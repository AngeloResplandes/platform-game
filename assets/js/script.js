const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const platforms = document.getElementsByClassName('platform');
const ground = document.getElementById('ground');
let playerSpeed = 7;
let jumpHeight = 21;
let gravity = 1;
let isJumping = false;
let isDescending = false; // Variável para verificar se o jogador está descendo
let velocityY = 0;
let keys = {};

// Inicialização da posição do jogador
const groundHeight = ground.clientHeight; // Altura do chão a partir do elemento ground
player.style.left = '200px';
player.style.top = (gameArea.clientHeight - groundHeight - player.clientHeight) + 'px';

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function gameLoop() {
  // Movimento lateral
  let newLeft = parseInt(player.style.left);
  if (keys['a']) {
    newLeft -= playerSpeed;
  }
  if (keys['d']) {
    newLeft += playerSpeed;
  }

  // Verificar colisão com as extremidades esquerda e direita
  if (newLeft < 0) {
    newLeft = 0;
  }
  if (newLeft + player.clientWidth > gameArea.clientWidth) {
    newLeft = gameArea.clientWidth - player.clientWidth;
  }

  player.style.left = newLeft + 'px';

  // Pulo
  if (keys[' '] && !isJumping) {
    isJumping = true;
    velocityY = -jumpHeight;
  }

  // Descer da plataforma
  if (keys['s']) {
    isDescending = true;
  } else {
    isDescending = false;
  }

  // Gravidade
  velocityY += gravity;
  player.style.top = (parseInt(player.style.top) + velocityY) + 'px';

  // Verificar colisão com o chão
  if (parseInt(player.style.top) >= (gameArea.clientHeight - groundHeight - player.clientHeight)) {
    isJumping = false;
    velocityY = 0;
    player.style.top = (gameArea.clientHeight - groundHeight - player.clientHeight) + 'px';
  } else {
    // Verificar colisão com plataformas
    let onPlatform = false;
    for (let platform of platforms) {
      let platformRect = platform.getBoundingClientRect();
      let playerRect = player.getBoundingClientRect();

      if (playerRect.left < platformRect.right &&
        playerRect.right > platformRect.left &&
        playerRect.bottom <= platformRect.bottom + velocityY &&
        playerRect.bottom >= platformRect.top &&
        playerRect.top < platformRect.top &&
        velocityY >= 0 &&
        !isDescending) {
        isJumping = false;
        velocityY = 0;
        player.style.top = (platformRect.top - playerRect.height) + 'px';
        onPlatform = true;
        break;
      }
    }

    // Se o jogador não estiver em nenhuma plataforma, continuar caindo
    if (!onPlatform && !isJumping) {
      isJumping = true;
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
