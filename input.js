import { running, paused, startGame } from "./states.js";
import { player, spook, bomb, explosion, door, floor, destructible } from "./class.js"

export function listenForKeys() {
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case 'Enter':
                if (!running) startGame();
                break;
            case 'Escape':
                if (running && !paused) quitGame();
                break;
            case ' ':
                if (running) {
                    e.preventDefault(); // Prevent scrolling
                    togglePause();
                }
                break;
            default:
                if (running && !paused && player.row >= 1 && player.row <= 17 && player.col >= 1 && player.col <= 17) {
                    switch (e.key) {
                        case 'ArrowUp': player.move(0, -1); break;
                        case 'ArrowDown': player.move(0, 1); break;
                        case 'ArrowLeft': player.move(-1, 0); break;
                        case 'ArrowRight': player.move(1, 0); break;
                    }
                }
                break;
        }
    });
}