/**
 * Chidambaram Heritage Chatbot Initialization
 * Clean initializer that instantiates ImprovedHeritageChatbot (frontend)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🕉️ Initializing Chidambaram Heritage Chatbot (clean init)...');

    // Concise site knowledge used as context for the chatbot
    const chidambaramKnowledge = `Chidambaram Nataraja Temple — Chidambaram
- Sacred abode of Lord Nataraja performing the cosmic dance (Ananda Tandava). Part of the Pancha Bhootha Sthalams representing Akasha (space/ether).
- Historical significance: Ancient temple with origins dating back to the Sangam period, significantly patronized during the Chola dynasty (9th-13th century CE). Raja Raja Chola I and subsequent Chola rulers made significant contributions.
- Architectural highlights: Four towering gopurams (Raja, Deva, Uttara, and Sabha gopurams), golden roof (Kanaka Sabha) weighing 21,600 kg and reaching 39m high, Chit Sabha (Hall of Consciousness), sacred Chidambara Rahasyam (the divine secret represented by a space curtain), 1000-pillared hall (999+1 pillars representing cosmic consciousness), and exquisite bronze sculptures depicting the 108 karanas of Bharatanatyam.
- Spiritual significance: Represents the cosmic dance of creation, preservation, and destruction. The Chidambara Rahasyam symbolizes the formless nature of the divine - the space behind the curtain represents the ethereal form of Shiva. The temple embodies the concept of Akasha (space/ether) as the primordial element from which all creation emerges.
- Cultural heritage: Centre for Tamil Shaivism, classical arts (Bharatanatyam dance originated here), Carnatic music, and annual festivals including the famous Natyanjali Dance Festival where dancers from around the world pay homage to Nataraja. The temple preserves Shaiva Siddhanta philosophy and ancient Tevaram hymns.
- Unique features: Temple without a traditional deity idol in the main sanctum - the cosmic dance itself and the space (akasha) are the manifestations; Golden roof of Kanaka Sabha; Chit Sabha representing consciousness; 108 Bharatanatyam poses sculpted on pillars; extensive inscriptions in Tamil and Sanskrit detailing temple history and royal patronage.
- Temple rituals: Six daily poojas, elaborate abhishekams, traditional music and dance performances, special rituals during Margazhi month, Arudra Darshan festival (Dec-Jan) when Nataraja is taken in procession.
- Festivals: Arudra Darshan (most important), Natyanjali Dance Festival (Feb-Mar), Chithirai Thiruvizha, Aani Thiruvizha, Thai Poosam.
- Visiting info: Living temple with regular festivals; open to all devotees; best time to visit Oct–Mar and during Natyanjali Festival (Feb-Mar); respect local customs and photography restrictions in sanctum sanctorum; witness the daily rituals, evening aarthi, and if possible attend a Bharatanatyam performance. Distance from Chennai ~240 km (5 hours drive).`;

    // Prefer the ImprovedHeritageChatbot if available (it handles API key UI & validation), otherwise fall back to ProfessionalHeritageChatbot
    if (window.ImprovedHeritageChatbot) {
        try {
            window.chidambaramChatbot = new ImprovedHeritageChatbot('Chidambaram Nataraja Temple', { context: chidambaramKnowledge });
            console.log('✅ Chidambaram Heritage Chatbot (Improved) initialized successfully');
        } catch (err) {
            console.error('❌ Failed to initialize ImprovedHeritageChatbot:', err);
        }
    } else if (window.ProfessionalHeritageChatbot) {
        try {
            window.chidambaramChatbot = new ProfessionalHeritageChatbot('Chidambaram Nataraja Temple', chidambaramKnowledge);
            console.log('✅ Chidambaram Heritage Chatbot (Professional) initialized successfully');
        } catch (err) {
            console.error('❌ Failed to initialize ProfessionalHeritageChatbot:', err);
        }
    } else {
        console.error('❌ No chatbot implementation found. Ensure improved-chatbot.js or professional-chatbot.js is loaded before this initializer.');
    }
});
