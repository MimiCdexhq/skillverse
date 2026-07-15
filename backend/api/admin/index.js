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
    authMiddleware(req, res, adminOnly);
    try {
      const warriors = db.getWarriors();
      res.json(warriors);
    } catch (error) {
      console.error('Admin warriors error:', error);
      res.status(500).json({ error: 'Server error fetching warriors' });
    }
  } else if (req.method === 'POST') {
    authMiddleware(req, res, adminOnly);
    try {
      const { matchId, winnerId, player1Choice, player2Choice } = req.body;
      const match = db.updateMatch(matchId, {
        winner: winnerId,
        player1_choice: player1Choice,
        player2_choice: player2Choice,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      if (winnerId === match.player1_id) {
        db.updateWarrior(match.player1_id, {
          total_wins: (db.getWarriorById(match.player1_id).total_wins || 0) + 1,
          skill_score: (db.getWarriorById(match.player1_id).skill_score || 0) + 10,
          mim_balance: (db.getWarriorById(match.player1_id).mim_balance || 0) + 10,
          win_streak: (db.getWarriorById(match.player1_id).win_streak || 0) + 1,
          games_played: (db.getWarriorById(match.player1_id).games_played || 0) + 1
        });
        if (match.player2_id) {
          db.updateWarrior(match.player2_id, {
            total_losses: (db.getWarriorById(match.player2_id).total_losses || 0) + 1,
            games_played: (db.getWarriorById(match.player2_id).games_played || 0) + 1
          });
        }
      } else if (winnerId === match.player2_id) {
        db.updateWarrior(match.player2_id, {
          total_wins: (db.getWarriorById(match.player2_id).total_wins || 0) + 1,
          skill_score: (db.getWarriorById(match.player2_id).skill_score || 0) + 10,
          mim_balance: (db.getWarriorById(match.player2_id).mim_balance || 0) + 10,
          win_streak: (db.getWarriorById(match.player2_id).win_streak || 0) + 1,
          games_played: (db.getWarriorById(match.player2_id).games_played || 0) + 1
        });
        db.updateWarrior(match.player1_id, {
          total_losses: (db.getWarriorById(match.player1_id).total_losses || 0) + 1,
          games_played: (db.getWarriorById(match.player1_id).games_played || 0) + 1
        });
      } else {
        db.updateWarrior(match.player1_id, {
          total_draws: (db.getWarriorById(match.player1_id).total_draws || 0) + 1,
          skill_score: (db.getWarriorById(match.player1_id).skill_score || 0) + 2,
          mim_balance: (db.getWarriorById(match.player1_id).mim_balance || 0) + 2,
          games_played: (db.getWarriorById(match.player1_id).games_played || 0) + 1
        });
        if (match.player2_id) {
          db.updateWarrior(match.player2_id, {
            total_draws: (db.getWarriorById(match.player2_id).total_draws || 0) + 1,
            skill_score: (db.getWarriorById(match.player2_id).skill_score || 0) + 2,
            mim_balance: (db.getWarriorById(match.player2_id).mim_balance || 0) + 2,
            games_played: (db.getWarriorById(match.player2_id).games_played || 0) + 1
          });
        }
      }

      res.json({ match });
    } catch (error) {
      console.error('Admin match result error:', error);
      res.status(500).json({ error: 'Server error submitting match result' });
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
