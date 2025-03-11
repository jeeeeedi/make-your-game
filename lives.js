import { playerPos } from './game.js'; 
import { spooks } from './spooks.js';

let playerLives = 5;
const livesCounter = document.getElementById('lives');

export function decreaseLives() {
  if (playerLives > 0) {
      playerLives--;
      updateLivesCounter(); // Update the counter after losing a energy
  } else {
      alert('Game Over!');
  }
}

export function updateLivesCounter() {
  livesCounter.textContent = `Lives: ${playerLives}`;
  document.getElementById('lives').textContent > 0 ? '❤️'.repeat(playerLives) : '🫶🏼';
}

export function isAtSamePosition(playerPos, spookPos) {
  return playerPos.row === spookPos.row && playerPos.col === spookPos.col;
}
export function checkSpookyHug() {
  spooks.forEach(spook => {
      if (isAtSamePosition(playerPos, spook.position)) {
          decreaseLives();
      }
  });
}