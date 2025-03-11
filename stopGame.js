import { handleKeyPress , gameLoopFrame, spookyHugInterval } from './game.js'
import { spawnInterval, spooks } from './spooks.js'
import { timerInterval } from './timer.js';

// Stop the game by clearing intervals and stopping the loop
export function enoughIsEnough() {
    if (spawnInterval) {
        clearInterval(spawnInterval);
        console.log("Spook spawn interval cleared")
    }

    if (spookyHugInterval) {
        clearInterval(spookyHugInterval);
        console.log("SpookyHug interval cleared")
    }
    
    if (timerInterval) {
        clearInterval(timerInterval); // Clear the timer interval
        console.log("Timer interval cleared");
    }
    
    if (gameLoopFrame) {
        cancelAnimationFrame(gameLoopFrame); // Cancel the game loop frame
        console.log("Game loop frame cleared");
    }

      spooks.forEach(spook => {
        spook.element.remove(); // Remove all spooks from the game board
    });
    
      // Disable key
      document.removeEventListener("keydown", handleKeyPress);
    
      alert("Game over! Do you want to try once again?");
      location.reload(); // refresh the page
      console.log("Reload the page");
    }
