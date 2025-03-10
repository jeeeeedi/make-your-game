const gameBoard = document.getElementById("game-board");

const tileSize = 40;
const gridSize = 17;

function generateMap() {
    let map = Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => {
            if (row === 0 || col === 0 || row === gridSize - 1 || col === gridSize - 1) {
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
    let hiddenBrick = brickPositions[Math.floor(Math.random() * brickPositions.length)];

    // Print the door position as a hint
    console.log(`Hint: The door is hidden at row ${hiddenBrick.row}, col ${hiddenBrick.col}`);

    return { map, hiddenDoor: hiddenBrick };
}


let { map, hiddenDoor } = generateMap();


// Player starts at the center
let playerPos = { row: 8, col: 8 };

const player = document.createElement("div");
player.classList.add("player");
player.innerText = "😇";
gameBoard.appendChild(player);

function createMap() {
    gameBoard.innerHTML = "";
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");

            if (map[row][col] === 1) {
                tile.classList.add("wall");
            } else if (map[row][col] === 2) {
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

function updatePlayerPosition() {
    player.style.transform = `translate3d(${playerPos.col * tileSize}px, ${playerPos.row * tileSize}px, 0)`;
}

function destroyBrick(row, col) {
    if (map[row][col] === 2) {
        map[row][col] = 0; // Change brick to floor

        const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        tile.style.opacity = "100"; // Fade effect

        // If this was the hidden door, show it after fade animation
        if (row === hiddenDoor.row && col === hiddenDoor.col) {
            setTimeout(() => {
                tile.innerText = "🚪"; // Show door
                tile.style.opacity = "100"; // Restore opacity
            }, 500);
        }
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

function placeBomb(row, col) {
    if (map[row][col] !== 0) return; // Only place bombs on empty tiles

    const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!tile) return;

    tile.textContent = "💣"; // Set bomb emoji on the tile

    // Trigger explosion after 2 seconds
    setTimeout(() => explodeBomb(row, col), 2000);
}

function explodeBomb(row, col) {
    const explosionTiles = [
        { row, col }, // Center
        { row: row - 1, col }, // Up
        { row: row + 1, col }, // Down
        { row, col: col - 1 }, // Left
        { row, col: col + 1 }  // Right
    ];

    explosionTiles.forEach(({ row, col }) => {
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!tile) return;

            tile.textContent = "💥"; // Set explosion emoji

            // Handle destructible bricks
            if (map[row][col] === 2) {
                tile.style.opacity = "0.3"; // Fade destructible bricks
                map[row][col] = 0; // Mark it as destroyed in the map
            }

            setTimeout(() => {
                if (tile.textContent === "💥") {
                    tile.textContent = ""; // Clear explosion after 0.5s
                }
            }, 500);
        }
    });
}
