import { running, paused } from "./states.js";
import { entities, delay, decreaseLife, gridSize } from "./game.js";
import { Player, Spook, Floor, Door } from "./class.js";
export function placeBomb(row, col) {
  if (!running && paused) return;

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


function destroySurroundings(row, col) {
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