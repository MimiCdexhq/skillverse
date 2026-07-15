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

- **Frontend:** Open `frontend/webapp/index.html` in a browser or serve via any static server
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📁 Project Structure

```
skillverse/
├── backend/
│   ├── server.js           # Express server
│   ├── database.js         # JSON file-based database
│   ├── middleware/         # Auth middleware
│   ├── routes/            # API routes
│   ├── package.json
│   └── .env.example
├── frontend/
│   └── webapp/
│       ├── index.html     # Main app
│       ├── style.css      # Galaxy theme
│       ├── script.js      # Game logic
│       └── screens/       # Screen templates
├── database/
│   └── skillverse.json    # Database file (warriors, matches)
├── docs/                  # Documentation
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

### Authentication
- `POST /auth/login` - Telegram login / registration

### Warrior
- `GET /warrior/profile` - Get warrior profile
- `GET /warrior/stats` - Get warrior statistics

### Match
- `POST /match/create` - Create new match
- `POST /match/result` - Submit match result
- `GET /match/history` - Get match history

### Leaderboard
- `GET /leaderboard/skillscore` - SkillScore rankings
- `GET /leaderboard/mim` - MIM balance rankings
- `GET /leaderboard/games` - Games played rankings
- `GET /leaderboard/streak` - Win streak rankings

### Wallet
- `GET /wallet` - Get MIM and vUSDT balances
- `POST /wallet/reward` - Grant rewards

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
