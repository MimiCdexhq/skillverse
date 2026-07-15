const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const warrior = db.getWarriorById(req.warrior.warriorId);

    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    res.json({
      mim_balance: warrior.mim_balance || 0,
      vusdt_balance: warrior.vusdt_balance || 0
    });
  } catch (error) {
    console.error('Wallet error:', error);
    res.status(500).json({ error: 'Server error fetching wallet' });
  }
});

router.post('/reward', authMiddleware, async (req, res) => {
  try {
    const { type, amount } = req.body;
    const warrior = db.getWarriorById(req.warrior.warriorId);

    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }

    if (type === 'mim') {
      db.updateWarrior(req.warrior.warriorId, {
        mim_balance: (warrior.mim_balance || 0) + amount
      });
    } else if (type === 'vusdt') {
      db.updateWarrior(req.warrior.warriorId, {
        vusdt_balance: (warrior.vusdt_balance || 0) + amount
      });
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
