import { Player, Spook, Bomb, Explosion, Door, Floor } from './class.js';
import { startGame } from './states.js';
import { listenForKeys } from './input.js';

export let player = new Player(8, 8);
export let spook = new Spook(0, 0);
export let bomb = new Bomb(0, 0);
export let explosion = new Explosion(0, 0);
export let door = new Door(0, 0);
export let floor = new Floor(0, 0);
//export let destructible = new Destructible(0, 0);

listenForKeys();
startGame(); // Start the game
console.log(door.position)