const { AuthService } = require('../services/authService');

class AuthController {
  static async login(req, res) {
    try {
      const { initData } = req.body;

      if (!initData) {
        return res.status(400).json({ error: 'initData is required' });
      }

      const telegramUser = AuthService.verifyTelegramInitData(initData);
      const { warrior, token, isNew } = await AuthService.loginOrCreate(telegramUser);

      res.json({
        success: true,
        token,
        warrior: {
          warriorId: warrior.warrior_id,
          telegramId: warrior.telegram_id,
          username: warrior.username,
          displayName: warrior.display_name,
          skillScore: warrior.skill_score,
          mimBalance: warrior.mim_balance,
          vusdtBalance: warrior.vusdt_balance,
          level: warrior.level,
          rank: warrior.rank,
        },
        isNew,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = { AuthController };
