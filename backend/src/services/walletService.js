const db = require('../config/database');

class WalletService {
  static async getWallet(warriorId) {
    const result = await db.query(
      'SELECT mim_balance, vusdt_balance FROM warriors WHERE warrior_id = $1',
      [warriorId]
    );

    if (result.rows.length === 0) {
      throw new Error('Warrior not found');
    }

    return result.rows[0];
  }

  static async getTransactionHistory(warriorId, limit = 50, offset = 0) {
    const result = await db.query(
      `SELECT
        transaction_id, type, amount, currency, description, created_at
       FROM transactions
       WHERE warrior_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [warriorId, limit, offset]
    );

    return result.rows;
  }
}

class RewardService {
  static async grantDailyReward(warriorId) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const lastRewardResult = await client.query(
        `SELECT last_daily_reward FROM warriors WHERE warrior_id = $1`,
        [warriorId]
      );

      const lastReward = lastRewardResult.rows[0]?.last_daily_reward;
      const now = new Date();
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

      if (lastReward && new Date(lastReward) > oneDayAgo) {
        throw new Error('Daily reward already claimed');
      }

      await client.query(
        `UPDATE warriors
         SET mim_balance = mim_balance + 50, last_daily_reward = $1
         WHERE warrior_id = $2`,
        [now, warriorId]
      );

      await client.query(
        `INSERT INTO transactions (warrior_id, type, amount, currency, description)
         VALUES ($1, 'daily_reward', 50, 'MIM', 'Daily reward claimed')`,
        [warriorId]
      );

      await client.query('COMMIT');
      return { success: true, amount: 50, currency: 'MIM' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async grantReward(warriorId, type, amount, currency, description) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      if (currency === 'MIM') {
        await client.query(
          `UPDATE warriors
           SET mim_balance = mim_balance + $1
           WHERE warrior_id = $2`,
          [amount, warriorId]
        );
      } else if (currency === 'vUSDT') {
        await client.query(
          `UPDATE warriors
           SET vusdt_balance = vusdt_balance + $1
           WHERE warrior_id = $2`,
          [amount, warriorId]
        );
      }

      await client.query(
        `INSERT INTO transactions (warrior_id, type, amount, currency, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [warriorId, type, amount, currency, description]
      );

      await client.query('COMMIT');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = { WalletService, RewardService };
