const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const result = await db.query(
      'SELECT warrior_id, telegram_id, username, display_name, skill_score, mim_balance, vusdt_balance, level, rank, total_wins, total_losses, total_draws, games_played, win_streak, referral_code, created_at FROM warriors WHERE warrior_id = $1',
      [decoded.warriorId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.warrior = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticate };
