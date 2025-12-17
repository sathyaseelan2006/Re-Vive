/**
 * Improved Heritage Chatbot System
 * Version: 3.0
 * Features: Simplified, reliable, efficient Google Gemini integration
 */

class ImprovedHeritageChatbot {
    constructor(siteName, siteKnowledge) {
        this.siteName = siteName;
        this.siteKnowledge = siteKnowledge;
        this.apiKey = null;
        this.useServerProxy = false; // prefer server-side proxy when available
        this.apiEndpoint = '/api/chatbot/chat'; // default API endpoint (server-side proxy)
        this.conversationHistory = [];
        this.isOpen = false;
        this.isTyping = false;

        console.log(`🚀 Initializing ${siteName} Heritage Chatbot v3.0...`);
        this.init();
    }

    init() {
        // First, check if backend proxy is available and whether it has an API key configured
        this.checkBackendProxy().finally(() => {
            // Continue initialization after backend check
        });
        // Priority 1: Check for a bundle-provided key (injected at build time) - safe access
        try {
            if (import.meta.env.VITE_GEMINI_API_KEY &&
                import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here') {
                this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                this.showChatInterface();
                console.log('✅ API key loaded from environment variable');
                this.setupEventListeners();
                return;
            }
        }
        catch (err) {
            // ignore
        }

        // Priority 2: Check for stored API key in localStorage (guarded for Tracking Prevention)
        let storedKey = null;
        try {
            storedKey = localStorage.getItem('gemini_api_key');
        } catch (err) {
            console.warn('⚠️ localStorage unavailable (tracking prevention?). API key persistence disabled for this session.');
        }

        if (storedKey) {
            this.apiKey = storedKey;
            this.showChatInterface();
            console.log('✅ API key loaded from localStorage');
        } else {
            // Priority 3: Show API key setup form
            this.showApiKeySetup();
            console.log('⚠️ No API key found. Please enter your API key.');
        }

        this.setupEventListeners();
        console.log('✅ Chatbot initialized successfully');
    }

