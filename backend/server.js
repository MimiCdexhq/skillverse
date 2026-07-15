const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const warriorRoutes = require('./routes/warrior');
const matchRoutes = require('./routes/match');
const leaderboardRoutes = require('./routes/leaderboard');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/warrior', warriorRoutes);
app.use('/match', matchRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/wallet', walletRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillVerse API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillVerse backend running on port ${PORT}`);
});
