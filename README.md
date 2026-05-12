# 📰 NewsLens — AI-Powered News Summarizer

A full-stack MERN application where users can read the latest news, search by category or keyword, and generate AI-powered summaries using **Google Gemini** or **OpenAI**. Features JWT authentication, bookmarking, reading history, dark/light mode, and a fully responsive modern UI.

---

## ✨ Features

| Feature         | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| 🤖 AI Summaries | One-click AI summaries with key points & sentiment via Gemini or OpenAI |
| 📰 Live News    | Top headlines and search via NewsAPI (with rich mock data fallback)     |
| 🔐 JWT Auth     | Secure register/login with protected routes                             |
| 🔖 Bookmarks    | Save and manage articles (up to 100 per user)                           |
| 🕐 History      | Automatic reading history (last 50 articles)                            |
| 🌙 Dark Mode    | System-aware dark/light/manual theme toggle                             |
| 🔍 Search       | Full-text search with sort options                                      |
| 📱 Responsive   | Mobile-first design with Tailwind CSS                                   |
| ⚡ Performance  | Lazy loading, AI result caching, rate limiting                          |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT + bcryptjs  
**AI:** Google Gemini Pro or OpenAI GPT-3.5-turbo  
**News:** NewsAPI.org

---

## 📁 Project Structure

```
news-summarizer/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers (auth, news, AI, user)
│   ├── middleware/      # Auth + error middleware
│   ├── models/          # Mongoose schemas (User, Summary)
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helpers
│   ├── server.js        # Entry point
│   └── .env.example     # Environment template
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/    # ProtectedRoute
│       │   ├── common/  # SkeletonCard
│       │   ├── layout/  # Navbar, Footer
│       │   └── news/    # NewsCard, AISummary, CategoryFilter
│       ├── context/     # AuthContext, ThemeContext
│       ├── hooks/       # useBookmarks
│       ├── pages/       # Home, ArticleDetail, Search, etc.
│       ├── services/    # Axios API client
│       └── App.jsx
│
├── scripts/
│   └── setup.js         # Initial setup helper
└── package.json         # Root (concurrent dev script)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- (Optional) Free API keys — see Step 3

---

### Step 1 — Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd news-summarizer

# Install ALL dependencies (backend + frontend) in one command
npm run install:all

# Or install individually:
npm install --prefix backend
npm install --prefix frontend
```

---

### Step 2 — Configure Environment

```bash
# Run the setup script to create backend/.env from the template
node scripts/setup.js

# Then open and edit backend/.env
nano backend/.env    # or use your editor
```

Your `backend/.env` should look like:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/news-summarizer
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRE=30d

# --- NEWS API (free at https://newsapi.org) ---
NEWS_API_KEY=your_newsapi_key_here

# --- AI Provider (choose one) ---
# Google Gemini — FREE tier at https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI — paid at https://platform.openai.com
OPENAI_API_KEY=your_openai_api_key_here

# Which provider to use: 'gemini' or 'openai'
AI_PROVIDER=gemini

NODE_ENV=development
```

> **Note:** The app works WITHOUT any API keys using built-in mock data and demo AI summaries. Add keys to get live news and real AI summaries.

---

### Step 3 — Get API Keys (Optional but recommended)

#### 📰 NewsAPI (Free — 100 req/day)

1. Go to [newsapi.org](https://newsapi.org)
2. Click **Get API Key** and register
3. Copy your key to `NEWS_API_KEY`

#### 🤖 Google Gemini (Free tier available)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API key
3. Copy your key to `GEMINI_API_KEY`
4. Set `AI_PROVIDER=gemini`

#### 🤖 OpenAI (Paid alternative)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key under **API Keys**
3. Copy your key to `OPENAI_API_KEY`
4. Set `AI_PROVIDER=openai`

---

### Step 4 — Run the App

```bash
# Run both backend and frontend together (recommended)
npm run dev

