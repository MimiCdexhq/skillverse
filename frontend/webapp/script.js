/* ===========================
   SKILLVERSE V2 - FUTURISTIC UI
   =========================== */

const API_BASE = '/api';
let currentWarrior = null;
let authToken = null;
let currentMatch = null;
let particleAnimationId = null;

/* ===========================
   PARTICLE BACKGROUND SYSTEM
   =========================== */
const ParticleSystem = {
  canvas: null,
  ctx: null,
  particles: [],
  nebulaClouds: [],
  animationId: null,

  init() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();
    this.createNebula();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    const count = Math.min(150, Math.floor(window.innerWidth / 10));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.5 ? '0, 191, 255' : '255, 0, 68',
      });
    }
  },

  createNebula() {
    this.nebulaClouds = [
      {
        x: this.canvas.width * 0.2,
        y: this.canvas.height * 0.3,
        radius: 300,
        color: '0, 191, 255',
        opacity: 0.08,
      },
      {
        x: this.canvas.width * 0.8,
        y: this.canvas.height * 0.4,
        radius: 350,
        color: '255, 0, 68',
        opacity: 0.06,
      },
      {
        x: this.canvas.width * 0.5,
        y: this.canvas.height * 0.8,
        radius: 250,
        color: '120, 0, 255',
        opacity: 0.05,
      },
    ];
  },

  animate() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw nebula clouds
    this.nebulaClouds.forEach(cloud => {
      const gradient = this.ctx.createRadialGradient(
        cloud.x, cloud.y, 0,
        cloud.x, cloud.y, cloud.radius
      );
      gradient.addColorStop(0, `rgba(${cloud.color}, ${cloud.opacity})`);
      gradient.addColorStop(0.5, `rgba(${cloud.color}, ${cloud.opacity * 0.5})`);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });

    // Draw particles
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.pulse += particle.pulseSpeed;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      const currentOpacity = particle.opacity * (0.7 + Math.sin(particle.pulse) * 0.3);
      const currentRadius = particle.radius * (0.9 + Math.sin(particle.pulse) * 0.1);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${particle.color}, ${currentOpacity})`;
      this.ctx.fill();

      // Add glow effect
      const glow = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, currentRadius * 3
      );
      glow.addColorStop(0, `rgba(${particle.color}, ${currentOpacity * 0.4})`);
      glow.addColorStop(1, 'transparent');

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, currentRadius * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = glow;
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  },

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
};

/* ===========================
   ANIMATED NUMBER COUNTER
   =========================== */
const AnimatedCounter = {
  animate(element, target, duration = 1000, prefix = '', suffix = '') {
    const start = parseFloat(element.textContent.replace(/[^\d.-]/g, '')) || 0;
    const end = parseFloat(target);
    const range = end - start;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + range * easeOutQuart;

      element.textContent = prefix + this.formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + this.formatNumber(end) + suffix;
      }
    };

    requestAnimationFrame(update);
  },

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toLocaleString();
  },
};

/* ===========================
   COUNTDOWN TIMER
   =========================== */
const CountdownTimer = {
  intervalId: null,

  start(elementId, hours = 4, minutes = 32, seconds = 15) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const update = () => {
      totalSeconds--;

      if (totalSeconds <= 0) {
        totalSeconds = 24 * 3600;
      }

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      element.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    update();
    this.intervalId = setInterval(update, 1000);
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },
};

/* ===========================
   COIN SPARKLE EFFECT
   =========================== */
const SparkleEffect = {
  create(element, count = 12) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 6px;
        height: 6px;
        background: #ffd700;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px #ffd700;
      `;
      document.body.appendChild(sparkle);

      const angle = (Math.PI * 2 * i) / count;
      const distance = 60 + Math.random() * 40;
      const duration = 600 + Math.random() * 400;

      sparkle.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
          opacity: 0,
        },
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      });

      setTimeout(() => sparkle.remove(), duration);
    }
  },
};

/* ===========================
   SCREEN TRANSITIONS
   =========================== */
const ScreenManager = {
  currentScreen: 'splash',

  show(screenId, direction = 'forward') {
    const current = document.getElementById(this.currentScreen);
    const next = document.getElementById(screenId);

    if (!next || this.currentScreen === screenId) return;

    // Animate out current screen
    if (current) {
      current.style.animation = 'fadeOut 0.3s ease-out forwards';
    }

    // Prepare next screen
    next.style.display = 'block';
    next.style.opacity = '0';
    next.style.animation = 'fadeIn 0.4s ease-out 0.3s forwards';

    // Update bottom nav
    this.updateBottomNav(screenId);

    setTimeout(() => {
      if (current) current.style.display = 'none';
      this.currentScreen = screenId;
    }, 300);
  },

  updateBottomNav(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    const navMap = {
      dashboard: 0,
      play: 1,
      leaderboard: 2,
      wallet: 3,
      profile: 4,
    };

    const index = navMap[screenId];
    if (index !== undefined && navItems[index]) {
      navItems[index].classList.add('active');
    }
  },
};

