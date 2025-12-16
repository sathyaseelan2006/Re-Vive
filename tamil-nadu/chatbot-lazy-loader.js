/**
 * Optimized Heritage Chatbot - Performance Enhanced
 * Reduces lag with lazy initialization and debounced operations
 */

// Global optimization flag
window.CHATBOT_OPTIMIZED = true;

// Debounce utility
const debounceChat = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Lazy load chatbot only when needed
let chatbotInstance = null;
let chatbotLoaded = false;

function initChatbotLazy() {
    if (chatbotLoaded) return;
    
    const toggle = document.getElementById('chatbotToggle');
    if (!toggle) return;
    
    // Load chatbot on first interaction
    toggle.addEventListener('click', function loadChatbot() {
        if (!chatbotLoaded) {
            console.log('🚀 Loading chatbot on demand...');
            
            // Load the actual chatbot script dynamically
            const script = document.createElement('script');
            script.src = '../improved-chatbot.js';
            script.onload = () => {
                chatbotLoaded = true;
                console.log('✅ Chatbot loaded');
            };
            document.head.appendChild(script);
            
            // Remove this listener after first load
            toggle.removeEventListener('click', loadChatbot);
        }
    }, { once: true });
}

// Initialize lazy loading on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotLazy);
} else {
    initChatbotLazy();
}

// Optimize typing indicator
const showTypingOptimized = debounceChat((container) => {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });
    }
}, 100);

const hideTypingOptimized = debounceChat(() => {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}, 100);

// Export optimized functions
window.chatbotOptimizations = {
    showTypingOptimized,
    hideTypingOptimized,
    debounceChat
};
