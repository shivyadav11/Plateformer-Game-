const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// === AUDIO ===
const bgMusic = document.getElementById("bgMusic");
const coinSound = document.getElementById("coinSound");
const jumpSound = document.getElementById("jumpSound");
const gameoverSound = document.getElementById("gameoverSound");

// Start background music after first user interaction
let bgMusicStarted = false;
function startBgMusic() {
  if (!bgMusicStarted) {
    bgMusic.play().catch(() => {
      console.log("User interaction required to play music");
    });
    bgMusicStarted = true;
  }
}
document.addEventListener("click", startBgMusic, { once: true });
document.addEventListener("keydown", startBgMusic, { once: true });
document.addEventListener("touchstart", startBgMusic, { once: true });

// === PLAYER CONFIG ===
const player = {
  x: 50, y: 400,
  width: 40, height: 40,
  color: "#e74c3c",
  dx: 0, dy: 0,
  speed: 6,
  gravity: 0.6,
  jumpPower: -15,
  grounded: false,
  alive: true,
  score: 0
};

let currentLevel = 0;

const levels = [
  {
    platforms: [
      {x: 0, y: 460, width: 900, height: 40},
      {x: 200, y: 360, width: 120, height: 20},
      {x: 400, y: 280, width: 120, height: 20},
    ],
    coins: [
      {x: 220, y: 330, radius: 12, collected: false},
      {x: 430, y: 250, radius: 12, collected: false},
    ],
    enemies: [
      {x: 300, y: 430, width: 35, height: 35, dx: 2}
    ]
  },
  {
    platforms: [
      {x: 0, y: 460, width: 900, height: 40},
      {x: 180, y: 340, width: 150, height: 20},
      {x: 380, y: 250, width: 150, height: 20},
      {x: 600, y: 150, width: 120, height: 20},
    ],
    coins: [
      {x: 200, y: 310, radius: 12, collected: false},
      {x: 420, y: 220, radius: 12, collected: false},
      {x: 630, y: 120, radius: 12, collected: false},
    ],
    enemies: [
      {x: 250, y: 430, width: 35, height: 35, dx: 2},
      {x: 600, y: 430, width: 35, height: 35, dx: -2}
    ]
  },
  {
    platforms: [
      {x: 0, y: 460, width: 900, height: 40},
      {x: 150, y: 380, width: 120, height: 20},
      {x: 350, y: 300, width: 120, height: 20},
      {x: 550, y: 220, width: 120, height: 20},
      {x: 750, y: 140, width: 120, height: 20},
    ],
    coins: [
      {x: 170, y: 350, radius: 12, collected: false},
      {x: 370, y: 270, radius: 12, collected: false},
      {x: 570, y: 190, radius: 12, collected: false},
      {x: 770, y: 110, radius: 12, collected: false},
    ],
    enemies: [
      {x: 200, y: 430, width: 35, height: 35, dx: 2},
      {x: 500, y: 430, width: 35, height: 35, dx: -2},
      {x: 700, y: 430, width: 35, height: 35, dx: 2}
    ]
  },
  {
    platforms: [
      {x: 0, y: 460, width: 900, height: 40},
      {x: 250, y: 380, width: 120, height: 20},
      {x: 450, y: 300, width: 120, height: 20},
      {x: 650, y: 200, width: 120, height: 20},
    ],
    coins: [
      {x: 270, y: 350, radius: 12, collected: false},
      {x: 470, y: 270, radius: 12, collected: false},
      {x: 670, y: 170, radius: 12, collected: false},
    ],
    enemies: [
      {x: 350, y: 430, width: 35, height: 35, dx: 3},
      {x: 600, y: 430, width: 35, height: 35, dx: -2}
    ]
  },
  {
    platforms: [
      {x: 0, y: 460, width: 900, height: 40},
      {x: 100, y: 360, width: 150, height: 20},
      {x: 300, y: 280, width: 150, height: 20},
      {x: 500, y: 200, width: 150, height: 20},
      {x: 700, y: 120, width: 150, height: 20},
    ],
    coins: [
      {x: 120, y: 330, radius: 12, collected: false},
      {x: 320, y: 250, radius: 12, collected: false},
      {x: 520, y: 170, radius: 12, collected: false},
      {x: 720, y: 90, radius: 12, collected: false},
    ],
    enemies: [
      {x: 250, y: 430, width: 35, height: 35, dx: 2},
      {x: 450, y: 430, width: 35, height: 35, dx: -2},
      {x: 650, y: 430, width: 35, height: 35, dx: 3}
    ]
  },
  ...Array.from({length: 15}, (_, i) => {
  const plat1Y = 400 - (i % 4) * 40;
  const plat2Y = 320 - (i % 3) * 40;
  const plat3Y = 220 - (i % 2) * 40;
  const plat4Y = 140; // top platform

  const platforms = [
    {x: 0, y: 460, width: 900, height: 40},
    {x: 100 + (i * 20), y: plat1Y, width: 140, height: 20},
    {x: 300 + (i * 10), y: plat2Y, width: 140, height: 20},
    {x: 550, y: plat3Y, width: 140, height: 20},
    {x: 750, y: plat4Y, width: 140, height: 20}
  ];

  const coins = [
    {x: 120 + (i*15), y: plat1Y - 30, radius: 12, collected: false},
    {x: 340 + (i*10), y: plat2Y - 30, radius: 12, collected: false},
    {x: 570, y: plat3Y - 30, radius: 12, collected: false},
    {x: 770, y: plat4Y - 30, radius: 12, collected: false},
  ];

  const enemies = [
    {x: 200 + (i*10), y: 430, width: 35, height: 35, dx: 2 + (i*0.3)},
    {x: 500, y: 430, width: 35, height: 35, dx: -2 - (i*0.2)},
    {x: 700, y: 430, width: 35, height: 35, dx: 2 + (i*0.4)}
  ]

  return {platforms, coins, enemies};
}) 
];

