import { running, paused, startGame, placeBomb } from "./states.js";
import { entities /*player, spook, bomb, explosion, door, /*floor , destructible */} from "./game.js"

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
                case 'x' || 'X':
                    if (running && !paused) placeBomb(entities.player.row, entities.player.col);
                break;
            default:
                if (running && !paused && entities.player.row >= 1 && entities.player.row <= 17 && entities.player.col >= 1 && entities.player.col <= 17) {
                    console.log(`Player position before move: row=${entities.player.row}, col=${entities.player.col}`); 
                    switch (e.key) {
                        case 'ArrowUp': e.preventDefault(); entities.player.move(-1, 0); break;
                        case 'ArrowDown': e.preventDefault(); entities.player.move(1, 0); break;
                        case 'ArrowLeft': e.preventDefault(); entities.player.move(0, -1); break;
                        case 'ArrowRight': e.preventDefault(); entities.player.move(0, 1); break;
                    }
                    console.log(`Player position after move: row=${entities.player.row}, col=${entities.player.col}`); 
                }
                break;
        }
    });
}