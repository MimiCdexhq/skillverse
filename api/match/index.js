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

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    authMiddleware(req, res, () => {
      try {
        const { stake, gameType, mode } = req.body;
        const match = db.createMatch({
          player1_id: req.warrior.warriorId,
          game_type: gameType,
          stake: stake,
          mode: mode,
          status: 'waiting',
          created_at: new Date().toISOString()
        });
        res.status(201).json({ match });
      } catch (error) {
        console.error('Create match error:', error);
        res.status(500).json({ error: 'Server error creating match' });
      }
    });
  } else if (req.method === 'GET') {
    authMiddleware(req, res, () => {
      try {
        const matches = db.getMatchesByPlayer(req.warrior.warriorId);
        res.json(matches);
      } catch (error) {
        console.error('Match history error:', error);
        res.status(500).json({ error: 'Server error fetching match history' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
