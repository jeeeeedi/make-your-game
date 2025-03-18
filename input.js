import { running, paused, startGame } from "./states.js";
import { player, spook, bomb, explosion, door, /*floor , destructible */} from "./game.js"

export function listenForKeys() {
    document.addEventListener("keydown", (e) => {
        console.log(`Key pressed: ${e.key}`);
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
                    console.log(`Player position before move: row=${player.row}, col=${player.col}`); 
                    switch (e.key) {
                        case 'ArrowUp': player.move(-1, 0); break;
                        case 'ArrowDown': player.move(1, 0); break;
                        case 'ArrowLeft': player.move(0, -1); break;
                        case 'ArrowRight': player.move(0, 1); break;
                    }
                    console.log(`Player position after move: row=${player.row}, col=${player.col}`); 
                }
                break;
        }
    });
}