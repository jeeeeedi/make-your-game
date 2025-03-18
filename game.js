export const entities = [];

console.log(entities);

import { Player, Spook, Bomb, Explosion, Door, Floor, Wall } from './class.js';
import { startGame } from './states.js';
import { listenForKeys } from './input.js';

export let player = new Player(9, 9);
export let spook = new Spook(0, 0);
export let bomb = new Bomb(0, 0);
export let explosion = new Explosion(0, 0);
export let door = new Door(0, 0);
// export let floor = new Floor(0, 0);
// export let wall = new Wall(0, 0);
//export let destructible = new Destructible(0, 0);

function initializeWallAndFloorEntities() {
    const elements = document.querySelectorAll('#game-board > div');
    elements.forEach(element => {
        const row = parseInt(element.getAttribute('data-row'));
        const col = parseInt(element.getAttribute('data-col'));
        if (element.classList.contains('wall')) {
            entities.push(new Wall(row, col));
        } else if (element.classList.contains('floor')) {
            entities.push(new Floor(row, col));
        }
    });
}

initializeWallAndFloorEntities();
console.log(player);
listenForKeys();
startGame(); // Start the game
console.log(door.position)