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
  if (req.method === 'GET') {
    if (req.query.action === 'profile') {
      authMiddleware(req, res, () => {
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
    } else if (req.query.action === 'stats') {
      authMiddleware(req, res, () => {
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
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
