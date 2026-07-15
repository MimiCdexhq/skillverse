/* ===========================
   SKILLVERSE V1 - Main JS
   =========================== */

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : '';

let currentWarrior = null;
let authToken = localStorage.getItem('skillverse_token');
let selectedMode = 'practice';
let selectedStake = 500;
let battleTimer = null;
let countdownTimer = null;

// Initialize Telegram Web App
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
}

// Create Moving Stars
const stars = document.getElementById('stars');
for (let i = 0; i < 120; i++) {
  const star = document.createElement('div');
  star.style.position = 'absolute';
  star.style.width = Math.random() * 3 + 'px';
  star.style.height = star.style.width;
  star.style.background = 'white';
  star.style.borderRadius = '50%';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.opacity = Math.random();
  star.style.animation = `twinkle ${2 + Math.random() * 4}s infinite`;
  stars.appendChild(star);
}

// Splash Screen
setTimeout(() => {
  const splash = document.getElementById('splash');
  splash.style.transition = '1s';
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.style.display = 'none';
  }, 1000);
}, 2500);

// Navigation
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId)?.classList.add('active');
  
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const navItems = document.querySelectorAll(`.nav-item[data-target="${screenId}"]`);
  navItems.forEach(item => item.classList.add('active'));
}

document.querySelectorAll('.nav-item, .back-btn, .menu-item').forEach(el => {
  el.addEventListener('click', () => {
    const target = el.dataset.target;
    if (target) showScreen(target);
  });
});

document.getElementById('enterBtn')?.addEventListener('click', () => {
  showScreen('home');
  if (authToken) loadDashboard();
});

document.getElementById('playNowBtn')?.addEventListener('click', () => {
  showScreen('play');
});

document.getElementById('telegramLogin')?.addEventListener('click', handleTelegramLogin);

// Telegram Login
async function handleTelegramLogin() {
  if (!tg || !tg.initDataUnsafe?.user) {
    alert('Please open this app from Telegram');
    return;
  }
  
  const user = tg.initDataUnsafe.user;
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: user.id,
        username: user.username || `warrior_${user.id}`,
        firstName: user.first_name || 'Warrior',
        lastName: user.last_name || ''
      })
    });
    
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('skillverse_token', authToken);
      currentWarrior = data.warrior;
      showScreen('home');
      loadDashboard();
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

// API Helper
async function apiCall(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers
    }
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (response.status === 401) {
    localStorage.removeItem('skillverse_token');
    authToken = null;
    showScreen('landing');
    return null;
  }
  
  return response.json();
}

// Load Dashboard
async function loadDashboard() {
  const profile = await apiCall('/warrior/profile');
  if (!profile) return;
  
  currentWarrior = profile;
  document.getElementById('mimBalance').textContent = profile.mim_balance || 0;
  document.getElementById('vusdtBalance').textContent = profile.vusdt_balance || 0;
  document.getElementById('skillScore').textContent = profile.skill_score || 0;
  document.getElementById('welcomeText').textContent = `Welcome, ${profile.display_name || 'Warrior'}`;
}

// Play Screen - Mode Selection
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMode = btn.dataset.mode;
  });
});

// Play Screen - Stake Selection
document.querySelectorAll('.stake-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stake-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedStake = parseInt(btn.dataset.stake);
  });
});

// Find Match
document.getElementById('findMatchBtn')?.addEventListener('click', async () => {
  if (!authToken) {
    alert('Please login first');
    showScreen('landing');
    return;
  }
  
  showScreen('loading');
  document.getElementById('loadingText').textContent = 'Finding match...';
  
  try {
    const result = await apiCall('/match/create', {
      method: 'POST',
      body: JSON.stringify({
        stake: selectedStake,
        gameType: 'rps',
        mode: selectedMode
      })
    });
    
    if (result) {
      showScreen('battle');
      startBattle();
    }
  } catch (error) {
    console.error('Find match error:', error);
    showScreen('play');
    alert('Failed to find match. Please try again.');
  }
});

