const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;

// Meccaniche Paletta e Proiettili
let paddleHeight = 15;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleIncrements = 0;
const MAX_INCREMENTS = 5;
let ammo = 0; // Contatore proiettili
let bullets = [];

// Pallina
let ballRadius = 8;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

let rightPressed = false;
let leftPressed = false;

let bricks = [];
let powerUps = [];

function initBricks() {
    bricks = [];
    for (let r = 0; r < level; r++) {
        bricks[r] = [];
        let specialLife = Math.floor(Math.random() * brickColumnCount);
        let specialWidth = Math.floor(Math.random() * brickColumnCount);
        while(specialWidth === specialLife) specialWidth = Math.floor(Math.random() * brickColumnCount);

        for (let c = 0; c < brickColumnCount; c++) {
            let type = "normal", color = "", points = 0;
            if (c === specialLife) { type = "life"; color = "#FFFF00"; }
            else if (c === specialWidth) { type = "expand"; color = "#A020F0"; }
            else {
                const rand = Math.random();
                if (rand < 0.33) { color = `rgb(${150 + Math.random()*105}, 0, 0)`; points = 1; }
                else if (rand < 0.66) { color = `rgb(0, ${150 + Math.random()*105}, 0)`; points = 2; }
                else { color = `rgb(0, 0, ${150 + Math.random()*105})`; points = 3; }
            }
            bricks[r][c] = { x: 0, y: 0, status: 1, color, points, type };
        }
    }
}

const brickColumnCount = 8;
const brickHeight = 25;
const brickPadding = 5;
const brickOffsetTop = 50;
const brickOffsetLeft = 10;
const brickWidth = (canvas.width - (brickOffsetLeft * 2)) / brickColumnCount - brickPadding;

document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowUp") {
        if (!gameRunning) {
            gameRunning = true;
        } else if (ammo > 0) {
            fireBullet();
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

function breakBrick(b) {
    b.status = 0;
    score += b.points || 0;
    if (b.type !== "normal") {
        powerUps.push({ x: b.x + brickWidth / 2, y: b.y, type: b.type, dy: 3 });
    }
    if (bricks.every(row => row.every(br => br.status === 0))) {
        if (level < 5) { level++; resetLevel(); }
        else { alert("VITTORIA TOTALE!"); document.location.reload(); }
    }
}

function resetLevel() {
    gameRunning = false;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 4; dy = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    bullets = [];
    initBricks();
}

function drawPowerUps() {
    powerUps.forEach((p, index) => {
        p.y += p.dy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = p.type === "life" ? "#FFFF00" : "#A020F0";
        ctx.fill();
        ctx.closePath();

        if (p.y + 8 > canvas.height - paddleHeight - 10 && p.x > paddleX && p.x < paddleX + paddleWidth) {
            if (p.type === "life") lives++;
            if (p.type === "expand") {
                if (paddleIncrements < MAX_INCREMENTS) {
                    paddleWidth += 30;
                    paddleIncrements++;
                } else {
                    ammo++; // Guadagna un proiettile
                }
            }
            powerUps.splice(index, 1);
        }
    });
}

// ... (Resto delle funzioni drawBall, drawBricks, updateUI simili a prima) ...

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[r][c].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function updateUI() {
    scoreEl.innerText = score;
    livesEl.innerText = lives;
    levelEl.innerText = level;
    // Aggiungiamo un piccolo indicatore per i proiettili nel punteggio se vuoi
    if(ammo > 0) scoreEl.innerText += ` (Proiettili: ${ammo})`;
}

// ... (manteniamo la struttura precedente, aggiorno le funzioni interessate) ...

const ZONE_WIDTH = 30; // Larghezza delle zone ai bordi (aumentata)

function fireBullet() {
    // 25% di probabilità di proiettile perforante (Mega)
    const isMega = Math.random() < 0.25;
    bullets.push({ 
        x: paddleX + paddleWidth / 2, 
        y: canvas.height - 30, 
        dy: -7, 
        isMega: isMega,
        w: isMega ? 10 : 4 // Più grosso se è Mega
    });
    ammo--;
}

function collisionDetection() {
    // Collisione Pallina -> Mattoncini
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            let b = bricks[r][c];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    breakBrick(b);
                }
            }
        }
    }

    // Collisione Proiettili -> Mattoncini
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        let hitSomething = false;

        for (let r = 0; r < bricks.length; r++) {
            for (let c = 0; c < brickColumnCount; c++) {
                let brick = bricks[r][c];
                if (brick.status === 1 && 
                    bullet.x > brick.x && bullet.x < brick.x + brickWidth && 
                    bullet.y > brick.y && bullet.y < brick.y + brickHeight) {
                    
                    breakBrick(brick);
                    hitSomething = true;
                }
            }
        }

        // Se il proiettile NON è Mega e ha colpito, lo rimuoviamo.
        // Se è Mega, continua la sua corsa fino alla fine del canvas.
        if (hitSomething && !bullet.isMega) {
            bullets.splice(i, 1);
        }
    }
}

function drawBullets() {
    bullets.forEach((b, index) => {
        b.y += b.dy;
        ctx.beginPath();
        ctx.rect(b.x - b.w/2, b.y, b.w, 12);
        // Colore diverso per il Mega Proiettile
        ctx.fillStyle = b.isMega ? "#00FFFF" : "#FF0000"; 
        ctx.fill();
        ctx.closePath();
        
        if (b.y < 0) bullets.splice(index, 1);
    });
}

function drawPaddle() {
    let baseColor = "#0095DD";
    if (ammo > 0) baseColor = "#FFD700"; 

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = baseColor;
    ctx.fill();
    ctx.closePath();

    if (paddleIncrements >= MAX_INCREMENTS) {
        ctx.fillStyle = "#FF4500"; 
        // Zone esterne (ZONE_WIDTH ora è 30)
        ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, ZONE_WIDTH, paddleHeight);
        ctx.fillRect(paddleX + paddleWidth - ZONE_WIDTH, canvas.height - paddleHeight - 10, ZONE_WIDTH, paddleHeight);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUps();
    drawBullets();
    collisionDetection();
    updateUI();

    if (gameRunning) {
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
        if (y + dy < ballRadius) dy = -dy;
        else if (y + dy > canvas.height - ballRadius - 10) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                // Rimbalzo speciale se colpisce le zone esterne
                if (paddleIncrements >= MAX_INCREMENTS && (x < paddleX + ZONE_WIDTH || x > paddleX + paddleWidth - ZONE_WIDTH)) {
                    // Angolo casuale tra -7 e 7 per rendere la traiettoria imprevedibile
                    dx = (Math.random() - 0.5) * 14; 
                }
                dy = -dy;
            } else {
                lives--;
                if (!lives) { alert("GAME OVER"); document.location.reload(); }
                else { resetLevel(); }
            }
        }
        x += dx; y += dy;
        if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
        else if (leftPressed && paddleX > 0) paddleX -= 7;
    }
    requestAnimationFrame(draw);
}

// ... (tutte le altre funzioni di supporto rimangono uguali) ...

initBricks();
draw();