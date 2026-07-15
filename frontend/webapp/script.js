/* ===========================
   SKILLVERSE V1 - MODULAR APP
   =========================== */

const API_BASE = '/api';
let currentWarrior = null;
let authToken = null;
let currentMatch = null;

const App = {
  init() {
    this.createStars();
    this.bindEvents();
    this.checkSession();
  },

  createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div');
      star.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${star.style.width};
        background: white;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random()};
        animation: twinkle ${2 + Math.random() * 4}s infinite;
      `;
      starsContainer.appendChild(star);
    }

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes twinkle {
        0% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
        100% { opacity: 0.2; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  },

  bindEvents() {
    const telegramLoginBtn = document.getElementById('telegramLoginBtn');
    if (telegramLoginBtn) {
      telegramLoginBtn.addEventListener('click', () => this.telegramLogin());
    }
  },

  checkSession() {
    const token = localStorage.getItem('skillverse_token');
    const warrior = localStorage.getItem('skillverse_warrior');

    if (token && warrior) {
      authToken = token;
      currentWarrior = JSON.parse(warrior);
      this.showDashboard();
    }
  },

  async telegramLogin() {
    try {
      if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const initData = Telegram.WebApp.initData;

        if (!initData) {
          alert('Please open this app from Telegram');
          return;
        }

        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });

        const result = await response.json();

        if (result.success) {
          authToken = result.token;
          currentWarrior = result.warrior;

          localStorage.setItem('skillverse_token', authToken);
          localStorage.setItem('skillverse_warrior', JSON.stringify(currentWarrior));

          this.showDashboard();
        } else {
          alert(result.error || 'Login failed');
        }
      } else {
        alert('This app must be opened from Telegram');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  },

  showDashboard() {
    document.getElementById('main').style.display = 'none';
    document.getElementById('splash').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    this.updateDashboardUI();
  },

  async updateDashboardUI() {
    if (!currentWarrior) return;

    document.getElementById('mimBalance').textContent = currentWarrior.mimBalance || 0;
    document.getElementById('vusdtBalance').textContent = currentWarrior.vusdtBalance || 0;
    document.getElementById('skillScore').textContent = currentWarrior.skillScore || 0;
    document.getElementById('warriorName').textContent = currentWarrior.displayName || 'Warrior';
  },

  logout() {
    localStorage.removeItem('skillverse_token');
    localStorage.removeItem('skillverse_warrior');
    authToken = null;
    currentWarrior = null;

    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('main').style.display = 'block';
  },
};

const API = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

const Router = {
  screens: {},

  register(name, elementId, showFn) {
    this.screens[name] = { elementId, showFn };
  },

  show(name) {
    Object.keys(this.screens).forEach(key => {
      const screen = document.getElementById(this.screens[key].elementId);
      if (screen) {
        screen.style.display = 'none';
      }
    });

    const target = this.screens[name];
    if (target) {
      const element = document.getElementById(target.elementId);
      if (element) {
        element.style.display = 'block';
        if (target.showFn) target.showFn();
      }
    }
  },
};

const RPS = {
  choices: ['rock', 'paper', 'scissors'],
  beats: { rock: 'scissors', scissors: 'paper', paper: 'rock' },

  play(playerChoice) {
    const opponentChoice = this.choices[Math.floor(Math.random() * 3)];

    let result;
    if (playerChoice === opponentChoice) {
      result = 'draw';
    } else if (this.beats[playerChoice] === opponentChoice) {
      result = 'win';
    } else {
      result = 'loss';
    }

    return { playerChoice, opponentChoice, result };
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
  Router.register('dashboard', 'dashboard', () => App.updateDashboardUI());
  Router.register('play', 'play', () => Game.reset());
  Router.register('leaderboard', 'leaderboard', () => Leaderboard.load('skillscore'));
  Router.register('wallet', 'wallet', () => Wallet.load());
  Router.register('profile', 'profile', () => Profile.load());
  Router.register('dailyReward', 'dailyReward', () => {});
  Router.register('victory', 'victoryScreen', () => {});
});

const Router = {
  screens: {},

  register(name, elementId, showFn) {
    this.screens[name] = { elementId, showFn };
  },

  show(name) {
    Object.keys(this.screens).forEach(key => {
      const screen = document.getElementById(this.screens[key].elementId);
      if (screen) {
        screen.style.display = 'none';
      }
    });

    const target = this.screens[name];
    if (target) {
      const element = document.getElementById(target.elementId);
      if (element) {
        element.style.display = 'block';
        if (target.showFn) target.showFn();
      }
    }
  },
};

const Game = {
  gameType: null,
  opponentType: null,
  roundResult: null,

  select(gameType) {
    this.gameType = gameType;
    document.querySelector('.game-selection').style.display = 'none';
    document.getElementById('matchSetup').style.display = 'block';
  },

  async startMatch(opponentType) {
    this.opponentType = opponentType;

    try {
      const response = await API.post('/match/create', {
        gameType: this.gameType,
        opponentType: opponentType,
      });

      if (response.success) {
        currentMatch = response.data;
        Router.show('play');
        document.getElementById('matchSetup').style.display = 'none';
        document.getElementById('rpsGame').style.display = 'block';
      }
    } catch (error) {
      alert('Failed to create match');
    }
  },

  makeChoice(choice) {
    if (!currentMatch) return;

    const result = RPS.play(choice);

    this.roundResult = result;

    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.choice === choice) {
        btn.classList.add('selected');
      }
    });

    document.getElementById('roundResult').innerHTML = `
      <div class="result-display">
        <div class="player-choice">You: ${this.getEmoji(choice)}</div>
        <div class="opponent-choice">AI: ${this.getEmoji(result.opponentChoice)}</div>
        <div class="result-text ${result.result}">${result.result.toUpperCase()}</div>
      </div>
    `;

    this.submitResult(result);
  },

  async submitResult(result) {
    try {
      const response = await API.post(`/match/${currentMatch.match_id}/result`, {
        result: result.result,
        playerChoice: result.playerChoice,
        opponentChoice: result.opponentChoice,
      });

      if (response.success) {
        setTimeout(() => this.showVictory(result, response.data.rewards), 1500);
      }
    } catch (error) {
      console.error('Submit result error:', error);
    }
  },

  showVictory(result, rewards) {
    const icon = document.getElementById('victoryIcon');
    const title = document.getElementById('victoryTitle');
    const message = document.getElementById('victoryMessage');

    if (result.result === 'win') {
      icon.textContent = '🏆';
      title.textContent = 'Victory!';
      message.textContent = 'You dominated the battle!';
    } else if (result.result === 'draw') {
      icon.textContent = '🤝';
      title.textContent = 'Draw!';
      message.textContent = 'Great minds think alike!';
    } else {
      icon.textContent = '💔';
      title.textContent = 'Defeat';
      message.textContent = 'Better luck next time!';
    }

    document.getElementById('rewardSkillScore').textContent = `+${rewards.skillScore}`;
    document.getElementById('rewardMim').textContent = `+${rewards.mim}`;

    Router.show('victory');

    App.updateDashboardUI();
  },

  async claimDailyReward() {
    try {
      const response = await API.post('/wallet/daily-reward');
      if (response.success) {
        alert(`Claimed ${response.data.amount} ${response.data.currency}!`);
        App.updateDashboardUI();
        Router.show('dashboard');
      }
    } catch (error) {
      alert(error.error || 'Failed to claim daily reward');
    }
  },

  reset() {
    currentMatch = null;
    this.gameType = null;
    this.opponentType = null;
    this.roundResult = null;

    document.getElementById('matchSetup').style.display = 'none';
    document.getElementById('rpsGame').style.display = 'none';
    document.querySelector('.game-selection').style.display = 'block';
    document.getElementById('roundResult').innerHTML = '';

    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('selected');
    });

    Router.show('play');
  },

  endMatch() {
    this.reset();
    Router.show('dashboard');
  },

  getEmoji(choice) {
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    return emojis[choice] || choice;
  },
};

const Leaderboard = {
  async load(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');

    const content = document.getElementById('leaderboardContent');
    content.innerHTML = '<div class="loading">Loading...</div>';

    try {
      let endpoint;
      switch (tab) {
        case 'skillscore': endpoint = '/leaderboard/skillscore'; break;
        case 'mim': endpoint = '/leaderboard/mim'; break;
        case 'games': endpoint = '/leaderboard/games'; break;
        case 'streak': endpoint = '/leaderboard/streak'; break;
        case 'referrals': endpoint = '/leaderboard/referrals'; break;
        default: endpoint = '/leaderboard/skillscore';
      }

      const response = await API.get(endpoint);

      if (response.success) {
        this.render(response.data);
      }
    } catch (error) {
      content.innerHTML = '<div class="error">Failed to load leaderboard</div>';
    }
  },

  render(data) {
    const content = document.getElementById('leaderboardContent');

    if (!data || data.length === 0) {
      content.innerHTML = '<div class="empty">No data available</div>';
      return;
    }

    content.innerHTML = data.map((item, index) => `
      <div class="leaderboard-item ${item.warrior_id === currentWarrior?.warriorId ? 'highlight' : ''}">
        <div class="rank">#${item.rank || index + 1}</div>
        <div class="player-info">
          <div class="player-name">${item.display_name}</div>
          <div class="player-details">${this.getDetails(item)}</div>
        </div>
      </div>
    `).join('');
  },

  getDetails(item) {
    if (item.skill_score) return `SkillScore: ${item.skill_score}`;
    if (item.mim_balance) return `MIM: ${item.mim_balance}`;
    if (item.games_played) return `Games: ${item.games_played}`;
    if (item.win_streak) return `Streak: ${item.win_streak}`;
    if (item.referral_count) return `Referrals: ${item.referral_count}`;
    return '';
  },

  switchTab(tab) {
    this.load(tab);
  },
};

const Wallet = {
  async load() {
    try {
      const [walletRes, historyRes] = await Promise.all([
        API.get('/wallet'),
        API.get('/wallet/history?limit=20'),
      ]);

      if (walletRes.success) {
        document.getElementById('walletMim').textContent = walletRes.data.mim_balance || 0;
        document.getElementById('walletVusdt').textContent = walletRes.data.vusdt_balance || 0;
      }

      if (historyRes.success) {
        this.renderHistory(historyRes.data);
      }
    } catch (error) {
      console.error('Wallet load error:', error);
    }
  },

  renderHistory(transactions) {
    const list = document.getElementById('transactionList');

    if (!transactions || transactions.length === 0) {
      list.innerHTML = '<div class="empty">No transactions yet</div>';
      return;
    }

    list.innerHTML = transactions.map(tx => `
      <div class="transaction-item">
        <div class="tx-info">
          <div class="tx-type">${tx.type.replace(/_/g, ' ')}</div>
          <div class="tx-date">${new Date(tx.created_at).toLocaleDateString()}</div>
        </div>
        <div class="tx-amount ${tx.type.includes('reward') ? 'positive' : 'negative'}">
          ${tx.type.includes('reward') || tx.type.includes('claim') ? '+' : ''}${tx.amount} ${tx.currency}
        </div>
      </div>
    `).join('');
  },
};

const Profile = {
  async load() {
    try {
      const [profileRes, statsRes] = await Promise.all([
        API.get('/warrior/profile'),
        API.get('/warrior/stats'),
      ]);

      if (profileRes.success) {
        const p = profileRes.data;
        document.getElementById('profileName').textContent = p.display_name || 'Warrior';
        document.getElementById('profileId').textContent = `ID: #${p.warrior_id}`;
        document.getElementById('profileWins').textContent = p.total_wins || 0;
        document.getElementById('profileLosses').textContent = p.total_losses || 0;
        document.getElementById('profileDraws').textContent = p.total_draws || 0;
        document.getElementById('profileWinRate').textContent = `${p.win_rate || 0}%`;
      }
    } catch (error) {
      console.error('Profile load error:', error);
    }
  },
};

const RPS = {
  choices: ['rock', 'paper', 'scissors'],
  beats: { rock: 'scissors', scissors: 'paper', paper: 'rock' },

  play(playerChoice) {
    const opponentChoice = this.choices[Math.floor(Math.random() * 3)];

    let result;
    if (playerChoice === opponentChoice) {
      result = 'draw';
    } else if (this.beats[playerChoice] === opponentChoice) {
      result = 'win';
    } else {
      result = 'loss';
    }

    return { playerChoice, opponentChoice, result };
  },
};
