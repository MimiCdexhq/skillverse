const { authenticate } = require('../middleware/auth');
const { ReferralService } = require('../services/referralService');

class ReferralController {
  static async createReferral(req, res) {
    try {
      const { telegramId } = req.body;
      const referral = await ReferralService.createReferral(
        req.warrior.telegram_id,
        telegramId
      );
      res.status(201).json({ success: true, data: referral });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getReferrals(req, res) {
    try {
      const referrals = await ReferralService.getReferrals(req.warrior.warrior_id);
      res.json({ success: true, data: referrals });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getReferralStats(req, res) {
    try {
      const stats = await ReferralService.getReferralStats(req.warrior.warrior_id);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = { ReferralController };
