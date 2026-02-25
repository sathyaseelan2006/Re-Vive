// Heritage AI Integration for Heritage Site Pages
class HeritageAIIntegration {
    constructor() {
        this.aiButton = null;
        this.aiModal = null;
        this.isModalOpen = false;
        this.init();
    }

    init() {
        this.createAIButton();
        this.createAIModal();
        this.setupEventListeners();
    }

    createAIButton() {
        // Create floating AI button
        this.aiButton = document.createElement('div');
        this.aiButton.className = 'heritage-ai-button';
        this.aiButton.innerHTML = `
            <div class="ai-button-content">
                <i class="fas fa-user-graduate"></i>
                <span class="ai-button-text">Ask The Sage</span>
            </div>
            <div class="ai-button-pulse"></div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .heritage-ai-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #8b4513, #cd853f);
                border-radius: 50%;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
                transition: all 0.3s ease;
                overflow: hidden;
            }

            .heritage-ai-button:hover {
                width: 160px;
                border-radius: 30px;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 69, 19, 0.5);
            }

            .ai-button-content {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #f8f4eb;
                font-weight: 600;
                white-space: nowrap;
            }

            .ai-button-content i {
                font-size: 1.5rem;
                min-width: 24px;
            }

            .ai-button-text {
                opacity: 0;
                transform: translateX(-10px);
                transition: all 0.3s ease;
                font-family: 'Cinzel', serif;
            }

            .heritage-ai-button:hover .ai-button-text {
                opacity: 1;
                transform: translateX(0);
            }

            .ai-button-pulse {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(218, 165, 32, 0.3);
                animation: pulse 2s infinite;
                pointer-events: none;
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.1); opacity: 0.3; }
                100% { transform: scale(1); opacity: 0.7; }
            }

            .heritage-ai-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .ai-modal-content {
                background: #f5f1e6;
                border-radius: 20px;
                width: 100%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 3px solid #daa520;
                position: relative;
            }

            .ai-modal-header {
                background: linear-gradient(135deg, #8b4513, #cd853f);
                padding: 20px;
                color: #f8f4eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .ai-modal-title {
                font-family: 'Cinzel', serif;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .ai-modal-close {
                background: none;
                border: none;
                color: #f8f4eb;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .ai-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .ai-modal-body {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .ai-quick-actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }

            .ai-action-btn {
                background: linear-gradient(135deg, #daa520, #cd853f);
                color: #3e2d1a;
                border: none;
                padding: 15px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'Cormorant Garamond', serif;
            }

            .ai-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
            }

            .ai-input-area {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #daa520;
            }

            .ai-input-group {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .ai-input-group input {
                flex: 1;
                padding: 12px;
                border: 2px solid #d4af37;
                border-radius: 25px;
                background: white;
                color: #3e2d1a;
                font-family: 'Cormorant Garamond', serif;
            }

            .ai-input-group input:focus {
                outline: none;
                border-color: #daa520;
                box-shadow: 0 0 10px rgba(218, 165, 32, 0.3);
            }

            .ai-send-btn {
                background: linear-gradient(135deg, #8b4513, #cd853f);
                color: #f8f4eb;
                border: none;
                padding: 12px;
                border-radius: 50%;
                cursor: pointer;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .ai-send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
            }

            @media (max-width: 768px) {
                .heritage-ai-button {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                }

                .heritage-ai-button:hover {
                    width: 140px;
                }

                .ai-modal-content {
                    margin: 10px;
                    max-height: 95vh;
                }

                .ai-quick-actions {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.aiButton);
    }

    createAIModal() {
        this.aiModal = document.createElement('div');
        this.aiModal.className = 'heritage-ai-modal';
        
        const siteName = this.getCurrentSiteName();
        const siteContext = this.getSiteContext();
        
        this.aiModal.innerHTML = `
            <div class="ai-modal-content">
                <div class="ai-modal-header">
                    <div class="ai-modal-title">
                        <i class="fas fa-user-graduate"></i>
                        The Sage - ${siteName}
                    </div>
                    <button class="ai-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ai-modal-body">
                    <div class="ai-quick-actions">
                        <button class="ai-action-btn" data-action="about-site">
                            <i class="fas fa-info-circle"></i>
                            Tell me about ${siteName}
                        </button>
                        <button class="ai-action-btn" data-action="legends">
                            <i class="fas fa-dragon"></i>
                            Share legends of this place
                        </button>
                        <button class="ai-action-btn" data-action="architecture">
                            <i class="fas fa-building"></i>
                            Explain the architecture
                        </button>
                        <button class="ai-action-btn" data-action="history">
                            <i class="fas fa-scroll"></i>
                            Historical significance
                        </button>
                    </div>
                    
                    <div class="ai-input-area">
                        <p style="margin-bottom: 15px; color: #3e2d1a; font-style: italic;">
                            🙏 Ask The Sage anything about ${siteName} or Indian heritage...
                        </p>
                        <div class="ai-input-group">
                            <input type="text" placeholder="What would you like to know about ${siteName}?" maxlength="300">
                            <button class="ai-send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.aiModal);
    }

