const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'skillverse.json');

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
