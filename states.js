import { entities, activateSpooksOneByOne } from "./game.js";
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

//initialize game states
export let running = false;
export let paused = false;

export const gridSize = 17;
let xp = document.getElementById("xp");
let lives = document.getElementById("lives");

export function startGame() {
  if (running && !paused) return;

  running = true;
  paused = false;

  entities.player.updatePosition(9, 9);
  //console.log(entities.player)
  //ctivateSpooksOneByOne();
  delay(500, activateSpooksOneByOne);
  setInterval(checkCollisions, 100);
  console.log("STATUS: startGame. running: ", running, " | paused: ", paused);
}

export function placeBomb(row, col) {
  if (!running && paused) return;

  console.log(`bomb! at ${row} ${col}`);

  entities.bomb.activate();
  entities.bomb.updatePosition(row, col);
  blink(entities.bomb);

  // Delay explosion
  delay(1000, () => {
    entities.bomb.deactivate();
    entities.explosion.activate();
    entities.explosion.updatePosition(row, col);
    blink(entities.explosion);

    // Delay surroundings destruction and explosion deactivation
    delay(500, () => {
      destroySurroundings(row, col);
      entities.explosion.deactivate();
    });
  });
}

export function delay(ms, callback) {
  let start;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    if (progress < ms) {
      requestAnimationFrame(step);
    } else {
      callback();
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
      entity.element.classList.remove("blink");
    },
    { once: true }
  );
}

let currentLives = 5;

export function decreaseLife() {
  if (!running && paused) return;

  if (currentLives > 0 && currentLives <= 5) {
    currentLives--;
    console.log("Lives: ", currentLives);
    lives.textContent = "❤️".repeat(currentLives);
  }
  if (currentLives === 0) {
    lives.textContent = "💔";
    console.log("Game Over!");
    //add game over logic here
  }
}

export function checkCollisions() {
  entities.spooks.forEach((spook) => {
    if (
      entities.spook.active &&  
      entities.player.row === spook.row &&
      entities.player.col === spook.col
    ) {
      decreaseLife();
      blink(entities.player);
    }
  });
}

export function destroySurroundings(row, col) {
  if (!running && paused) return;

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

    // Iterate over all entities to check if they are at the current position
    entities.all.forEach((entity) => {
      if (entity.row === row && entity.col === col) {
        if (entity instanceof Player) {
          decreaseLife();
          blink(entity);
        } else if (entity instanceof Spook) {
          blink(entity);
          entity.deactivate();
          xp.textContent = parseInt(xp.textContent) + 30; // 30xp per spook
        } else if (
          entity instanceof Floor &&
          entity.element.classList.contains("destructible")
        ) {
          console.log("destroying destructible at", entity.row, entity.col);
          blink(entity);
          entity.element.classList.replace("destructible", "floor");
          xp.textContent = parseInt(xp.textContent) + 10; // 10xp per destructible
        } else if (entity instanceof Door) {
          entity.activate();
          xp.textContent = parseInt(xp.textContent) + 50; // 50xp for revealing a door
        }
      }
    });
  });
}
