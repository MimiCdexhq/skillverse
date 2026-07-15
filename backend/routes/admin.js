const express = require('express');
const db = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get('/warriors', async (req, res) => {
  try {
    const warriors = db.getWarriors();
    res.json(warriors);
  } catch (error) {
    console.error('Admin warriors error:', error);
    res.status(500).json({ error: 'Server error fetching warriors' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const warriors = db.getWarriors();
    const matches = db.getMatches();
    
    const stats = {
      total_warriors: warriors.length,
      total_matches: matches.length,
      total_skill_score: warriors.reduce((sum, w) => sum + (w.skill_score || 0), 0),
      total_mim: warriors.reduce((sum, w) => sum + (w.mim_balance || 0), 0),
      total_vusdt: warriors.reduce((sum, w) => sum + (w.vusdt_balance || 0), 0),
      total_wins: warriors.reduce((sum, w) => sum + (w.total_wins || 0), 0),
      active_today: warriors.filter(w => {
        const joinDate = new Date(w.join_date);
        const today = new Date();
        return joinDate.toDateString() === today.toDateString();
      }).length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

router.put('/warriors/:id/points', async (req, res) => {
  try {
    const warriorId = parseInt(req.params.id);
    const { skill_score, mim_balance, vusdt_balance, level, rank } = req.body;
    
    const updates = {};
    if (skill_score !== undefined) updates.skill_score = skill_score;
    if (mim_balance !== undefined) updates.mim_balance = mim_balance;
    if (vusdt_balance !== undefined) updates.vusdt_balance = vusdt_balance;
    if (level !== undefined) updates.level = level;
    if (rank !== undefined) updates.rank = rank;
    
    const warrior = db.updateWarrior(warriorId, updates);
    
    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }
    
    res.json({ success: true, warrior });
  } catch (error) {
    console.error('Admin update points error:', error);
    res.status(500).json({ error: 'Server error updating points' });
  }
});

router.put('/warriors/:id/admin', async (req, res) => {
  try {
    const warriorId = parseInt(req.params.id);
    const { is_admin } = req.body;
    
    const warrior = db.updateWarrior(warriorId, { is_admin });
    
    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }
    
    res.json({ success: true, warrior });
  } catch (error) {
    console.error('Admin toggle error:', error);
    res.status(500).json({ error: 'Server error updating admin status' });
  }
});

router.delete('/warriors/:id', async (req, res) => {
  try {
    const warriorId = parseInt(req.params.id);
    const warrior = db.deleteWarrior(warriorId);
    
    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }
    
    res.json({ success: true, message: 'Warrior deleted' });
  } catch (error) {
    console.error('Admin delete error:', error);
    res.status(500).json({ error: 'Server error deleting warrior' });
  }
});

router.post('/warriors/:id/reward', async (req, res) => {
  try {
    const warriorId = parseInt(req.params.id);
    const { type, amount } = req.body;
    
    const warrior = db.getWarriorById(warriorId);
    if (!warrior) {
      return res.status(404).json({ error: 'Warrior not found' });
    }
    
    if (type === 'mim') {
      db.updateWarrior(warriorId, {
        mim_balance: (warrior.mim_balance || 0) + amount
      });
    } else if (type === 'vusdt') {
      db.updateWarrior(warriorId, {
        vusdt_balance: (warrior.vusdt_balance || 0) + amount
      });
    } else if (type === 'skill_score') {
      db.updateWarrior(warriorId, {
        skill_score: (warrior.skill_score || 0) + amount
      });
    } else {
      return res.status(400).json({ error: 'Invalid reward type' });
    }
    
    res.json({ success: true, message: 'Reward granted' });
  } catch (error) {
    console.error('Admin reward error:', error);
    res.status(500).json({ error: 'Server error granting reward' });
  }
});

module.exports = router;
