export const entities = {
  all: [],
};

console.log(entities);
//import { setupMenu } from './menu.js';
import {
  Player,
  Spook,
  Bomb,
  Explosion,
  Door,
  Floor,
  Wall,
  Destructible,
  gameBoard,
} from "./class.js";
import {
  running,
  paused,
  checkCollisions,
  win,
  lose,
  delay,
} from "./states.js";
import { listenForKeys } from "./input.js";
import { setupMenu } from "./menu.js";

const gridSize = 17;

export function createMap() {
  gameBoard.textContent = "";

  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      if (row === 9 && col === 9) {
        entities.floor = new Floor(row, col);
        entities.all.push(entities.floor);
        entities.floor.element.id = `floor-center`;
      } else if (
        row === 1 ||
        row === 17 ||
        col === 1 ||
        col === 17 ||
        (row % 2 === 1 && col % 2 === 1)
      ) {
        entities.wall = new Wall(row, col);
        entities.all.push(entities.wall);
      } else {
        entities.floor = new Floor(row, col);
        entities.all.push(entities.floor);
      }
    }
  }
  // Create and add player, spook, bomb, explosion, and door entities
  entities.player = new Player(9, 9);
  entities.spook = new Spook(0, 0);
  entities.bomb = new Bomb(0, 0);
  entities.explosion = new Explosion(0, 0);
  entities.door = new Door(0, 0);
  entities.all.push(
    entities.player,
    entities.spook,
    entities.bomb,
    entities.explosion,
    entities.door
  );
  addDestructibles();
  assignDoorPosition();
  
  // Initialize and add 6 spook entities
  const spooks = [];
  while (spooks.length < 6) {
    const row = Math.floor(Math.random() * 15) + 2; // Random row between 2 and 16
    const col = Math.floor(Math.random() * 15) + 2; // Random col between 2 and 16
    const targetEntity = entities.all.find(
      (entity) => entity.row === row && entity.col === col
    );
    if (
      targetEntity instanceof Floor &&
      targetEntity.element.classList.contains("floor")
    ) {
      const spook = new Spook(row, col);
      spook.updatePosition(row, col);
      spooks.push(spook);
      entities.all.push(spook);
    }
  }
  entities.spooks = spooks; // Store the spooks in the entities object

  // Deactivate player and spooks at start
  entities.player.deactivate();
  entities.spooks.forEach(spook => spook.deactivate());
}

export function activateSpooksOneByOne() {
  if (!running || paused) return;
  
  // Check if any menu is visible
  const menu = document.getElementById('game-menu');
  const controlsWindow = document.getElementById('controls-window');
  if (menu?.style.display === 'flex' || controlsWindow?.style.display === 'flex') {
    // If any menu is visible, deactivate all spooks
    entities.spooks.forEach(spook => {
      spook.deactivate();
      spook.stopMoving();
    });
    return;
  }

  // Only activate spooks if no menu is visible
  entities.spooks.forEach((spook, index) => {
    if (!spook.active) {  // Only activate spooks that aren't already active
      delay(index * 8000, () => {
        // Check if menus are still not visible before activating
        if (!(menu?.style.display === 'flex' || controlsWindow?.style.display === 'flex')) {
          spook.activate();
          spook.startMoving();
          console.log(
            `Spook at row=${spook.row}, col=${spook.col} activated`,
            new Date()
          );
        }
      });
    }
  });
}

let total = 45; // total destructibles to be added

export function addDestructibles() {
  let built = 0;

  // Select random floor elements
  const randomFloorTiles = Array.from(
    document.querySelectorAll("#game-board > .floor")
  ).sort(() => 0.5 - Math.random());

  randomFloorTiles.forEach((tile) => {
    if (built >= total) return;

    // Exclude center (player start position)
    if (tile.id !== "floor-center") {
      // Change the ID and class of the floor element to destructible
      tile.id = `destructible${built + 1}`;
      tile.classList.replace("floor", "destructible");
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
    let tileIndex = Array.from(randomTileElement.parentNode.children).indexOf(
      randomTileElement
    );
    let row = Math.floor(tileIndex / gridSize);
    let col = tileIndex % gridSize;
    entities.door.position = [row + 1, col + 1];
    entities.door.updatePosition(row + 1, col + 1);
    console.log(
      `Door is at id = ${randomtileID} | Row: ${row + 1}, Column: ${col + 1}`
    );
  } else {
    console.log(`Tile with ID ${randomtileID} not found.`);
  }
}

export function checkCollisionsLoop() {
  checkCollisions();
  requestAnimationFrame(checkCollisionsLoop);
}

createMap();
setupMenu(); // Initialize the menu
listenForKeys();

export function gameLoop() {
  if (running && !paused) {
    win();
    lose();
  }
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

export function resetGame() {
    // Reset player
    entities.player.deactivate();
    entities.player.row = 0;
    entities.player.col = 0;
    entities.player.element.style.display = 'none';

    // Reset spooks
    entities.spooks.forEach(spook => {
        spook.deactivate();
        spook.element.style.display = 'none';
    });
    entities.spooks = [];

    // Reset game state using the proper state management functions
    if (running) {
        togglePaused();
    }
    gameTime = 0;
    updateTimer();
}
