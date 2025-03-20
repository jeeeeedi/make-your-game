import { addDestructibles } from './states.js' ;

export const entities = {
  all: [],
};

console.log(entities);

import { Player, Spook, Bomb, Explosion, Door, Floor, Wall, gameBoard } from './class.js';
import { startGame } from './states.js';
import { listenForKeys } from './input.js';

const gridSize = 17;

export function createMap() {
  gameBoard.textContent = "";

  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      if (row === 9 && col === 9) {
        entities.floor = new Floor(row, col);
        entities.all.push(entities.floor);
        entities.floor.element.id = `floor-center`;

      } else if (row === 1 || row === 17 || col === 1 || col === 17 || (row % 2 === 1 && col % 2 === 1)) {
        entities.wall = new Wall(row, col);
        entities.all.push(entities.wall);
        //entities.wall.element.id = `wall`;
      } else {
        entities.floor = new Floor(row, col);
        entities.all.push(entities.floor);
        //entities[`floor-${row}-${col}`] = entities.floor;
      }
    }
  }

  // Create and add player, spook, bomb, explosion, and door entities
  entities.player = new Player(9, 9);
  entities.bomb = new Bomb(0, 0);
  entities.explosion = new Explosion(0, 0);
  entities.door = new Door(0, 0);
  entities.all.push(entities.player, entities.spook, entities.bomb, entities.explosion, entities.door);
  // Initialize and add 6 spook entities
  addDestructibles();
  const spooks = [];
  while (spooks.length < 6) {
    const row = Math.floor(Math.random() * 15) + 2; // Random row between 2 and 16
    const col = Math.floor(Math.random() * 15) + 2; // Random col between 2 and 16
    const targetEntity = entities.all.find(entity => entity.row === row && entity.col === col);
    console.log("targetentity: ", targetEntity)
    if (targetEntity instanceof Floor && targetEntity.element.classList.contains('floor')) {
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
    setTimeout(() => {
      spook.activate();
      console.log(`Spook at row=${spook.row}, col=${spook.col} activated`, new Date);
      setInterval(() => {
        spook.randomMove();
      }, 800);
    }, index * 8000); // 8 seconds delay between each activation
  });
}


createMap();
console.log(entities);
listenForKeys();
startGame(); // Start the game
setTimeout(activateSpooksOneByOne, 0)