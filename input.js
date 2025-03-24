import {
  running,
  paused,
  startGame,
} from "./states.js";
import {
  entities,
} from "./game.js";
import { placeBomb } from "./explosions.js";

export function listenForKeys() {

  // Game control keys (not movement)
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "x":
      case "X":
        if (running && !paused) {
          placeBomb(entities.player.row, entities.player.col);
        }
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
        }
        break;
    }
  });
}