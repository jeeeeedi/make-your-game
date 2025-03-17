import { player, spook, bomb, explosion, door, floor, destructible } from "./class.js"

//initialize game states
export let running = false;
export let paused = false;

export const gridSize = 17;

export function startGame() {
    if (running && !paused) return;

    running = true;
    paused = false;

    player.activate();
    //deactivate(spook, bomb, explosion);
    addDestructibles();
    console.log('STATUS: startGame. running: ', running, ' | paused: ', paused)
}

function addDestructibles() {
    let total = 50; // total destructibles to be added
    let destructiblePos = [];
    let placed = 0;

    while (placed < total) {
        let randomRow = Math.floor(Math.random() * gridSize);
        let randomCol = Math.floor(Math.random() * gridSize);

        if (!player.collide) {
            destructiblePos.push({ row: randomRow, col: randomCol });
            placed++;
        }
    }
}