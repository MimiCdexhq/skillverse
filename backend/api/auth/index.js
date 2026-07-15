const jwt = require('jsonwebtoken');
const db = require('../database');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { telegramId, username, firstName, lastName } = req.body;

    let warrior = db.getWarriorByTelegramId(telegramId);

    if (warrior) {
      const token = jwt.sign(
        { warriorId: warrior.warrior_id, telegramId: warrior.telegram_id, is_admin: warrior.is_admin || false },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.json({ token, warrior });
    }

    const newWarrior = {
      telegram_id: parseInt(telegramId),
      username: username || `warrior_${telegramId}`,
      display_name: firstName || username || 'Warrior',
      skill_score: 0,
      mim_balance: 0,
      vusdt_balance: 0,
      level: 1,
      rank: 'Warrior',
      total_wins: 0,
      total_losses: 0,
      total_draws: 0,
      games_played: 0,
      win_streak: 0,
      referral_code: `REF${String(telegramId).slice(-6)}`,
      join_date: new Date().toISOString(),
      is_admin: false
    };

    warrior = db.createWarrior(newWarrior);
    const token = jwt.sign(
      { warriorId: warrior.warrior_id, telegramId: warrior.telegram_id, is_admin: warrior.is_admin || false },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ token, warrior });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};
