const gameArea = document.getElementById("gameArea"); // 🔧 CORREGIDO
const startBtn = document.getElementById("startGame");
const pauseBtn = document.getElementById("pauseGame");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("gameMessage");
const difficultyBtns = document.querySelectorAll("[data-difficulty]");

let score = 0;
let time = 60;
let timerInterval = null;
let gameInterval = null;
let isRunning = false;

/* CONFIG POR DIFICULTAD */
let gameConfig = { spawn: 800, minFall: 4, maxFall: 6 };

const difficulties = {
  easy:   { spawn: 900, minFall: 4, maxFall: 6 },
  medium: { spawn: 650, minFall: 3, maxFall: 5 },
  hard:   { spawn: 400, minFall: 2, maxFall: 4 }
};

/* CREAR CORAZÓN */
function createHeart() {
  const heart = document.createElement("div");
  const rand = Math.random();

  if (rand < 0.7) {
    heart.textContent = "💗";
    heart.dataset.value = 1;
  } else if (rand < 0.9) {
    heart.textContent = "💖";
    heart.dataset.value = 5;
  } else {
    heart.textContent = "💔";
    heart.dataset.value = -2;
  }

  heart.className = "heart-drop";
  heart.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
  heart.style.top = "-40px";

  const duration =
    Math.random() * (gameConfig.maxFall - gameConfig.minFall) +
    gameConfig.minFall;

  heart.style.animationDuration = duration + "s";

heart.onclick = (e) => {
  const value = parseInt(heart.dataset.value);
  score += value;

  const rect = gameArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  showFloatingScore(x, y, value);
  burstEffect(x, y);

  if (value === 5) {
    glowConsole();
  }

   if (value >0 ) {
    soundGood.currentTime = 0;
    soundGood.play();
  }

  if (value < 0) {
    shakeConsole();
    soundBad.currentTime = 0;
    soundBad.play();
  }

  heart.remove();
};


  gameArea.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

/* INICIAR */
function startGame() {
  if (isRunning) return;

  score = 0;
  time = 60;
  timeEl.textContent = "60s";
  messageEl.textContent = "";
  gameArea.innerHTML = "";

  isRunning = true;
  startBtn.disabled = true;

  gameInterval = setInterval(createHeart, gameConfig.spawn);

  timerInterval = setInterval(() => {
    time--;
    timeEl.textContent = `${time}s`;
    if (time <= 0) endGame();
  }, 1000);
}

/* PAUSAR */
function pauseGame() {
  if (!isRunning) return;

  clearInterval(gameInterval);
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
}

/* FIN */
function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;

  messageEl.textContent = `Recolectaste ${score} corazones 💕`;
}

/* DIFICULTAD */
difficultyBtns.forEach(btn => {
  btn.onclick = () => {
    gameConfig = difficulties[btn.dataset.difficulty];
    difficultyBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});

/* EVENTOS */
startBtn.onclick = startGame;
pauseBtn.onclick = pauseGame;


/* ===============================
   SONIDO
================================ */

const soundGood = new Audio("/src/pop-402324.mp3");   // 💗 💖
const soundBad  = new Audio("/src/error-011-352286.mp3"); // 💔

soundGood.volume = 0.4;
soundBad.volume = 0.5;

let soundEnabled = true;

soundToggle.onclick = () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔈" : "🔇";
};

function playSound(sound) {
  if (!soundEnabled) return;
  sound.currentTime = 0;
  sound.volume = 0.4;
  sound.play();
}


const gameConsole = document.querySelector(".game-console");

/* +1 / +5 flotante */
function showFloatingScore(x, y, value) {
  const el = document.createElement("div");
  el.className = "floating-score";
  el.textContent = value > 0 ? `+${value}` : value;

  if (value < 0) el.classList.add("negative");

  el.style.left = x + "px";
  el.style.top = y + "px";

  gameArea.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

/* Explosión */
function burstEffect(x, y) {
  for (let i = 0; i < 4; i++) {
    const b = document.createElement("div");
    b.className = "heart-burst";
    b.style.left = x + "px";
    b.style.top = y + "px";
    gameArea.appendChild(b);
    setTimeout(() => b.remove(), 600);
  }
}

/* Glow consola */
function glowConsole() {
  gameConsole.classList.add("glow");
  setTimeout(() => gameConsole.classList.remove("glow"), 300);
}

/* Shake consola */
function shakeConsole() {
  gameConsole.classList.add("shake");
  setTimeout(() => gameConsole.classList.remove("shake"), 250);
}
