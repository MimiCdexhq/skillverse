const { createTables } = require('./run');
const db = require('../config/database');

async function main() {
  try {
    await createTables();

    const sampleWarriors = [
      { telegram_id: 123456789, username: 'warrior_one', display_name: 'Shadow Warrior' },
      { telegram_id: 987654321, username: 'champion_x', display_name: 'Champion X' },
      { telegram_id: 456789123, username: 'mim_master', display_name: 'MIM Master' },
    ];

    for (const warrior of sampleWarriors) {
      const result = await db.query(
        `INSERT INTO warriors (telegram_id, username, display_name, skill_score, mim_balance, vusdt_balance, total_wins, games_played)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (telegram_id) DO NOTHING
         RETURNING warrior_id`,
        [warrior.telegram_id, warrior.username, warrior.display_name, 100 + Math.floor(Math.random() * 500), 500 + Math.floor(Math.random() * 2000), Math.random() * 10, 10 + Math.floor(Math.random() * 50), 20 + Math.floor(Math.random() * 80)]
      );
      console.log(`Seeded warrior: ${warrior.display_name}`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

main();
