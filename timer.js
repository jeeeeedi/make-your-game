import { enoughIsEnough } from "./lives.js";

let time = 180;
let timerInterval;

export function startTimer() {
    updateTimerDisplay(); // Show initial time before the countdown starts
    timerInterval = setInterval(() => {
        if (time > 0) {
            time--;
            updateTimerDisplay();
        } else {
            stopTimer();
            //alert("Time's up! Game Over!");
            enoughIsEnough();
        }
    }, 1000);
}

export function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    document.getElementById('time').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
