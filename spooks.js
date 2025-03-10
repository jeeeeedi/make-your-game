import { map, tileSize, gridSize, playerPos, isAtSamePosition, decreaseEnergy} from './game.js';

export function callTheSpooks(gameBoard) {
    let spookCount = 0;
    
    function spawnSpook() {
        if(spookCount >= 6) return;

        let row, col;
        do{
            row = Math.floor(Math.random() * gridSize);
            col = Math.floor(Math.random() * gridSize);
        } while (map[row][col] !== 0 || (row === 8 && col === 8));

        const spook = document.createElement("div");
        spook.classList.add("spook");
        spook.textContent = "👻";
        spook.style.transform = `translate3d(${col * tileSize}px, ${row * tileSize}px, 0)`;

        gameBoard.appendChild(spook);
        moveSpook(spook, row, col);

        spookCount++;
    }
    spawnSpook();

    const spawnInterval = setInterval(() =>{
        if (spookCount >= 6) {
            clearInterval(spawnInterval);
            return;
        }
        spawnSpook();

    }, 7000);
}
export let newRow, newCol;
function moveSpook(spook, row, col) {
    let lastMoveTime = performance.now();
    function animate(time) {
        if (time - lastMoveTime < 1000) { 
            requestAnimationFrame(animate);
            return;
        }
    lastMoveTime = time;    
    newCol= col, newRow = row;
    const directions = ['up', 'down', 'left', 'right'];

    let moved = false;

    while (!moved) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        newRow = row;
        newCol = col;

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

        if (isAtSamePosition(playerPos, {row: newRow, col: newCol})) {
            decreaseEnergy();
        }
        row = newRow;
        col = newCol;
        moved = true;
            }
        
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}