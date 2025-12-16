# RE:VIVE Heritage Platform - Data Flow Diagram

## Project Overview
RE:VIVE is a comprehensive cultural heritage platform showcasing India's rich historical sites, with a focus on Tamil Nadu heritage. The platform features user authentication, personalized recommendations, AI-powered chatbot assistance, and interactive exploration of heritage sites.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  - React/TypeScript Application (Login/SignUp)                          │
│  - HTML/CSS/JavaScript Static Pages (Heritage Sites)                    │
│  - Interactive SVG Map (India Map Navigation)                           │
│  - Heritage AI Interface (Chatbot)                                      │
│  - Kolam Background Animation                                           │
└─────────────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVER LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  - Express.js Backend (Port 5000)                                       │
│  - RESTful API Endpoints                                                │
│  - JWT Authentication Middleware                                        │
│  - CORS & Helmet Security                                               │
└─────────────────────────────────────────────────────────────────────────┘
                              ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  - MongoDB (revive_heritage database)                                   │
│  - Collections: users, heritagesites                                    │
└─────────────────────────────────────────────────────────────────────────┘
                              ↕ HTTP API
┌─────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  - Google Gemini AI API (gemini-2.5-flash)                             │
│  - AI-Powered Heritage Expert Chatbot                                   │
│  - Content Generation & Narration                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────────┐
│   User      │
│ (Browser)   │
└──────┬──────┘
       │
       │ 1. Navigate to login.html or signup.html
       ↓
┌──────────────────┐
│  Login/SignUp    │
│  React Forms     │
│  (App.tsx)       │
└──────┬───────────┘
       │
       │ 2. Submit credentials
       │    POST /api/auth/login
       │    POST /api/auth/signup
       ↓
┌────────────────────┐
│  Express Server    │
│  Auth Routes       │
│  (auth.js)         │
└──────┬─────────────┘
       │
       │ 3. Validate input
       │    Check email format
       │    Password length >= 6
       ↓
┌────────────────────┐
│   MongoDB          │
│   User Model       │
│   (User.js)        │
└──────┬─────────────┘
       │
       │ 4. Query user by email
       │    Hash password (bcrypt)
       │    Compare passwords
       ↓
┌────────────────────┐
│  JWT Token         │
│  Generation        │
│  (jsonwebtoken)    │
└──────┬─────────────┘
       │
       │ 5. Return JWT token + user data
       │    {success, token, user: {id, fullName, email}}
       ↓
┌────────────────────┐
│  Client Storage    │
│  localStorage      │
│  'user' object     │
└──────┬─────────────┘
       │
       │ 6. Redirect to index.html
       ↓
┌────────────────────┐
│  Main Heritage     │
│  Platform          │
│  (index.html)      │
└────────────────────┘
```

**Data Elements:**
- **Input**: email, password, fullName (signup)
- **Processing**: Validation, hashing, JWT signing
- **Output**: JWT token, user profile
- **Storage**: MongoDB users collection, localStorage

---

### 2. Personalized Recommendation Flow

```
┌─────────────┐
│   User      │
│ Logged In   │
└──────┬──────┘
       │
       │ 1. First login detected
       ↓
┌──────────────────────┐
│  Preference Modal    │
│  (preferences.html)  │
└──────┬───────────────┘
       │
       │ 2. Select preferences
       │    [romantic, spiritual, war, heroic,
       │     history, architecture, nature, cultural]
       ↓
┌────────────────────────┐
│  POST /api/user/       │
│  preferences           │
│  (profile.js)          │
└──────┬─────────────────┘
       │
       │ 3. Process preferences
       │    - Validate tags
       │    - Determine emotional profile
       ↓
┌───────────────────────────────┐
│  Recommendation Engine        │
│  (generateRecommendations)    │
└──────┬────────────────────────┘
       │
       │ 4. Query heritage sites
       │    - From MongoDB (HeritageSite model)
       │    - Fallback to tamilNaduSites.js
       ↓
┌────────────────────────────────┐
│  Scoring Algorithm             │
│  - Match emotional tags        │
│  - Calculate match score       │
│  - Generate personalized reason│
└──────┬─────────────────────────┘
       │
       │ 5. Return top 6 recommendations
       │    {siteName, location, matchScore, reason, highlights}
       ↓
┌────────────────────────────────┐
│  Update User Profile           │
│  - preferences                 │
│  - emotionalProfile            │
│  - recommendedSites            │
└──────┬─────────────────────────┘
       │
       │ 6. Display recommendations
       ↓
┌────────────────────────────────┐
│  User Dashboard                │
│  Personalized Site Cards       │
└────────────────────────────────┘
```

**Data Elements:**
- **Input**: User preferences array
- **Processing**: Tag matching, scoring algorithm
- **Output**: Ranked site recommendations with reasons
- **Profiles**: explorer, scholar, romantic, warrior, seeker

---

### 3. Heritage Site Exploration Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. View India map (index.html)
       │    Interactive SVG map
       ↓
┌──────────────────────┐
│  India Map           │
│  (main.js)           │
│  - SVG paths for     │
│    each state        │
│  - Hover tooltips    │
└──────┬───────────────┘
       │
       │ 2. Click on state (e.g., Tamil Nadu)
       │    Golden glow highlight
       │    path.addEventListener('click')
       ↓
┌──────────────────────┐
│  State Data Lookup   │
│  stateData object    │
│  - State name        │
│  - Cultural info     │
└──────┬───────────────┘
       │
       │ 3. Navigate to state page
       │    window.location.href = 'tamil-nadu/index.html'
       ↓
┌────────────────────────────┐
│  Tamil Nadu Heritage Page  │
│  (tamil-nadu/index.html)   │
└──────┬─────────────────────┘
       │
       │ 4. Browse heritage sites
       │    - Site cards with images
       │    - Period information
       │    - Quick facts
       ↓
┌────────────────────────────┐
│  Click on specific site    │
│  (e.g., Thanjavur)         │
└──────┬─────────────────────┘
       │
       │ 5. Navigate to site detail page
       │    tamil-nadu/thanjavur/index.html
       ↓
┌────────────────────────────────┐
│  Site Detail Page              │
│  - Historical information      │
│  - Photo gallery               │
│  - Architecture details        │
│  - Visit information           │
│  - AI Chatbot interface        │
└────────────────────────────────┘
```

