import { player, spook, bomb, explosion, door, floor } from "./game.js"

//initialize game states
export let running = false;
export let paused = false;

export const gridSize = 17;

export function startGame() {
    if (running && !paused) return;

    running = true;
    paused = false;

    player.activate();
    player.updatePosition(9, 9);

    addDestructibles();
    assignDoorPosition();
    //door.activate();
    console.log('STATUS: startGame. running: ', running, ' | paused: ', paused)
}

let total = 45; // total destructibles to be added

function addDestructibles() {
    let built = 0;

    // Select random floor elements
    const randomFloorTiles = Array.from(document.querySelectorAll('#game-board > .floor'))
        .sort(() => 0.5 - Math.random());

    randomFloorTiles.forEach((tile) => {
        if (built >= total) return;

        // Exclude center (player start position)
        if (tile.id !== 'floor center') {
            // Change the ID and class of the floor element to destructible
            tile.id = `destructible${built + 1}`;
            tile.classList.add('destructible');
            tile.classList.remove('floor');

            built++;
        }
    });
}

function assignDoorPosition() {
    // Select a random floor tile
    let randomtileID = `destructible${Math.floor(Math.random() * total) + 1}`;
    let randomTileElement = document.getElementById(randomtileID);

    // Calculate row and column
    if (randomTileElement) {
        let tileIndex = Array.from(randomTileElement.parentNode.children).indexOf(randomTileElement);
        let row = Math.floor(tileIndex / gridSize);
        let col = tileIndex % gridSize;
        door.position = [row + 1, col + 1];
        door.updatePosition(row + 1, col + 1);
        console.log(`Door is at id = ${randomtileID} | Row: ${row + 1}, Column: ${col + 1}`);
    } else {
        console.log(`Tile with ID ${randomtileID} not found.`);
    }
}