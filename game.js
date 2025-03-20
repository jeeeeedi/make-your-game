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
import { startGame, checkCollisions, delay } from "./states.js";
import { listenForKeys } from "./input.js";

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
    console.log("targetentity: ", targetEntity);
    if (
      targetEntity instanceof Floor &&
      targetEntity.element.classList.contains("floor")
    ) {
      const spook = new Spook(row, col);
      spook.updatePosition(row, col);
      console.log(spook);
      spooks.push(spook);
      entities.all.push(spook);
    }
  }
  entities.spooks = spooks; // Store the spooks in the entities object
}

export function activateSpooksOneByOne() {
    entities.spooks.forEach((spook, index) => {
      delay(index * 8000, () => {
        spook.activate();
        console.log(
          `Spook at row=${spook.row}, col=${spook.col} activated`,
          new Date()
        );
        function moveSpook() {
          spook.randomMove();
          delay(800, moveSpook);
        }
        moveSpook();
      });
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

function checkCollisionsLoop() {
    checkCollisions();
    requestAnimationFrame(checkCollisionsLoop);
  }
  

createMap();
listenForKeys();
startGame(); // Start the game
requestAnimationFrame(() => activateSpooksOneByOne());
requestAnimationFrame(checkCollisionsLoop);
