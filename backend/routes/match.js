const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { stake, gameType, mode } = req.body;

    const match = await pool.query(
      'INSERT INTO matches (player1_id, game_type, stake, mode, status, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.warrior.warriorId, gameType, stake, mode, 'waiting', new Date()]
    );

    res.status(201).json({ match: match.rows[0] });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ error: 'Server error creating match' });
  }
});

router.post('/result', authMiddleware, async (req, res) => {
  try {
    const { matchId, winnerId, player1Choice, player2Choice } = req.body;

    const result = await pool.query(
      'UPDATE matches SET winner = $1, player1_choice = $2, player2_choice = $3, status = $4, completed_at = $5 WHERE match_id = $6 RETURNING *',
      [winnerId, player1Choice, player2Choice, 'completed', new Date(), matchId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = result.rows[0];

    if (winnerId === match.player1_id) {
      await pool.query(
        'UPDATE warriors SET total_wins = total_wins + 1, skill_score = skill_score + 10, mim_balance = mim_balance + 10, win_streak = win_streak + 1, games_played = games_played + 1 WHERE warrior_id = $1',
        [match.player1_id]
      );
      await pool.query(
        'UPDATE warriors SET total_losses = total_losses + 1, games_played = games_played + 1 WHERE warrior_id = $1',
        [match.player2_id]
      );
    } else if (winnerId === match.player2_id) {
      await pool.query(
        'UPDATE warriors SET total_wins = total_wins + 1, skill_score = skill_score + 10, mim_balance = mim_balance + 10, win_streak = win_streak + 1, games_played = games_played + 1 WHERE warrior_id = $1',
        [match.player2_id]
      );
      await pool.query(
        'UPDATE warriors SET total_losses = total_losses + 1, games_played = games_played + 1 WHERE warrior_id = $1',
        [match.player1_id]
      );
    } else {
      await pool.query(
        'UPDATE warriors SET total_draws = total_draws + 1, skill_score = skill_score + 2, mim_balance = mim_balance + 2, games_played = games_played + 1 WHERE warrior_id = $1',
        [match.player1_id]
      );
      await pool.query(
        'UPDATE warriors SET total_draws = total_draws + 1, skill_score = skill_score + 2, mim_balance = mim_balance + 2, games_played = games_played + 1 WHERE warrior_id = $1',
        [match.player2_id]
      );
    }

    res.json({ match });
  } catch (error) {
    console.error('Match result error:', error);
    res.status(500).json({ error: 'Server error submitting match result' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM matches WHERE player1_id = $1 OR player2_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.warrior.warriorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Match history error:', error);
    res.status(500).json({ error: 'Server error fetching match history' });
  }
});

module.exports = router;
