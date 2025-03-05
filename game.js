const gameBoard = document.getElementById("game-board");

// 11x11 game map (0 = floor, 1 = wall, 2 = destructible)
const map = [
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,2,0,1,0,2,0,2,0,1],
    [1,0,1,0,1,0,1,0,1,0,1],
    [1,0,2,0,0,0,0,0,2,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,2,0,2,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,0,2,0,0,0,0,0,2,0,1],
    [1,0,1,0,1,0,1,0,1,0,1],
    [1,0,2,0,1,0,2,0,2,0,1],
    [1,1,1,1,1,1,1,1,1,1,1]
];

// Render the game map
function createMap() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");

            if (map[row][col] === 1) {
                tile.classList.add("wall"); // Indestructible wall
            } else if (map[row][col] === 2) {
                tile.classList.add("destructible"); // Breakable block
            } else {
                tile.classList.add("floor"); // Walkable floor
            }

            gameBoard.appendChild(tile);
        }
    }
}

createMap();
