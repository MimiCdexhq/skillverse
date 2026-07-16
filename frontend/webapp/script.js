/* ===========================
   SKILLVERSE V1
=========================== */

const API_BASE = 'http://localhost:3000';
let accessToken = localStorage.getItem('skillverse_token');
let currentWarrior = null;

const tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
  tg.expand();
  tg.enableClosingConfirmation();
}

function showDashboard() {
  document.getElementById('main').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
}

function showError(message) {
  const el = document.getElementById('auth-error');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  } else {
    alert(message);
  }
}

async function fetchWithAuth(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function loadWarriorProfile() {
  try {
    const data = await fetchWithAuth('/warrior/profile');
    currentWarrior = data.warrior;
    updateDashboard();
    showDashboard();
  } catch (err) {
    localStorage.removeItem('skillverse_token');
    accessToken = null;
    showError(err.message);
  }
}

function updateDashboard() {
  if (!currentWarrior) return;
  document.querySelector('.dash-header h2').textContent = `⚔️ SkillVerse`;
  document.querySelector('.dash-header p').textContent = `Welcome Back, ${currentWarrior.displayName}`;
  document.querySelector('.wallet-card:nth-child(1) h1').textContent = currentWarrior.mimBalance;
  document.querySelector('.wallet-card:nth-child(2) h1').textContent = currentWarrior.vUSDTBalance;
  document.querySelector('.wallet-card:nth-child(3) h1').textContent = currentWarrior.skillScore;
}

async function telegramLogin() {
  if (!tg || !tg.initData) {
    showError('Please open SkillVerse from inside Telegram.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: tg.initData }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    accessToken = data.token;
    localStorage.setItem('skillverse_token', accessToken);
    currentWarrior = data.warrior;
    updateDashboard();
    showDashboard();
    tg.MainButton.hide();
  } catch (err) {
    showError(err.message);
  }
}

function handleEnter() {
  if (accessToken) {
    loadWarriorProfile();
  } else {
    telegramLogin();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const enter = document.querySelector('.enter');
  if (enter) {
    enter.addEventListener('click', handleEnter);
  }

  const telegramBtn = document.querySelector('.telegram');
  if (telegramBtn) {
    telegramBtn.addEventListener('click', telegramLogin);
  }

  const playButton = document.querySelector('.play-now');
  if (playButton) {
    playButton.onclick = () => {
      document.getElementById('dashboard').style.display = 'none';
      document.getElementById('playScreen').style.display = 'block';
    };
  }

  if (tg && tg.MainButton) {
    tg.MainButton.setText('Login with Telegram');
    tg.MainButton.show();
    tg.MainButton.onClick(telegramLogin);
  }

  if (accessToken) {
    loadWarriorProfile();
  }
});

// Create Moving Stars
const stars = document.getElementById("stars");
for (let i = 0; i < 120; i++) {
  const star = document.createElement("div");
  star.style.position = "absolute";
  star.style.width = Math.random() * 3 + "px";
  star.style.height = star.style.width;
  star.style.background = "white";
  star.style.borderRadius = "50%";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.opacity = Math.random();
  star.style.animation = `twinkle ${2 + Math.random() * 4}s infinite`;
  stars.appendChild(star);
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes twinkle{
  0%{opacity:.2;transform:scale(1);}
  50%{opacity:1;transform:scale(1.5);}
  100%{opacity:.2;transform:scale(1);}
}
`;
document.head.appendChild(style);

setTimeout(() => {
  const splash = document.getElementById("splash");
  splash.style.transition = "1s";
  splash.style.opacity = "0";
  setTimeout(() => {
    splash.style.display = "none";
  }, 1000);
}, 2500);
