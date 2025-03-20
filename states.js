import { entities } from "./game.js"


//initialize game states
export let running = false;
export let paused = false;

export const gridSize = 17;

export function startGame() {
    if (running && !paused) return;

    running = true;
    paused = false;

    entities.player.activate();
    entities.player.updatePosition(9, 9);
    console.log(entities.player)
    activateSpooksOneByOne();

    addDestructibles();
    assignDoorPosition();
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

        if (tile.id !== 'floor-center') {
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
        entities.door.position = [row + 1, col + 1];
        entities.door.updatePosition(row + 1, col + 1);
        console.log(`Door is at id = ${randomtileID} | Row: ${row + 1}, Column: ${col + 1}`);
    } else {
        console.log(`Tile with ID ${randomtileID} not found.`);
    }
}

export function placeBomb(row, col) {
    console.log(`bomb! at ${row} ${col}`)

  entities.bomb.activate();
  entities.bomb.updatePosition(row, col);
  blink(entities.bomb);

  // Add a pause before activating the explosion using requestAnimationFrame
  let start;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    if (progress < 1000) { // 1000 milliseconds = 1 second delay
      requestAnimationFrame(step);
    } else {
      entities.explosion.activate();
      console.log(entities.explosion.element)
      entities.explosion.updatePosition(row, col);
      blink(entities.explosion);

    }
  }
  requestAnimationFrame(step);
}

export function blink(entity) {
    entity.element.classList.add("blink");
  
    // Remove the blink class after the animation ends
    entity.element.addEventListener(
      "animationend",
      () => {
        console.log(entities.explosion.element)
        entity.element.classList.remove("blink");
        entity.deactivate();
      },
      { once: true }
    );
  }
  
  function activateSpooksOneByOne() {
    const spooks = entities.spooks;
    spooks.forEach((spook, index) => {
        setTimeout(() => {
            spook.activate();
            console.log(`Spook ${index + 1} activated at row=${spook.row}, col=${spook.col}`);
        }, index * 1000); // 1000 milliseconds = 1 second delay between each activation
    });
}