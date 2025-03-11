import { enoughIsEnough } from "./stopGame.js";

export let timerInterval;
let time = 180;

export function startTimer() {
    updateTimerDisplay(); // Show initial time before the countdown starts
    timerInterval = setInterval(() => {
        if (time > 0) {
            time--;
            updateTimerDisplay();
        } else {
            enoughIsEnough();
        }
    }, 1000);
}

function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    document.getElementById('time').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
