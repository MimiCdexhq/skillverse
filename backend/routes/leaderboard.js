const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/skillscore', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT warrior_id, username, display_name, skill_score, games_played FROM warriors ORDER BY skill_score DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
});

router.get('/mim', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT warrior_id, username, display_name, mim_balance FROM warriors ORDER BY mim_balance DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching MIM leaderboard' });
  }
});

router.get('/games', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT warrior_id, username, display_name, games_played FROM warriors ORDER BY games_played DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching games leaderboard' });
  }
});

router.get('/streak', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT warrior_id, username, display_name, win_streak FROM warriors ORDER BY win_streak DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching streak leaderboard' });
  }
});

module.exports = router;