// Battle Logic
function startBattle() {
  let countdown = 3;
  const countdownEl = document.getElementById('countdown');
  const controlsEl = document.getElementById('battleControls');
  const timerEl = document.getElementById('battleTimer');
  
  countdownEl.style.display = 'block';
  controlsEl.style.display = 'none';
  timerEl.style.display = 'none';
  
  document.getElementById('playerChoice').textContent = '';
  document.getElementById('opponentChoice').textContent = '';
  
  countdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownEl.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      countdownEl.style.display = 'none';
      controlsEl.style.display = 'flex';
      startBattleTimer();
    }
  }, 1000);
}

function startBattleTimer() {
  let timeLeft = 10;
  const timerEl = document.getElementById('battleTimer');
  timerEl.style.display = 'block';
  timerEl.textContent = timeLeft;
  
  battleTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(battleTimer);
      resolveBattle(null);
    }
  }, 1000);
}

document.querySelectorAll('.battle-choice').forEach(btn => {
  btn.addEventListener('click', () => {
    if (battleTimer) {
      clearInterval(battleTimer);
    }
    resolveBattle(btn.dataset.choice);
  });
});

function resolveBattle(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const opponentChoice = choices[Math.floor(Math.random() * 3)];
  
  document.getElementById('playerChoice').textContent = getEmoji(playerChoice);
  document.getElementById('opponentChoice').textContent = getEmoji(opponentChoice);
  
  const result = determineWinner(playerChoice, opponentChoice);
  
  setTimeout(() => {
    showResults(result, playerChoice, opponentChoice);
  }, 1000);
}

function getEmoji(choice) {
  const map = { rock: '✊', paper: '✋', scissors: '✌️' };
  return map[choice] || '❓';
}

function determineWinner(player, opponent) {
  if (player === opponent) return 'draw';
  if (
    (player === 'rock' && opponent === 'scissors') ||
    (player === 'paper' && opponent === 'rock') ||
    (player === 'scissors' && opponent === 'paper')
  ) {
    return 'win';
  }
  return 'loss';
}

function showResults(result, playerChoice, opponentChoice) {
  const badge = document.getElementById('resultBadge');
  const title = document.getElementById('resultTitle');
  const message = document.getElementById('resultMessage');
  const skillScoreEl = document.getElementById('rewardSkillScore');
  const mimEl = document.getElementById('rewardMim');
  const streakEl = document.getElementById('rewardStreak');
  
  if (result === 'win') {
    badge.textContent = '🏆';
    title.textContent = 'VICTORY';
    title.style.color = '#00bfff';
    message.textContent = 'You crushed the opponent!';
    skillScoreEl.textContent = '+10';
    mimEl.textContent = '+10';
  } else if (result === 'draw') {
    badge.textContent = '🤝';
    title.textContent = 'DRAW';
    title.style.color = '#ffd700';
    message.textContent = 'A fierce battle ends in a draw!';
    skillScoreEl.textContent = '+2';
    mimEl.textContent = '+2';
  } else {
    badge.textContent = '💔';
    title.textContent = 'DEFEAT';
    title.style.color = '#ff0044';
    message.textContent = 'Better luck next time!';
    skillScoreEl.textContent = '+0';
    mimEl.textContent = '+1';
  }
  
  const streak = currentWarrior?.win_streak || 0;
  streakEl.textContent = `🔥 ${streak}`;
  
  showScreen('results');
  
  if (authToken) {
    apiCall('/match/result', {
      method: 'POST',
      body: JSON.stringify({
        matchId: Date.now(),
        winnerId: result === 'win' ? currentWarrior.warrior_id : (result === 'draw' ? null : 0),
        player1Choice: playerChoice,
        player2Choice: opponentChoice
      })
    });
    
    if (result === 'win') {
      apiCall('/reward', {
        method: 'POST',
        body: JSON.stringify({ type: 'skillscore', amount: 10 })
      });
    } else if (result === 'draw') {
      apiCall('/reward', {
        method: 'POST',
        body: JSON.stringify({ type: 'skillscore', amount: 2 })
      });
    }
    
    loadDashboard();
  }
}

