const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');
const { WarriorService } = require('../services/warriorService');

class WarriorController {
  static async getProfile(req, res) {
    try {
      const profile = await WarriorService.getProfile(req.warrior.warrior_id);
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await WarriorService.getStats(req.warrior.warrior_id);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const warrior = await WarriorService.updateProfile(
        req.warrior.warrior_id,
        req.body
      );
      res.json({ success: true, data: warrior });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = { WarriorController };
