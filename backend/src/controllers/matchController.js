const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');
const { MatchService } = require('../services/matchService');

class MatchController {
  static async createMatch(req, res) {
    try {
      const { gameType, opponentType } = req.body;
      const match = await MatchService.createMatch(req.warrior.warrior_id, gameType, opponentType);
      res.status(201).json({ success: true, data: match });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async joinMatch(req, res) {
    try {
      const { matchId } = req.params;
      const match = await MatchService.joinMatch(matchId, req.warrior.warrior_id);
      res.json({ success: true, data: match });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async submitResult(req, res) {
    try {
      const { matchId } = req.params;
      const { result, playerChoice, opponentChoice } = req.body;

      const { match, rewards } = await MatchService.submitResult(
        matchId,
        req.warrior.warrior_id,
        result,
        playerChoice,
        opponentChoice
      );

      res.json({ success: true, data: { match, rewards } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const history = await MatchService.getHistory(req.warrior.warrior_id, limit, offset);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = { MatchController };
