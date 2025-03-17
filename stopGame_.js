import { listenForKeydown, gameLoopFrame } from "./game.js";
import { spawnInterval, spooks } from "./spooks.js";
import { timerFrame } from "./timer.js";

export let gameOver = false;
// Stop the game by clearing intervals and stopping the loop
export function enoughIsEnough() {
  if (gameOver) return;

  gameOver = true;

  if (spawnInterval) {
    clearInterval(spawnInterval);
    console.log("Spook spawn interval cleared");
  }

  if (timerFrame) {
    cancelAnimationFrame(timerFrame); // Clear the timer interval
    console.log("Timer is cleared");
  }

  if (gameLoopFrame) {
    cancelAnimationFrame(gameLoopFrame); // Cancel the game loop frame
    console.log("Game loop frame cleared");
  }

  spooks.forEach((spook) => {
    spook.element.remove(); // Remove all spooks from the game board
  });

  // Disable key
  document.removeEventListener("keydown", listenForKeydown);

  alert("Game over! Do you want to try once again?");
  location.reload(); // refresh the page
  console.log("Reload the page");
}
