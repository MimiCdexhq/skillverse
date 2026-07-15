const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query('CREATE DATABASE IF NOT EXISTS skillverse');
    console.log('Database checked/created');
  } catch (error) {
    console.error('Error creating database:', error.message);
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schema);
    console.log('Schema applied successfully');
  } catch (error) {
    console.error('Schema error:', error.message);
  }

  const count = await pool.query('SELECT COUNT(*) FROM warriors');
  if (parseInt(count.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO warriors (telegram_id, username, display_name, skill_score, mim_balance, vusdt_balance, level, rank, total_wins, total_losses, total_draws, games_played, win_streak, referral_code, join_date)
      VALUES 
        (123456789, 'demo_warrior', 'Demo Warrior', 150, 250, 5, 3, 'Veteran', 15, 5, 2, 22, 3, 'REF001', '2026-01-15'),
        (987654321, 'test_player', 'Test Player', 80, 120, 2, 2, 'Warrior', 8, 7, 1, 16, 1, 'REF002', '2026-02-20'),
        (555555555, 'pro_gamer', 'Pro Gamer', 320, 500, 12, 5, 'Champion', 32, 8, 3, 43, 8, 'REF003', '2026-01-01')
    `);
    console.log('Seed data inserted');
  }

  const warriors = await pool.query('SELECT warrior_id, display_name, skill_score, mim_balance, vusdt_balance FROM warriors');
  console.log('Current warriors:');
  warriors.rows.forEach(w => {
    console.log(`  ID: ${w.warrior_id} | ${w.display_name} | SS: ${w.skill_score} | MIM: ${w.mim_balance} | vUSDT: ${w.vusdt_balance}`);
  });

  console.log('Database setup complete!');
  process.exit(0);
}

setupDatabase().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