let platforms = JSON.parse(JSON.stringify(levels[currentLevel].platforms));
let coins = JSON.parse(JSON.stringify(levels[currentLevel].coins));
let enemies = JSON.parse(JSON.stringify(levels[currentLevel].enemies));

// === CONTROLS ===
const keys = { left: false, right: false, jump: false };
document.addEventListener("keydown", e => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW") {
    if (player.grounded) jumpSound.play();
    keys.jump = true;
  }
  if (e.code === "KeyR" && !player.alive) restartGame();
});
document.addEventListener("keyup", e => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
  if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW") keys.jump = false;
});

// On-screen buttons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

[leftBtn, rightBtn, jumpBtn].forEach(btn => {
  btn.addEventListener("mousedown", () => {
    if (btn === leftBtn) keys.left = true;
    if (btn === rightBtn) keys.right = true;
    if (btn === jumpBtn && player.grounded) { jumpSound.play(); keys.jump = true; }
  });
  btn.addEventListener("mouseup", () => {
    if (btn === leftBtn) keys.left = false;
    if (btn === rightBtn) keys.right = false;
    if (btn === jumpBtn) keys.jump = false;
    // if (btn=== jumpBtn) keys.upper/lower = false ;
  });
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    if (btn === leftBtn) keys.left = true;
    if (btn === rightBtn) keys.right = true;
    if (btn === jumpBtn && player.grounded) { jumpSound.play(); keys.jump = true; }
  });
  btn.addEventListener("touchend", e => {
    e.preventDefault();
    if (btn === leftBtn) keys.left = false;
    if (btn === rightBtn) keys.right = false;
    if (btn === jumpBtn) keys.jump = false;
  });
});

