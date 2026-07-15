const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');
const { WalletService, RewardService } = require('../services/walletService');

class WalletController {
  static async getWallet(req, res) {
    try {
      const wallet = await WalletService.getWallet(req.warrior.warrior_id);
      res.json({ success: true, data: wallet });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getTransactionHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const transactions = await WalletService.getTransactionHistory(
        req.warrior.warrior_id,
        limit,
        offset
      );
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

class RewardController {
  static async claimDailyReward(req, res) {
    try {
      const reward = await RewardService.grantDailyReward(req.warrior.warrior_id);
      res.json({ success: true, data: reward });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = { WalletController, RewardController };
