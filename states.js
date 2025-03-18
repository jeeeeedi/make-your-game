import { player, spook, bomb, explosion, door, floor } from "./game.js";
import { listenForKeys } from "./input.js";
import { callTheSpooks, spooks, movingSpooks } from "./spooks.js";

import { decreaseLives, isAtSamePosition, blink } from "./lives.js";
import {
  quitGame,
  /* startGame, */
  togglePause,
  winGame,
  gamePaused,
  gameStarted,
} from "./stateMgr.js";

export const gameBoard = document.getElementById("game-board");

let xp = document.getElementById("xp");

//initialize game states
export let running = false;
export let paused = false;

export const tileSize = 40;
export const gridSize = 17;
export let gameLoopFrame;

export function startGame() {
  if (running && !paused) return;

  running = true;
  paused = false;

  player.activate();
  player.updatePosition(9, 9);

  //addDestructibles();
  //assignDoorPosition();
  listenForKeys();
  //door.activate();
  console.log("STATUS: startGame. running: ", running, " | paused: ", paused);
}

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
      floor.id = `destructible${built + 1}`;
      floor.classList.add("destructible");
      floor.classList.remove("floor");
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

let bombs = [];

export function placeBomb(row, col) {
  // Only place bombs on empty tiles (this includes destroyed bricks and floors)
  if (map[row][col] !== 0) return;

  bomb.activate();
  bomb.updatePosition(row, col);
  blink(bomb.element);
  bombs.push(bomb);
  explodeBomb();
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
  explosion.activate();
  explosion.updatePosition(row, col);
  blink(explosion.element);

  const explosionTiles = [
    { row, col }, // Center
    { row: row - 1, col }, // Up
    { row: row + 1, col }, // Down
    { row, col: col - 1 }, // Left
    { row, col: col + 1 }, // Right
  ];

  explosionTiles.forEach(({ row, col }) => {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const tile = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (!tile) return;

      // If player is caught in the explosion, decrease lives
      if (player.collide({ row, col }, player)) {
        decreaseLives();
      }

      // If a spook is hit, deactivate it and add XP
      spooks.forEach((spook) => {
        if (isAtSamePosition({ row, col }, spook)) {
          xp.textContent = parseInt(xp.textContent) + 30; // 30xp per spook
          spook.deactivate();
        }
      });

      // Only destroy destructible tiles (not permanent walls)
      if (map[row][col] === 2) {
        map[row][col] = 0; // Mark it as destroyed
        tile.classList.replace("destructible", "floor");
        xp.textContent = parseInt(xp.textContent) + 10; // 10xp per brick
      } else if (map[row][col] === 3) {
        // If the hidden door is destroyed, reveal it
        door.updatePosition(row, col);
        door.activate();
        xp.textContent = parseInt(xp.textContent) + 50; // 50xp for revealing a door
      }
    }
  });
}

function gameLoop() {
  explodeBomb();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
