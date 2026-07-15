const { authenticate } = require('../middleware/auth');
const { LeaderboardService } = require('../services/leaderboardService');

class LeaderboardController {
  static async getBySkillScore(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const leaderboard = await LeaderboardService.getBySkillScore(limit, offset);
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByMim(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const leaderboard = await LeaderboardService.getByMim(limit, offset);
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByGames(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const leaderboard = await LeaderboardService.getByGames(limit, offset);
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByStreak(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const leaderboard = await LeaderboardService.getByStreak(limit, offset);
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByReferrals(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const leaderboard = await LeaderboardService.getByReferrals(limit, offset);
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getHallOfFame(req, res) {
    try {
      const hallOfFame = await LeaderboardService.getHallOfFame();
      res.json({ success: true, data: hallOfFame });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = { LeaderboardController };
