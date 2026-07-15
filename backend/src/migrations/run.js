const db = require('../config/database');

const createTables = async () => {
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS warriors (
      warrior_id SERIAL PRIMARY KEY,
      telegram_id BIGINT UNIQUE NOT NULL,
      username VARCHAR(255),
      display_name VARCHAR(100) NOT NULL,
      avatar_url TEXT,
      skill_score INTEGER DEFAULT 0,
      mim_balance BIGINT DEFAULT 0,
      vusdt_balance DECIMAL(18,6) DEFAULT 0,
      level INTEGER DEFAULT 1,
      rank INTEGER DEFAULT 0,
      total_wins INTEGER DEFAULT 0,
      total_losses INTEGER DEFAULT 0,
      total_draws INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      win_streak INTEGER DEFAULT 0,
      referral_code VARCHAR(20) UNIQUE NOT NULL,
      last_daily_reward TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS matches (
      match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      player1_id INTEGER NOT NULL REFERENCES warriors(warrior_id),
      player2_id INTEGER REFERENCES warriors(warrior_id),
      winner_id INTEGER REFERENCES warriors(warrior_id),
      game_type VARCHAR(50) NOT NULL,
      opponent_type VARCHAR(10) NOT NULL,
      result VARCHAR(10),
      player_choice VARCHAR(20),
      opponent_choice VARCHAR(20),
      status VARCHAR(20) DEFAULT 'waiting',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS referrals (
      referral_id SERIAL PRIMARY KEY,
      referrer_id INTEGER NOT NULL REFERENCES warriors(warrior_id),
      referred_id INTEGER NOT NULL REFERENCES warriors(warrior_id),
      reward_amount DECIMAL(18,6) DEFAULT 0.1,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      UNIQUE(referrer_id, referred_id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id SERIAL PRIMARY KEY,
      warrior_id INTEGER NOT NULL REFERENCES warriors(warrior_id),
      type VARCHAR(50) NOT NULL,
      amount NUMERIC(18,6) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `,
  ];

  for (const query of queries) {
    await db.query(query);
  }

  console.log('Database tables created successfully');
};

const seedDatabase = async () => {
  try {
    await createTables();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { createTables, seedDatabase };
