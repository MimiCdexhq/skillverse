const db = require('../database');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { action } = req.query;
    
    if (action === 'skillscore') {
      const warriors = db.getWarriors();
      const sorted = warriors.sort((a, b) => (b.skill_score || 0) - (a.skill_score || 0)).slice(0, 100);
      return res.json(sorted);
    } else if (action === 'mim') {
      const warriors = db.getWarriors();
      const sorted = warriors.sort((a, b) => (b.mim_balance || 0) - (a.mim_balance || 0)).slice(0, 100);
      return res.json(sorted);
    } else if (action === 'games') {
      const warriors = db.getWarriors();
      const sorted = warriors.sort((a, b) => (b.games_played || 0) - (a.games_played || 0)).slice(0, 100);
      return res.json(sorted);
    } else if (action === 'streak') {
      const warriors = db.getWarriors();
      const sorted = warriors.sort((a, b) => (b.win_streak || 0) - (a.win_streak || 0)).slice(0, 100);
      return res.json(sorted);
    }
    
    return res.status(400).json({ error: 'Invalid action' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
