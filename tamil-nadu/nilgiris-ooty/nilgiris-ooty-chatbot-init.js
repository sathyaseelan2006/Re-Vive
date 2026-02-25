/**
 * Nilgiris Ooty Heritage Chatbot Initialization
 * Clean initializer that instantiates ImprovedHeritageChatbot
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏔️ Initializing Nilgiris Ooty Heritage Chatbot...');
    
    // Comprehensive site knowledge used as context for the chatbot
    const nilgirisKnowledge = `Nilgiris Heritage (Ooty) — Queen of Hill Stations, Tamil Nadu

🚂 NILGIRI MOUNTAIN RAILWAY:
- UNESCO World Heritage Site (2005). Built 1854-1908 using unique rack and pinion system
- Connects Mettupalayam to Ooty (2,240m elevation), passes 16 tunnels & 250 bridges
- Only rack railway in India, colonial engineering marvel

🏰 COLONIAL HERITAGE:
- Established by John Sullivan (1819-1823) as British hill station
- Summer capital of Madras Presidency; Victorian architecture, Gothic churches
- Ooty Lake (1824, 65 acres artificial lake)
- Government Botanical Garden (1848, 650+ species, 20-million-year-old fossil)

🏛️ TODA TRIBAL CULTURE:
- Indigenous people living in Nilgiris for 1000+ years
- Distinctive barrel-shaped huts, sacred water buffalo relationship
- Ancient traditions, pastoral lifestyle, endangered culture preservation

🍵 TEA HERITAGE:
- Tea cultivation started 1850s; Nilgiri tea world-famous
- Second largest tea-growing region in India
- High-altitude tea with traditional and modern processing

🌿 NATURAL HERITAGE:
- Nilgiri Biosphere Reserve (UNESCO), Shola forests and grasslands
- Home to Nilgiri tahr, endemic species, cool climate (10-25°C)
- Doddabetta Peak highest point (2,637m)

VISITING INFO:
- Best time: October-March; peak April-June
- From Chennai (540km), Bangalore (270km)
- Attractions: Ooty Lake, Botanical Garden, Tea Museum
- Activities: trekking, boating, horse riding
- Specialties: homemade chocolates, tea, eucalyptus oil`;
    
    // Prefer the ImprovedHeritageChatbot if available (handles API key UI & validation), otherwise fallback
    if (window.ImprovedHeritageChatbot) {
        try {
            window.nilgirisChatbot = new ImprovedHeritageChatbot('Nilgiris (Ooty)', { context: nilgirisKnowledge });
            console.log('✅ Nilgiris Ooty Heritage Chatbot (Improved) initialized successfully');
        } catch (err) {
            console.error('❌ Failed to initialize ImprovedHeritageChatbot:', err);
        }
    } else if (window.ProfessionalHeritageChatbot) {
        try {
            window.nilgirisChatbot = new ProfessionalHeritageChatbot('Nilgiris (Ooty)', nilgirisKnowledge);
            console.log('✅ Nilgiris Ooty Heritage Chatbot (Professional) initialized successfully');
        } catch (err) {
            console.error('❌ Failed to initialize ProfessionalHeritageChatbot:', err);
        }
    } else {
        console.error('❌ No chatbot implementation found. Ensure improved-chatbot.js or professional-chatbot.js is loaded before this initializer.');
    }
});
