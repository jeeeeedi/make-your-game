import { map, tileSize, gridSize } from './game.js';
import { checkSpookyHug } from './lives.js'

export let spooks = [];
export let spawnInterval;

export function callTheSpooks(gameBoard) {
    
    function spawnSpook() {
        if(spooks.length >= 6) return;

        let row, col;
        do {
            row = Math.floor(Math.random() * gridSize);
            col = Math.floor(Math.random() * gridSize);
        } while (map[row][col] !== 0 || (row === 8 && col === 8));

        const spook = document.createElement("div");
        spook.classList.add("spook");
        spook.textContent = "👻";
        spook.style.transform = `translate3d(${col * tileSize}px, ${row * tileSize}px, 0)`;

        gameBoard.appendChild(spook);

        spooks.push({element: spook, position: {row, col}});
    }

    spawnSpook(); // first spook appears without any delay. 

    let lastSpawnTime = performance.now(); // Track last spawn time
    let spawnInterval = 7000; // 7 seconds in milliseconds
    let isSpawning = true; // Control spawning loop
    
    function spawnLoop(timestamp) {
        if (!isSpawning) return; // Stop loop if needed
    
        if (spooks.length < 6) {
            if (timestamp - lastSpawnTime >= spawnInterval) {
                spawnSpook();
                lastSpawnTime = timestamp; // Reset timer
            }
            requestAnimationFrame(spawnLoop); // Continue loop
        }
    }
    
    // Start the loop
    requestAnimationFrame(spawnLoop);
    

    startMovingSpooks();
}

function startMovingSpooks() {
    let lastMoveTime = performance.now();

    function update(time) {
        if (time - lastMoveTime < 1000) {
            requestAnimationFrame(update);
            return;
        }
        lastMoveTime = time;
        moveSpooks();

        requestAnimationFrame(update); // update all spooks
    }
    requestAnimationFrame(update); // start loop
}

function moveSpooks() {
    spooks.forEach(spookObj => {
        let spook = spookObj.element;
        let position = spookObj.position;


        const directions = ['up', 'down', 'left', 'right'];

        const direction = directions[Math.floor(Math.random() * directions.length)];

        let newRow = position.row;
        let newCol = position.col;

        switch (direction) {
            case 'up': newRow--; break;
            case 'down': newRow++; break;
            case 'left': newCol--; break;
            case 'right': newCol++; break;
        }
        if (newRow >= 0 && newRow < gridSize 
            && newCol >= 0 && newCol < gridSize 
            && map[newRow][newCol] === 0) {
            spook.style.transform = `translate3d(${newCol * tileSize}px, ${newRow * tileSize}px, 0)`;

            checkSpookyHug();
            
            position.row = newRow;
            position.col = newCol;
        }
    });
}