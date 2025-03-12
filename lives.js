import { playerPos } from "./game.js";
import { spooks } from "./spooks.js";
import { enoughIsEnough } from "./stopGame.js";

let playerLives = 5;
const livesCounter = document.getElementById("lives");

export function decreaseLives() {
  if (playerLives > 0) {
    playerLives--;
  }
  updateLivesCounter(); // Update the counter after losing a life
  
  if (playerLives === 0) {
    console.log("I'm done")
    requestAnimationFrame(() => {
      enoughIsEnough();
    });
  }
  
}

export function updateLivesCounter() {
  livesCounter.textContent = `${playerLives}`;
  document.getElementById("lives").textContent =
    playerLives > 0 ? "❤️".repeat(playerLives) : "🫶🏼";
}

export function isAtSamePosition(playerPos, spookPos) {
  return playerPos.row === spookPos.row && playerPos.col === spookPos.col;
}
export function checkSpookyHug() {
  spooks.forEach((spook) => {
    if (isAtSamePosition(playerPos, spook.position)) {
      decreaseLives();
    }
  });
}
