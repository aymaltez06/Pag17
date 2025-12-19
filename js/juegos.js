/* ===============================
   ELEMENTOS DOM
================================ */
const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startGame");
const pauseBtn = document.getElementById("pauseGame");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("gameMessage");
const difficultyBtns = document.querySelectorAll("[data-difficulty]");
const gameConsole = document.querySelector(".game-console");
const bestScoreEl = document.getElementById("bestScore");

/* JUGADORES */
const playerNameInput = document.getElementById("playerNameInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersList = document.getElementById("playersList");
const rankingList = document.getElementById("rankingList");

/* ===============================
   JUGADORES & RANKING
================================ */
let players = JSON.parse(localStorage.getItem("players")) || [];
let currentPlayer = null;



/* ===============================
   ESTADO DEL JUEGO
================================ */
let score = 0;
let time = 60;
let timerInterval = null;
let gameInterval = null;
let isRunning = false;

let currentDifficulty = null;
let gameConfig = null;

let freneticMode = false;
let freneticTimer = null;
let totalElapsed = 0;

/* BONUS TIEMPO */
let bonusScore = 0;
let firstBonusGiven = false;

/* ===============================
   CONFIG POR DIFICULTAD
================================ */

const difficulties = {
  easy:   { spawn: 900, minFall: 4, maxFall: 6 },
  medium: { spawn: 650, minFall: 3, maxFall: 5 },
  hard:   { spawn: 400, minFall: 2, maxFall: 4 }
};

/* ===============================
   SONIDO
================================ */
const soundGood = new Audio("/src/pop-402324.mp3");
const soundBad  = new Audio("/src/error-011-352286.mp3");

soundGood.volume = 0.4;
soundBad.volume = 0.5;

/* ===============================
   CREAR CORAZÓN
================================ */
function createHeart() {
  const heart = document.createElement("div");
  const rand = Math.random();

  if (currentDifficulty === "hard") {
    if (freneticMode) {
      if (rand < 0.35) {
        heart.textContent = "💎";
        heart.dataset.value = 10;
      } else if (rand < 0.65) {
        heart.textContent = "☠️";
        heart.dataset.value = -15;
      } else if (rand < 0.85) {
        heart.textContent = "💖";
        heart.dataset.value = 5;
      } else {
        heart.textContent = "💔";
        heart.dataset.value = -2;
      }
    } else {
      if (rand < 0.6) {
        heart.textContent = "💗";
        heart.dataset.value = 1;
      } else if (rand < 0.8) {
        heart.textContent = "💖";
        heart.dataset.value = 5;
      } else if (rand < 0.9) {
        heart.textContent = "💎";
        heart.dataset.value = 10;
      } else {
        heart.textContent = "☠️";
        heart.dataset.value = -15;
      }
    }
  } else {
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
    if (value > 0) bonusScore += value;

    const rect = gameArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    showFloatingScore(x, y, value);
    burstEffect(x, y);

    if (value >= 5) glowConsole();
    if (value > 0) soundGood.play();
    if (value < 0) {
      shakeConsole();
      soundBad.play();
    }

    checkBonusTime();
    heart.remove();
  };

  gameArea.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

/* ===============================
   BONUS DE TIEMPO
================================ */
function checkBonusTime() {
  const required = firstBonusGiven ? 60 : 90;

  if (bonusScore >= required) {
    bonusScore -= required;

    if (!firstBonusGiven) {
      time += 30;
      firstBonusGiven = true;
      showTimeBonus(30);
    } else {
      time += 20;
      showTimeBonus(20);
    }

    accelerateGame();
    timeEl.textContent = `${time}s`;
  }
}

function accelerateGame() {
  gameConfig.spawn = Math.max(200, gameConfig.spawn - 60);
  gameConfig.minFall = Math.max(1.5, gameConfig.minFall - 0.3);
  gameConfig.maxFall = Math.max(3, gameConfig.maxFall - 0.3);

  clearInterval(gameInterval);
  gameInterval = setInterval(createHeart, gameConfig.spawn);
}

/* ===============================
   MODO FRENÉTICO
================================ */
function startFreneticMode() {
  freneticMode = true;
  gameConsole.classList.add("frenetic");

  gameConfig.spawn = Math.max(150, gameConfig.spawn - 150);
  gameConfig.minFall = Math.max(1, gameConfig.minFall - 0.8);
  gameConfig.maxFall = Math.max(2, gameConfig.maxFall - 0.8);

  clearInterval(gameInterval);
  gameInterval = setInterval(createHeart, gameConfig.spawn);

  freneticTimer = setTimeout(endFreneticMode, 20000);
}

function endFreneticMode() {
  freneticMode = false;
  gameConsole.classList.remove("frenetic");
}

/* ===============================
   INICIAR / PAUSAR / FIN
================================ */
function startGame() {
  if (!currentPlayer) {
    alert("Selecciona un jugador antes de jugar");
    return;
  }

  if (isRunning) return;

  // 🔥 SI NO ELIGIÓ DIFICULTAD, USAMOS FÁCIL
  if (!currentDifficulty) {
    currentDifficulty = "easy";
    gameConfig = { ...difficulties.easy };
    document.querySelector('[data-difficulty="easy"]').classList.add("active");
  }

  // Reset normal
  score = 0;
  bonusScore = 0;
  time = 60;
  totalElapsed = 0;
  firstBonusGiven = false;
  freneticMode = false;
  clearTimeout(freneticTimer);

  timeEl.textContent = "60s";
  messageEl.textContent = "";
  gameArea.innerHTML = "";

  isRunning = true;
  startBtn.disabled = true;

  gameInterval = setInterval(createHeart, gameConfig.spawn);

  timerInterval = setInterval(() => {
    time--;
    totalElapsed++;
    timeEl.textContent = `${time}s`;

    if (currentDifficulty === "hard" && totalElapsed % 60 === 0 && !freneticMode) {
      startFreneticMode();
    }

    if (time <= 0) endGame();
  }, 1000);
}

function pauseGame() {
  if (!isRunning) return;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;

  if (score > currentPlayer.bestScore) {
    currentPlayer.bestScore = score;
    savePlayers();
  }

  updateBestScoreDisplay();
  renderRanking();

  messageEl.textContent = `Recolectaste ${score} corazones 💕`;
}

/* ===============================
   JUGADORES & RANKING
================================ */
function addPlayer() {
  const name = playerNameInput.value.trim();
  if (!name) return;

  if (players.find(p => p.name === name)) {
    alert("Ese jugador ya existe");
    return;
  }

  players.push({ name, bestScore: 0 });
  savePlayers();
  renderPlayers();
  playerNameInput.value = "";
}

function selectPlayer(name) {
  currentPlayer = players.find(p => p.name === name);
  renderPlayers();
  updateBestScoreDisplay();
}

function renderPlayers() {
  playersList.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.name;
    if (currentPlayer && p.name === currentPlayer.name) {
      li.classList.add("active");
    }
    li.onclick = () => selectPlayer(p.name);
    playersList.appendChild(li);
  });
}

