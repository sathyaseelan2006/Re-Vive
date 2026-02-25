// Context-Aware Heritage AI - Integrates with site content for intelligent responses
class ContextAwareAI {
    constructor() {
        this.geminiAPI = new GeminiAPI();
        this.contextAnalyzer = null;
        this.siteContext = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        // Initialize context analyzer
        this.contextAnalyzer = new SiteContextAnalyzer();
        this.siteContext = this.contextAnalyzer.getAIContext();
        
        // Try to load stored API key
        if (this.geminiAPI.loadStoredApiKey()) {
            this.isInitialized = true;
        }
    }

    // Initialize with API key
    async initializeWithKey(apiKey) {
        try {
            this.geminiAPI.initialize(apiKey);
            this.isInitialized = true;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create context-aware prompt for the current site
    createContextAwarePrompt(userQuery) {
        if (!this.siteContext) {
            return this.createGenericPrompt(userQuery);
        }

        const { site, aiContext } = this.siteContext;
        const siteName = site?.siteName || 'this heritage site';
        const location = `${site?.siteName}, ${site?.state}` || 'this location';

        const contextPrompt = `You are a Heritage Expert with complete knowledge of the user's heritage website and current location context.

**CURRENT CONTEXT:**
- **User Location**: ${location}
- **Site Focus**: ${aiContext?.primaryFocus || 'heritage site'}
- **Historical Period**: ${aiContext?.historicalPeriod || 'historical period'}
- **Architectural Style**: ${aiContext?.architecturalStyle || 'traditional architecture'}
- **Key Topics**: ${aiContext?.keyTopics?.join(', ') || 'heritage topics'}

**SITE-SPECIFIC KNOWLEDGE:**
${this.buildSiteKnowledgeContext()}

**YOUR ROLE:**
You are the expert guide for this specific heritage website. You have intimate knowledge of:
- Every page and section of this heritage portal
- Detailed information about ${siteName} specifically
- The site's navigation structure and content organization
- Related heritage sites in the region
- How this site connects to broader Indian heritage

**RESPONSE GUIDELINES:**
1. **Location Awareness**: Always acknowledge you're discussing ${siteName} specifically
2. **Site Integration**: Reference other sections/pages of the website when relevant
3. **Navigation Guidance**: Help users explore related content on the site
4. **Contextual Depth**: Provide information specific to this location and time period
5. **Cross-References**: Connect to other heritage sites mentioned on the website
6. **Academic Tone**: Maintain scholarly approach with archaeological/historical evidence

**WEBSITE NAVIGATION CONTEXT:**
${this.buildNavigationContext()}

**USER QUERY**: ${userQuery}

**EXPERT RESPONSE** (as the Heritage Expert familiar with this specific site and website):`;

        return contextPrompt;
    }

    // Build site knowledge context from analyzed content
    buildSiteKnowledgeContext() {
        if (!this.siteContext?.content) return 'General heritage information available.';

        const content = this.siteContext.content;
        let context = '';

        if (content.title && content.description) {
            context += `**Site Overview**: ${content.title} - ${content.description}\n\n`;
        }

        if (content.sections && content.sections.length > 0) {
            context += '**Available Site Sections**:\n';
            content.sections.forEach(section => {
                context += `- ${section.heading}: ${section.content?.substring(0, 150)}...\n`;
            });
            context += '\n';
        }

        if (content.historicalInfo) {
            const { dynasties, periods, rulers } = content.historicalInfo;
            if (dynasties?.length > 0) context += `**Dynasties**: ${dynasties.join(', ')}\n`;
            if (periods?.length > 0) context += `**Time Periods**: ${periods.join(', ')}\n`;
            if (rulers?.length > 0) context += `**Notable Rulers**: ${rulers.join(', ')}\n`;
        }

        if (content.architecturalInfo) {
            const { styles, elements, materials } = content.architecturalInfo;
            if (styles?.length > 0) context += `**Architectural Styles**: ${styles.join(', ')}\n`;
            if (elements?.length > 0) context += `**Architectural Elements**: ${elements.join(', ')}\n`;
            if (materials?.length > 0) context += `**Construction Materials**: ${materials.join(', ')}\n`;
        }

        return context || 'Site-specific information extracted from current page.';
    }

    // Build navigation context
    buildNavigationContext() {
        if (!this.siteContext?.content?.navigation) return '';

        const nav = this.siteContext.content.navigation;
        if (nav.length === 0) return '';

        let navContext = 'Website sections available to users:\n';
        nav.forEach(link => {
            if (link.text && link.text !== 'HOME') {
                navContext += `- ${link.text}${link.section ? ` (#${link.section})` : ''}\n`;
            }
        });

        return navContext;
    }

    // Create generic prompt for non-heritage pages
    createGenericPrompt(userQuery) {
        return `You are a Heritage Expert with comprehensive knowledge of Indian cultural heritage and the user's heritage website.

**YOUR EXPERTISE:**
- Archaeological sites and excavation findings across India
- Historical architecture and construction techniques  
- Cultural developments and dynastic histories
- Educational content about Indian heritage

**WEBSITE CONTEXT:**
You are integrated into a comprehensive Indian heritage website that covers:
- Tamil Nadu heritage sites (Thanjavur, Madurai, Mahabalipuram, etc.)
- Pan-India cultural heritage information
- Archaeological insights and historical analysis
- Educational resources for heritage learning

**USER QUERY**: ${userQuery}

**EXPERT RESPONSE**:`;
    }

    // Generate context-aware response
    async generateResponse(userQuery) {
        if (!this.isInitialized) {
            throw new Error('Heritage AI not initialized. Please provide API key.');
        }

        try {
            const contextPrompt = this.createContextAwarePrompt(userQuery);
            
            const response = await this.geminiAPI.generateContent(contextPrompt);
            
            return {
                success: true,
                text: response.text,
                context: {
                    siteName: this.siteContext?.site?.siteName,
                    location: this.siteContext?.site?.state,
                    focus: this.siteContext?.aiContext?.primaryFocus
                }
            };
        } catch (error) {
            throw new Error(`Heritage Expert unavailable: ${error.message}`);
        }
    }

    // Generate site-specific welcome message
    generateWelcomeMessage() {
        if (!this.siteContext) {
            return "Welcome! I'm your Heritage Expert, ready to explore India's cultural heritage with you.";
        }

        const { site, aiContext } = this.siteContext;
        const siteName = site?.siteName;
        const focus = aiContext?.primaryFocus;

        if (siteName && siteName !== 'Indian Heritage Portal') {
            return `Welcome to ${siteName}! I'm your Heritage Expert with detailed knowledge of this ${focus} site. I can analyze its architecture, explain its historical significance, discuss archaeological findings, and guide you through all the content available on this heritage portal. What would you like to explore?`;
        }

        return "Welcome to the Indian Heritage Portal! I'm your Heritage Expert with comprehensive knowledge of all the sites featured here. I can guide you through Tamil Nadu's magnificent heritage sites and provide detailed archaeological and historical analysis. Where shall we begin our exploration?";
    }

    // Get site-specific suggested queries
    getSuggestedQueries() {
        if (this.siteContext?.aiContext?.suggestedQueries) {
            return this.siteContext.aiContext.suggestedQueries;
        }

        return [
            "Tell me about the archaeological significance of this site",
            "Analyze the architectural features and construction techniques",
            "Explain the historical context and cultural importance",
            "What other heritage sites are related to this one?"
        ];
    }

    // Check if user is on a heritage site
    isOnHeritageSite() {
        return this.contextAnalyzer?.isOnHeritageSite() || false;
    }

    // Get current site information
    getCurrentSiteInfo() {
        return this.siteContext?.site || null;
    }

    // Update context when user navigates
    updateContext() {
        if (this.contextAnalyzer) {
            this.contextAnalyzer = new SiteContextAnalyzer();
            this.siteContext = this.contextAnalyzer.getAIContext();
        }
    }

    // Get navigation suggestions
    getNavigationSuggestions() {
        if (!this.siteContext?.content?.navigation) return [];

        return this.siteContext.content.navigation
            .filter(nav => nav.text && nav.text !== 'HOME')
            .map(nav => ({
                text: nav.text,
                section: nav.section,
                suggestion: `Tell me about the ${nav.text.toLowerCase()} section of this site`
            }));
    }
}

// Enhanced Gemini API integration for context-aware responses
class EnhancedGeminiAPI extends GeminiAPI {
    async generateContent(prompt) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
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

        return {
            text: data.candidates[0].content.parts[0].text.trim()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextAwareAI;
} else {
    window.ContextAwareAI = ContextAwareAI;
}
