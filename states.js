import { entities, activateSpooksOneByOne } from "./game.js"


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

  console.log('STATUS: startGame. running: ', running, ' | paused: ', paused)
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
      entities.explosion.updatePosition(row, col);
      blink(entities.explosion);
      entities.explosion.deactivate();

    }
  }
  requestAnimationFrame(step);
  destroySurroundings(row, col);
}

export function blink(entity) {
    entity.element.classList.add("blink");
  
    // Remove the blink class after the animation ends
    entity.element.addEventListener(
      "animationend",
      () => {
        entity.element.classList.remove("blink");
      },
      { once: true }
    );
  }

  export function decreaseLife() {
  console.log('***Life decreased***', new Date);
  }

  export function checkCollisions() {
    entities.spooks.forEach((spook) => {
      if (entities.player.row === spook.row && entities.player.col === spook.col) {
        decreaseLife();
        blink(entities.player);
      }
    });
  }

export function destroySurroundings(row, col) {
  console.log('destroying...')
  const surroundings = [
    { row, col }, // Center / current position
    { row: row - 1, col }, // Up
    { row: row + 1, col }, // Down
    { row, col: col - 1 }, // Left
    { row, col: col + 1 }, // Right
    { row: row - 1, col: col - 1 }, // Up-Left
    { row: row - 1, col: col + 1 }, // Up-Right
    { row: row + 1, col: col - 1 }, // Down-Left
    { row: row + 1, col: col + 1 }, // Down-Right
  ];

  surroundings.forEach(({ row, col }) => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return;
    }

    // Check if certain entities is at this position
    /*  if (entities.player.row === row && entities.player.col === col) {
       decreaselives();
     } */
    if (entities.spook.row === row && entities.spook.col === col) {
      blink(entities.spook);
    }
    if (entities.destructible.row === row && entities.destructible.col === col) {
      console.log("destroying destructible at", entities.destructible.row, entities.destructible.col)
      blink(entities.destructible);
    }
    if (entities.door.row === row && entities.door.col === col) {
      entities.door.activate();
    }
  });
}