const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
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

router.post('/result', authMiddleware, async (req, res) => {
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
    console.error('Match result error:', error);
    res.status(500).json({ error: 'Server error submitting match result' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const matches = db.getMatchesByPlayer(req.warrior.warriorId);
    res.json(matches);
  } catch (error) {
    console.error('Match history error:', error);
    res.status(500).json({ error: 'Server error fetching match history' });
  }
});

module.exports = router;
