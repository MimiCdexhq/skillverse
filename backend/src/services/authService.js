const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const db = require('../config/database');

class AuthService {
  static generateJwt(warrior) {
    return jwt.sign(
      { warriorId: warrior.warrior_id, telegramId: warrior.telegram_id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  static generateReferralCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  static async loginOrCreate(telegramUser) {
    const { id, username, first_name, last_name, photo_url } = telegramUser;

    const existingResult = await db.query(
      'SELECT * FROM warriors WHERE telegram_id = $1',
      [id]
    );

    if (existingResult.rows.length > 0) {
      const warrior = existingResult.rows[0];
      const token = this.generateJwt(warrior);
      return { warrior, token, isNew: false };
    }

    const displayName = [first_name, last_name].filter(Boolean).join(' ') || username || `Warrior_${id}`;
    const referralCode = this.generateReferralCode();

    const result = await db.query(
      `INSERT INTO warriors (telegram_id, username, display_name, avatar_url, referral_code)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, username || null, displayName, photo_url || null, referralCode]
    );

    const warrior = result.rows[0];
    const token = this.generateJwt(warrior);

    return { warrior, token, isNew: true };
  }

  static verifyTelegramInitData(initData) {
    const url = new URL(initData);
    const params = new URLSearchParams(url.search);
    const hash = params.get('hash');

    if (!hash) {
      throw new Error('Missing hash parameter');
    }

    const dataCheckString = Array.from(params.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(config.telegram.botToken)
      .digest();

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      throw new Error('Invalid init data');
    }

    const userData = JSON.parse(params.get('user') || '{}');
    const authDate = parseInt(params.get('auth_date') || '0');
    const now = Math.floor(Date.now() / 1000);

    if (now - authDate > 86400) {
      throw new Error('Init data expired');
    }

    return userData;
  }
}

module.exports = { AuthService };
