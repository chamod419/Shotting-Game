const gameContainer = document.getElementById('gameContainer');
const gun = document.getElementById('gun');
const scoreSpan = document.getElementById('score');
const levelSpan = document.getElementById('level');

let score = 0;
let level = 1;
let bullets = [];
let enemies = [];
let enemySpeed = 0.5;
let bulletSpeed = 5;
let isGameOver = false;
let gunPosition = gameContainer.offsetWidth / 2 - gun.offsetWidth / 2;

// Initialize gun position
gun.style.left = `${gunPosition}px`;

// Move gun with arrow keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && gunPosition > 0) {
        gunPosition -= 20;
        gun.style.left = `${gunPosition}px`;
    } else if (e.key === 'ArrowRight' && gunPosition < gameContainer.offsetWidth - gun.offsetWidth) {
        gunPosition += 20;
        gun.style.left = `${gunPosition}px`;
    } else if (e.key === ' ') {
        fireBullet(gunPosition + gun.offsetWidth / 2 - 2.5, gun.offsetTop);
    }
});

// Fire bullets
function fireBullet(x, y) {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
}

// Create enemies
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.random() * (gameContainer.offsetWidth - 40)}px`;
    enemy.style.top = '0px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

// Update positions
function update() {
    if (isGameOver) return;

    bullets.forEach((bullet, index) => {
        bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;
        if (bullet.offsetTop < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.style.top = `${enemy.offsetTop + enemySpeed}px`;
        if (enemy.offsetTop > gameContainer.offsetHeight) {
            gameOver();
        }

        bullets.forEach((bullet, bulletIndex) => {
            if (isColliding(bullet, enemy)) {
                enemy.remove();
                bullet.remove();
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                updateScore();
            }
        });
    });

    if (enemies.length < level * 2) {
        createEnemy();
    }

    requestAnimationFrame(update);
}

// Check collision
function isColliding(bullet, enemy) {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    return !(
        bulletRect.top > enemyRect.bottom ||
        bulletRect.bottom < enemyRect.top ||
        bulletRect.left > enemyRect.right ||
        bulletRect.right < enemyRect.left
    );
}

// Update score and level
function updateScore() {
    score += 10;
    scoreSpan.textContent = score;
    if (score % 100 === 0) {
        level += 1;
        levelSpan.textContent = level;
        enemySpeed += 1;
    }
}

// Game over
function gameOver() {
    isGameOver = true;
    alert('Game Over! Final Score: ' + score);
}

// Start game
update();