# OR run separately in two terminals:
npm run dev:backend    # Backend on http://localhost:5000
npm run dev:frontend   # Frontend on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

### Step 5 — Create a Demo Account (Optional)

To use the demo login button on the login page, seed a demo user:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.findOneAndDelete({ email: 'demo@newslens.com' });
  await User.create({ name: 'Demo User', email: 'demo@newslens.com', password: 'demo123' });
  console.log('✅ Demo user created: demo@newslens.com / demo123');
  process.exit(0);
});
"
```

---

## 🔌 API Reference

### Auth

| Method | Endpoint             | Access  | Description             |
| ------ | -------------------- | ------- | ----------------------- |
| POST   | `/api/auth/register` | Public  | Register new user       |
| POST   | `/api/auth/login`    | Public  | Login + get JWT         |
| GET    | `/api/auth/me`       | Private | Get current user        |
| PUT    | `/api/auth/profile`  | Private | Update name/preferences |
| PUT    | `/api/auth/password` | Private | Change password         |

### News

| Method | Endpoint               | Access | Description                              |
| ------ | ---------------------- | ------ | ---------------------------------------- |
| GET    | `/api/news/headlines`  | Public | Top headlines (category, page, pageSize) |
| GET    | `/api/news/search`     | Public | Search articles (q, sortBy, page)        |
| GET    | `/api/news/categories` | Public | Available categories                     |

### User

| Method | Endpoint                  | Access  | Description     |
| ------ | ------------------------- | ------- | --------------- |
| GET    | `/api/user/bookmarks`     | Private | List bookmarks  |
| POST   | `/api/user/bookmarks`     | Private | Add bookmark    |
| DELETE | `/api/user/bookmarks/:id` | Private | Remove bookmark |
| GET    | `/api/user/history`       | Private | Reading history |
| POST   | `/api/user/history`       | Private | Add to history  |
| DELETE | `/api/user/history`       | Private | Clear history   |
| GET    | `/api/user/stats`         | Private | User stats      |

### AI

| Method | Endpoint            | Access  | Description                      |
| ------ | ------------------- | ------- | -------------------------------- |
| POST   | `/api/ai/summarize` | Private | Generate AI summary (cached 24h) |

---

## 🎨 Customization

### Changing the colour scheme

Edit `frontend/tailwind.config.js` — update the `brand` colour palette (currently orange).

### Adding more categories

Update `CATEGORIES` array in `backend/controllers/newsController.js` and the frontend `CategoryFilter` component.

### Switching AI providers at runtime

Change `AI_PROVIDER` in `backend/.env` to `gemini` or `openai` and restart the backend.

---

## 🚢 Production Deployment

### Backend (Railway / Render / Heroku)

1. Set all env vars in your hosting dashboard
2. Set `NODE_ENV=production`
3. Deploy the `backend/` folder

### Frontend (Vercel / Netlify)

1. Build: `cd frontend && npm run build`
2. Deploy the `frontend/dist/` folder
3. Set `VITE_API_URL` if your backend is on a different domain and update `vite.config.js` proxy

### MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier and update `MONGO_URI`.

---

## 🐛 Troubleshooting

| Problem                      | Fix                                                                     |
| ---------------------------- | ----------------------------------------------------------------------- |
| `MONGO_URI` connection error | Ensure MongoDB is running: `mongod` or use Atlas URI                    |
| News articles not loading    | Check `NEWS_API_KEY` — app uses mock data as fallback                   |
| AI summary fails             | Check `GEMINI_API_KEY` or `OPENAI_API_KEY` — falls back to demo summary |
| CORS error                   | Ensure backend is on port 5000 and frontend vite proxy is configured    |
| "Too many requests" on AI    | Built-in rate limit: 10 AI calls/minute per IP                          |
| Port already in use          | Change `PORT` in `.env` and update `vite.config.js` proxy target        |

---

## 📜 License

MIT — free to use and modify.

---

Built using React, Node.js, MongoDB & AI
