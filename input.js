import { map, running, paused, startGame, placeBomb } from "./states.js";
import { player, spook, bomb, explosion, door, floor } from "./game.js";

export function listenForKeys() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      startGame();
    } else if (e.key === "Escape") {
      quitGame();
    } else if (e.key === " ") {
      e.preventDefault(); // Prevent spacebar from scrolling the page
      togglePause();
    } else if (!paused && running) {
      handleGameControls(e);
    }
  });
}
// Handle movement and actions only if the game is running
function handleGameControls(e) {
  let rowChange = 0;
  let colChange = 0;

  if (e.key === "ArrowUp") {
    rowChange = -1;
    e.preventDefault(); // Prevent scrolling the page
  }
  if (e.key === "ArrowDown") {
    rowChange = 1;
    e.preventDefault(); // Prevent scrolling the page
  }
  if (e.key === "ArrowLeft") {
    colChange = -1;
    e.preventDefault(); // Prevent scrolling the page
  }
  if (e.key === "ArrowRight") {
    colChange = 1;
    e.preventDefault(); // Prevent scrolling the page
  }

  // Ensure the new position is within the map boundaries
  const newRow = player.row + rowChange;
  const newCol = player.col + colChange;

  if (newRow >= 0 && newRow < 17 && newCol >= 0 && newCol < 17) {
    if (map[newRow][newCol] === 0 || map[newRow][newCol] === 3) {
      player.move(rowChange, colChange);

      // Check if the player has moved to the door's position
      if (map[newRow][newCol] === 3) {
        winGame();
      }
    }
  }

  if (e.key === "x" || e.key === "X") {
    placeBomb(player.row, player.col);
  }
}
