import {
  entities,
  addDestructibles,
  assignDoorPosition, gridSize, delay
} from "./game.js";
import { pauseTimer, timer, timerState } from "./timer.js";
import { listenForKeys } from "./input.js";
import { activateSpooksOneByOne } from "./spooks.js";

//initialize game states
export let running = false;
export let paused = false;
let xp = document.getElementById("xp");
let lives = document.getElementById("lives");

export function togglePaused() {
  paused = !paused;
  
  if (paused) {
    // Stop all spook movements when pausing
    entities.spooks.forEach(spook => {
      if (spook.active) {
        spook.stopMoving();
      }
    });
  } else {
    // Resume all spook movements when unpausing
    entities.spooks.forEach(spook => {
      if (spook.active) {
        spook.startMoving();
      }
    });
  }
}

export function startGame() {
  if (running && !paused) return;

  // Reset game state
  running = true;
  paused = false;
  entities.player.lives = 5;
  lives.textContent = "❤️".repeat(entities.player.lives);
  xp.textContent = "0";

  entities.door.deactivate();
  
  entities.player.updatePosition(9, 9);
  entities.player.activate();

  entities.spooks.forEach(spook => {
    spook.deactivate();
    spook.stopMoving();
  });

  entities.bomb.deactivate();
  entities.explosion.deactivate();
  // Reset timer
  timerState.timeLeft = 60;
  timerState.timerActive = false;
  document.getElementById("time").textContent = "01:00";

  // Show menu button
  const menuButton = document.getElementById("menu-button");
  menuButton.style.display = "block";
  menuButton.style.position = "fixed";
  menuButton.style.top = "20px";
  menuButton.style.right = "20px";
  menuButton.style.zIndex = "1001";
  document.getElementById("start-game-btn").disabled = true;

  // Activating the game
  // Add destructibles and assign door position after everything is reset
  addDestructibles();
  assignDoorPosition();

  // Start the game systems immediately
  activateSpooksOneByOne();
  timer();
}

export function win() {
  if (entities.player.collision(entities.door.row, entities.door.col)) {
    xp.textContent = parseInt(xp.textContent) + 100; // 100xp for winning
    running = false;
    paused = true;
    pauseTimer();
    listenForKeys();
    
    // Stop all spook movements
    entities.spooks.forEach(spook => {
      if (spook.active) {
        spook.stopMoving();
      }
    });
    
    // Show game over window with win message
    const gameOverWindow = document.getElementById("game-over-window");
    const gameOverText = document.getElementById("game-over-text");
    gameOverText.textContent = `Congratulations! You won! Your score: ${xp.textContent}`;
    gameOverWindow.style.display = "flex";
    gameOverWindow.style.position = "fixed";
    gameOverWindow.style.top = "50%";
    gameOverWindow.style.left = "50%";
    gameOverWindow.style.transform = "translate(-50%, -50%)";
    gameOverWindow.style.zIndex = "1000";
  }
}

export function lose() {
  if (entities.player.lives === 0 || timerState.timeLeft === 0) {
    running = false;
    paused = true;
    pauseTimer();
    listenForKeys();
    
    // Stop all spook movements
    entities.spooks.forEach(spook => {
      if (spook.active) {
        spook.stopMoving();
      }
    });
    
    // Reset game state
    xp.textContent = "0";
    
    const gameOverWindow = document.getElementById("game-over-window");
    const gameOverText = document.getElementById("game-over-text");
    gameOverText.textContent = "Game Over!";
    gameOverWindow.style.display = "flex";
    gameOverWindow.style.position = "fixed";
    gameOverWindow.style.top = "50%";
    gameOverWindow.style.left = "50%";
    gameOverWindow.style.transform = "translate(-50%, -50%)";
    gameOverWindow.style.zIndex = "1000";
  }
}
