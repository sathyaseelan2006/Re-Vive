// Gemini API Integration for Heritage AI
class GeminiAPI {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.isInitialized = false;
        this.requestCount = 0;
        this.maxRequestsPerMinute = 60;
        this.requestTimestamps = [];
        
        // Auto-load API key from environment or localStorage
        this.autoLoadApiKey();
    }

    // Auto-load API key from environment variables or localStorage
    async autoLoadApiKey() {
        try {
            // First, try to load from environment variable (Vite)
            if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
                const envKey = import.meta.env.VITE_GEMINI_API_KEY;
                if (envKey && envKey !== 'your_gemini_api_key_here') {
                    this.initialize(envKey);
                    console.log('✅ Gemini API key loaded from environment');
                    return true;
                }
            }
            
            // Fallback to localStorage
            if (this.loadStoredApiKey()) {
                console.log('✅ Gemini API key loaded from localStorage');
                return true;
            }
            
            console.log('⚠️ No API key found. Please configure your API key.');
            return false;
        } catch (error) {
            console.warn('Could not auto-load API key:', error);
            return false;
        }
    }

    // Initialize with API key
    initialize(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('Valid API key is required');
        }
        this.apiKey = apiKey.trim();
        this.isInitialized = true;
        
        // Store API key securely in localStorage
        try {
            localStorage.setItem('heritage_ai_api_key', this.apiKey);
        } catch (error) {
            console.warn('Could not store API key in localStorage:', error);
        }
    }

    // Load API key from localStorage
    loadStoredApiKey() {
        try {
            const storedKey = localStorage.getItem('heritage_ai_api_key');
            if (storedKey) {
                this.apiKey = storedKey;
                this.isInitialized = true;
                return true;
            }
        } catch (error) {
            console.warn('Could not load stored API key:', error);
        }
        return false;
    }

    // Check if API is ready
    isReady() {
        return this.isInitialized && this.apiKey;
    }

    // Rate limiting check
    checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Remove timestamps older than 1 minute
        this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
        
        if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
            throw new Error('Rate limit exceeded. Please wait a moment before making another request.');
        }
        
        this.requestTimestamps.push(now);
    }

    // Create The Heritage Expert persona prompt
    createSagePrompt(userQuery, context = {}) {
        const basePersona = `You are "The Heritage Expert" - a distinguished archaeological, historical, and educational specialist with deep expertise in India's cultural heritage. You are a secular academic focused purely on historical facts, archaeological evidence, and educational content.

🏛️ **Your Expertise Areas:**
- **Archaeological Sites**: Excavations, artifacts, dating methods, site analysis
- **Historical Architecture**: Construction techniques, materials, engineering marvels
- **Cultural History**: Trade routes, urban planning, social structures, technological advances
- **Art & Craftsmanship**: Sculpture techniques, painting methods, metallurgy, textiles
- **Educational Context**: Historical timelines, cause-and-effect relationships, comparative analysis

**Your Communication Style:**
- Scholarly yet accessible, like a museum curator or university professor
- Focus on archaeological evidence, historical documentation, and factual analysis
- Use precise terminology while explaining complex concepts clearly
- Include specific dates, measurements, materials, and construction techniques
- Reference historical sources, inscriptions, and archaeological findings
- Connect historical developments to broader cultural and technological progress
- Avoid religious interpretations - focus on historical, cultural, and archaeological significance

**Context Awareness:**
- Tamil Nadu sites → Dravidian architectural evolution, Chola engineering, urban planning
- Rajasthan → Desert architecture, water management systems, fortification techniques
- Odisha → Kalinga architectural style, maritime trade evidence, stone carving techniques
- Always distinguish between historical facts and later mythological additions

**Your Mission:** Educate about India's rich cultural heritage through archaeological evidence, historical analysis, and scholarly research - making complex historical concepts accessible to all learners.`;

        let contextInfo = '';
        if (context.currentSite) {
            contextInfo += `\n**Current Context**: User is exploring ${context.currentSite}\n`;
        }
        if (context.knowledgeBase && context.knowledgeBase.length > 0) {
            contextInfo += `\n**Relevant Heritage Information**:\n`;
            context.knowledgeBase.forEach(item => {
                contextInfo += `- ${item.name}: ${item.description}\n`;
            });
        }

        return `${basePersona}${contextInfo}\n\n**User Query**: ${userQuery}\n\n**Your Response as The Sage**:`;
    }

    // Generate AI response
    async generateResponse(userQuery, context = {}) {
        if (!this.isReady()) {
            throw new Error('Gemini API is not initialized. Please provide an API key.');
        }

        try {
            this.checkRateLimit();
            
            const prompt = this.createSagePrompt(userQuery, context);
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                    stopSequences: []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH", 
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response format from Gemini API');
            }

            const generatedText = data.candidates[0].content.parts[0].text;
            this.requestCount++;
            
            return {
                success: true,
                text: generatedText.trim(),
                usage: {
                    requestCount: this.requestCount,
                    remainingRequests: this.maxRequestsPerMinute - this.requestTimestamps.length
                }
            };

        } catch (error) {
            console.error('Gemini API Error:', error);
            
            // Provide fallback responses for common errors
            if (error.message.includes('API_KEY_INVALID')) {
                throw new Error('Invalid API key. Please check your Gemini API key and try again.');
            } else if (error.message.includes('QUOTA_EXCEEDED')) {
                throw new Error('API quota exceeded. Please try again later or check your billing settings.');
            } else if (error.message.includes('Rate limit')) {
                throw new Error('Too many requests. Please wait a moment before asking again.');
            } else {
                throw new Error(`The Sage is temporarily unavailable: ${error.message}`);
            }
        }
    }

    // Generate story mode response
    async generateStory(theme = 'random', region = null) {
        const storyPrompts = {
            random: "Share a captivating tale from any period of Indian history",
            architecture: "Tell me about the construction of a magnificent Indian monument",
            legends: "Narrate a fascinating legend or myth from Indian heritage",
            dynasties: "Share stories of great rulers and their achievements",
            festivals: "Describe the origins and significance of an Indian festival"
        };

        let prompt = storyPrompts[theme] || storyPrompts.random;
        if (region) {
            prompt += ` from ${region}`;
        }

        return await this.generateResponse(prompt, { mode: 'story' });
    }

    // Generate daily heritage content
    async generateDailyHeritage() {
        const today = new Date();
        const prompts = [
            `What happened on this day (${today.toDateString()}) in Indian history?`,
            "Share a lesser-known fact about Indian heritage",
            "Tell me about a forgotten architectural marvel of India",
            "Describe a traditional art form that needs preservation",
            "Share the story of an unsung hero from Indian history"
        ];

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        return await this.generateResponse(randomPrompt, { mode: 'daily' });
    }

    // Test API connection
    async testConnection() {
        try {
            const response = await this.generateResponse("Namaste! Please introduce yourself as The Sage.");
            return { success: true, message: "Connection successful!" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Clear stored API key
    clearApiKey() {
        this.apiKey = null;
        this.isInitialized = false;
        try {
            localStorage.removeItem('heritage_ai_api_key');
        } catch (error) {
            console.warn('Could not clear stored API key:', error);
        }
    }

    // Get usage statistics
    getUsageStats() {
        return {
            requestCount: this.requestCount,
            remainingRequests: Math.max(0, this.maxRequestsPerMinute - this.requestTimestamps.length),
            isRateLimited: this.requestTimestamps.length >= this.maxRequestsPerMinute
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAPI;
} else {
    window.GeminiAPI = GeminiAPI;
}
