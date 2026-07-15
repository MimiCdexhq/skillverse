const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/skillscore', async (req, res) => {
  try {
    const warriors = db.getWarriors();
    const sorted = warriors.sort((a, b) => (b.skill_score || 0) - (a.skill_score || 0)).slice(0, 100);
    res.json(sorted);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
});

router.get('/mim', async (req, res) => {
  try {
    const warriors = db.getWarriors();
    const sorted = warriors.sort((a, b) => (b.mim_balance || 0) - (a.mim_balance || 0)).slice(0, 100);
    res.json(sorted);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching MIM leaderboard' });
  }
});

router.get('/games', async (req, res) => {
  try {
    const warriors = db.getWarriors();
    const sorted = warriors.sort((a, b) => (b.games_played || 0) - (a.games_played || 0)).slice(0, 100);
    res.json(sorted);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching games leaderboard' });
  }
});

router.get('/streak', async (req, res) => {
  try {
    const warriors = db.getWarriors();
    const sorted = warriors.sort((a, b) => (b.win_streak || 0) - (a.win_streak || 0)).slice(0, 100);
    res.json(sorted);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching streak leaderboard' });
  }
});

module.exports = router;
