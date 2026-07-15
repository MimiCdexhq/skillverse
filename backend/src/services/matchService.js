const db = require('../config/database');

class MatchService {
  static async createMatch(player1Id, gameType, opponentType) {
    const result = await db.query(
      `INSERT INTO matches (player1_id, game_type, opponent_type, status)
       VALUES ($1, $2, $3, 'waiting')
       RETURNING *`,
      [player1Id, gameType, opponentType]
    );

    return result.rows[0];
  }

  static async joinMatch(matchId, player2Id) {
    const matchResult = await db.query(
      'SELECT * FROM matches WHERE match_id = $1 AND status = $2',
      [matchId, 'waiting']
    );

    if (matchResult.rows.length === 0) {
      throw new Error('Match not found or already started');
    }

    const updatedMatch = await db.query(
      `UPDATE matches
       SET player2_id = $1, status = 'playing'
       WHERE match_id = $2
       RETURNING *`,
      [player2Id, matchId]
    );

    return updatedMatch.rows[0];
  }

  static async submitResult(matchId, winnerId, result, playerChoice, opponentChoice) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const matchResult = await client.query(
        'SELECT * FROM matches WHERE match_id = $1',
        [matchId]
      );

      if (matchResult.rows.length === 0) {
        throw new Error('Match not found');
      }

      const match = matchResult.rows[0];

      if (match.status === 'completed') {
        throw new Error('Match already completed');
      }

      const rewards = this.calculateRewards(result);

      if (result === 'win') {
        await client.query(
          `UPDATE warriors
           SET total_wins = total_wins + 1,
               games_played = games_played + 1,
               skill_score = skill_score + $1,
               mim_balance = mim_balance + $2,
               win_streak = win_streak + 1
           WHERE warrior_id = $3`,
          [rewards.skillScore, rewards.mim, winnerId]
        );
      } else if (result === 'loss') {
        await client.query(
          `UPDATE warriors
           SET total_losses = total_losses + 1,
               games_played = games_played + 1,
               mim_balance = mim_balance + $1,
               win_streak = 0
           WHERE warrior_id = $2`,
          [rewards.mim, winnerId]
        );
      } else {
        await client.query(
          `UPDATE warriors
           SET total_draws = total_draws + 1,
               games_played = games_played + 1,
               skill_score = skill_score + $1,
               mim_balance = mim_balance + $2
           WHERE warrior_id = $3`,
          [rewards.skillScore, rewards.mim, winnerId]
        );
      }

      const updatedMatch = await client.query(
        `UPDATE matches
         SET winner_id = $1, result = $2, player_choice = $3, opponent_choice = $4, status = 'completed'
         WHERE match_id = $5
         RETURNING *`,
        [winnerId, result, playerChoice, opponentChoice, matchId]
      );

      await client.query('COMMIT');
      return { match: updatedMatch.rows[0], rewards };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static calculateRewards(result) {
    switch (result) {
      case 'win':
        return { skillScore: 10, mim: 10 };
      case 'draw':
        return { skillScore: 2, mim: 2 };
      case 'loss':
        return { skillScore: 0, mim: 1 };
      default:
        return { skillScore: 0, mim: 0 };
    }
  }

  static async getHistory(warriorId, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT
        m.match_id, m.game_type, m.result, m.player_choice, m.opponent_choice,
        m.created_at,
        w1.display_name as player1_name,
        w2.display_name as player2_name
       FROM matches m
       LEFT JOIN warriors w1 ON m.player1_id = w1.warrior_id
       LEFT JOIN warriors w2 ON m.player2_id = w2.warrior_id
       WHERE m.player1_id = $1 OR m.player2_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [warriorId, limit, offset]
    );

    return result.rows;
  }
}

module.exports = { MatchService };
