const gameBoard = document.getElementById("game-board");

const tileSize = 40;
const gridSize = 17;

function generateMap() {
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

  map[8][8] = 0;

  let numBricks = 40;
  let brickPositions = [];
  let placed = 0;

  while (placed < numBricks) {
    let randRow = Math.floor(Math.random() * (gridSize - 2)) + 1;
    let randCol = Math.floor(Math.random() * (gridSize - 2)) + 1;

    if (map[randRow][randCol] === 0 && !(randRow === 8 && randCol === 8)) {
      map[randRow][randCol] = 2;
      brickPositions.push({ row: randRow, col: randCol });
      placed++;
    }
  }

  let hiddenDoor = brickPositions[Math.floor(Math.random() * brickPositions.length)];
  map[hiddenDoor.row][hiddenDoor.col] = 3;

  return { map, hiddenDoor };
}

let { map, hiddenDoor } = generateMap();

const player = document.createElement("div");
player.classList.add("player");
player.textContent = "😇";
gameBoard.appendChild(player);

function createMap() {
  gameBoard.textContent = "";

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (map[row][col] === 1) {
        const wall = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        wall.setAttribute("x", col * tileSize);
        wall.setAttribute("y", row * tileSize);
        wall.setAttribute("width", tileSize);
        wall.setAttribute("height", tileSize);
        wall.setAttribute("fill", "gray");
        wall.setAttribute("stroke", "black");
        gameBoard.appendChild(wall);
      }
    }
  }
}

createMap();


function updatePlayerPosition() {
  player.style.transform = `translate3d(${playerPos.col * tileSize}px, ${
    playerPos.row * tileSize
  }px, 0)`;
}

function destroyBrick(row, col) {
  if (map[row][col] === 2 || map[row][col] === 3) {
    const tile = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (!tile) return;

    tile.style.opacity = "0.3"; // Fade effect for destructible tile

    // If this was the hidden door, show it after destruction
    if (map[row][col] === 3) {
      tile.classList.remove("destructible"); // Remove the destructible class
      tile.classList.add("door");
      tile.textContent = "🚪"; // Show door emoji
      tile.style.opacity = "100%"; // Ensure door is fully visible
    } else {
      tile.classList.remove("destructible"); // Remove the destructible class
      tile.classList.add("floor"); // Ensure it stays a floor
      tile.textContent = ""; // Remove any content from the tile
      tile.style.opacity = "100%"; // Ensure full visibility after destruction
    }

    map[row][col] = 0; // Change brick to floor
  }
}

document.addEventListener("keydown", (e) => {
  let newRow = playerPos.row;
  let newCol = playerPos.col;

  if (e.key === "ArrowUp") newRow--;
  if (e.key === "ArrowDown") newRow++;
  if (e.key === "ArrowLeft") newCol--;
  if (e.key === "ArrowRight") newCol++;

  if (map[newRow][newCol] === 0) {
    playerPos.row = newRow;
    playerPos.col = newCol;
    updatePlayerPosition();
  }

  if (e.key === "x") {
    placeBomb(playerPos.row, playerPos.col);
  }
});

createMap();
updatePlayerPosition();

let bombs = [];
let lastBombPlacedTime = 0; // Track the time bomb was placed

function placeBomb(row, col) {
  // Only place bombs on empty tiles (this includes destroyed bricks and floors)
  if (map[row][col] !== 0) return; // Skip if not a floor tile (0)

  const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (!tile) return;

  tile.classList.add("bomb");
  tile.style.opacity = "100%";
  tile.textContent = "💣"; // Set bomb emoji on the tile

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
  ];

  const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (tile) {
    tile.textContent = "💥"; // Show explosion emoji at bomb's location
    tile.classList.add("explosion");
  }

  // Handle surrounding destructible bricks
  explosionTiles.forEach(({ row, col }) => {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const tile = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (!tile) return;

      // Only destroy destructible tiles (not permanent walls)
      if (map[row][col] === 2) {
        tile.style.opacity = "0"; // Fade destructible bricks
        map[row][col] = 0; // Mark it as destroyed
        tile.classList.remove("destructible");
        tile.classList.add("floor"); // Keep it as a floor tile
      } else if (map[row][col] === 3) {
        // If the hidden door is destroyed, reveal it
        tile.textContent = "🚪"; // Show door emoji
        tile.classList.remove("destructible");
        tile.classList.add("door"); // Keep it as a door tile
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
        tile.innerText = ""; // Clear explosion emoji
        tile.classList.remove("explosion"); // Remove the explosion class
      }
    } else {
      requestAnimationFrame(clearExplosion); // Continue until the explosion is done
    }
  }

  // Start the animation loop to clear the explosion after 500ms
  lastFrameTime = performance.now();
  requestAnimationFrame(clearExplosion);
}

function gameLoop() {
  // Call explodeBomb to check if any bombs need to explode
  explodeBomb();

  // Continuously request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
