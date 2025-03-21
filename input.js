import {
  running,
  paused,
  togglePaused,
  startGame,
  placeBomb,
} from "./states.js";
import {
  activateSpooksOneByOne,
  entities /*player, spook, bomb, explosion, door, /*floor , destructible */,
} from "./game.js";
import { resumeTimer, pauseTimer } from "./timer.js";

export function listenForKeys() {
  document.addEventListener("keydown", (e) => {
    console.log(`Key pressed: ${e.key}`);
    switch (e.key) {
      case "Enter":
        if (!running) startGame();
        break;
      case "Escape":
          pauseTimer();
          togglePaused();
          cancelAnimationFrame(activateSpooksOneByOne);
          if (confirm("Are you sure you want to quit the current game?")) {
            location.reload();
          } else {
            togglePaused(); // Toggle the paused state
            resumeTimer(); // Resume the timer
          }
        break;
      case " ":
        if (running) {
          e.preventDefault(); // Prevent scrolling
          if (paused) {
            togglePaused(); // Toggle the paused state
            resumeTimer(); // Resume the timer
          } else {
            cancelAnimationFrame(activateSpooksOneByOne);

            pauseTimer(); // Pause the timer
            togglePaused(); // Toggle the paused state
          }
        }
        break;
      case "x":
      case "X":
        if (running && !paused)
          placeBomb(entities.player.row, entities.player.col);
        break;
      default:
        if (
          running &&
          !paused &&
          entities.player.row >= 1 &&
          entities.player.row <= 17 &&
          entities.player.col >= 1 &&
          entities.player.col <= 17
        ) {
          //console.log(`Player position before move: row=${entities.player.row}, col=${entities.player.col}`);
          switch (e.key) {
            case "ArrowUp":
              e.preventDefault();
              entities.player.move(-1, 0);
              break;
            case "ArrowDown":
              e.preventDefault();
              entities.player.move(1, 0);
              break;
            case "ArrowLeft":
              e.preventDefault();
              entities.player.move(0, -1);
              entities.player.element.style.transform = "scaleX(-1)"; // Flip the image horizontally
              break;
            case "ArrowRight":
              e.preventDefault();
              entities.player.move(0, 1);
              entities.player.element.style.transform = "scaleX(1)"; // Reset to normal orientation
              break;
          }
          // console.log(`Player position after move: row=${entities.player.row}, col=${entities.player.col}`);
        }
        break;
    }
  });
}
