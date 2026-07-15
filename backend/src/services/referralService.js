const db = require('../config/database');

class ReferralService {
  static async createReferral(referrerId, referredTelegramId) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const referrerResult = await client.query(
        'SELECT warrior_id FROM warriors WHERE telegram_id = $1',
        [referrerId]
      );

      if (referrerResult.rows.length === 0) {
        throw new Error('Referrer not found');
      }

      const referrerWarriorId = referrerResult.rows[0].warrior_id;

      const referredResult = await client.query(
        'SELECT warrior_id FROM warriors WHERE telegram_id = $1',
        [referredTelegramId]
      );

      if (referredResult.rows.length === 0) {
        throw new Error('Referred warrior not found');
      }

      const referredWarriorId = referredResult.rows[0].warrior_id;

      if (referrerWarriorId === referredWarriorId) {
        throw new Error('Cannot refer yourself');
      }

      const existingReferral = await client.query(
        'SELECT referral_id FROM referrals WHERE referrer_id = $1 AND referred_id = $2',
        [referrerWarriorId, referredWarriorId]
      );

      if (existingReferral.rows.length > 0) {
        throw new Error('Referral already exists');
      }

      const referral = await client.query(
        `INSERT INTO referrals (referrer_id, referred_id, reward_amount, status)
         VALUES ($1, $2, 0.1, 'pending')
         RETURNING *`,
        [referrerWarriorId, referredWarriorId]
      );

      await client.query('COMMIT');
      return referral.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getReferrals(warriorId) {
    const result = await db.query(
      `SELECT
        r.referral_id, r.reward_amount, r.status, r.created_at,
        w.display_name as referred_name, w.username as referred_username
       FROM referrals r
       JOIN warriors w ON r.referred_id = w.warrior_id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [warriorId]
    );

    return result.rows;
  }

  static async getReferralStats(warriorId) {
    const result = await db.query(
      `SELECT
        COUNT(*) as total_referrals,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_referrals,
        SUM(reward_amount) as total_earned
       FROM referrals
       WHERE referrer_id = $1`,
      [warriorId]
    );

    return result.rows[0];
  }
}

module.exports = { ReferralService };