// Play Again
document.getElementById('playAgainBtn')?.addEventListener('click', () => {
  showScreen('play');
});

// Leaderboard
document.querySelectorAll('.lb-tab').forEach(tab => {
  tab.addEventListener('click', async () => {
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    await loadLeaderboard(tab.dataset.type);
  });
});

async function loadLeaderboard(type) {
  const list = document.getElementById('leaderboardList');
  list.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
  
  const data = await apiCall(`/leaderboard/${type}`);
  if (!data) return;
  
  list.innerHTML = '';
  data.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    
    let rankClass = '';
    if (index === 0) rankClass = 'gold';
    else if (index === 1) rankClass = 'silver';
    else if (index === 2) rankClass = 'bronze';
    
    const score = type === 'skillscore' ? entry.skill_score 
      : type === 'mim' ? entry.mim_balance 
      : type === 'games' ? entry.games_played 
      : entry.win_streak;
    
    item.innerHTML = `
      <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${entry.display_name || entry.username || 'Warrior'}</div>
        <div class="leaderboard-score">${score.toLocaleString()} ${type === 'mim' ? 'MIM' : type === 'skillscore' ? 'SS' : type === 'games' ? 'Games' : 'Streak'}</div>
      </div>
    `;
    
    list.appendChild(item);
  });
}

// Load leaderboard when screen is shown
const leaderboardObserver = new MutationObserver(() => {
  if (document.getElementById('leaderboard').classList.contains('active')) {
    loadLeaderboard('skillscore');
  }
});
leaderboardObserver.observe(document.getElementById('leaderboard'), { attributes: true, attributeFilter: ['class'] });

// Wallet Screen
async function loadWallet() {
  const wallet = await apiCall('/wallet');
  if (!wallet) return;
  
  document.getElementById('walletMim').textContent = (wallet.mim_balance || 0).toLocaleString();
  document.getElementById('walletVusdt').textContent = (wallet.vusdt_balance || 0).toLocaleString();
}

const walletObserver = new MutationObserver(() => {
  if (document.getElementById('wallet').classList.contains('active')) {
    loadWallet();
  }
});
walletObserver.observe(document.getElementById('wallet'), { attributes: true, attributeFilter: ['class'] });

// Profile Screen
async function loadProfile() {
  const profile = await apiCall('/warrior/profile');
  if (!profile) return;
  
  document.getElementById('profileName').textContent = profile.display_name || 'Warrior';
  document.getElementById('profileId').textContent = `ID: #${String(profile.warrior_id).padStart(6, '0')}`;
  document.getElementById('profileLevel').textContent = profile.level || 1;
  document.getElementById('profileRank').textContent = profile.rank || 'Warrior';
  document.getElementById('profileWins').textContent = profile.total_wins || 0;
  document.getElementById('profileLosses').textContent = profile.total_losses || 0;
  document.getElementById('profileDraws').textContent = profile.total_draws || 0;
  document.getElementById('profileGames').textContent = profile.games_played || 0;
  document.getElementById('profileStreak').textContent = profile.win_streak || 0;
  
  const winRate = profile.games_played > 0 
    ? ((profile.total_wins / profile.games_played) * 100).toFixed(1) 
    : 0;
  document.getElementById('profileWinRate').textContent = `${winRate}%`;
  
  const joinDate = new Date(profile.join_date).toLocaleDateString();
  document.getElementById('profileJoinDate').textContent = joinDate;
}

const profileObserver = new MutationObserver(() => {
  if (document.getElementById('profile').classList.contains('active')) {
    loadProfile();
  }
});
profileObserver.observe(document.getElementById('profile'), { attributes: true, attributeFilter: ['class'] });

// Auto-login check
if (authToken) {
  showScreen('home');
  loadDashboard();
}

// Handle Telegram theme
if (tg?.themeParams) {
  document.body.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#050816');
  document.body.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
  document.body.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#bbbbbb');
  document.body.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#00bfff');
  document.body.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#00bfff');
  document.body.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
  document.body.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#111827');
}

console.log('SkillVerse initialized');
