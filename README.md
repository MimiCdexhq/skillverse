# ⚔️ SkillVerse

**Play • Compete • Earn**

SkillVerse is a competitive gaming platform built for Telegram, where Warriors compete in skill-based games, climb leaderboards, earn seasonal rewards, and build their legacy.

## Vision

To build the world's leading skill-based gaming platform on Telegram.

Built with ❤️ by MimiCdex Studios.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- Git installed

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/skillverse.git
cd skillverse

# Install backend dependencies
cd backend
npm install
cd ..

# Start backend server
cd backend
npm start
```

### Access the App

- **Frontend:** Open `public/index.html` in a browser or serve via any static server
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## 📁 Project Structure

```
skillverse/
├── backend/
│   ├── api/                 # Vercel serverless functions
│   │   ├── auth/           # Login endpoint
│   │   ├── warrior/        # Profile/stats
│   │   ├── match/          # Match create/result
│   │   ├── leaderboard/    # Rankings
│   │   └── wallet/         # Wallet/rewards
│   ├── database.js         # JSON file-based database
│   └── package.json
├── public/                  # Vercel static frontend
│   ├── index.html          # Main app
│   ├── style.css           # Galaxy theme
│   ├── script.js           # Game logic
│   ├── assets/             # Images
│   └── screens/            # Screen templates
├── database/
│   └── skillverse.json    # Database file (warriors, matches)
├── docs/                  # Documentation
├── vercel.json            # Vercel deployment config
└── README.md
```

## 🎮 Features

- **Telegram Mini App** - Seamless Telegram integration
- **Rock Paper Scissors** - Classic skill game with AI and PvP modes
- **SkillScore System** - Competitive ranking
- **MIM Currency** - In-game rewards
- **vUSDT Rewards** - Season 1 founder rewards
- **Leaderboards** - Multiple ranking categories
- **Warrior Profiles** - Detailed stats and history

## 🚢 Deploy to Vercel (Free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click **"Import Project"** → select your `skillverse` repo
4. Vercel auto-detects the config from `vercel.json`
5. Add environment variable:
   - `JWT_SECRET` = any long random string
6. Click **Deploy**

Your app will be live at `https://your-project.vercel.app`

### Vercel Structure
- Frontend: `public/` (static files)
- Backend API: `backend/api/` (serverless functions)
- Database: JSON file stored in `/tmp` (persists per serverless instance)

### Local Development
```bash
# Install dependencies
npm install
cd backend && npm install

# Start backend locally (if needed)
cd backend && node -e "console.log('Backend API at http://localhost:5000/api')"
```

## 🛠 Tech Stack

### Frontend
- HTML5 / CSS3 / JavaScript
- Telegram Web App SDK
- Galaxy-themed UI with animations

### Backend
- Node.js + Express.js
- JWT Authentication
- JSON file-based database

### Hosting
- **Frontend:** Vercel / Netlify / GitHub Pages
- **Backend:** Railway / Render / Fly.io (all free tiers available)

## 📡 API Endpoints

All endpoints are prefixed with `/api`.

### Authentication
- `POST /auth` - Telegram login / registration

### Warrior
- `GET /warrior?action=profile` - Get warrior profile
- `GET /warrior?action=stats` - Get warrior statistics

### Match
- `POST /match` - Create new match
- `POST /match/result` - Submit match result
- `GET /match` - Get match history

### Leaderboard
- `GET /leaderboard?action=skillscore` - SkillScore rankings
- `GET /leaderboard?action=mim` - MIM balance rankings
- `GET /leaderboard?action=games` - Games played rankings
- `GET /leaderboard?action=streak` - Win streak rankings

### Wallet
- `GET /wallet?action=wallet` - Get MIM and vUSDT balances
- `POST /wallet?action=reward` - Grant rewards

## 🎯 Game Rules (Rock Paper Scissors)

### Rewards
- **Win:** +10 SkillScore, +10 MIM
- **Draw:** +2 SkillScore, +2 MIM
- **Loss:** +1 MIM (Participation)

### Streaks
- 3 Wins = Bronze Streak
- 5 Wins = Silver Streak
- 10 Wins = Gold Streak

## 🚢 Free Hosting Options

### Option 1: Railway (Recommended)
1. Fork this repo
2. Sign up at [railway.app](https://railway.app)
3. Connect your GitHub account
4. Deploy the `backend` folder
5. Set environment variables:
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
6. Deploy frontend separately to Vercel/Netlify

### Option 2: Render
1. Fork this repo
2. Sign up at [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Build command: `cd backend && npm install`
6. Start command: `cd backend && node server.js`
7. Add free PostgreSQL database

### Option 3: Vercel + Railway
- Frontend → Vercel (free)
- Backend → Railway (free tier)
- Database → Railway PostgreSQL (free tier)

## ⚙️ Environment Variables

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📞 Support

- Telegram: @skillverse_support
- Email: support@skillverse.gg

---

© 2026 SkillVerse - MimiCdex Studios