**Data Elements:**
- **Input**: User clicks, state selection
- **Processing**: SVG path mapping, route navigation
- **Output**: State/site details, visual feedback
- **Storage**: Static site data, image assets

---

### 4. AI Chatbot Interaction Flow

```
┌─────────────┐
│   User      │
│ On Site     │
│ Detail Page │
└──────┬──────┘
       │
       │ 1. Open Heritage AI chatbot
       │    (heritage-ai.html or integrated)
       ↓
┌──────────────────────────┐
│  Chatbot Interface       │
│  (heritage-ai.js)        │
│  - Message input         │
│  - Chat history          │
│  - Dr. Thornbury persona │
└──────┬───────────────────┘
       │
       │ 2. User asks question
       │    "Tell me about the architecture"
       ↓
┌──────────────────────────┐
│  Frontend Processing     │
│  (ai-integration.js)     │
│  - Build context         │
│  - Site knowledge        │
│  - Conversation history  │
└──────┬───────────────────┘
       │
       │ 3. POST /api/chatbot/chat
       │    {message, siteName, siteKnowledge, conversationHistory}
       ↓
┌────────────────────────────────┐
│  Express Chatbot Route         │
│  (chatbot.js)                  │
└──────┬─────────────────────────┘
       │
       │ 4. Build expert persona prompt
       │    - Dr. Archibald Thornbury character
       │    - 40 years experience
       │    - Historical context
       │    - Site-specific knowledge
       ↓
┌────────────────────────────────┐
│  Gemini API Call               │
│  (axios POST)                  │
│  - Model: gemini-2.5-flash     │
│  - Temperature: 0.7            │
│  - maxTokens: 1024             │
│  - Safety settings             │
└──────┬─────────────────────────┘
       │
       │ 5. AI generates response
       │    - Historical facts
       │    - Architectural details
       │    - Cultural significance
       │    - Educational content
       ↓
┌────────────────────────────────┐
│  Response Processing           │
│  - Extract text                │
│  - Format response             │
│  - Add to conversation history │
└──────┬─────────────────────────┘
       │
       │ 6. Return to client
       │    {success, response, conversationId}
       ↓
┌────────────────────────────────┐
│  Display in Chat               │
│  - Dr. Thornbury avatar        │
│  - Formatted message           │
│  - Scroll to bottom            │
└────────────────────────────────┘
```

**Data Elements:**
- **Input**: User query, site context
- **Processing**: AI prompt engineering, API call
- **Output**: Expert heritage information
- **API**: Google Gemini 2.5-flash

---

### 5. Content Narration Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Click "Listen to narration"
       │    on heritage site page
       ↓
┌──────────────────────────┐
│  Frontend Narration UI   │
│  - Play button           │
│  - Language selector     │
└──────┬───────────────────┘
       │
       │ 2. POST /api/chatbot/narrate
       │    {title, content, style, language}
       ↓
┌────────────────────────────────┐
│  Express Narration Route       │
│  (chatbot.js)                  │
└──────┬─────────────────────────┘
       │
       │ 3. Build storyteller prompt
       │    - Warm, vivid style
       │    - 150-400 words
       │    - Language: English/Tamil
       │    - Audio-friendly format
       ↓
┌────────────────────────────────┐
│  Gemini API Call               │
│  - Generate narration text     │
│  - Speech-optimized            │
└──────┬─────────────────────────┘
       │
       │ 4. Return narration text
       │    {success, narration}
       ↓