function renderRanking() {
  rankingList.innerHTML = "";
  [...players]
    .sort((a, b) => b.bestScore - a.bestScore)
    .forEach((p, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${i + 1}. ${p.name}</span><span>${p.bestScore}</span>`;
      rankingList.appendChild(li);
    });
}

function updateBestScoreDisplay() {
  bestScoreEl.textContent = currentPlayer ? currentPlayer.bestScore : 0;
}

function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

/* ===============================
   EFECTOS VISUALES
================================ */
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

function glowConsole() {
  gameConsole.classList.add("glow");
  setTimeout(() => gameConsole.classList.remove("glow"), 300);
}

function shakeConsole() {
  gameConsole.classList.add("shake");
  setTimeout(() => gameConsole.classList.remove("shake"), 250);
}

function showTimeBonus(seconds) {
  const bonus = document.createElement("div");
  bonus.className = "time-bonus";
  bonus.textContent = `+${seconds} segundos ⏱️`;
  gameConsole.appendChild(bonus);
  setTimeout(() => bonus.remove(), 1200);
}

/* ===============================
   EVENTOS
================================ */
startBtn.onclick = startGame;
pauseBtn.onclick = pauseGame;
addPlayerBtn.onclick = addPlayer;

/* INIT */
renderPlayers();
renderRanking();
updateBestScoreDisplay();


// Dificultad por defecto

difficultyBtns.forEach(btn => {
  btn.onclick = () => {
    if (isRunning) return;

    currentDifficulty = btn.dataset.difficulty;
    gameConfig = { ...difficulties[currentDifficulty] };

    difficultyBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});
