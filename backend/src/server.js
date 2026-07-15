const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const warriorRoutes = require('./routes/warrior');
const matchRoutes = require('./routes/match');
const leaderboardRoutes = require('./routes/leaderboard');
const walletRoutes = require('./routes/wallet');
const referralRoutes = require('./routes/referral');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/warrior', warriorRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/referral', referralRoutes);

app.use(errorHandler);

const PORT = config.port;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SkillVerse API running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

module.exports = app;
