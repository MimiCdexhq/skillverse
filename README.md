# ⚔️ SkillVerse

**Play • Compete • Earn**

SkillVerse is a competitive gaming platform built for Telegram, where Warriors compete in skill-based games, climb leaderboards, earn seasonal rewards, and build their legacy.

## Vision

To build the world's leading skill-based gaming platform on Telegram.

Built with ❤️ by MimiCdex Studios.

## Setup

### Prerequisites
- Node.js 18+
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and set BOT_TOKEN to your bot token from @BotFather
npm install
npm start
```

### Frontend
Serve the `frontend/webapp` directory on a public URL (e.g., Vercel, Netlify, or `npx serve`).

### Bot Configuration in @BotFather
1. Open @BotFather and select your bot
2. Go to **Bot Settings** -> **Menu Button**
3. Set the menu button to open your web app URL
4. Or use `/setmenubutton` and provide your web app URL

### Common Login Error Causes
1. **Not opened inside Telegram**: The app must be opened from Telegram (via bot menu or inline button). Opening directly in a browser will show login errors because `initData` is empty.
2. **Wrong BOT_TOKEN**: Ensure the `BOT_TOKEN` in `backend/.env` matches the token from @BotFather.
3. **Backend not running**: Ensure the backend server is running and accessible from the internet (not just `localhost`).
4. **Web app URL mismatch**: The URL served to Telegram must match what you configured in @BotFather.
5. **CORS error**: Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL.
