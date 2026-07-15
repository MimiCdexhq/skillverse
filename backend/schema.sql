CREATE TABLE IF NOT EXISTS warriors (
  warrior_id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  display_name VARCHAR(255),
  skill_score INTEGER DEFAULT 0,
  mim_balance INTEGER DEFAULT 0,
  vusdt_balance INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank VARCHAR(50) DEFAULT 'Warrior',
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_draws INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  win_streak INTEGER DEFAULT 0,
  referral_code VARCHAR(50) UNIQUE,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
  match_id SERIAL PRIMARY KEY,
  player1_id INTEGER REFERENCES warriors(warrior_id),
  player2_id INTEGER REFERENCES warriors(warrior_id),
  winner INTEGER REFERENCES warriors(warrior_id),
  game_type VARCHAR(50) NOT NULL,
  stake INTEGER DEFAULT 0,
  mode VARCHAR(50) DEFAULT 'practice',
  status VARCHAR(50) DEFAULT 'waiting',
  player1_choice VARCHAR(50),
  player2_choice VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  referral_id SERIAL PRIMARY KEY,
  referrer_id INTEGER REFERENCES warriors(warrior_id),
  referred_id INTEGER REFERENCES warriors(warrior_id),
  reward DECIMAL(10, 4) DEFAULT 0.1,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_warriors_telegram_id ON warriors(telegram_id);
CREATE INDEX IF NOT EXISTS idx_matches_players ON matches(player1_id, player2_id);
CREATE INDEX IF NOT EXISTS idx_warriors_skill_score ON warriors(skill_score DESC);
CREATE INDEX IF NOT EXISTS idx_warriors_mim_balance ON warriors(mim_balance DESC);
