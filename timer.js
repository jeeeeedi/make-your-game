import { running, paused, lose } from "./states.js";
import { delay } from "./game.js";

export const timerState = {
  timeLeft: 60, // 1 minute
  timerActive: false,
};

function updateTimerDisplay() {
  const timeElement = document.getElementById("time");
  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;
  timeElement.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function countdown(onComplete) {
  if (!running || paused || timerState.timeLeft <= 0) {
    stopTimer();
    if (onComplete) onComplete(); // Trigger callback when timer ends
    return;
  }

  timerState.timeLeft--;
  updateTimerDisplay();

  delay(1000, () => countdown(onComplete));
}

export function startTimer(duration = 60, onComplete) {
  if (timerState.timerActive) return; // Prevent multiple timers
  timerState.timeLeft = duration;
  updateTimerDisplay();
  timerState.timerActive = true;
  countdown(onComplete);
}

export function resumeTimer(onComplete) {
  if (!timerState.timerActive && !paused) {
    timerState.timerActive = true;
    countdown(onComplete);
  }
}

export function pauseTimer() {
  timerState.timerActive = false; // Stops the countdown loop
}

export function stopTimer() {
  timerState.timerActive = false;
}

export function timer(onComplete) {
  if (!running) {
    startTimer(60, onComplete);
  } else if (paused) {
    pauseTimer();
  } else if (running && !paused) {
    resumeTimer(onComplete);
  }
  
  if (timerState.timeLeft === 0) {
    stopTimer();
    lose();
  }
}
