const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;

    const existingWarrior = await pool.query(
      'SELECT * FROM warriors WHERE telegram_id = $1',
      [telegramId]
    );

    if (existingWarrior.rows.length > 0) {
      const warrior = existingWarrior.rows[0];
      const token = jwt.sign(
        { warriorId: warrior.warrior_id, telegramId: warrior.telegram_id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.json({ token, warrior });
    }

    const newWarrior = await pool.query(
      'INSERT INTO warriors (telegram_id, username, display_name, skill_score, mim_balance, vusdt_balance, level, rank, total_wins, total_losses, total_draws, games_played, win_streak, join_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [telegramId, username, firstName || username, 0, 0, 0, 1, 'Warrior', 0, 0, 0, 0, 0, new Date()]
    );

    const warrior = newWarrior.rows[0];
    const token = jwt.sign(
      { warriorId: warrior.warrior_id, telegramId: warrior.telegram_id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ token, warrior });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
});

module.exports = router;
