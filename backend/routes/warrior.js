const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const warrior = db.getWarriorById(req.warrior.warriorId);

    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    res.json(warrior);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const warrior = db.getWarriorById(req.warrior.warriorId);

    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    const winRate = warrior.games_played > 0 
      ? ((warrior.total_wins / warrior.games_played) * 100).toFixed(2) 
      : 0;

    res.json({
      skill_score: warrior.skill_score,
      mim_balance: warrior.mim_balance,
      vusdt_balance: warrior.vusdt_balance,
      total_wins: warrior.total_wins,
      total_losses: warrior.total_losses,
      total_draws: warrior.total_draws,
      games_played: warrior.games_played,
      win_streak: warrior.win_streak,
      win_rate: winRate
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

module.exports = router;
