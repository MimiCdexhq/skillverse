/* ===========================
   SKILLVERSE V1
=========================== */

// Create Moving Stars
const stars = document.getElementById("stars");
if (stars) {
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
}

// Add Animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes twinkle{
0%{opacity:.2;transform:scale(1);}
50%{opacity:1;transform:scale(1.5);}
100%{opacity:.2;transform:scale(1);}
}
`;
document.head.appendChild(style);

// Splash Screen
setTimeout(() => {
  const splash = document.getElementById("splash");
  if (splash) {
    splash.style.transition = "1s";
    splash.style.opacity = "0";
    setTimeout(() => { splash.style.display = "none"; }, 1000);
  }
}, 2500);

/* ===========================
   NAVIGATION WIRING
=========================== */
function showScreen(id) {
  ["main", "dashboard", "playScreen", "matchScreen"].forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    if (s === "matchScreen") { el.classList.add("hidden"); }
    else { el.style.display = "none"; }
  });
  const target = document.getElementById(id);
  if (!target) return;
  if (id === "matchScreen") { target.classList.remove("hidden"); }
  else { target.style.display = "block"; }
}

// ENTER THE VERSE -> Dashboard
document.addEventListener("click", (e) => {
  if (e.target.closest(".enter")) {
    showScreen("dashboard");
  }
  // PLAY NOW -> Select Match
  if (e.target.closest(".play-now")) {
    showScreen("matchScreen");
  }
});

/* ===========================
   SELECT MATCH interactions
=========================== */
document.querySelectorAll(".m-action").forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    const labels = { pvp: "Finding a rival player", ai: "Starting AI battle", private: "Creating private match" };
    const original = ({ pvp: "FIND MATCH", ai: "PLAY AI", private: "CREATE MATCH" })[mode];
    btn.textContent = "SEARCHING...";
    btn.disabled = true;
    setTimeout(() => {
      alert(labels[mode] + " — match flow coming next!");
      btn.textContent = original;
      btn.disabled = false;
    }, 1500);
  });
});

// Bottom nav active toggle
document.querySelectorAll(".m-bottomnav .nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".m-bottomnav .nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
