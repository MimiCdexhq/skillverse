const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.VERCEL 
  ? '/tmp/skillverse.json' 
  : path.join(__dirname, 'skillverse.json');

let db = null;

function loadDatabase() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    db = JSON.parse(data);
  } catch (error) {
    db = {
      warriors: [],
      matches: [],
      referrals: []
    };
    saveDatabase();
  }
}

function saveDatabase() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function init() {
  loadDatabase();
  
  if (db.warriors.length === 0) {
    db.warriors = [
      {
        warrior_id: 1,
        telegram_id: 123456789,
        username: "demo_warrior",
        display_name: "Demo Warrior",
        skill_score: 150,
        mim_balance: 250,
        vusdt_balance: 5,
        level: 3,
        rank: "Veteran",
        total_wins: 15,
        total_losses: 5,
        total_draws: 2,
        games_played: 22,
        win_streak: 3,
        referral_code: "REF001",
        join_date: "2026-01-15T00:00:00.000Z",
        is_admin: false
      },
      {
        warrior_id: 2,
        telegram_id: 987654321,
        username: "test_player",
        display_name: "Test Player",
        skill_score: 80,
        mim_balance: 120,
        vusdt_balance: 2,
        level: 2,
        rank: "Warrior",
        total_wins: 8,
        total_losses: 7,
        total_draws: 1,
        games_played: 16,
        win_streak: 1,
        referral_code: "REF002",
        join_date: "2026-02-20T00:00:00.000Z",
        is_admin: false
      },
      {
        warrior_id: 3,
        telegram_id: 555555555,
        username: "pro_gamer",
        display_name: "Pro Gamer",
        skill_score: 320,
        mim_balance: 500,
        vusdt_balance: 12,
        level: 5,
        rank: "Champion",
        total_wins: 32,
        total_losses: 8,
        total_draws: 3,
        games_played: 43,
        win_streak: 8,
        referral_code: "REF003",
        join_date: "2026-01-01T00:00:00.000Z",
        is_admin: true
      }
    ];
    db.matches = [
      {
        match_id: 1,
        player1_id: 1,
        player2_id: 2,
        winner: 1,
        game_type: "rps",
        stake: 500,
        mode: "ranked",
        status: "completed",
        player1_choice: "rock",
        player2_choice: "scissors",
        created_at: "2026-07-14T10:00:00.000Z",
        completed_at: "2026-07-14T10:05:00.000Z"
      },
      {
        match_id: 2,
        player1_id: 2,
        player2_id: 3,
        winner: 3,
        game_type: "rps",
        stake: 1000,
        mode: "ranked",
        status: "completed",
        player1_choice: "paper",
        player2_choice: "scissors",
        created_at: "2026-07-14T11:00:00.000Z",
        completed_at: "2026-07-14T11:03:00.000Z"
      }
    ];
    db.referrals = [];
    saveDatabase();
  }
  
  return {
    getWarriors: () => db.warriors,
    getMatches: () => db.matches,
    getReferrals: () => db.referrals,
    
    getWarriorById: (id) => db.warriors.find(w => w.warrior_id === id),
    getWarriorByTelegramId: (telegramId) => db.warriors.find(w => w.telegram_id === parseInt(telegramId)),
    createWarrior: (warrior) => {
      warrior.warrior_id = db.warriors.length > 0 ? Math.max(...db.warriors.map(w => w.warrior_id)) + 1 : 1;
      db.warriors.push(warrior);
      saveDatabase();
      return warrior;
    },
    updateWarrior: (id, updates) => {
      const index = db.warriors.findIndex(w => w.warrior_id === id);
      if (index !== -1) {
        db.warriors[index] = { ...db.warriors[index], ...updates };
        saveDatabase();
        return db.warriors[index];
      }
      return null;
    },
    deleteWarrior: (id) => {
      const index = db.warriors.findIndex(w => w.warrior_id === id);
      if (index !== -1) {
        const deleted = db.warriors.splice(index, 1)[0];
        saveDatabase();
        return deleted;
      }
      return null;
    },
    
    createMatch: (match) => {
      match.match_id = db.matches.length > 0 ? Math.max(...db.matches.map(m => m.match_id)) + 1 : 1;
      db.matches.push(match);
      saveDatabase();
      return match;
    },
    updateMatch: (id, updates) => {
      const index = db.matches.findIndex(m => m.match_id === id);
      if (index !== -1) {
        db.matches[index] = { ...db.matches[index], ...updates };
        saveDatabase();
        return db.matches[index];
      }
      return null;
    },
    getMatchesByPlayer: (playerId) => {
      return db.matches.filter(m => m.player1_id === playerId || m.player2_id === playerId);
    },
    
    createReferral: (referral) => {
      referral.referral_id = db.referrals.length > 0 ? Math.max(...db.referrals.map(r => r.referral_id)) + 1 : 1;
      db.referrals.push(referral);
      saveDatabase();
      return referral;
    }
  };
}

const dbApi = init();

module.exports = dbApi;