    setupEventListeners() {
        // AI Button click
        this.aiButton.addEventListener('click', () => this.openModal());
        
        // Modal close
        const closeBtn = this.aiModal.querySelector('.ai-modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        this.aiModal.addEventListener('click', (e) => {
            if (e.target === this.aiModal) {
                this.closeModal();
            }
        });
        
        // Quick action buttons
        this.aiModal.querySelectorAll('.ai-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Send button and enter key
        const sendBtn = this.aiModal.querySelector('.ai-send-btn');
        const input = this.aiModal.querySelector('input');
        
        sendBtn.addEventListener('click', () => this.sendQuery());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendQuery();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.aiModal.style.display = 'flex';
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Focus input
        setTimeout(() => {
            const input = this.aiModal.querySelector('input');
            if (input) input.focus();
        }, 100);
    }

    closeModal() {
        this.aiModal.style.display = 'none';
        this.isModalOpen = false;
        document.body.style.overflow = '';
    }

    getCurrentSiteName() {
        // Extract site name from page title or URL
        const title = document.title;
        if (title.includes('Thanjavur')) return 'Thanjavur';
        if (title.includes('Madurai')) return 'Madurai';
        if (title.includes('Mahabalipuram')) return 'Mahabalipuram';
        if (title.includes('Kumbakonam')) return 'Kumbakonam';
        if (title.includes('Keeladi')) return 'Keeladi';
        if (title.includes('Chidambaram')) return 'Chidambaram';
        if (title.includes('Kanyakumari')) return 'Kanyakumari';
        if (title.includes('Chennai')) return 'Chennai';
        
        // Fallback to URL parsing
        const path = window.location.pathname;
        const segments = path.split('/');
        const siteSegment = segments[segments.length - 2];
        return siteSegment ? siteSegment.charAt(0).toUpperCase() + siteSegment.slice(1) : 'Heritage Site';
    }

    getSiteContext() {
        // Extract context from page content
        const description = document.querySelector('.site-description')?.textContent || '';
        const title = document.querySelector('.site-title')?.textContent || '';
        const subtitle = document.querySelector('.site-subtitle')?.textContent || '';
        
        return {
            title,
            subtitle,
            description,
            url: window.location.href
        };
    }

    handleQuickAction(action) {
        const siteName = this.getCurrentSiteName();
        const queries = {
            'about-site': `Tell me about ${siteName} - its history, significance, and what makes it special`,
            'legends': `Share the fascinating legends and myths associated with ${siteName}`,
            'architecture': `Explain the architectural marvels and unique features of ${siteName}`,
            'history': `Describe the historical significance and cultural importance of ${siteName}`
        };
        
        const query = queries[action];
        if (query) {
            const input = this.aiModal.querySelector('input');
            input.value = query;
            this.sendQuery();
        }
    }

    sendQuery() {
        const input = this.aiModal.querySelector('input');
        const query = input.value.trim();
        
        if (!query) return;
        
        // Clear input
        input.value = '';
        
        // Open Heritage AI in new tab with the query
        const aiUrl = `../../heritageai/heritage-ai.html?query=${encodeURIComponent(query)}&site=${encodeURIComponent(this.getCurrentSiteName())}`;
        window.open(aiUrl, '_blank');
        
        // Close modal
        this.closeModal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on heritage site pages (not on the main AI page)
    if (!window.location.pathname.includes('heritageai')) {
        new HeritageAIIntegration();
    }
});