┌────────────────────────────────┐
│  Text-to-Speech (Browser)      │
│  - Web Speech API              │
│  - Play audio narration        │
└────────────────────────────────┘
```

**Data Elements:**
- **Input**: Site content, language preference
- **Processing**: Storytelling AI generation
- **Output**: Narration text for TTS
- **Languages**: English, Tamil

---

## Data Models

### User Model (MongoDB)
```javascript
{
  _id: ObjectId,
  fullName: String (required, min 2 chars),
  email: String (required, unique, lowercase),
  password: String (hashed, bcrypt, min 6 chars),
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean (default: true),
  isFirstLogin: Boolean (default: true),
  preferences: [String] (romantic, spiritual, war, heroic, history, architecture, nature, cultural),
  emotionalProfile: String (explorer, scholar, romantic, warrior, seeker),
  recommendedSites: [{
    siteName: String,
    location: String,
    matchScore: Number,
    reason: String
  }],
  lastPreferenceUpdate: Date
}
```

### Heritage Site Model (MongoDB)
```javascript
{
  _id: ObjectId,
  siteName: String (required),
  location: String,
  district: String,
  state: String (default: "Tamil Nadu"),
  period: String,
  emotionalTags: [String],
  highlights: [String],
  urlPath: String,
  description: String,
  architecture: String,
  culturalSignificance: String,
  images: [String],
  isActive: Boolean (default: true),
  visitingHours: String,
  entryFee: String,
  createdAt: Date,
  updatedAt: Date
}
```

### State Data (Static Object)
```javascript
{
  stateId: {
    name: String,
    culture: String (description)
  }
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Input | Output |
|--------|----------|-------------|-------|--------|
| POST | `/api/auth/signup` | Register new user | {fullName, email, password, confirmPassword} | {success, token, user} |
| POST | `/api/auth/login` | User login | {email, password} | {success, token, user} |
| GET | `/api/auth/verify` | Verify JWT token | Authorization header | {success, user} |

### User Profile Routes (`/api/user`)
| Method | Endpoint | Description | Input | Output |
|--------|----------|-------------|-------|--------|
| POST | `/api/user/preferences` | Update preferences | {userId, preferences[]} | {success, data} |
| GET | `/api/user/profile/:userId` | Get user profile | userId param | {success, data} |
| GET | `/api/user/first-login/:userId` | Check first login | userId param | {success, isFirstLogin, fullName} |
| GET | `/api/user/recommendations/:userId` | Get recommendations | userId param | {success, recommendations[]} |

### Chatbot Routes (`/api/chatbot`)
| Method | Endpoint | Description | Input | Output |
|--------|----------|-------------|-------|--------|
| POST | `/api/chatbot/chat` | AI chat interaction | {message, siteName, siteKnowledge, conversationHistory} | {success, response, conversationId} |
| POST | `/api/chatbot/narrate` | Generate narration | {title, content, style, language} | {success, narration} |
| GET | `/api/chatbot/health` | Health check | - | {status, service, apiKeyConfigured} |

---

## Data Flow Security

### Security Measures
1. **Authentication**: JWT tokens with 7-day expiration
2. **Password Security**: bcrypt hashing (10 salt rounds)
3. **CORS**: Configured with environment-based origins
4. **Helmet**: Security headers (CSP, XSS protection)
5. **Input Validation**: Email format, password length
6. **API Key Protection**: Environment variables (.env)
7. **Rate Limiting**: 60 requests/minute for Gemini API

### Data Protection
- Passwords never returned in JSON responses
- JWT tokens stored in localStorage (client-side)
- MongoDB connection URI in environment variables
- Gemini API key stored securely
- User email stored in lowercase for consistency

---

## Technology Stack

### 🎨 Frontend

#### **React 18.2** - Component-based UI framework
- Modern declarative UI library
- Component reusability for forms and interfaces
- Hooks for state management (useState, useEffect)
- Virtual DOM for efficient rendering
- Used in: `App.tsx`, `LoginForm.tsx`, `SignUpForm.tsx`

#### **TypeScript 5.8** - Type-safe JavaScript
- Static type checking for enhanced code quality
- Interface definitions for data models
- Improved IDE support and autocomplete
- Compile-time error detection
- Used in: `types.ts`, all `.tsx` components

#### **Vite 6.2** - Fast build tool and dev server
- Lightning-fast hot module replacement (HMR)
- Optimized production builds
- ES module-based development
- Efficient code splitting
- Config: `vite.config.ts`

#### **HTML5/CSS3** - Modern web standards
- Semantic HTML structure
- Custom CSS animations and transitions
- Responsive design with media queries
- CSS Grid and Flexbox layouts
- Files: `index.html`, `style.css`, `tamil-nadu-style.css`

#### **SVG (Scalable Vector Graphics)** - Interactive maps
- Vector-based India map with state boundaries
- Dynamic path manipulation for state selection
- Hover effects and click interactions
- Scalable without quality loss
- File: `public/india-map.svg`

#### **Vanilla JavaScript (ES6+)** - Core interactivity
- DOM manipulation and event handling
- Interactive map functionality
- Scroll animations and reveals
- Performance optimizations
- Files: `main.js`, `performance-utils.js`, `heritage-ai.js`

#### **localStorage/sessionStorage** - Client-side storage
- User session persistence
- JWT token storage
- Preference caching
- Conversation history
- SVG map caching for performance

---

### ⚙️ Backend

#### **Node.js** - JavaScript runtime environment
- Event-driven, non-blocking I/O
- V8 JavaScript engine
- NPM package ecosystem
- Async/await support
- Runtime for Express server

#### **Express.js 4.18** - Web application framework
- RESTful API routing
- Middleware architecture
- Request/response handling
- Static file serving
- File: `backend/server.js`

#### **Mongoose 8.0/7.5** - MongoDB ODM (Object Data Modeling)
- Schema definition and validation
- Model-based data operations
- Middleware (pre/post hooks)
- Query building and population
- Password hashing integration
- Files: `models/User.js`, `models/HeritageSite.js`

#### **JWT (jsonwebtoken 9.0)** - Authentication tokens
- Stateless authentication
- Token generation and verification
- 7-day expiration policy
- User session management
- Used in: `routes/auth.js`

#### **bcryptjs 2.4** - Password hashing
- Secure password encryption
- Salt generation (10 rounds)
- Password comparison
- Protection against rainbow table attacks
- Used in: `models/User.js`

#### **Helmet 8.1** - Security middleware
- HTTP headers protection
- Content Security Policy (CSP)
- XSS protection
- Clickjacking prevention
- MIME sniffing protection

#### **CORS 2.8** - Cross-origin resource sharing
- Configurable origin validation
- Environment-based access control
- Preflight request handling
- Secure API access from frontend

#### **dotenv 16.3** - Environment variables
- Secure configuration management
- API key protection
- Database URI security
- Port configuration
- File: `.env`

---

### 🗄️ Database

#### **MongoDB 5.9** - NoSQL document database
- Flexible schema design
- JSON-like document storage
- Horizontal scalability
- Aggregation pipeline
- Collections: `users`, `heritagesites`

**User Collection Schema:**
```javascript
{
  fullName: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  preferences: Array,
  emotionalProfile: String,
  recommendedSites: Array,
  isFirstLogin: Boolean,
  lastLogin: Date
}
```

**Heritage Site Collection Schema:**
```javascript
{
  siteName: String,
  location: String,
  district: String,
  period: String,
  emotionalTags: Array,
  highlights: Array,
  urlPath: String,
  isActive: Boolean
}
```

---

### 🤖 AI & External APIs

#### **Google Gemini AI** (gemini-2.5-flash) - Advanced language model
- Natural language understanding
- Context-aware responses
- Heritage education content generation
- Multi-language support (English/Tamil)
- Story narration generation
- Temperature: 0.7-0.8 for balanced creativity
- Max tokens: 1024 for detailed responses
- Safety settings: Block harmful content
- Used in: `routes/chatbot.js`, `heritageai/gemini-api.js`

**API Endpoints:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

**Features:**
- Dr. Thornbury heritage expert persona
- Site-specific knowledge integration
- Conversation history tracking
- Educational content focus
- Rate limiting (60 requests/minute)

#### **Axios 1.13** - HTTP client
- Promise-based HTTP requests
- Request/response interceptors
- Automatic JSON transformation
- Error handling
- Used for Gemini API calls

---

### 📦 Utilities & Libraries

#### **@svg-maps/india 1.0** - India map components
- Pre-built SVG map of India
- State boundary definitions
- Path IDs for each state/UT
- Responsive and scalable

#### **Web Speech API** (Browser native) - Text-to-speech
- Convert narration text to audio
- Multi-language support
- Voice selection
- Playback controls
- Used for heritage site narration

#### **IntersectionObserver API** (Browser native) - Scroll animations
- Lazy loading optimization
- Reveal animations on scroll
- Performance-efficient visibility detection
- Used in: `main.js` for scroll reveals

#### **RequestAnimationFrame** (Browser native) - Smooth animations
- 60fps animation rendering
- Tooltip positioning
- Scroll effects
- Performance optimization

---

### 🛠️ Development Tools

#### **nodemon 3.0** - Development server
- Auto-restart on file changes
- Development efficiency
- Error watching
- Config: `package.json` scripts

#### **TypeScript Compiler** - Type checking
- Static type analysis
- Build-time validation
- Config: `tsconfig.json`

#### **Vite Dev Server** - Hot Module Replacement
- Instant feedback during development
- Fast rebuild times
- Browser auto-refresh

---

### 🚀 DevOps & Deployment

#### **Vercel** - Serverless deployment platform
- Automatic deployments from Git
- Edge network CDN
- Serverless functions
- Environment variable management
- Config: `vercel.json`

**Vercel Configuration:**
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/backend/server.js" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### **Environment Variables (.env)** - Configuration management
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/revive_heritage

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# AI API
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
```

#### **Git/GitHub** - Version control
- Repository: `RE-VIVE_Heritage_app`
- Owner: `sathyaseelan2006`
- Branch: `main`
- Collaborative development
- Issue tracking

---

### 📊 Package Management

#### **npm (Node Package Manager)** - Dependency management
- Package installation and updates
- Script execution
- Version management
- Lock file for consistency

**Main Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "axios": "^1.13.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "nodemon": "^3.0.1"
  }
}
```

---

### 🎨 UI/UX Enhancement

#### **Custom CSS Animations** - Visual feedback
- Fade-in reveals on scroll
- Golden glow state highlighting
- Hover transitions
- Loading states
- Tooltip animations

#### **Responsive Design** - Multi-device support
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interactions
- Adaptive layouts

#### **Performance Optimizations** - Fast loading
- Code splitting
- Lazy loading images
- CSS minification
- JavaScript bundling
- Gzip compression
- SVG caching in sessionStorage
- RequestAnimationFrame for animations

---

### 🔒 Security Stack

#### **Password Security**
- bcryptjs with 10 salt rounds
- No plaintext password storage
- Secure comparison methods

#### **API Security**
- JWT token validation
- HTTP-only considerations
- Rate limiting on AI endpoints
- Environment variable protection

#### **HTTP Security**
- Helmet security headers
- Content Security Policy (CSP)
- CORS configuration
- XSS protection
- CSRF considerations

#### **Input Validation**
- Email format validation
- Password length requirements (min 6 chars)
- Mongoose schema validation
- SQL injection prevention (NoSQL)

---

### 📱 Browser APIs Used

- **Fetch API** - HTTP requests from frontend
- **localStorage** - Persistent user data
- **sessionStorage** - Temporary session data
- **IntersectionObserver** - Scroll animations
- **Web Speech API** - Text-to-speech narration
- **History API** - Navigation management
- **DOM API** - Dynamic content manipulation
- **Events API** - User interaction handling

---

### 🌐 Supported Browsers

- **Chrome/Edge** (Chromium) - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Mobile browsers** - Responsive design
- **Minimum versions**: Modern evergreen browsers (ES6+ support)

---

## Performance Optimizations

### Frontend
- **Code Splitting**: Lazy loading for route components
- **Image Optimization**: WebP format, lazy loading
- **CSS Optimization**: Critical CSS inline
- **JavaScript**: Minification, tree shaking
- **Caching**: sessionStorage for SVG map
- **Animation**: RequestAnimationFrame for smooth scrolls

### Backend
- **Connection Pooling**: MongoDB connection reuse
- **Response Compression**: gzip/brotli
- **Static Asset Caching**: Express.static with cache headers
- **API Rate Limiting**: Prevent abuse

### Database
- **Indexes**: Email (unique), site name
- **Query Optimization**: Select only needed fields
- **Aggregation Pipeline**: For complex queries

---

## Data Flow Diagram Levels

### Level 0: Context Diagram
```
┌──────────┐           ┌─────────────────┐           ┌──────────┐
│          │           │                 │           │          │
│   User   │◄─────────►│  RE:VIVE        │◄─────────►│ Gemini   │
│          │           │  Heritage       │           │   AI     │
│          │           │  Platform       │           │          │
└──────────┘           └─────────────────┘           └──────────┘
                              ▲
                              │
                              ▼
                       ┌──────────┐
                       │          │
                       │ MongoDB  │
                       │          │
                       └──────────┘
```

### Level 1: Main Processes
1. **User Management**: Authentication, profile, preferences
2. **Heritage Exploration**: Map navigation, site browsing
3. **Recommendation Engine**: Personalized suggestions
4. **AI Chatbot**: Heritage expert assistance
5. **Content Generation**: Narration and descriptions

### Level 2: Detailed Sub-processes
- Each main process broken down into specific operations
- Data stores identified (MongoDB collections, localStorage)
- External entity interactions (Gemini API)

---

---

## Complete Project Contextual Flow

### Overview: Context Layers in RE:VIVE

The RE:VIVE platform operates on **five interconnected context layers** that create a deeply personalized and intelligent user experience:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAYER 5: EXTERNAL CONTEXT                             │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Google Gemini AI Knowledge Base                              │    │
│  │ • Historical & Cultural World Knowledge                        │    │
│  │ • Real-time AI Understanding                                   │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                              ⬇ Enriches
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAYER 4: APPLICATION CONTEXT                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Site Knowledge Database (tamilNaduSites.js)                  │    │
│  │ • Emotional Tags & Categories                                  │    │
│  │ • Heritage Site Metadata                                       │    │
│  │ • Cultural Information per State                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                              ⬇ Personalizes
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAYER 3: USER CONTEXT                                 │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • User Profile (fullName, email, preferences)                  │    │
│  │ • Emotional Profile (explorer, scholar, romantic, etc.)        │    │
│  │ • Recommended Sites (personalized list)                        │    │
│  │ • Authentication State (JWT token)                             │    │
│  │ • First Login Status                                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                              ⬇ Shapes
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAYER 2: SESSION CONTEXT                              │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Current Page/Location (state, site)                          │    │
│  │ • Navigation History                                           │    │
│  │ • Active Conversations (chatbot history)                       │    │
│  │ • Selected Preferences (during session)                        │    │
│  │ • localStorage State                                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                              ⬇ Drives
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAYER 1: INTERACTION CONTEXT                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • Current Question/Query                                       │    │
│  │ • Immediate User Intent                                        │    │
│  │ • UI State (hover, click, scroll)                             │    │
│  │ • Real-time Feedback                                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Complete Contextual Flow Journey

## 🎯 The Full User Journey with Contextual Flow

### Phase 1: Initial Context Establishment

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 1: USER ARRIVES (No Context)                                       │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
                    User lands on login.html
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 2: AUTHENTICATION CONTEXT CREATION                                 │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  INPUT: email, password                                         │     │
│  │  PROCESS: Auth validation, JWT generation                      │     │
│  │  CONTEXT CREATED:                                               │     │
│  │    • User Identity (id, fullName, email)                       │     │
│  │    • JWT Token (7-day session)                                 │     │
│  │    • isFirstLogin flag                                         │     │
│  │  STORAGE: localStorage['user'] = {id, fullName, email, token} │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
          User Context Now Active Throughout Application
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 3: PREFERENCE CONTEXT ESTABLISHMENT (First Login)                  │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  IF isFirstLogin = true:                                       │     │
│  │    → Show preferences.html modal                               │     │
│  │  INPUT: User selects emotional preferences                     │     │
│  │    ☑ romantic  ☑ architecture  ☑ history                      │     │
│  │  PROCESS:                                                       │     │
│  │    1. Validate tags                                            │     │
│  │    2. Determine emotional profile algorithm:                   │     │
│  │       • explorer (nature + cultural + history)                 │     │
│  │       • scholar (history + architecture + cultural)            │     │
│  │       • romantic (romantic + spiritual + nature)               │     │
│  │       • warrior (war + heroic + history)                       │     │
│  │       • seeker (spiritual + cultural + romantic)               │     │
│  │    3. Generate recommendations (match algorithm)               │     │
│  │  CONTEXT CREATED:                                               │     │
│  │    • user.preferences = ['romantic', 'architecture', 'history']│     │
│  │    • user.emotionalProfile = 'scholar'                         │     │
│  │    • user.recommendedSites = [6 personalized sites]            │     │
│  │  STORAGE: MongoDB users collection + localStorage update       │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Navigation Context Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 4: HOMEPAGE CONTEXT (index.html)                                   │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  CONTEXT AVAILABLE:                                             │     │
│  │    ✓ User authenticated (name in header)                       │     │
│  │    ✓ User preferences loaded                                   │     │
│  │    ✓ Personalized recommendations ready                        │     │
│  │  PAGE SHOWS:                                                    │     │
│  │    • Welcome message with user's name                          │     │
│  │    • Interactive India map with 36 states/UTs                  │     │
│  │    • Personalized site recommendations                         │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
                  User hovers over Tamil Nadu state
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 5: GEOGRAPHIC CONTEXT ACTIVATION                                   │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  HOVER EVENT:                                                   │     │
│  │    • SVG path ID: 'tn' → stateIdMap['tn'] = 'IN-TN'          │     │
│  │    • Lookup: stateData['IN-TN']                               │     │
│  │  CONTEXT RETRIEVED:                                             │     │
│  │    name: "Tamil Nadu"                                          │     │
│  │    culture: "Ancient Tamil literature, Bharatanatyam,          │     │
│  │             Dravidian architecture, temple culture"            │     │
│  │  UI FEEDBACK:                                                   │     │
│  │    • Tooltip displays state name + culture                     │     │
│  │    • Visual highlight (scale 1.02, opacity 0.9)               │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
                  User clicks Tamil Nadu
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 6: LOCATION CONTEXT TRANSITION                                     │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  CLICK EVENT:                                                   │     │
│  │    • Golden glow animation (#d4af37)                           │     │
│  │    • Navigation: window.location.href = 'tamil-nadu/index.html'│     │
│  │  CONTEXT CARRIED FORWARD:                                       │     │
│  │    ✓ User identity (from localStorage)                         │     │
│  │    ✓ User preferences (from localStorage)                      │     │
│  │    ✓ State selection = "Tamil Nadu"                            │     │
│  │  NEW CONTEXT CREATED:                                           │     │
│  │    • currentState = "Tamil Nadu"                               │     │
│  │    • availableSites = tamilNaduSites array (filtered)          │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Site-Level Context

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 7: TAMIL NADU STATE PAGE (tamil-nadu/index.html)                  │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  CONTEXT STACK:                                                 │     │
│  │    Layer 1: User Context (name, preferences, profile)          │     │
│  │    Layer 2: Location Context (Tamil Nadu)                      │     │
│  │    Layer 3: Available Sites Context                            │     │
│  │  PAGE DISPLAYS:                                                 │     │
│  │    • Heritage sites grid with 20+ locations                    │     │
│  │    • Sites highlighted based on user preferences               │     │
│  │    • Recommended badge for matched sites                       │     │
│  │  CONTEXTUAL FILTERING:                                          │     │
│  │    IF user.preferences includes 'architecture':                │     │
│  │      → Highlight: Thanjavur, Madurai, Mahabalipuram           │     │
│  │    IF user.emotionalProfile = 'scholar':                       │     │
│  │      → Sort by historical significance                         │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
        User clicks "Brihadeeswarar Temple, Thanjavur"
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 8: SITE DETAIL CONTEXT (tamil-nadu/thanjavur/index.html)          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  COMPLETE CONTEXT STACK:                                        │     │
│  │    Layer 1: User Context                                       │     │
│  │      • fullName: "Sathya Seelan"                               │     │
│  │      • preferences: ['architecture', 'history']                │     │
│  │      • emotionalProfile: 'scholar'                             │     │
│  │    Layer 2: Location Context                                   │     │
│  │      • state: "Tamil Nadu"                                     │     │
│  │      • district: "Thanjavur"                                   │     │
│  │    Layer 3: Site Context                                       │     │
│  │      • siteName: "Brihadeeswarar Temple"                       │     │
│  │      • period: "1003-1010 CE (Chola Dynasty)"                 │     │
│  │      • emotionalTags: ['spiritual','architecture','history']   │     │
│  │      • highlights: [UNESCO, 216ft tower, 80-ton capstone...]  │     │
│  │  SITE KNOWLEDGE BASE LOADED:                                    │     │
│  │      siteKnowledge = {                                          │     │
│  │        architecture: "Dravidian style, granite construction", │     │
│  │        history: "Built by Raja Raja Chola I",                 │     │
│  │        significance: "UNESCO World Heritage Site",            │     │
│  │        engineering: "Precision stone cutting techniques",     │     │
│  │        cultural: "Living temple, daily rituals"               │     │
│  │      }                                                          │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Phase 4: AI Contextual Interaction

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 9: AI CHATBOT CONTEXT ASSEMBLY                                     │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  USER ACTION: Opens Heritage AI chatbot                        │     │
│  │  USER ASKS: "How was the 80-ton capstone placed on top?"      │     │
│  │                                                                 │     │
│  │  CONTEXT ASSEMBLY PROCESS:                                      │     │
│  │  ┌──────────────────────────────────────────────────────────┐ │     │
│  │  │ 1. COLLECT USER CONTEXT                                   │ │     │
│  │  │    • userName: "Sathya Seelan"                           │ │     │
│  │  │    • userProfile: "scholar" (interested in how/why)      │ │     │
│  │  │    • userPreferences: ['architecture', 'history']        │ │     │
│  │  └──────────────────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────────────────┐ │     │
│  │  │ 2. COLLECT SITE CONTEXT                                   │ │     │
│  │  │    • siteName: "Brihadeeswarar Temple"                   │ │     │
│  │  │    • siteKnowledge: {period, architecture, engineering}  │ │     │
│  │  │    • relevantFacts: [80-ton capstone, ramp theory...]    │ │     │
│  │  └──────────────────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────────────────┐ │     │
│  │  │ 3. COLLECT CONVERSATION CONTEXT                           │ │     │
│  │  │    • conversationHistory: [                              │ │     │
│  │  │        {role: 'user', content: 'Tell me about this site'},│ │     │
│  │  │        {role: 'assistant', content: 'The Brihadeeswarar...'}│ │   │
│  │  │      ]                                                    │ │     │
│  │  │    • previousTopics: ['temple construction', 'Chola']    │ │     │
│  │  └──────────────────────────────────────────────────────────┘ │     │
│  │  ┌──────────────────────────────────────────────────────────┐ │     │
│  │  │ 4. CONSTRUCT AI PROMPT                                    │ │     │
│  │  │    EXPERT_PERSONA: Dr. Archibald Thornbury              │ │     │
│  │  │    + Site Context (Brihadeeswarar Temple knowledge)      │ │     │
│  │  │    + Conversation History                                 │ │     │
│  │  │    + User's Question                                      │ │     │
│  │  │    = CONTEXTUAL PROMPT (sent to Gemini API)             │ │     │
│  │  └──────────────────────────────────────────────────────────┘ │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
                    POST /api/chatbot/chat
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 10: BACKEND CONTEXT PROCESSING (chatbot.js)                       │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  REQUEST BODY:                                                  │     │
│  │    {                                                            │     │
│  │      message: "How was the 80-ton capstone placed on top?",   │     │
│  │      siteName: "Brihadeeswarar Temple",                        │     │
│  │      siteKnowledge: "Built 1003-1010 CE...",                  │     │
│  │      conversationHistory: [...]                                │     │
│  │    }                                                            │     │
│  │                                                                 │     │
│  │  CONTEXT ENRICHMENT:                                            │     │
│  │    systemContext = EXPERT_PERSONA +                           │     │
│  │      "You are currently at Brihadeeswarar Temple" +           │     │
│  │      siteKnowledge +                                           │     │
│  │      "Previous conversation: [history]"                        │     │
│  │                                                                 │     │
│  │  FULL PROMPT TO GEMINI:                                         │     │
│  │    "You are Dr. Thornbury, expert in ancient architecture...  │     │
│  │     Current site: Brihadeeswarar Temple, built by Raja Raja   │     │
│  │     Chola I in 1003-1010 CE, features an 80-ton granite       │     │
│  │     capstone at 216 feet height...                             │     │
│  │     Previous: [User asked about temple, you explained Chola]  │     │
│  │     Visitor asks: How was the 80-ton capstone placed on top?  │     │
│  │     Dr. Thornbury: [AI generates contextual response]"         │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                              ⬇
                    Gemini AI Processing
                              ⬇
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 11: CONTEXTUAL AI RESPONSE                                         │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  AI GENERATES (with full context awareness):                   │     │
│  │                                                                 │     │
│  │  "Ah, excellent question about one of the greatest             │     │
│  │   engineering marvels of the Chola period! The placement       │     │
│  │   of the 80-ton granite capstone (called 'Kumbam') atop       │     │
│  │   the 216-foot vimana is indeed fascinating.                   │     │
│  │                                                                 │     │
│  │   Based on archaeological evidence and architectural analysis: │     │
│  │                                                                 │     │
│  │   1. **Inclined Plane Theory**: Engineers believe a 6.5 km    │     │
│  │      earthen ramp was constructed from the village of          │     │
│  │      Sarapallam, gradually ascending to the temple top.        │     │
│  │                                                                 │     │
│  │   2. **Elephant Power**: Historical records suggest trained    │     │
│  │      elephants pulled the capstone up the ramp using           │     │
│  │      wooden rollers and ropes.                                 │     │
│  │                                                                 │     │
│  │   3. **Precision Engineering**: The Chola architects           │     │
│  │      calculated the exact center of gravity to ensure          │     │
│  │      perfect balance, demonstrating advanced mathematical      │     │
│  │      knowledge.                                                 │     │
│  │                                                                 │     │
│  │   As we discussed earlier regarding Chola engineering          │     │
│  │   prowess, this achievement showcases their mastery of         │     │
│  │   mechanics, mathematics, and project management—truly         │     │
│  │   remarkable for the 11th century!"                            │     │
│  │                                                                 │     │
│  │  CONTEXT AWARENESS IN RESPONSE:                                │     │
│  │    ✓ References previous conversation about Chola             │     │
│  │    ✓ Uses site-specific details (216 feet, Sarapallam)       │     │
│  │    ✓ Speaks as Dr. Thornbury persona                          │     │
│  │    ✓ Addresses user's 'scholar' profile (detailed technical)  │     │
│  │    ✓ Educational tone matching user preferences               │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Phase 5: Context Persistence & Learning

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STEP 12: CONTEXT UPDATE & PERSISTENCE                                   │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  AFTER INTERACTION:                                             │     │
│  │                                                                 │     │
│  │  1. UPDATE CONVERSATION CONTEXT:                               │     │
│  │     conversationHistory.push({                                 │     │
│  │       role: 'user',                                            │     │
│  │       content: 'How was 80-ton capstone placed?',             │     │
│  │       timestamp: Date.now()                                    │     │
│  │     });                                                         │     │
│  │     conversationHistory.push({                                 │     │
│  │       role: 'assistant',                                       │     │
│  │       content: 'Ah, excellent question...',                    │     │
│  │       timestamp: Date.now()                                    │     │
│  │     });                                                         │     │
│  │                                                                 │     │
│  │  2. UPDATE USER ENGAGEMENT METRICS (potential):                │     │
│  │     MongoDB → users.update({                                   │     │
│  │       visitedSites: ['Brihadeeswarar Temple'],               │     │
│  │       interactionCount: +1,                                    │     │
│  │       topicsExplored: ['Chola engineering', 'construction']   │     │
│  │     });                                                         │     │
│  │                                                                 │     │
│  │  3. MAINTAIN SESSION CONTEXT:                                  │     │
│  │     sessionStorage['currentSite'] = 'Thanjavur';              │     │
│  │     sessionStorage['chatHistory'] = conversationHistory;       │     │
│  │                                                                 │     │
│  │  4. CONTEXT READY FOR NEXT INTERACTION:                        │     │
│  │     ✓ Conversation history maintained                          │     │
│  │     ✓ User still on same site (context preserved)             │     │
│  │     ✓ AI remembers previous topics                            │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Context Flow Diagram: Complete System

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          USER ENTERS SYSTEM (No Context)                         │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │   AUTHENTICATION LAYER        │
                     │   Creates: Identity Context   │
                     └───────────────┬───────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CONTEXT INITIALIZATION                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐             │
│  │ User Context     │  │ Session Context  │  │ Storage Context  │             │
│  │ • ID, Name       │  │ • JWT Token      │  │ • localStorage   │             │
│  │ • Email          │  │ • Auth State     │  │ • sessionStorage │             │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘             │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PREFERENCE CONTEXT ENRICHMENT                             │
│  ┌──────────────────────────────────────────────────────────────────────┐      │
│  │  User Preferences → Emotional Profile → Personalized Recommendations │      │
│  │  ['romantic', 'architecture'] → 'scholar' → [6 matched sites]        │      │
│  └──────────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     ↓                               ↓
        ┌────────────────────────┐     ┌────────────────────────┐
        │  NAVIGATION CONTEXT    │     │  INTERACTION CONTEXT   │
        │  • Current Page        │     │  • Hover Events        │
        │  • Selected State      │     │  • Click Events        │
        │  • Browsing History    │     │  • Scroll Position     │
        └────────┬───────────────┘     └───────────┬────────────┘
                 │                                  │
                 └───────────────┬──────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          GEOGRAPHIC CONTEXT LAYER                                │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐                     │
│  │ State Level │  →   │ Site Level  │  →   │ Detail Level│                     │
│  │ Tamil Nadu  │      │ Thanjavur   │      │ Temple Info │                     │
│  └─────────────┘      └─────────────┘      └─────────────┘                     │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        KNOWLEDGE CONTEXT ASSEMBLY                                │
│  ┌────────────────────────────────────────────────────────────────┐            │
│  │  Application Knowledge Base:                                    │            │
│  │  • tamilNaduSites.js (20+ sites with metadata)                 │            │
│  │  • Emotional tags, periods, highlights                         │            │
│  │  • Cultural information per state                              │            │
│  │                                                                 │            │
│  │  Site-Specific Knowledge:                                       │            │
│  │  • Architecture details                                        │            │
│  │  • Historical facts                                            │            │
│  │  • Engineering marvels                                         │            │
│  │  • Cultural significance                                       │            │
│  └────────────────────────────────────────────────────────────────┘            │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AI CONTEXT INTEGRATION                                   │
│  ┌────────────────────────────────────────────────────────────────┐            │
│  │  CONTEXT LAYERS MERGE:                                          │            │
│  │                                                                 │            │
│  │  User Context (who, preferences, profile)                      │            │
│  │       +                                                         │            │
│  │  Location Context (state, site, details)                       │            │
│  │       +                                                         │            │
│  │  Knowledge Context (facts, architecture, history)              │            │
│  │       +                                                         │            │
│  │  Conversation Context (history, previous topics)               │            │
│  │       +                                                         │            │
│  │  Persona Context (Dr. Thornbury, expert character)             │            │
│  │       ║                                                         │            │
│  │       ║                                                         │            │
│  │       ↓                                                         │            │
│  │  RICH CONTEXTUAL PROMPT → Gemini AI                           │            │
│  │       ↓                                                         │            │
│  │  INTELLIGENT, PERSONALIZED RESPONSE                            │            │
│  └────────────────────────────────────────────────────────────────┘            │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CONTEXT PERSISTENCE                                     │
│  ┌────────────────────────────────────────────────────────────────┐            │
│  │  SHORT-TERM (Session):                                          │            │
│  │    • Conversation history                                      │            │
│  │    • Current page state                                        │            │
│  │    • Navigation path                                           │            │
│  │                                                                 │            │
│  │  MEDIUM-TERM (Browser):                                         │            │
│  │    • localStorage (user profile, JWT)                          │            │
│  │    • sessionStorage (chat history, preferences)                │            │
│  │                                                                 │            │
│  │  LONG-TERM (Database):                                          │            │
│  │    • MongoDB users collection                                  │            │
│  │    • User preferences, emotional profile                       │            │
│  │    • Recommended sites                                         │            │
│  │    • Last preference update                                    │            │
│  └────────────────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Context Intelligence: How Different Contexts Interact

### 1. **User Context × Site Context = Personalized Experience**

```javascript
// Example: User visiting Mahabalipuram
const context = {
  user: {
    preferences: ['romantic', 'nature', 'architecture'],
    emotionalProfile: 'romantic'
  },
  site: {
    name: 'Shore Temple',
    emotionalTags: ['romantic', 'architecture', 'nature'],
    location: 'facing Bay of Bengal'
  }
};

// Result: High match score (80%), personalized reason
recommendation = {
  matchScore: 80,
  reason: "Perfect for romantic souls - Shore Temple offers breathtaking 
          beauty and serene atmosphere facing the Bay of Bengal."
};
```

### 2. **Conversation Context × Site Knowledge = Intelligent Responses**

```javascript
// Chat #1
user: "Tell me about this temple"
AI: "Built in 1003 CE by Raja Raja Chola I..."

// Chat #2 (with context)
user: "How tall is it?"
AI: "As I mentioned, the Brihadeeswarar Temple stands at 216 feet..."
     // ↑ References previous conversation without repeating everything
```

### 3. **Preference Context × Recommendation Engine = Smart Filtering**

```javascript
// Scoring Algorithm with Context
function calculateMatchScore(userPrefs, siteTags) {
  let score = 0;
  userPrefs.forEach(pref => {
    if (siteTags.includes(pref)) {
      score += 20; // Each match = 20 points
    }
  });
  return Math.min(score, 100);
}

// User: ['architecture', 'history', 'cultural']
// Site: ['architecture', 'history', 'spiritual']
// Score: 40 (2 matches × 20)
```

### 4. **Session Context × Navigation = Seamless Flow**

```javascript
// Context maintained across pages
Page 1 (index.html):
  localStorage.user = {id: "123", name: "Sathya"}
  
Page 2 (tamil-nadu/index.html):
  const user = JSON.parse(localStorage.user); // Context restored
  showWelcome(`Welcome back, ${user.name}!`);
  
Page 3 (tamil-nadu/thanjavur/index.html):
  const user = JSON.parse(localStorage.user); // Still available
  initChatbot({ userName: user.name }); // Personalized chatbot
```

---

## 📊 Context Flow Metrics

| Context Type | Storage Location | Lifespan | Used By |
|-------------|------------------|----------|---------|
| **User Identity** | localStorage, MongoDB | 7 days (JWT) | All pages, API routes |
| **Preferences** | MongoDB, localStorage | Permanent | Recommendation engine |
| **Session State** | sessionStorage | Browser session | Navigation, UI state |
| **Conversation** | Memory (runtime) | Chat session | AI chatbot |
| **Site Knowledge** | Static JS files | Permanent | Site pages, AI prompts |
| **Geographic** | URL params, state | Page navigation | Map, site pages |
| **Emotional Profile** | MongoDB | Permanent | Recommendations |
| **JWT Token** | localStorage, headers | 7 days | API authentication |

---

## 🎯 Context-Driven Features

### 1. **Personalized Recommendations**
- **Context Used**: User preferences + Emotional profile + Site tags
- **Result**: Top 6 sites with match scores and personalized reasons

### 2. **Intelligent Chatbot**
- **Context Used**: User + Site + Conversation + Knowledge base
- **Result**: Contextually aware, educational responses

### 3. **Smart Navigation**
- **Context Used**: User location + Previous selections
- **Result**: Relevant site suggestions, breadcrumb trails

### 4. **Adaptive UI**
- **Context Used**: User state (logged in/out) + First-time visitor
- **Result**: Conditional rendering, preference modals

### 5. **Multi-Language Narration**
- **Context Used**: User language preference + Site content
- **Result**: Localized storytelling (English/Tamil)

---

## Conclusion

The RE:VIVE Heritage Platform implements a comprehensive data flow architecture that:
- Provides secure user authentication and profile management
- Offers personalized heritage site recommendations based on emotional preferences
- Enables interactive exploration of Indian cultural heritage
- Integrates AI-powered chatbot for educational content
- Supports multi-language narration for accessibility
- Maintains data security and privacy throughout all interactions

**The contextual flow architecture ensures that every interaction is:**
- ✅ **Personalized** (knows who you are)
- ✅ **Location-Aware** (knows where you are)
- ✅ **Intelligent** (remembers what you discussed)
- ✅ **Contextual** (understands what you care about)
- ✅ **Seamless** (maintains state across pages)

This multi-layered context system creates a deeply engaging, educational, and personalized experience for exploring India's rich cultural heritage.

---

**Generated**: December 4, 2025  
**Project**: RE:VIVE Heritage Application  
**Repository**: RE-VIVE_Heritage_app
