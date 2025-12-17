/**
 * Thanjavur Heritage Chatbot Initialization
 * Clean initializer that instantiates ImprovedHeritageChatbot (frontend)
 */

// Concise site knowledge used as context for the chatbot
const thanjavurKnowledge = `Brihadeeswarar Temple (Brihadisvara) — Thanjavur
- Built by Raja Raja Chola I (c. 1003–1010 CE). Part of the Great Living Chola Temples (UNESCO).
- Architectural highlights: 216 ft granite vimana, monolithic Nandi, massive granite capstone (~80 tons), precise interlocking stone technique.
- Cultural significance: centre for Tamil literature, classical arts (Bharatanatyam), and Tanjore painting; extensive inscriptions and royal patronage.
- Visiting info: living temple with regular festivals; best time to visit Oct–Mar; respect local customs and photography restrictions in sanctum.`;

// Function to initialize chatbot
function initializeThanjavurChatbot() {
    console.log('🏛️ Initializing Thanjavur Heritage Chatbot...');

    // Prefer the ImprovedHeritageChatbot if available
    if (window.ImprovedHeritageChatbot) {
        try {
            window.thanjavurChatbot = new ImprovedHeritageChatbot('Brihadeeswarar Temple, Thanjavur', { context: thanjavurKnowledge });
            console.log('✅ Thanjavur Heritage Chatbot (Improved) initialized successfully');
            return true;
        } catch (err) {
            console.error('❌ Failed to initialize ImprovedHeritageChatbot:', err);
        }
    } else if (window.ProfessionalHeritageChatbot) {
        try {
            window.thanjavurChatbot = new ProfessionalHeritageChatbot('Brihadeeswarar Temple, Thanjavur', thanjavurKnowledge);
            console.log('✅ Thanjavur Heritage Chatbot (Professional) initialized successfully');
            return true;
        } catch (err) {
            console.error('❌ Failed to initialize ProfessionalHeritageChatbot:', err);
        }
    }

    return false;
}

// Try to initialize immediately (works if scripts loaded in order)
if (window.ImprovedHeritageChatbot || window.ProfessionalHeritageChatbot) {
    initializeThanjavurChatbot();
} else {
    // Wait a bit for the chatbot class to load (defer scripts)
    setTimeout(() => {
        if (!initializeThanjavurChatbot()) {
            console.error('❌ Chatbot class not found. Ensure improved-chatbot.js is loaded.');
        }
    }, 500);
}
