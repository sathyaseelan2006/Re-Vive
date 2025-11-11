# Professional Heritage Chatbot System - Setup Guide

## Overview
This chatbot system features **Dr. Archibald Thornbury**, a distinguished historian and cultural heritage specialist, who provides professional insights about historical sites across Tamil Nadu.

## Key Features
✅ **Secure API Key Management** - API key stored in backend `.env` file, never exposed to frontend  
✅ **Professional Historian Persona** - Dr. Thornbury provides scholarly, engaging responses  
✅ **No Religious Content** - Purely historical, architectural, and cultural focus  
✅ **Universal System** - One backend serves all heritage site chatbots  
✅ **No Re-entering API Keys** - Set once in backend, works everywhere  

## Setup Instructions

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install axios
```

### Step 2: Configure Environment Variables
1. Create a `.env` file in the `backend` directory:
```bash
cd backend
copy .env.example .env
```

2. Edit `.env` and add your Gemini API key:
```env
# Google Gemini API Key (Get from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other settings
PORT=5000
MONGODB_URI=mongodb://localhost:27017/revive_heritage
NODE_ENV=development
```

### Step 3: Start the Backend Server
```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:5000
📊 API available at http://localhost:5000/api
```

### Step 4: Open Your Heritage Site
Open any heritage site page (e.g., `tamil-nadu/thanjavur/index.html`) in your browser.

The chatbot will automatically:
- Connect to the backend server
- Load the API key securely from the server
- Initialize Dr. Thornbury for that specific site

## How It Works

### Architecture
```
Frontend (Heritage Sites)
      ↓
professional-chatbot.js
      ↓
Backend API (/api/chatbot/chat)
      ↓
Google Gemini API
```

### File Structure
```
backend/
├── .env                    # Your API key (DO NOT COMMIT)
├── .env.example           # Template
├── server.js              # Updated with chatbot route
└── routes/
    └── chatbot.js         # Chatbot API endpoint

tamil-nadu/
├── professional-chatbot.js    # Universal chatbot client
└── thanjavur/
    ├── index.html             # Updated to use new chatbot
    └── thanjavur-chatbot-init.js  # Site-specific knowledge
```

## Adding Chatbot to New Sites

### 1. Include the Scripts
Add to your site's HTML before `</body>`:
```html
<!-- Professional Heritage Chatbot System -->
<script src="../professional-chatbot.js"></script>
<script src="your-site-chatbot-init.js"></script>
```

### 2. Create Site-Specific Initialization
Create `your-site-chatbot-init.js`:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const yourSiteKnowledge = `
SITE: Your Heritage Site Name

HISTORICAL OVERVIEW:
- Key historical facts
- Dates and dynasties
- Significance

ARCHITECTURAL HIGHLIGHTS:
- Building techniques
- Materials used
- Unique features

CULTURAL SIGNIFICANCE:
- Art and traditions
- Historical impact
- Modern relevance

VISITING INFORMATION:
- Hours and access
- Best visiting times
- Practical tips
`;
    
    window.yourSiteChatbot = new ProfessionalHeritageChatbot(
        'Your Site Name',
        yourSiteKnowledge
    );
});
```

## Dr. Archibald Thornbury - The Expert

**Persona:** Distinguished historian with 40 years of experience  
**Expertise:** Architecture, cultural anthropology, archaeology  
**Style:** Professional, warm, scholarly yet accessible  
**Focus:** Historical facts, architectural details, cultural significance  
**Avoids:** Religious preaching, devotional content, speculation  

## API Endpoint

### POST /api/chatbot/chat

**Request:**
```json
{
  "message": "Tell me about the temple's history",
  "siteName": "Brihadeeswarar Temple, Thanjavur",
  "siteKnowledge": "...site information...",
  "conversationHistory": [
    {"role": "user", "content": "previous message"},
    {"role": "assistant", "content": "previous response"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "Dr. Thornbury's response...",
  "conversationId": 1730836800000
}
```

## Security Notes

- ✅ API key stored securely in backend `.env` file
- ✅ Never exposed to frontend/browser
- ✅ Backend validates and sanitizes all requests
- ✅ CORS enabled for local development
- ⚠️ For production, add proper authentication and rate limiting

## Troubleshooting

### "Cannot connect to chatbot server"
- Ensure backend server is running (`npm start` in backend directory)
- Check that server is on http://localhost:5000
- Verify no firewall blocking port 5000

### "API key not configured"
- Check `.env` file exists in backend directory
- Verify `GEMINI_API_KEY=your_key_here` is set
- Restart backend server after changing `.env`

### "Error communicating with AI service"
- Verify your Gemini API key is valid
- Check internet connection
- Ensure API key has proper permissions

## Get Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create new API key
4. Copy to backend `.env` file

## Benefits

✨ **Single Configuration** - Set API key once, works everywhere  
✨ **Secure** - API key never exposed to users  
✨ **Professional** - Consistent expert persona across all sites  
✨ **Maintainable** - One backend, multiple frontend sites  
✨ **Scalable** - Easy to add new heritage sites  

## Support

For issues or questions:
1. Check this README
2. Verify backend server is running
3. Check browser console for errors
4. Check backend terminal for API errors

---

**Version:** 4.0  
**Last Updated:** November 5, 2025  
**System:** Professional Heritage Chatbot with Backend Integration
