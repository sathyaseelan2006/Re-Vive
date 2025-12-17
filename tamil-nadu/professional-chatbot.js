/**
 * Professional Heritage Chatbot System
 * Version: 4.0 - Backend API Integration
 * Features: Secure API key management, Professional historian persona
 */

class ProfessionalHeritageChatbot {
    constructor(siteName, siteKnowledge) {
        this.siteName = siteName;
        this.siteKnowledge = siteKnowledge;
        this.apiEndpoint = '/api/chatbot/chat';
        this.conversationHistory = [];
        this.isOpen = false;
        this.isTyping = false;

        console.log(`🚀 Initializing ${siteName} Professional Heritage Chatbot v4.0...`);
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.setupEventListeners();
        this.checkServerHealth();
        console.log('✅ Chatbot initialized successfully');
    }

    async checkServerHealth() {
        try {
            const response = await fetch('/api/chatbot/health');
            const data = await response.json();

            if (data.status === 'OK' && data.apiKeyConfigured) {
                console.log('✅ Chatbot server is healthy and API key is configured');
                this.showWelcomeMessage();
            } else {
                console.warn('⚠️ API key not configured on server');
                this.showErrorMessage('Server configuration incomplete. Please contact administrator.');
            }
        } catch (error) {
            console.error('❌ Cannot connect to chatbot server:', error);
            this.showErrorMessage('Cannot connect to chatbot server. Please ensure the backend server is running.');
        }
    }

    createChatbotUI() {
        // Check if chatbot HTML already exists
        if (document.getElementById('chatbotToggle')) {
            console.log('Chatbot UI already exists');
            return;
        }

        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <button id="chatbotToggle" class="chatbot-toggle" aria-label="Open Heritage Expert Chat">
                <div class="chatbot-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="chat-pulse"></div>
            </button>

            <!-- Chatbot Window -->
            <div id="chatbotWindow" class="chatbot-window" style="display: none;">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">
                        <div class="avatar-icon">🎓</div>
                        <div class="chatbot-info">
                            <h3>Dr. Archibald Thornbury</h3>
                            <p class="status">Heritage & Cultural Expert</p>
                        </div>
                    </div>
                    <button id="chatbotClose" class="chatbot-close" aria-label="Close chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be appended here -->
                </div>

                <div class="quick-questions" id="quickQuestions">
                    <button class="quick-btn" data-question="Tell me about the history of this site">📜 History</button>
                    <button class="quick-btn" data-question="What is unique about the architecture here?">🏛️ Architecture</button>
                    <button class="quick-btn" data-question="What cultural significance does this place have?">🎭 Culture</button>
                    <button class="quick-btn" data-question="What are the best times to visit?">🕐 Visit Info</button>
                </div>

                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <textarea 
                            id="chatInput" 
                            placeholder="Ask Dr. Thornbury about history, architecture, or culture..."
                            rows="1"
                        ></textarea>
                        <button id="sendMessage" class="send-button" aria-label="Send message">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
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

        // Send message button
        document.getElementById('sendMessage')?.addEventListener('click', () => {
            this.sendMessage();
        });

        // Chat input - Enter key (Shift+Enter for new line)
        document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('chatInput')?.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
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
            chatbotWindow.style.display = 'flex';
            document.getElementById('chatInput')?.focus();

            // Show welcome message if no conversation history
            if (this.conversationHistory.length === 0) {
                this.showWelcomeMessage();
            }
        } else {
            chatbotWindow.style.display = 'none';
        }
    }

    closeChatbot() {
        this.isOpen = false;
        document.getElementById('chatbotWindow').style.display = 'none';
    }

    showWelcomeMessage() {
        const welcomeText = `Greetings! I'm Dr. Archibald Thornbury, a historian and cultural heritage specialist. I've spent decades studying the magnificent architecture and rich cultural tapestry of sites like ${this.siteName}.

I'm here to share fascinating insights about the history, architecture, and cultural significance of this remarkable place. Feel free to ask me anything about the historical context, architectural techniques, or cultural traditions associated with this heritage site.

What would you like to explore today?`;

        this.addBotMessage(welcomeText, true);
    }

    showErrorMessage(message) {
        this.addBotMessage(`⚠️ ${message}`, false);
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message to UI
        this.addUserMessage(message);

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to backend API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    siteName: this.siteName,
                    siteKnowledge: this.siteKnowledge,
                    conversationHistory: this.conversationHistory.slice(-6) // Last 3 exchanges
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Add bot response to conversation history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.response
                });

                // Remove typing indicator and show response
                this.removeTypingIndicator();
                this.addBotMessage(data.response);
            } else {
                throw new Error(data.message || 'Unknown error');
            }

        } catch (error) {
            console.error('Error sending message:', error);
            this.removeTypingIndicator();
            this.addBotMessage(
                "I apologize, but I'm experiencing technical difficulties at the moment. Please ensure the backend server is running and try again.",
                false
            );
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const messageHTML = `
            <div class="message user-message">
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(message)}</div>
                    <div class="message-time">${messageTime}</div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessage(message, isWelcome = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const messageHTML = `
            <div class="message bot-message ${isWelcome ? 'welcome-message' : ''}">
                <div class="message-avatar">
                    <div class="avatar-icon">🎓</div>
                </div>
                <div class="message-content">
                    <div class="message-text">${this.formatBotMessage(message)}</div>
                    <div class="message-time">${messageTime}</div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatMessages');

        const typingHTML = `
            <div class="message bot-message typing-indicator" id="typingIndicator">
                <div class="message-avatar typing-avatar">
                    <div class="avatar-icon">🎓</div>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        this.isTyping = false;
        document.getElementById('typingIndicator')?.remove();
    }

    formatBotMessage(text) {
        // Convert newlines to <br>
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in other scripts
window.ProfessionalHeritageChatbot = ProfessionalHeritageChatbot;
