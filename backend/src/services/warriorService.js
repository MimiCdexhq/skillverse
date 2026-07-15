const db = require('../config/database');

class WarriorService {
  static async getProfile(warriorId) {
    const result = await db.query(
      `SELECT warrior_id, telegram_id, username, display_name, avatar_url,
              skill_score, mim_balance, vusdt_balance, level, rank,
              total_wins, total_losses, total_draws, games_played,
              win_streak, referral_code, created_at
       FROM warriors
       WHERE warrior_id = $1`,
      [warriorId]
    );

    if (result.rows.length === 0) {
      throw new Error('Warrior not found');
    }

    const warrior = result.rows[0];
    const winRate = warrior.games_played > 0
      ? ((warrior.total_wins / warrior.games_played) * 100).toFixed(1)
      : 0;

    return { ...warrior, win_rate: parseFloat(winRate) };
  }

  static async updateProfile(warriorId, updates) {
    const allowedFields = ['display_name', 'avatar_url'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(warriorId);

    const query = `
      UPDATE warriors
      SET ${setClause.join(', ')}
      WHERE warrior_id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getStats(warriorId) {
    const result = await db.query(
      `SELECT
        total_wins, total_losses, total_draws, games_played,
        win_streak, skill_score, mim_balance, vusdt_balance,
        (SELECT COUNT(*) FROM matches WHERE player1_id = $1 OR player2_id = $1) as total_matches
       FROM warriors
       WHERE warrior_id = $1`,
      [warriorId]
    );

    if (result.rows.length === 0) {
      throw new Error('Warrior not found');
    }

    const stats = result.rows[0];
    const winRate = stats.games_played > 0
      ? ((stats.total_wins / stats.games_played) * 100).toFixed(1)
      : 0;

    return {
      ...stats,
      win_rate: parseFloat(winRate),
    };
  }
}

module.exports = { WarriorService };
