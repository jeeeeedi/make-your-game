import { callTheSpooks, spooks, movingSpooks } from "./spooks.js";
import { decreaseLives, isAtSamePosition, blink } from "./lives.js";
import {
  quitGame,
  startGame,
  togglePause,
  winGame,
  gamePaused,
  gameStarted,
} from "./stateMgr.js";

export const gameBoard = document.getElementById("game-board");

let xp = document.getElementById("xp");

// Player starts at the center
export let playerPos = { row: 8, col: 8 };

// Listen for key presses
export let listenForKeydown = document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startGame();
  } else if (e.key === "Escape") {
    quitGame();
  } else if (e.key === " ") {
    e.preventDefault(); // Prevent spacebar from scrolling the page
    togglePause();
  } else if (!gamePaused && gameStarted) {
    handleGameControls(e);
  }
});

// Handle movement and actions only if the game is running
function handleGameControls(e) {
  let newRow = playerPos.row;
  let newCol = playerPos.col;

  if (e.key === "ArrowUp") {
    newRow--;
    e.preventDefault(); // Prevent scrolling the page
  }
  if (e.key === "ArrowDown") {
    newRow++;
    e.preventDefault(); // Prevent scrolling the page
  }
  if (e.key === "ArrowLeft") {
    newCol--;
    e.preventDefault(); // Prevent scrolling the page
  }
  if (e.key === "ArrowRight") {
    newCol++;
    e.preventDefault(); // Prevent scrolling the page
  }

  // Ensure the new position is within the map boundaries
  if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
    if (map[newRow][newCol] === 0 || map[newRow][newCol] === 3) {
      playerPos.row = newRow;
      playerPos.col = newCol;
      updatePlayerPosition();

      // Check if the player has moved to the door's position
      if (map[newRow][newCol] === 3) {
        winGame();
      }
    }
  }

  if (e.key === "x" || e.key === "X") {
    placeBomb(playerPos.row, playerPos.col);
  }
}

export const tileSize = 40;
export const gridSize = 17;
export let gameLoopFrame;

// Function to generate a random game map object
export function generateMap() {
  let map = Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, col) => {
      if (
        row === 0 ||
        col === 0 ||
        row === gridSize - 1 ||
        col === gridSize - 1
      ) {
        return 1; // Border walls
      }
      if (row % 2 === 0 && col % 2 === 0) {
        return 1; // Fixed walls
      }
      return 0; // Default floor
    })
  );

  // Ensure the player's starting position is a floor
  map[8][8] = 0;

  let numBricks = 40;
  let brickPositions = [];
  let placed = 0;

  while (placed < numBricks) {
    let randRow = Math.floor(Math.random() * (gridSize - 2)) + 1;
    let randCol = Math.floor(Math.random() * (gridSize - 2)) + 1;

    // Prevent bricks from spawning on the player’s start position
    if (map[randRow][randCol] === 0 && !(randRow === 8 && randCol === 8)) {
      map[randRow][randCol] = 2; // Mark as destructible
      brickPositions.push({ row: randRow, col: randCol });
      placed++;
    }
  }

  // Randomly select a brick to hide the door
  let hiddenDoor =
    brickPositions[Math.floor(Math.random() * brickPositions.length)];
  console.log(
    `HINT: Door is at row ${hiddenDoor.row}, column ${hiddenDoor.col}`
  );
  // Mark the hidden door position in the map
  map[hiddenDoor.row][hiddenDoor.col] = 3; // 3 represents a destructible brick with a hidden door

  return { map, hiddenDoor };
}

export let { map, hiddenDoor } = generateMap();

const player = document.getElementById("player");
/* const player = document.createElement("div");
player.classList.add("player");
player.textContent = "😇";
gameBoard.appendChild(player); */

let frameIndex = 0;
const totalFrames = 6; // Number of frames in the sprite sheet
const frameWidth = 100; // Width of each frame
let frameCounter = 0;
const frameSpeed = 10; // Control speed (higher = slower)

function animateSprite() {
  frameCounter++;

// Only change frame when frameCounter reaches frameSpeed
if (frameCounter >= frameSpeed) {
  frameIndex = (frameIndex + 1) % totalFrames;
  const offsetX = frameIndex * frameWidth;
  player.style.backgroundPosition = `-${offsetX}px 0`;
  
  frameCounter = 0; // Reset counter
}
  
  requestAnimationFrame(animateSprite);
}

animateSprite();

