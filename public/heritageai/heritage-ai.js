// Heritage AI Main Application - The Sage
class HeritageAI {
    constructor() {
        this.geminiAPI = new GeminiAPI();
        this.knowledgeBase = new HeritageKnowledge();
        this.currentMode = 'ask';
        this.conversationHistory = [];
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        // Wait a moment for autoLoadApiKey to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if API key is already loaded (from env or localStorage)
        if (this.geminiAPI.isReady()) {
            this.showChatInterface();
            this.isInitialized = true;
            console.log('✅ Heritage AI initialized with API key');
        } else {
            console.log('⚠️ No API key found. Please enter your API key to continue.');
        }
        
        this.setupEventListeners();
        this.setupQuickSuggestions();
    }

    setupEventListeners() {
        // API Key activation
        const activateBtn = document.getElementById('activateAI');
        const apiKeyInput = document.getElementById('apiKeyInput');
        
        if (activateBtn && apiKeyInput) {
            activateBtn.addEventListener('click', () => this.activateAI());
            apiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.activateAI();
            });
        }

        // Mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                this.setMode(mode);
            });
        });

        // Chat functionality
        const sendBtn = document.getElementById('sendMessage');
        const userInput = document.getElementById('userInput');
        const clearBtn = document.getElementById('clearChat');

        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearChat());

        // Quick suggestions
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                if (query) {
                    document.getElementById('userInput').value = query;
                    this.sendMessage();
                }
            });
        });
    }

    setupQuickSuggestions() {
        const suggestions = [
            "Tell me about the Brihadeeswara Temple in Thanjavur",
            "What are the legends behind Konark Sun Temple?", 
            "Describe the architectural marvels of Chola dynasty",
            "Share stories about the Ajanta and Ellora caves",
            "What makes Meenakshi Temple in Madurai special?",
            "Tell me about the Shore Temple at Mahabalipuram",
            "Describe the significance of Keeladi excavations",
            "Share legends about the Red Fort in Delhi"
        ];

        const suggestionsContainer = document.getElementById('quickSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            suggestions.slice(0, 4).forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'suggestion-btn';
                btn.dataset.query = suggestion;
                btn.textContent = suggestion.split(' ').slice(0, 3).join(' ') + '...';
                btn.addEventListener('click', () => {
                    document.getElementById('userInput').value = suggestion;
                    this.sendMessage();
                });
                suggestionsContainer.appendChild(btn);
            });
        }
    }

    async activateAI() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput?.value?.trim();

        if (!apiKey) {
            this.showError('Please enter your Gemini API key');
            return;
        }

        this.showLoading('Activating The Sage...');

        try {
            this.geminiAPI.initialize(apiKey);
            
            // Test the connection
            const testResult = await this.geminiAPI.testConnection();
            
            if (testResult.success) {
                this.showChatInterface();
                this.isInitialized = true;
                this.addMessage('sage', '🙏 Namaste! The Sage has been awakened. I am now ready to guide you through the magnificent tapestry of India\'s cultural heritage. How may I illuminate your path today?');
                apiKeyInput.value = '';
            } else {
                throw new Error(testResult.message);
            }
        } catch (error) {
            this.showError(`Failed to activate The Sage: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    showChatInterface() {
        const apiConfig = document.getElementById('apiConfig');
        const interactionModes = document.getElementById('interactionModes');
        const chatSection = document.getElementById('chatSection');

        if (apiConfig) apiConfig.style.display = 'none';
        if (interactionModes) interactionModes.style.display = 'block';
        if (chatSection) chatSection.style.display = 'block';
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Update UI to show selected mode
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');

        // Handle different modes
        switch (mode) {
            case 'story':
                this.generateStoryMode();
                break;
            case 'legends':
                this.generateLegendsMode();
                break;
            case 'daily':
                this.generateDailyHeritage();
                break;
            case 'ask':
            default:
                this.focusInput();
                break;
        }
    }

    async generateStoryMode() {
        if (!this.isInitialized) return;
        
        this.showLoading('The Sage is selecting a tale...');
        try {
            const response = await this.geminiAPI.generateStory('random');
            this.addMessage('sage', response.text);
        } catch (error) {
            this.showError(`The Sage encountered an issue: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async generateLegendsMode() {
        if (!this.isInitialized) return;
        
        this.showLoading('The Sage is recalling ancient legends...');
        try {
            const response = await this.geminiAPI.generateStory('legends');
            this.addMessage('sage', response.text);
        } catch (error) {
            this.showError(`The Sage encountered an issue: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async generateDailyHeritage() {
        if (!this.isInitialized) return;
        
        this.showLoading('The Sage is consulting the chronicles...');
        try {
            const response = await this.geminiAPI.generateDailyHeritage();
            this.addMessage('sage', response.text);
        } catch (error) {
            this.showError(`The Sage encountered an issue: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async sendMessage() {
        const userInput = document.getElementById('userInput');
        const query = userInput?.value?.trim();

        if (!query || !this.isInitialized) return;

        // Add user message
        this.addMessage('user', query);
        userInput.value = '';

        // Show thinking state
        this.updateSageStatus('Contemplating your query...');
        this.showLoading('The Sage is contemplating...');

        try {
            // Get contextual information from knowledge base
            const context = this.knowledgeBase.getContextualInfo(query);
            
            // Generate AI response
            const response = await this.geminiAPI.generateResponse(query, {
                knowledgeBase: context.sites.concat(context.dynasties, context.traditions, context.festivals),
                currentMode: this.currentMode
            });

            // Add AI response
            this.addMessage('sage', response.text);
            
            // Update conversation history
            this.conversationHistory.push({
                user: query,
                sage: response.text,
                timestamp: new Date().toISOString()
            });

            this.updateSageStatus('Ready to guide you');
        } catch (error) {
            this.showError(`The Sage encountered an issue: ${error.message}`);
            this.updateSageStatus('Ready to guide you');
        } finally {
            this.hideLoading();
        }
    }

    addMessage(sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'sage' ? 
            '<i class="fas fa-user-graduate"></i>' : 
            '<i class="fas fa-user"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Process content for better formatting
        const formattedContent = this.formatMessage(content);
        contentDiv.innerHTML = formattedContent;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/🏛️|🎭|🎨|👑|📚|🎪|🕉️|🙏/g, '<span class="heritage-emoji">$&</span>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${formatted}</p>`;
    }

    updateSageStatus(status) {
        const statusElement = document.getElementById('sageStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Keep the initial sage greeting
            const initialMessage = chatMessages.querySelector('.sage-message');
            chatMessages.innerHTML = '';
            if (initialMessage) {
                chatMessages.appendChild(initialMessage.cloneNode(true));
            }
        }
        this.conversationHistory = [];
    }

    focusInput() {
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.focus();
        }
    }

    showLoading(message = 'The Sage is thinking...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const messageElement = overlay.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        // Create or update error display
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10001;
                max-width: 400px;
            `;
            document.body.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: auto; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Export conversation history
    exportConversation() {
        const data = {
            timestamp: new Date().toISOString(),
            conversations: this.conversationHistory
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `heritage-ai-conversation-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get AI statistics
    getStats() {
        return {
            conversationCount: this.conversationHistory.length,
            currentMode: this.currentMode,
            apiStats: this.geminiAPI.getUsageStats(),
            isInitialized: this.isInitialized
        };
    }
}

// Initialize Heritage AI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heritageAI = new HeritageAI();
});

// Add CSS for heritage emojis
const style = document.createElement('style');
style.textContent = `
    .heritage-emoji {
        font-size: 1.2em;
        margin: 0 2px;
    }
    
    .error-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .mode-card.active {
        border-color: var(--secondary-color);
        background: linear-gradient(135deg, var(--background-color), rgba(218, 165, 32, 0.1));
        transform: translateY(-5px);
        box-shadow: 0 12px 30px var(--shadow-color);
    }
    
    .message-content p {
        margin-bottom: 0.5rem;
    }
    
    .message-content p:last-child {
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);
