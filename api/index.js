require('dotenv').config({ path: require('path').join(process.cwd(), '..', '.env') });
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const users = new Map();
const sessions = new Map();

function verifyTelegramInitData(initData, botToken) {
  try {
    const url = new URL(`https://telegram.org?${initData}`);
    const hash = url.searchParams.get('hash');
    if (!hash) return null;

    const authDate = url.searchParams.get('auth_date');
    if (!authDate) return null;

    const userStr = url.searchParams.get('user');
    if (!userStr) return null;

    url.searchParams.delete('hash');

    const params = Array.from(url.searchParams.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const dataCheckString = params.map(([k, v]) => `${k}=${v}`).join('\n');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const signature = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (signature !== hash) return null;

    const user = JSON.parse(userStr);
    return { user, authDate: parseInt(authDate, 10) };
  } catch (err) {
    return null;
  }
}

app.post('/auth/login', (req, res) => {
  const { initData } = req.body;
  const botToken = process.env.BOT_TOKEN;

  if (!botToken || botToken === 'your_telegram_bot_token_here') {
    return res.status(500).json({ error: 'Server misconfigured: BOT_TOKEN not set' });
  }

  if (!initData) {
    return res.status(400).json({ error: 'Missing initData' });
  }

  const result = verifyTelegramInitData(initData, botToken);
  if (!result) {
    return res.status(401).json({ error: 'Invalid Telegram auth data' });
  }

  const { user } = result;
  const telegramId = String(user.id);

  let warrior = users.get(telegramId);
  if (!warrior) {
    warrior = {
      telegramId,
      username: user.username || `warrior_${telegramId.slice(-4)}`,
      displayName: user.first_name || 'Warrior',
      skillScore: 0,
      mimBalance: 500,
      vUSDTBalance: 0,
      level: 1,
      rank: 'Bronze',
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      gamesPlayed: 0,
      winStreak: 0,
      referralCode: `REF${telegramId.slice(-6).toUpperCase()}`,
      joinDate: new Date().toISOString(),
    };
    users.set(telegramId, warrior);
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { telegramId, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });

  res.json({ token, warrior });
});

app.get('/warrior/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.slice(7);
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const warrior = users.get(session.telegramId);
  if (!warrior) {
    return res.status(404).json({ error: 'Warrior not found' });
  }

  res.json({ warrior });
});

app.get('/warrior/stats', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.slice(7);
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const warrior = users.get(session.telegramId);
  if (!warrior) {
    return res.status(404).json({ error: 'Warrior not found' });
  }

  res.json({
    telegramId: warrior.telegramId,
    username: warrior.username,
    skillScore: warrior.skillScore,
    mimBalance: warrior.mimBalance,
    vUSDTBalance: warrior.vUSDTBalance,
    gamesPlayed: warrior.gamesPlayed,
    winStreak: warrior.winStreak,
  });
});

app.get('/wallet', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.slice(7);
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const warrior = users.get(session.telegramId);
  if (!warrior) {
    return res.status(404).json({ error: 'Warrior not found' });
  }

  res.json({
    mimBalance: warrior.mimBalance,
    vUSDTBalance: warrior.vUSDTBalance,
  });
});

app.get('/leaderboard/skillscore', (req, res) => {
  const leaderboard = Array.from(users.values())
    .sort((a, b) => b.skillScore - a.skillScore)
    .slice(0, 10)
    .map((u, i) => ({ rank: i + 1, username: u.username, skillScore: u.skillScore }));

  res.json({ leaderboard });
});

app.get('/leaderboard/mim', (req, res) => {
  const leaderboard = Array.from(users.values())
    .sort((a, b) => b.mimBalance - a.mimBalance)
    .slice(0, 10)
    .map((u, i) => ({ rank: i + 1, username: u.username, mimBalance: u.mimBalance }));

  res.json({ leaderboard });
});

module.exports = (req, res) => app(req, res);
