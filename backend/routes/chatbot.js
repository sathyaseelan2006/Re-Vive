import express from 'express';
import axios from 'axios';

const router = express.Router();

// Professional Historical Expert Persona
const EXPERT_PERSONA = `You are Dr. Archibald Thornbury, a distinguished historian and cultural heritage specialist with 40 years of experience studying ancient civilizations, architectural marvels, and cultural traditions across the world. 

Your expertise includes:
- Ancient and medieval architecture
- Cultural anthropology and heritage preservation
- Archaeological findings and historical artifacts
- Traditional art forms and craftsmanship
- Urban planning and ancient city structures
- Cross-cultural historical connections

Your communication style:
- Professional, warm, and engaging
- Use clear, accessible language while maintaining academic rigor
- Share fascinating historical details and little-known facts
- Make connections between past and present
- Encourage appreciation for cultural heritage
- Never discuss religion in a promotional or devotional manner
- Focus purely on historical, architectural, and cultural aspects
- Use phrases like "From a historical perspective..." or "Archaeological evidence suggests..."

You are passionate about making history accessible to everyone and helping people discover the rich tapestry of human civilization. You answer questions with enthusiasm and depth, always grounding your responses in historical facts and scholarly research.`;

// Chatbot endpoint - proxies requests to Gemini API
router.post('/chat', async (req, res) => {
    try {
        const { message, siteName, siteKnowledge, conversationHistory } = req.body;

        // Validate API key exists
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'API key not configured on server'
            });
        }

        // Build the context-aware prompt
        const systemContext = `${EXPERT_PERSONA}

You are currently assisting visitors at ${siteName}. Here's essential information about this site:

${siteKnowledge}

Remember to:
1. Answer from the perspective of Dr. Thornbury, the heritage expert
2. Focus on historical facts, architectural details, and cultural significance
3. Avoid any religious preaching or devotional content
4. Keep responses concise (2-3 paragraphs) but informative
5. If asked about visiting details, mention them professionally
6. Encourage curiosity and deeper exploration of heritage sites`;

        // Build conversation context
        const conversationContext = conversationHistory && conversationHistory.length > 0
            ? conversationHistory.map(msg => `${msg.role === 'user' ? 'Visitor' : 'Dr. Thornbury'}: ${msg.content}`).join('\n')
            : '';

        // Construct the full prompt
        const fullPrompt = `${systemContext}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}
Visitor: ${message}

Dr. Thornbury:`;

        // Call Gemini API - use gemini-2.5-flash (current stable model)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract response text
        const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                          "I apologize, but I'm having trouble formulating a response at the moment. Could you rephrase your question?";

        res.json({
            success: true,
            response: botResponse,
            conversationId: Date.now() // Simple conversation tracking
        });

    } catch (error) {
        console.error('❌ Chatbot API Error:', error.message);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            return res.status(error.response.status).json({
                success: false,
                message: 'Error communicating with AI service',
                error: error.response.data
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check for chatbot service
router.get('/health', (req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    res.json({
        status: 'OK',
        service: 'Heritage Chatbot',
        apiKeyConfigured: hasApiKey
    });
});

// Narration endpoint - generate an engaging storytelling narration for given content
router.post('/narrate', async (req, res) => {
    try {
        const { title, content, style, language } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'API key not configured on server' });
        }

        // Build a storyteller persona prompt
        const storytellerPersona = `You are a gifted storyteller for cultural heritage sites. Speak in a warm, vivid, and descriptive style that suits audio narration. Use short, well-paced sentences suitable for speech synthesis. Keep the narration engaging and suitable for general audiences of all ages. Avoid political or religious advocacy. Use sensory detail and historical context where relevant.`;

        // Language directive
        let languageInstruction = '';
        if (language && String(language).toLowerCase().startsWith('ta')) {
            languageInstruction = 'Please produce the narration in Tamil (use Tamil script). Ensure sentences flow naturally for spoken Tamil and avoid untranslated English phrases.';
        } else {
            languageInstruction = 'Please produce the narration in English.';
        }

        const prompt = `${storytellerPersona}\n\n${languageInstruction}\n\nTitle: ${title || 'Heritage Story'}\n\nContent: ${content}\n\nProduce a spoken-style narration of approximately 150-400 words (roughly 1-2 minutes when read aloud). Keep sentences clear and rhythmic for voice narration. Do NOT include meta instructions like "[pause]" or stage directions. Provide a single coherent narrative paragraph or short paragraphs suitable for TTS.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.75,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 800
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const narration = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        res.json({ success: true, narration });

    } catch (error) {
        console.error('❌ Narration API Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            return res.status(error.response.status).json({ success: false, message: 'Error communicating with AI service', error: error.response.data });
        }
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

export default router;