    setupEventListeners() {
        // Toggle chatbot
        document.getElementById('chatbotToggle')?.addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Close button
        document.getElementById('chatbotClose')?.addEventListener('click', () => {
            this.closeChatbot();
        });

        // Settings/Reset API key
        document.getElementById('chatbotSettings')?.addEventListener('click', () => {
            this.resetApiKey();
        });

        // Save API key
        document.getElementById('saveApiKey')?.addEventListener('click', () => {
            this.saveApiKey();
        });

        // API key input - Enter key
        document.getElementById('apiKeyInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });

        // Send message button
        document.getElementById('sendMessage')?.addEventListener('click', () => {
            this.sendMessage();
        });

        // Chat input - Enter key
        document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick question buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                document.getElementById('chatInput').value = question;
                this.sendMessage();
            });
        });
    }

    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatbotWindow.classList.add('show');
        } else {
            chatbotWindow.classList.remove('show');
        }
    }

    closeChatbot() {
        this.isOpen = false;
        document.getElementById('chatbotWindow').classList.remove('show');
    }

    showApiKeySetup() {
        document.getElementById('apiKeySetup')?.classList.remove('hidden');
        document.getElementById('chatMessages')?.classList.remove('show');
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessage');
        if (chatInput) chatInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        document.querySelector('.chat-input-container')?.classList.remove('show');
    }

    showChatInterface() {
        document.getElementById('apiKeySetup')?.classList.add('hidden');
        document.getElementById('chatMessages')?.classList.add('show');
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessage');
        if (chatInput) chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        document.querySelector('.chat-input-container')?.classList.add('show');
    }

    async saveApiKey() {
        const input = document.getElementById('apiKeyInput');
        const apiKey = input?.value.trim();

        if (!apiKey) {
            alert('Please enter a valid API key');
            return;
        }

        console.log('🔑 Testing API key...');

        // Test the API key
        const isValid = await this.testApiKey(apiKey);

        if (isValid) {
            this.apiKey = apiKey;
            try {
                localStorage.setItem('gemini_api_key', apiKey);
            } catch (err) {
                console.warn('⚠️ Unable to persist API key to localStorage:', err);
            }
            console.log('✅ API key saved successfully');
            this.showChatInterface();

            // Show welcome message
            this.showWelcomeMessage();
        } else {
            alert('❌ Invalid API key. Please check and try again.\n\nGet your free API key from:\nhttps://makersuite.google.com/app/apikey');
        }
    }

    async testApiKey(apiKey) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Hi' }]
                    }]
                })
            });

            if (response.ok) {
                console.log('✅ API key is valid');
                return true;
            } else {
                console.error('❌ API key validation failed:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ API key test error:', error);
            return false;
        }
    }

    resetApiKey() {
        if (confirm('Reset API key? You will need to enter it again.')) {
            try {
                localStorage.removeItem('gemini_api_key');
            } catch (err) {
                console.warn('⚠️ Unable to clear API key from localStorage:', err);
            }
            this.apiKey = null;
            this.conversationHistory = [];

            // Clear messages
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }

            this.showApiKeySetup();

            // Clear input
            const input = document.getElementById('apiKeyInput');
            if (input) input.value = '';
        }
    }

    showWelcomeMessage() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = `
            <div class="message bot-message welcome-message">
                <div class="message-avatar">
                    <svg viewBox="0 -8 72 72" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.11,8.25A7.54,7.54,0,0,0,19,6,11,11,0,0,0,15.6,4.31l-2.42-.57a2.78,2.78,0,0,0-.67,1.92c0,3,1.07,3.81,1.07,3.81h8.09A5.87,5.87,0,0,0,21.11,8.25Z"/>
                        <path d="M22.42,50.8a4.19,4.19,0,0,0,1-2.95V46h27a12.19,12.19,0,0,1-.14-1.88c0-9.08,7.85-22,7.85-32.31,0-8.26-7.85-9.3-7.85-9.3H16s6.14,1.48,7.56,7a9.11,9.11,0,0,1,.29,2.35C23.88,22.13,16,35.05,16,44.13a11.26,11.26,0,0,0,.49,3.41,7.25,7.25,0,0,0,1.27,2.39A5.51,5.51,0,0,0,19,51a3.2,3.2,0,0,0,1.47.59A2.39,2.39,0,0,0,22.42,50.8Z"/>
                        <path d="M25.28,47.85a6,6,0,0,1-1.51,4.2,7.42,7.42,0,0,1-3,1.43H55.42a3.7,3.7,0,0,0,2.89-1.64,6.59,6.59,0,0,0,1.18-4H25.28Z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        🙏 Vanakkam! I am your ${this.siteName} Heritage Guide AI. I'm here to help you explore the rich history, architecture, culture, and spiritual significance of ${this.siteName}.
                        <br><br>
                        💬 Ask me anything about:
                        <br>• Historical facts and timelines
                        <br>• Architectural marvels and engineering
                        <br>• Cultural traditions and festivals
                        <br>• Travel tips and visitor information
                        <br>• Spiritual significance and legends
                        <br><br>
                        What would you like to know about ${this.siteName}?
                    </div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input?.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);

            // Hide typing indicator
            this.hideTyping();

            // Add bot message
            this.addMessage(response, 'bot');

        } catch (error) {
            console.error('❌ Error getting AI response:', error);
            this.hideTyping();

            let errorMsg = '❌ Sorry, I encountered an error. ';

            if (error.message.includes('API key')) {
                errorMsg += 'Your API key may be invalid. Click the ⚙️ icon to reset it.';
            } else if (error.message.includes('429')) {
                errorMsg += 'Rate limit reached. Please wait a moment and try again.';
            } else if (error.message.includes('403')) {
                errorMsg += 'API access denied. Please check your API key permissions.';
            } else {
                errorMsg += 'Please try again or reset your API key using the ⚙️ icon.';
            }

            this.addMessage(errorMsg, 'bot');
        }
    }

    async getAIResponse(userMessage) {
        // Build conversation context
        const messages = this.conversationHistory.slice(-6); // Last 3 exchanges
        let context = this.siteKnowledge.context + '\n\n';

        if (messages.length > 0) {
            context += 'Recent conversation:\n';
            messages.forEach(msg => {
                context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
            });
            context += '\n';
        }

        context += `User: ${userMessage}\n\nAssistant:`;

        // If backend proxy is available, forward the request to the server-side proxy
        if (this.useServerProxy && this.apiEndpoint) {
            try {
                console.log('🌐 Using server-side chatbot proxy at', this.apiEndpoint);
                const resp = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userMessage,
                        siteName: this.siteName,
                        siteKnowledge: this.siteKnowledge && this.siteKnowledge.context ? this.siteKnowledge.context : this.siteKnowledge,
                        conversationHistory: messages
                    })
                });

                if (!resp.ok) {
                    const txt = await resp.text();
                    console.error('❌ Server proxy error:', resp.status, txt);
                    throw new Error('Server proxy error');
                }

                const data = await resp.json();
                if (data && data.success && data.response) {
                    const aiResponse = data.response;

                    // Store in conversation history
                    this.conversationHistory.push({ role: 'user', content: userMessage });
                    this.conversationHistory.push({ role: 'assistant', content: aiResponse });

                    if (this.conversationHistory.length > 10) {
                        this.conversationHistory = this.conversationHistory.slice(-10);
                    }

                    return aiResponse;
                } else {
                    console.error('❌ Invalid proxy response', data);
                    throw new Error('Invalid proxy response');
                }
            } catch (err) {
                console.error('❌ Error using server proxy:', err);
                // Fall through to try direct API call if client has API key
            }
        }

        // Call Gemini API directly (fallback) - Using current stable model gemini-2.5-flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
        console.log('🌐 Calling Gemini API directly...');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: context
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 600,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ API Error:', response.status, errorData);

            // More specific error messages
            if (response.status === 400) {
                throw new Error('API key is invalid or malformed. Please check your API key.');
            } else if (response.status === 403) {
                throw new Error('403 - API access denied. Your API key may not have proper permissions.');
            } else if (response.status === 429) {
                throw new Error('429 - Rate limit exceeded. Please wait a moment.');
            } else {
                throw new Error(`API request failed: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('✅ Got AI response');

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid API response format');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        // Store in conversation history
        this.conversationHistory.push({ role: 'user', content: userMessage });
        this.conversationHistory.push({ role: 'assistant', content: aiResponse });

        // Keep only last 10 messages
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }

        return aiResponse;
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <svg viewBox="0 -8 72 72" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.11,8.25A7.54,7.54,0,0,0,19,6,11,11,0,0,0,15.6,4.31l-2.42-.57a2.78,2.78,0,0,0-.67,1.92c0,3,1.07,3.81,1.07,3.81h8.09A5.87,5.87,0,0,0,21.11,8.25Z"/>
                        <path d="M22.42,50.8a4.19,4.19,0,0,0,1-2.95V46h27a12.19,12.19,0,0,1-.14-1.88c0-9.08,7.85-22,7.85-32.31,0-8.26-7.85-9.3-7.85-9.3H16s6.14,1.48,7.56,7a9.11,9.11,0,0,1,.29,2.35C23.88,22.13,16,35.05,16,44.13a11.26,11.26,0,0,0,.49,3.41,7.25,7.25,0,0,0,1.27,2.39A5.51,5.51,0,0,0,19,51a3.2,3.2,0,0,0,1.47.59A2.39,2.39,0,0,0,22.42,50.8Z"/>
                        <path d="M25.28,47.85a6,6,0,0,1-1.51,4.2,7.42,7.42,0,0,1-3,1.43H55.42a3.7,3.7,0,0,0,2.89-1.64,6.59,6.59,0,0,0,1.18-4H25.28Z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-text">${this.formatMessage(content)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(content)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Check backend proxy health and whether server has API key configured
    async checkBackendProxy() {
        try {
            // First try the relative path (works when frontend is served by the same host as backend)
            let resp = await fetch('/api/chatbot/health');
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.apiKeyConfigured) {
                    this.useServerProxy = true;
                    this.apiEndpoint = '/api/chatbot/chat';
                    this.showChatInterface();
                    console.log('✅ Backend chatbot proxy available (relative) and configured; using server-side proxy');
                    return;
                }
            }

            // If relative health check failed (404 or not found), try common local backend origins (useful during dev)
            const devOrigins = ['http://localhost:5000', 'http://127.0.0.1:5000'];
            for (const origin of devOrigins) {
                try {
                    resp = await fetch(origin + '/api/chatbot/health');
                    if (!resp.ok) continue;
                    const data = await resp.json();
                    if (data && data.apiKeyConfigured) {
                        this.useServerProxy = true;
                        this.apiEndpoint = origin + '/api/chatbot/chat';
                        this.showChatInterface();
                        console.log(`✅ Backend chatbot proxy available at ${origin} and configured; using server-side proxy`);
                        return;
                    }
                } catch (err) {
                    // ignore and try next origin
                }
            }
        } catch (err) {
            // ignore - backend may not be running or CORS blocked
            // console.log('Backend proxy unavailable', err);
        }
    }

    formatMessage(text) {
        // Convert markdown-style formatting to HTML
        text = this.escapeHtml(text);

        // Bold: **text** or __text__
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic: *text* or _text_
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');

        // Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTyping() {
        this.isTyping = true;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }

        // Scroll to show typing indicator
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    hideTyping() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Export for use
window.ImprovedHeritageChatbot = ImprovedHeritageChatbot;
