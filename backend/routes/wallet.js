const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT mim_balance, vusdt_balance FROM warriors WHERE warrior_id = $1',
      [req.warrior.warriorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Wallet error:', error);
    res.status(500).json({ error: 'Server error fetching wallet' });
  }
});

router.post('/reward', authMiddleware, async (req, res) => {
  try {
    const { type, amount } = req.body;

    if (type === 'mim') {
      await pool.query(
        'UPDATE warriors SET mim_balance = mim_balance + $1 WHERE warrior_id = $2',
        [amount, req.warrior.warriorId]
      );
    } else if (type === 'vusdt') {
      await pool.query(
        'UPDATE warriors SET vusdt_balance = vusdt_balance + $1 WHERE warrior_id = $2',
        [amount, req.warrior.warriorId]
      );
    } else {
      return res.status(400).json({ error: 'Invalid reward type' });
    }

    res.json({ success: true, message: 'Reward granted' });
  } catch (error) {
    console.error('Reward error:', error);
    res.status(500).json({ error: 'Server error granting reward' });
  }
});

module.exports = router;
