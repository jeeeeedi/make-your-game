import { enoughIsEnough } from "./stopGame.js"; /// call this function when time up

let timeLeft = 60000; // 1 minute in milliseconds
let lastTime = null;
let timerRunning = false;
export let timerFrame;

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
      enoughIsEnough();
      return;
    }

    let minutes = Math.floor(timeLeft / 60000);
    let seconds = Math.floor((timeLeft % 60000) / 1000);
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    timerFrame = requestAnimationFrame(updateTimer);
  }

  timerRunning = true;
  timerFrame = requestAnimationFrame(updateTimer);
}

export function pauseTimer() {
  timerRunning = false;
}

export function resumeTimer() {
  if (!timerRunning) {
    lastTime = null; // Reset lastTime to avoid time jumps
    timerRunning = true;
    timerFrame = requestAnimationFrame(timer);
  }
}