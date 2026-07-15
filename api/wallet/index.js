const jwt = require('jsonwebtoken');
const db = require('../database');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.warrior = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (!req.warrior?.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = async (req, res) => {
  if (req.method === 'GET' && req.query.action === 'wallet') {
    authMiddleware(req, res, () => {
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
  } else if (req.method === 'POST' && req.query.action === 'reward') {
    authMiddleware(req, res, () => {
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
        } else if (type === 'skill_score') {
          db.updateWarrior(req.warrior.warriorId, {
            skill_score: (warrior.skill_score || 0) + amount
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
  } else if (req.method === 'GET' && req.query.action === 'warriors') {
    authMiddleware(req, res, adminOnly);
    try {
      const warriors = db.getWarriors();
      res.json(warriors);
    } catch (error) {
      console.error('Admin warriors error:', error);
      res.status(500).json({ error: 'Server error fetching warriors' });
    }
  } else if (req.method === 'GET' && req.query.action === 'stats') {
    authMiddleware(req, res, adminOnly);
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
  } else if (req.method === 'PUT') {
    authMiddleware(req, res, adminOnly);
    try {
      const warriorId = parseInt(req.query.id);
      const updates = req.body;
      const warrior = db.updateWarrior(warriorId, updates);
      
      if (!warrior) {
        return res.status(404).json({ error: 'Warrior not found' });
      }
      
      res.json({ success: true, warrior });
    } catch (error) {
      console.error('Admin update error:', error);
      res.status(500).json({ error: 'Server error updating warrior' });
    }
  } else if (req.method === 'DELETE') {
    authMiddleware(req, res, adminOnly);
    try {
      const warriorId = parseInt(req.query.id);
      const warrior = db.deleteWarrior(warriorId);
      
      if (!warrior) {
        return res.status(404).json({ error: 'Warrior not found' });
      }
      
      res.json({ success: true, message: 'Warrior deleted' });
    } catch (error) {
      console.error('Admin delete error:', error);
      res.status(500).json({ error: 'Server error deleting warrior' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
