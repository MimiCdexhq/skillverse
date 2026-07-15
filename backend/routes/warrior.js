const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT warrior_id, telegram_id, username, display_name, skill_score, mim_balance, vusdt_balance, level, rank, total_wins, total_losses, total_draws, games_played, win_streak, referral_code, join_date FROM warriors WHERE warrior_id = $1',
      [req.warrior.warriorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT skill_score, mim_balance, vusdt_balance, total_wins, total_losses, total_draws, games_played, win_streak FROM warriors WHERE warrior_id = $1',
      [req.warrior.warriorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    const stats = result.rows[0];
    const winRate = stats.games_played > 0 
      ? ((stats.total_wins / stats.games_played) * 100).toFixed(2) 
      : 0;

    res.json({ ...stats, win_rate: winRate });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

module.exports = router;
