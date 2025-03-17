import { playerPos } from "./game.js";
import { spooks } from "./spooks.js";
import { enoughIsEnough, gameOver } from "./stopGame.js";

let playerLives = 5;
const livesCounter = document.getElementById("lives");
let player = document.getElementById("player");

export function decreaseLives() {
  blink(player);

  if (playerLives > 0) {
    playerLives--;
  }
  updateLivesCounter(); // Update the counter after losing a life

  if (playerLives === 0) {
    console.log("I'm done");
    setTimeout(() => {
      enoughIsEnough();
    }, 100);
  }
}

function updateLivesCounter() {
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

export function blink(entity) {
  entity.classList.add("blink");

  // Remove the blink class after the animation ends
  entity.addEventListener(
    "animationend",
    () => {
      entity.classList.remove("blink");
    },
    { once: true }
  );
}
