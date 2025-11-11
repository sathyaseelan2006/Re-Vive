// Vellore Fort AI Chatbot Initialization
// Heritage-specific knowledge base and configuration

const vellorenFortKnowledge = {
    siteName: "Vellore Fort",
    location: "Vellore, Tamil Nadu, India",
    period: "16th Century - Present",
    dynasty: "Vijayanagara Empire",
    
    keyFacts: [
        "Built in 16th century by Vijayanagara Empire",
        "Features double-wall fortification with 9-meter deep moat",
        "Houses the magnificent Jalakanteswarar Temple",
        "Site of the 1806 Vellore Mutiny - first major uprising against British rule",
        "Represents harmony between three major religions (Hindu, Muslim, Christian)",
        "Built entirely with granite blocks using advanced engineering",
        "Imprisoned Tipu Sultan's family after 1799",
        "Exemplifies peak Vijayanagara military architecture"
    ],
    
    architecture: {
        fortification: "Double-wall system with moat, bastions, and battlements",
        material: "Massive granite blocks fitted without mortar",
        dimensions: "Surrounded by 9-meter deep moat",
        specialFeatures: [
            "Double-walled construction for enhanced defense",
            "Strategic bastions at key positions",
            "Underground passages and chambers",
            "Water management systems",
            "Jalakanteswarar Temple with exquisite Vijayanagara carvings"
        ]
    },
    
    historicalEvents: [
        {
            year: "16th Century",
            event: "Construction by Vijayanagara Empire",
            significance: "Established as major military stronghold"
        },
        {
            year: "1799",
            event: "Tipu Sultan's family imprisoned",
            significance: "Fort became residence for Mysore royal family after Fourth Anglo-Mysore War"
        },
        {
            year: "1806",
            event: "Vellore Mutiny",
            significance: "First major armed uprising against British colonial rule, 51 years before 1857"
        },
        {
            year: "Present",
            event: "Protected Monument",
            significance: "Maintained by Archaeological Survey of India as heritage site"
        }
    ],
    
    culturalSignificance: {
        religious: "Unique coexistence of Hindu temple, mosque, and church within fortress walls",
        architectural: "Pinnacle of Vijayanagara military architecture and engineering",
        historical: "Witnessed crucial events in India's freedom struggle",
        artistic: "Jalakanteswarar Temple showcases finest Vijayanagara sculptural art"
    },
    
    visitingInfo: {
        timings: "9:00 AM to 5:00 PM (Closed on National Holidays)",
        entryFee: "Indians: ₹25, Foreigners: ₹300",
        bestTime: "October to March (Winter season)",
        duration: "2-3 hours for complete tour",
        accessibility: "Wheelchair accessible main areas"
    },
    
    nearbyAttractions: [
        "Vellore Golden Temple (Sripuram)",
        "Government Museum Vellore",
        "Jalakandeswarar Temple (inside fort)",
        "St. John's Church (inside fort)",
        "Vainu Bappu Observatory (Kavalur)"
    ],
    
    threeFaiths: {
        hindu: "Jalakanteswarar Temple - Magnificent Vijayanagara temple dedicated to Lord Shiva",
        muslim: "Historic mosque reflecting Islamic architectural influence",
        christian: "St. John's Church built during British colonial period"
    },
    
    mutinyDetails: {
        date: "July 10, 1806",
        cause: "British uniform regulations violating religious practices",
        participants: "Over 1,500 sepoys of Madras Army",
        outcome: "Suppressed but led to significant British policy reforms",
        legacy: "Inspired later independence movements including 1857 uprising"
    }
};

// Initialize chatbot with Vellore Fort context
function initializeVelloreFortChatbot() {
    // Check if ImprovedHeritageChatbot class is available
    if (typeof ImprovedHeritageChatbot !== 'undefined') {
        // Create comprehensive site knowledge for the AI
        const siteKnowledge = `
You are an expert guide for Vellore Fort in Tamil Nadu, India. Here is comprehensive information:

OVERVIEW:
${vellorenFortKnowledge.keyFacts.join('\n')}

ARCHITECTURE:
- Fortification: ${vellorenFortKnowledge.architecture.fortification}
- Material: ${vellorenFortKnowledge.architecture.material}
- Dimensions: ${vellorenFortKnowledge.architecture.dimensions}
- Special Features: ${vellorenFortKnowledge.architecture.specialFeatures.join(', ')}

HISTORICAL TIMELINE:
${vellorenFortKnowledge.historicalEvents.map(event => `${event.year}: ${event.event} - ${event.significance}`).join('\n')}

THREE FAITHS HERITAGE:
- Hindu: ${vellorenFortKnowledge.threeFaiths.hindu}
- Muslim: ${vellorenFortKnowledge.threeFaiths.muslim}
- Christian: ${vellorenFortKnowledge.threeFaiths.christian}

1806 VELLORE MUTINY:
- Date: ${vellorenFortKnowledge.mutinyDetails.date}
- Cause: ${vellorenFortKnowledge.mutinyDetails.cause}
- Participants: ${vellorenFortKnowledge.mutinyDetails.participants}
- Outcome: ${vellorenFortKnowledge.mutinyDetails.outcome}
- Legacy: ${vellorenFortKnowledge.mutinyDetails.legacy}

CULTURAL SIGNIFICANCE:
- Religious: ${vellorenFortKnowledge.culturalSignificance.religious}
- Architectural: ${vellorenFortKnowledge.culturalSignificance.architectural}
- Historical: ${vellorenFortKnowledge.culturalSignificance.historical}
- Artistic: ${vellorenFortKnowledge.culturalSignificance.artistic}

VISITOR INFORMATION:
- Timings: ${vellorenFortKnowledge.visitingInfo.timings}
- Entry Fee: ${vellorenFortKnowledge.visitingInfo.entryFee}
- Best Time: ${vellorenFortKnowledge.visitingInfo.bestTime}
- Duration: ${vellorenFortKnowledge.visitingInfo.duration}
- Accessibility: ${vellorenFortKnowledge.visitingInfo.accessibility}

NEARBY ATTRACTIONS:
${vellorenFortKnowledge.nearbyAttractions.join(', ')}

When answering questions:
1. Be informative and historically accurate
2. Use engaging storytelling when appropriate
3. Include relevant dates, names, and architectural details
4. Highlight the unique Three Faiths aspect
5. Emphasize the fort's role in Indian independence history
6. Provide practical visitor information when asked
7. Use emojis to make responses more engaging (🏰 ⚔️ 🕉️ 🕌 ⛪)
8. Keep responses concise but comprehensive
`;

        // Initialize the chatbot
        const chatbot = new ImprovedHeritageChatbot(
            "Vellore Fort",
            siteKnowledge
        );
        
        console.log("✅ Vellore Fort AI Chatbot initialized successfully");
        console.log("📚 Knowledge base loaded with Three Faiths heritage and 1806 Mutiny details");
        return chatbot;
    } else {
        console.error("❌ ImprovedHeritageChatbot class not found. Please ensure improved-chatbot.js is loaded.");
        return null;
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔄 Starting Vellore Fort chatbot initialization...");
    setTimeout(initializeVelloreFortChatbot, 1000); // Small delay to ensure other scripts load first
});