//creates the divs for the game board
export function createMap() {
  gameBoard.textContent = "";

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");

      if (map[row][col] === 1) {
        tile.classList.add("wall");
      } else if (map[row][col] === 2) {
        tile.classList.add("destructible");
      } else if (map[row][col] === 3) {
        tile.classList.add("destructible");
      } else {
        tile.classList.add("floor");
      }

      tile.dataset.row = row;
      tile.dataset.col = col;
      gameBoard.appendChild(tile);
    }
  }

  gameBoard.appendChild(player); // Ensure player stays on top
}

createMap();

// Instead of relying on left and top for movement, use transform: translate3d(x, y, z), which leverages the GPU for rendering.
export function updatePlayerPosition() {
  player.style.transform = `translate(${playerPos.col * tileSize}px, ${
    playerPos.row * tileSize
  }px)`;
}

updatePlayerPosition();

// Change 3 to any number of spooks you want

let bombs = [];

function placeBomb(row, col) {
  // Only place bombs on empty tiles (this includes destroyed bricks and floors)
  if (map[row][col] !== 0) return; // Skip if not a floor tile (0)

  const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (!tile) return;

  //tile.classList.add("bomb");
  //tile.style.opacity = "100%";
  tile.textContent = "💣"; // Set bomb emoji on the tile
  blink(tile);
  // Store the bomb's placement time
  bombs.push({ row, col, placedAt: performance.now() });
}

function explodeBomb() {
  const currentTime = performance.now();
  const explosionTimeLimit = 1000; // Bomb explodes after 1 second

  bombs = bombs.filter((bomb) => {
    if (currentTime - bomb.placedAt >= explosionTimeLimit) {
      explode(bomb.row, bomb.col);
      return false; // Remove the bomb from the list after explosion
    }
    return true; // Keep bombs that haven't exploded yet
  });
}

function explode(row, col) {
  const explosionTiles = [
    { row, col }, // Center
    { row: row - 1, col }, // Up
    { row: row + 1, col }, // Down
    { row, col: col - 1 }, // Left
    { row, col: col + 1 }, // Right
    { row: row - 1, col: col - 1 }, // Up-Left
    { row: row - 1, col: col + 1 }, // Up-Right
    { row: row + 1, col: col - 1 }, // Down-Left
    { row: row + 1, col: col + 1 }, // Down-Right
  ];

  const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (tile) {
    tile.textContent = "💥"; // Show explosion emoji at bomb's location
    tile.classList.add("explosion");
    blink(tile);
  }

  // Handle surrounding tiles
  explosionTiles.forEach(({ row, col }) => {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const tile = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (!tile) return;

      // If player is caught in the explosion, decrease lives
      if (isAtSamePosition({ row, col }, playerPos)) {
        decreaseLives();
      }

      // If a spook is hit, remove it and add 30 XP
      spooks.filter((spook) => {
        if (isAtSamePosition({ row, col }, spook.position)) {
          xp.textContent = parseInt(xp.textContent) + 30; // 30xp per spook
          blink(spook.element);
          spook.element.style.opacity = "0"; // Fade out the spook
        }
      });

      // Only destroy destructible tiles (not permanent walls)
      if (map[row][col] === 2) {
        blink(tile);
        //tile.style.opacity = "0"; // Fade destructible bricks
        map[row][col] = 0; // Mark it as destroyed
        tile.classList.replace("destructible", "floor"); // Change the class to floor
        //tile.classList.add("floor"); // Keep it as a floor tile
        xp.textContent = parseInt(xp.textContent) + 10; // 10xp per brick
      } else if (map[row][col] === 3) {
        // If the hidden door is destroyed, reveal it
        tile.textContent = "🚪"; // Show door emoji
        tile.classList.remove("destructible");
        tile.classList.add("door"); // Keep it as a door tile
        xp.textContent = parseInt(xp.textContent) + 50; // 50xp for revealing a door
      } else if (map[row][col] === 0 || map[row][col] === 1) {
        return; // Skip if it's a floor or wall
      }
    }
  });

  // Now, remove explosion after animation is done using requestAnimationFrame
  function clearExplosion(timestamp) {
    // You can ensure that the explosion stays for a certain amount of time (e.g., 500ms)
    if (timestamp - lastFrameTime > 500) {
      const tile = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (tile) {
        tile.textContent = ""; // Clear explosion emoji
        tile.classList.remove("bomb", "explosion"); // Remove bomb and explosion classes to remove the layer tile.floor.bomb
      }
    } else {
      requestAnimationFrame(clearExplosion); // Continue until the explosion is done
    }
  }

  // Start the animation loop to clear the explosion after 500ms
  let lastFrameTime = performance.now();
  requestAnimationFrame(clearExplosion);
}

function gameLoop() {
  // Call explodeBomb to check if any bombs need to explode
  explodeBomb();

  // Continuously request the next frame
  gameLoopFrame = requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoopFrame = requestAnimationFrame(gameLoop);
