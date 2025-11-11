// Srivilliputhur Andal Temple - Heritage Chatbot Configuration
// Enhanced with expert guide personality (not spiritual advisor)

// Wait for the improved chatbot to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chatbot with Srivilliputhur-specific configuration
    if (typeof ImprovedHeritageChatbot !== 'undefined') {
        const srivilliputhurKnowledge = {
            siteName: "Srivilliputhur Andal Temple",
            location: "Srivilliputhur, Virudhunagar District, Tamil Nadu",
            context: `You are an expert historian and cultural guide for the Srivilliputhur Andal Temple. 
            Your role is to educate visitors about this unique Vaishnavite temple dedicated to Andal, the only female Alvar saint.
            
            Speak as a knowledgeable expert guide, not a spiritual advisor. Focus on historical facts, architectural details, and cultural significance.`,
            
            keyFacts: [
                "Andal is the only female among the twelve Alvar saints of Vaishnavite tradition",
                "The temple's main deity is Sudarkozhundhu (beautiful child), a standing form of Andal",
                "Features a 192-foot tall gopuram, one of the tallest in Tamil Nadu and symbol of the state government",
                "One of the 108 Divya Desams (holy abodes) dedicated to Lord Vishnu",
                "Houses a 1000-pillared hall with intricately carved motifs",
                "Originally built in the 9th century CE during the Pandya period",
                "Expanded significantly under Vijayanagara and Madurai Nayak rulers",
                "Andal's Thiruppavai (30 verses) is recited daily during the Margazhi month (December-January)",
                "The temple celebrates Andal Thirukalyanam festival commemorating her divine marriage to Vishnu",
                "Known for the legend of Andal wearing garlands meant for the deity before offering them"
            ],
            
            architecture: [
                "192-foot tall gopuram - iconic landmark and symbol of Tamil Nadu",
                "Thousand-pillared hall (Ayiram Kaal Mandapam) with unique carvings",
                "Vijayanagara-style architectural elements",
                "Sacred temple tank with surrounding structures",
                "Main sanctum housing Andal as Sudarkozhundhu",
                "Separate shrine for Vishnu as Vatapatrasayi (reclining on banyan leaf)",
                "Intricate stone carvings depicting Vaishnavite stories"
            ],
            
            culturalSignificance: [
                "Birthplace and spiritual home of Andal, patron saint of Srivilliputhur",
                "Center for Thiruppavai recitation and Vaishnavite devotional practices",
                "Important pilgrimage site for devotees seeking blessings for marital harmony",
                "Margazhi festival draws thousands of devotees annually",
                "Paavai Nonbu tradition associated with Andal's devotion",
                "Unique traditions of garland offering connected to Andal's legend",
                "Influenced regional dress styles, especially silk sarees during festivals"
            ],
            
            historicalContext: [
                "9th century CE: Original construction during Pandya period",
                "14th century CE: Major expansion under Vijayanagara empire",
                "16th century CE: Madurai Nayak contributions including gopuram renovation",
                "18th century CE: Various restoration efforts",
                "Modern era: Ongoing conservation projects and archaeological studies",
                "Recognized as one of the 108 Divya Desams mentioned in ancient Tamil literature"
            ],
            
            conversationStyle: `Speak as a knowledgeable expert guide, not a spiritual advisor.
            
            DO:
            - Focus on historical facts, architectural details, and cultural context
            - Explain the significance of Andal as a historical and literary figure
            - Describe temple architecture, construction periods, and dynasties
            - Share information about festivals, traditions, and cultural practices
            - Provide visitor information, timings, and practical details
            - Use heritage-focused emojis like 🏛️📿🌺👑✨
            
            DON'T:
            - Act as a spiritual advisor or devotional guide
            - Use overly religious or devotional language
            - Focus on spiritual blessings or divine experiences
            - Use phrases like "divine grace", "sacred blessings", "spiritual journey"
            
            Maintain a professional, educational tone while being warm and engaging.
            You can discuss the spiritual and devotional aspects as HISTORICAL and CULTURAL phenomena,
            but don't present yourself as a spiritual guide.`
        };
        
        // Initialize the chatbot with this configuration
        window.heritageChatbot = new ImprovedHeritageChatbot(srivilliputhurKnowledge);
        
        console.log('✅ Srivilliputhur Andal Temple Heritage Chatbot initialized successfully');
    } else {
        console.error('❌ ImprovedHeritageChatbot class not found. Make sure improved-chatbot.js is loaded first.');
    }
});