// === PLAYER LOGIC ===
function updatePlayer() {
  if (!player.alive) return;

  player.dx = keys.left ? -player.speed : keys.right ? player.speed : 0;
  if (keys.jump && player.grounded) { player.dy = player.jumpPower; player.grounded = false; }
  player.dy += player.gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Platform collision
  player.grounded = false;
  for (let p of platforms) {
    if (player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y + player.height >= p.y &&
        player.y + player.height <= p.y + player.dy + 1) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  }

  // Coins
  let allCollected = true;
  for (let c of coins) {
    if (!c.collected) {
      allCollected = false;
      const dist = Math.hypot(player.x + player.width/2 - c.x, player.y + player.height/2 - c.y);
      if (dist < player.width/2 + c.radius) { c.collected = true; player.score += 10; coinSound.play(); }
    }
  }
  if (allCollected) nextLevel();

  // Enemy collision
  for (let e of enemies) {
    if (player.x < e.x + e.width &&
        player.x + player.width > e.x &&
        player.y < e.y + e.height &&
        player.y + player.height > e.y) {
      player.alive = false;
      bgMusic.pause();
      gameoverSound.play();
    }
  }

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) { player.alive = false; bgMusic.pause(); gameoverSound.play(); }
}

// === LEVEL FUNCTIONS ===
function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) { alert("🎉 Congratulations! You completed all levels!"); restartGame(); return; }
  platforms = JSON.parse(JSON.stringify(levels[currentLevel].platforms));
  coins = JSON.parse(JSON.stringify(levels[currentLevel].coins));
  enemies = JSON.parse(JSON.stringify(levels[currentLevel].enemies));
  player.x = 50; player.y = 400; player.dy = 0;

  // Increase difficulty slightly
  player.gravity += 0.02; // more gravity per level
}

// === RESTART ===
function restartGame() {
  currentLevel = 0;
  player.x = 50; player.y = 400; player.dy = 0;
  player.alive = true; player.score = 0;
  player.gravity = 0.6;
  platforms = JSON.parse(JSON.stringify(levels[currentLevel].platforms));
  coins = JSON.parse(JSON.stringify(levels[currentLevel].coins));
  enemies = JSON.parse(JSON.stringify(levels[currentLevel].enemies));
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => { console.log("User interaction required to play music"); });
}

// === ENEMY UPDATE ===
function updateEnemies() { for (let e of enemies) { e.x += e.dx; if (e.x <=0 || e.x + e.width >= canvas.width) e.dx*=-1; } }

// === DRAW ===
function drawPlayer() { ctx.fillStyle = player.color; ctx.beginPath(); ctx.roundRect(player.x, player.y, player.width, player.height, 8); ctx.fill(); }
function drawPlatforms() { ctx.fillStyle = "#8e5b3a"; for (let p of platforms) ctx.fillRect(p.x, p.y, p.width, p.height); }
function drawCoins() { for (let c of coins) if(!c.collected){ const gradient=ctx.createRadialGradient(c.x,c.y,3,c.x,c.y,c.radius); gradient.addColorStop(0,"yellow"); gradient.addColorStop(1,"gold"); ctx.fillStyle=gradient; ctx.beginPath(); ctx.arc(c.x,c.y,c.radius,0,Math.PI*2); ctx.fill(); } }
function drawEnemies() { ctx.fillStyle="#2c3e50"; for (let e of enemies){ ctx.beginPath(); ctx.roundRect(e.x,e.y,e.width,e.height,6); ctx.fill(); } }
function drawScore(){ ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+player.score,20,30); ctx.fillText("Level: "+(currentLevel+1),120,30); }
function drawGameOver(){ ctx.fillStyle="rgba(0,0,0,0.7)"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle="white"; ctx.font="40px Arial"; ctx.fillText("GAME OVER",canvas.width/2-120,canvas.height/2-20); ctx.font="20px Arial"; ctx.fillText("Press R to Restart",canvas.width/2-90,canvas.height/2+20); }

// === GAME LOOP ===
function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(player.alive){
    updatePlayer(); updateEnemies(); drawPlatforms(); drawCoins(); drawEnemies(); drawPlayer(); drawScore();
  } else {
    drawPlatforms(); drawCoins(); drawEnemies(); drawPlayer(); drawScore(); drawGameOver();
  }
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
