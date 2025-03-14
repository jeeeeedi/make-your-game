import { timer, pauseTimer, resumeTimer } from "./timer.js";
import { callTheSpooks, movingSpooks } from "./spooks.js";
import {
  createMap,
  updatePlayerPosition,
  gameBoard,
  listenForKeydown,
} from "./game.js";
import { enoughIsEnough } from "./stopGame.js";

export let gameStarted = false;
export let gamePaused = false;

export function quitGame() {
  gamePaused = true;
  pauseTimer();
  if (confirm("Are you sure you want to quit the current game?")) {
    location.reload();
  } else {
    gamePaused = false;
    resumeTimer();
  }
}

export function startGame() {
  if (gameStarted) return; // Prevent restarting if already started
  gameStarted = true;
  gamePaused = false; // Ensure game starts unpaused

  document.getElementById("time").textContent = "01:00"; // Reset timer
  timer(); // Start the countdown

  document.getElementById("status").textContent =
    "game running. press space to pause the game or esc to quit the current game and start a new one.";

  createMap(); // Generate the game board divs
  //playerPos = { row: 8, col: 8 };
  updatePlayerPosition();
  callTheSpooks(gameBoard); // Start spawning spooks
  console.log("Ready to play!");
}

export function togglePause() {
  if (!gameStarted) return; // Do nothing if the game hasn't started

  gamePaused = !gamePaused;
  if (gamePaused) {
    pauseTimer(); // Stop the timer
    cancelAnimationFrame(movingSpooks); // Stop moving spooks
    document.getElementById("status").textContent =
      "game paused. press space to resume.";
  } else {
    resumeTimer(); // Continue the timer
    callTheSpooks(gameBoard); // Resume spawning and moving spooks
    document.getElementById("status").textContent =
      "game running. press space to pause or esc to quit current game and start a new one.";
  }
}

export function winGame() {
  xp.textContent = parseInt(xp.textContent) + 100; // 100xp for winning
  document.getElementById("status").textContent =
    "congratulations! you win! press esc to start a new game.";

  gameStarted = false;
  gamePaused = true;
  pauseTimer();
  //listenForKeydown(); // Allow the player to start a new game
}