/* ===========================
   MAIN APP CONTROLLER
   =========================== */
const App = {
  init() {
    ParticleSystem.init();
    this.bindEvents();
    this.checkSession();

    // Hide splash after delay
    setTimeout(() => {
      const splash = document.getElementById('splash');
      if (splash && splash.classList.contains('active')) {
        this.hideSplash();
      }
    }, 2500);
  },

  hideSplash() {
    const splash = document.getElementById('splash');
    const landing = document.getElementById('landing');

    if (splash) {
      splash.style.animation = 'fadeOut 0.5s ease-out forwards';
    }

    setTimeout(() => {
      if (splash) splash.style.display = 'none';
      if (landing) landing.classList.add('active');
    }, 500);
  },

  bindEvents() {
    const telegramLoginBtn = document.getElementById('telegramLoginBtn');
    if (telegramLoginBtn) {
      telegramLoginBtn.addEventListener('click', () => this.telegramLogin());
    }

    // Add pulse effect to buttons
    document.querySelectorAll('.glow-btn, .mode-btn, .choice-btn').forEach(btn => {
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.95)';
      });
      btn.addEventListener('mouseup', () => {
        btn.style.transform = '';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
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

        // Show loading state
        const loginBtn = document.querySelector('.glow-btn');
        if (loginBtn) {
          loginBtn.innerHTML = '<span class="btn-text">CONNECTING...</span>';
          loginBtn.disabled = true;
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
          if (loginBtn) {
            loginBtn.innerHTML = '<span class="btn-text">ENTER THE VERSE</span><span class="btn-glow"></span>';
            loginBtn.disabled = false;
          }
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
    const splash = document.getElementById('splash');
    const landing = document.getElementById('landing');
    const dashboard = document.getElementById('dashboard');

    if (splash) splash.style.display = 'none';
    if (landing) landing.style.display = 'none';
    if (dashboard) {
      dashboard.classList.add('active');
      this.updateDashboardUI();
    }

    ScreenManager.currentScreen = 'dashboard';
  },

  updateDashboardUI() {
    if (!currentWarrior) return;

    const mimEl = document.getElementById('mimBalance');
    const vusdtEl = document.getElementById('vusdtBalance');
    const skillScoreEl = document.getElementById('skillScore');
    const warriorNameEl = document.getElementById('warriorName');
    const rankEl = document.getElementById('rankDisplay');
    const winRateEl = document.getElementById('winRateDisplay');
    const gamesPlayedEl = document.getElementById('gamesPlayed');
    const totalWinsEl = document.getElementById('totalWins');
    const profileWinRateEl = document.getElementById('profileWinRate');
    const currentStreakEl = document.getElementById('currentStreak');

    if (mimEl) AnimatedCounter.animate(mimEl, currentWarrior.mimBalance || 0, 800);
    if (vusdtEl) AnimatedCounter.animate(vusdtEl, currentWarrior.vusdtBalance || 0, 800);
    if (skillScoreEl) AnimatedCounter.animate(skillScoreEl, currentWarrior.skillScore || 0, 800);

    if (warriorNameEl) {
      warriorNameEl.textContent = currentWarrior.displayName || 'Warrior';
    }

    if (rankEl) rankEl.textContent = `#${currentWarrior.rank || '--'}`;
    if (winRateEl) winRateEl.textContent = `${currentWarrior.winRate || 0}%`;

    if (gamesPlayedEl) AnimatedCounter.animate(gamesPlayedEl, currentWarrior.gamesPlayed || 0, 600);
    if (totalWinsEl) AnimatedCounter.animate(totalWinsEl, currentWarrior.totalWins || 0, 600);
    if (profileWinRateEl) AnimatedCounter.animate(profileWinRateEl, currentWarrior.winRate || 0, 600, '', '%');
    if (currentStreakEl) AnimatedCounter.animate(currentStreakEl, currentWarrior.winStreak || 0, 600);
  },

  logout() {
    localStorage.removeItem('skillverse_token');
    localStorage.removeItem('skillverse_warrior');
    authToken = null;
    currentWarrior = null;

    const dashboard = document.getElementById('dashboard');
    const landing = document.getElementById('landing');

    if (dashboard) dashboard.classList.remove('active');
    if (landing) {
      landing.style.display = 'block';
      landing.classList.add('active');
    }

    ScreenManager.currentScreen = 'landing';
  },
};

/* ===========================
   API SERVICE
   =========================== */
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

/* ===========================
   ROUTER
   =========================== */
const Router = {
  screens: {},

  register(name, elementId, showFn) {
    this.screens[name] = { elementId, showFn };
  },

  show(name) {
    Object.keys(this.screens).forEach(key => {
      const screen = document.getElementById(this.screens[key].elementId);
      if (screen) {
        screen.classList.remove('active');
        screen.style.display = 'none';
      }
    });

    const target = this.screens[name];
    if (target) {
      const element = document.getElementById(target.elementId);
      if (element) {
        element.style.display = 'block';
        element.classList.add('active');
        if (target.showFn) target.showFn();
      }
    }

    ScreenManager.currentScreen = name;
  },
};

/* ===========================
   RPS GAME LOGIC
   =========================== */
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

  getEmoji(choice) {
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    return emojis[choice] || choice;
  },
};

/* ===========================
   GAME CONTROLLER
   =========================== */
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

        // Update opponent name
        const opponentNameEl = document.getElementById('opponentName');
        if (opponentNameEl) {
          opponentNameEl.textContent = opponentType === 'ai' ? 'AI' : 'Player';
        }
      }
    } catch (error) {
      alert('Failed to create match');
    }
  },

  makeChoice(choice) {
    if (!currentMatch) return;

    const result = RPS.play(choice);
    this.roundResult = result;

    // Disable all buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.choice === choice) {
        btn.classList.add('selected');
      }
    });

    // Show result with animation
    const roundResultEl = document.getElementById('roundResult');
    if (roundResultEl) {
      roundResultEl.innerHTML = `
        <div class="result-display">
          <div class="player-choice">You: ${RPS.getEmoji(choice)}</div>
          <div class="opponent-choice">AI: ${RPS.getEmoji(result.opponentChoice)}</div>
          <div class="result-text ${result.result}">${result.result.toUpperCase()}</div>
        </div>
      `;
    }

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
    const skillScoreEl = document.getElementById('rewardSkillScore');
    const mimEl = document.getElementById('rewardMim');

    if (result.result === 'win') {
      if (icon) icon.textContent = '🏆';
      if (title) {
        title.textContent = 'Victory!';
        title.style.background = 'linear-gradient(135deg, #00ff88, #00bfff)';
        title.style.webkitBackgroundClip = 'text';
      }
      if (message) message.textContent = 'You dominated the battle!';
    } else if (result.result === 'draw') {
      if (icon) icon.textContent = '🤝';
      if (title) {
        title.textContent = 'Draw!';
        title.style.background = 'linear-gradient(135deg, #ffaa00, #ff6600)';
        title.style.webkitBackgroundClip = 'text';
      }
      if (message) message.textContent = 'Great minds think alike!';
    } else {
      if (icon) icon.textContent = '💔';
      if (title) {
        title.textContent = 'Defeat';
        title.style.background = 'linear-gradient(135deg, #ff0044, #ff6600)';
        title.style.webkitBackgroundClip = 'text';
      }
      if (message) message.textContent = 'Better luck next time!';
    }

    if (skillScoreEl) AnimatedCounter.animate(skillScoreEl, rewards.skillScore, 800, '+');
    if (mimEl) AnimatedCounter.animate(mimEl, rewards.mim, 800, '+');

    // Add sparkle effect
    if (result.result === 'win') {
      setTimeout(() => {
        const victoryIcon = document.getElementById('victoryIcon');
        if (victoryIcon) SparkleEffect.create(victoryIcon, 20);
      }, 300);
    }

    Router.show('victory');
    App.updateDashboardUI();
  },

  async claimDailyReward() {
    try {
      const response = await API.post('/wallet/daily-reward');
      if (response.success) {
        // Create sparkle effect
        const rewardCard = document.querySelector('.reward-card');
        if (rewardCard) {
          SparkleEffect.create(rewardCard, 15);
        }

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
};

/* ===========================
   LEADERBOARD CONTROLLER
   =========================== */
const Leaderboard = {
  async load(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    if (activeTab) activeTab.classList.add('active');

    const content = document.getElementById('leaderboardContent');
    if (content) {
      content.innerHTML = `
        <div class="loading-state">
          <div class="energy-ring small">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
          <p>Loading rankings...</p>
        </div>
      `;
    }

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
      if (content) {
        content.innerHTML = '<div class="error-state">Failed to load leaderboard</div>';
      }
    }
  },

  render(data) {
    const content = document.getElementById('leaderboardContent');
    if (!content) return;

    if (!data || data.length === 0) {
      content.innerHTML = '<div class="empty-state">No data available</div>';
      return;
    }

    content.innerHTML = data.map((item, index) => {
      const rankClass = index < 3 ? 'top' : '';
      const isCurrentUser = item.warrior_id === currentWarrior?.warriorId;
      const highlightClass = isCurrentUser ? 'highlight' : '';
      const staggerClass = 'stagger-item';

      return `
        <div class="leaderboard-item ${highlightClass} ${staggerClass}" style="animation-delay: ${index * 0.05}s">
          <div class="rank ${rankClass}">#${item.rank || index + 1}</div>
          <div class="player-info">
            <div class="player-name">${item.display_name}</div>
            <div class="player-details">${this.getDetails(item)}</div>
          </div>
        </div>
      `;
    }).join('');
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

/* ===========================
   WALLET CONTROLLER
   =========================== */
const Wallet = {
  async load() {
    try {
      const [walletRes, historyRes] = await Promise.all([
        API.get('/wallet'),
        API.get('/wallet/history?limit=20'),
      ]);

      if (walletRes.success) {
        const mimEl = document.getElementById('walletMim');
        const vusdtEl = document.getElementById('walletVusdt');

        if (mimEl) AnimatedCounter.animate(mimEl, walletRes.data.mim_balance || 0, 800);
        if (vusdtEl) AnimatedCounter.animate(vusdtEl, walletRes.data.vusdt_balance || 0, 800);
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
    if (!list) return;

    if (!transactions || transactions.length === 0) {
      list.innerHTML = '<div class="empty-state">No transactions yet</div>';
      return;
    }

    list.innerHTML = transactions.map((tx, index) => `
      <div class="transaction-item stagger-item" style="animation-delay: ${index * 0.05}s">
        <div class="tx-info">
          <div class="tx-type">${tx.type.replace(/_/g, ' ')}</div>
          <div class="tx-date">${new Date(tx.created_at).toLocaleDateString()}</div>
        </div>
        <div class="tx-amount ${tx.type.includes('reward') || tx.type.includes('claim') ? 'positive' : 'negative'}">
          ${tx.type.includes('reward') || tx.type.includes('claim') ? '+' : '-'}${tx.amount} ${tx.currency}
        </div>
      </div>
    `).join('');
  },
};

/* ===========================
   PROFILE CONTROLLER
   =========================== */
const Profile = {
  async load() {
    try {
      const [profileRes, statsRes] = await Promise.all([
        API.get('/warrior/profile'),
        API.get('/warrior/stats'),
      ]);

      if (profileRes.success) {
        const p = profileRes.data;
        const nameEl = document.getElementById('profileName');
        const idEl = document.getElementById('profileId');

        if (nameEl) nameEl.textContent = p.display_name || 'Warrior';
        if (idEl) idEl.textContent = `ID: #${p.warrior_id}`;
      }

      if (statsRes.success) {
        const s = statsRes.data;
        const winsEl = document.getElementById('profileWins');
        const lossesEl = document.getElementById('profileLosses');
        const drawsEl = document.getElementById('profileDraws');
        const winRateEl = document.getElementById('profileWinRate');

        if (winsEl) AnimatedCounter.animate(winsEl, s.total_wins || 0, 600);
        if (lossesEl) AnimatedCounter.animate(lossesEl, s.total_losses || 0, 600);
        if (drawsEl) AnimatedCounter.animate(drawsEl, s.total_draws || 0, 600);
        if (winRateEl) AnimatedCounter.animate(winRateEl, s.win_rate || 0, 600, '', '%');
      }
    } catch (error) {
      console.error('Profile load error:', error);
    }
  },
};

/* ===========================
   INITIALIZATION
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  Router.register('dashboard', 'dashboard', () => {
    App.updateDashboardUI();
    CountdownTimer.start('countdownTimer', 4, 32, 15);
  });
  Router.register('play', 'play', () => Game.reset());
  Router.register('leaderboard', 'leaderboard', () => Leaderboard.load('skillscore'));
  Router.register('wallet', 'wallet', () => Wallet.load());
  Router.register('profile', 'profile', () => Profile.load());
  Router.register('dailyReward', 'dailyReward', () => {});
  Router.register('victory', 'victoryScreen', () => {});
});

/* Add fadeOut animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
