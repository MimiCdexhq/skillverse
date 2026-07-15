const db = require('../config/database');

class LeaderboardService {
  static async getBySkillScore(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT
        ROW_NUMBER() OVER (ORDER BY skill_score DESC, games_played ASC) as rank,
        warrior_id, display_name, avatar_url, skill_score, mim_balance, games_played
       FROM warriors
       ORDER BY skill_score DESC, games_played ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  static async getByMim(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT
        ROW_NUMBER() OVER (ORDER BY mim_balance DESC) as rank,
        warrior_id, display_name, avatar_url, mim_balance, games_played
       FROM warriors
       ORDER BY mim_balance DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  static async getByGames(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT
        ROW_NUMBER() OVER (ORDER BY games_played DESC) as rank,
        warrior_id, display_name, avatar_url, games_played, skill_score
       FROM warriors
       ORDER BY games_played DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  static async getByStreak(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT
        ROW_NUMBER() OVER (ORDER BY win_streak DESC) as rank,
        warrior_id, display_name, avatar_url, win_streak, total_wins
       FROM warriors
       WHERE win_streak > 0
       ORDER BY win_streak DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  static async getByReferrals(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT
        w.warrior_id, w.display_name, w.avatar_url,
        COUNT(r.referral_id) as referral_count,
        SUM(r.reward_amount) as total_rewards
       FROM warriors w
       LEFT JOIN referrals r ON w.warrior_id = r.referrer_id
       GROUP BY w.warrior_id, w.display_name, w.avatar_url
       ORDER BY referral_count DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  static async getHallOfFame() {
    const result = await db.query(
      `SELECT
        w.warrior_id, w.display_name, w.avatar_url, w.skill_score,
        w.total_wins, w.games_played,
        COUNT(DISTINCT m.match_id) as total_matches,
        ROUND((w.total_wins::numeric / NULLIF(w.games_played, 0) * 100), 1) as win_rate
       FROM warriors w
       LEFT JOIN matches m ON w.warrior_id = m.player1_id OR w.warrior_id = m.player2_id
       GROUP BY w.warrior_id, w.display_name, w.avatar_url, w.skill_score, w.total_wins, w.games_played
       ORDER BY w.skill_score DESC
       LIMIT 50`
    );

    return result.rows;
  }
}

module.exports = { LeaderboardService };
