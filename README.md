<div align="center">

<img src="public/india-map.svg" alt="India Map" width="120" />

# 🏛️ RE:VIVE
### *Bringing India's Hidden Heritage Back to Life*

[![License: MIT](https://img.shields.io/badge/License-MIT-d4af37.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ About

**Re:Vive** is an immersive cultural heritage platform that lets users explore India's rich history, traditions, and monuments through an interactive map experience. From ancient Dravidian temples to Mughal architecture, from Kathakali dance to Bihu festivals — Re:Vive brings it all to life.

> _"A nation's culture resides in the hearts and in the soul of its people."_ — Mahatma Gandhi

---

## 🗺️ Features

| Feature | Description |
|---|---|
| 🗾 **Interactive India Map** | Hover over any state to see a golden highlight and cultural tooltip |
| 🏛️ **State Heritage Pages** | Dedicated deep-dive pages per state (Tamil Nadu live!) |
| 🤖 **Heritage AI** | AI-powered assistant to answer heritage & culture queries |
| 🔐 **Auth System** | Secure login/signup with JWT & bcrypt |
| 👤 **User Profiles** | Personalized recommendations based on preferences |
| 🌐 **PWA Ready** | Optimized for performance with Vite |

---

## 🛠️ Tech Stack

### Frontend
- **Vite** + **TypeScript** — blazing fast dev & build
- **Vanilla CSS** — ornate dark-gold heritage theme
- **SVG India Map** — fully interactive with JS event listeners
- **Google Fonts** — Cinzel, Cormorant Garamond, Playfair Display

### Backend
- **Node.js** + **Express** — REST API server
- **MongoDB** + **Mongoose** — database & ODM
- **JWT** — authentication tokens
- **bcryptjs** — password hashing
- **Helmet** — HTTP security headers

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://mongodb.com/) (local or Atlas)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/revive.git
cd revive/edaproject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
# .env
MONGODB_URI=mongodb://localhost:27017/revive_heritage
JWT_SECRET=your_super_secret_key
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB

```bash
# Windows
net start MongoDB

# macOS / Linux
mongod
```

### 5. Run the Servers

**Frontend (Vite dev server):**
```bash
npm run dev
# → http://localhost:5173
```

**Backend (Express + MongoDB):**
```bash
npm run server
# → http://localhost:5000
```

---

## 📁 Project Structure

```
edaproject/
├── 📂 backend/               # Express server
│   ├── server.js             # Entry point
│   └── routes/
│       ├── auth.js           # Login / Signup
│       ├── profile.js        # User profiles
│       └── chatbot.js        # Heritage AI backend
│
├── 📂 css/
│   ├── style.css             # Main heritage theme
│   └── performance-optimizations.css
│
├── 📂 js/
│   ├── main.js               # Interactive map logic
│   └── performance-utils.js
│
├── 📂 tamil-nadu/            # Tamil Nadu heritage sub-site
├── 📂 heritageai/            # Heritage AI chat interface
├── 📂 public/                # Static assets (India map SVG, etc.)
│
├── index.html                # Landing page
├── login.html                # Login page
├── signup.html               # Signup page
├── vite.config.ts            # Vite configuration
└── vercel.json               # Deployment configuration
```

---

## 🗾 State Coverage

| Status | Count | Notes |
|---|---|---|
| ✅ **Live** | 1 | Tamil Nadu — full heritage page |
| 🚧 **Coming Soon** | 35 | All other states — hover tooltips are live |

> Click on **Tamil Nadu** to explore its full heritage page!

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user, returns JWT |
| `GET` | `/api/user/profile` | Get user profile (auth required) |
| `POST` | `/api/chatbot/ask` | Ask the Heritage AI |
| `GET` | `/api/health` | Server health check |

---

## 🎨 Design Philosophy

Re:Vive uses a **dark ornate heritage theme** inspired by ancient Indian manuscripts and temple architecture:

- 🟤 **Deep browns** (`#1a0f0a`, `#2c1810`) — aged manuscript background
- 🥇 **Heritage gold** (`#d4af37`) — temple ornament accent
- 🖋️ **Serif fonts** — Cinzel, Cormorant Garamond for an authentic feel
- ✨ **Golden glow** on map hover — states light up on mouse-over

---

## 🤝 Contributing

Contributions are welcome! To add a new state heritage page:

1. Fork the repository
2. Create a new folder: `your-state/`
3. Model it after `tamil-nadu/` structure
4. Add your state's navigation in `js/main.js`
5. Submit a Pull Request 🎉

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ to preserve India's cultural legacy**

*Re:Vive — Explore. Discover. Remember.*

</div>
