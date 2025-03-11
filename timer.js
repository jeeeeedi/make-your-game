import { enoughIsEnough } from "./stopGame.js";

let timeLeft = 60000; // 1 minutes in milliseconds
let lastTime = null;
let timerRunning = false;

export function timer() {
  let timeDisplay = document.getElementById("time");

  function updateTimer(timestamp) {
    if (!timerRunning) return;

    if (lastTime === null) lastTime = timestamp;
    let delta = timestamp - lastTime;
    lastTime = timestamp;

    timeLeft -= delta;
    if (timeLeft <= 0) {
      timeLeft = 0;
      document.getElementById("status").textContent = "Game Over!";
      return;
    }

    let minutes = Math.floor(timeLeft / 60000);
    let seconds = Math.floor((timeLeft % 60000) / 1000);
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    requestAnimationFrame(updateTimer);
  }

  timerRunning = true;
  requestAnimationFrame(updateTimer);
}

export function pauseTimer() {
  timerRunning = false;
}

export function resumeTimer() {
  if (!timerRunning) {
    lastTime = null; // Reset lastTime to avoid time jumps
    timerRunning = true;
    requestAnimationFrame(timer);
  }