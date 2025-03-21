import { startGame, togglePaused, running } from "./states.js";
import { entities } from "./game.js";
import { timer } from "./timer.js";

export function setupMenu() {
    // Get menu elements
    const menu = document.getElementById('game-menu');
    const controlsWindow = document.getElementById('controls-window');
    const gameOverWindow = document.getElementById('game-over-window');
    const menuButton = document.getElementById("menu-button");
    const startGameBtn = document.getElementById("start-game-btn");

    // Add menu button class and event listener
    menuButton.classList.add('menu-btn');
    menuButton.addEventListener("click", () => {
        handleMenuVisibility(true);
    });

    // Create controls button for menu
    const controlsButton = document.createElement("button");
    controlsButton.id = "controls-button";
    controlsButton.classList.add('menu-btn');
    controlsButton.textContent = "Controls";
    controlsButton.addEventListener("click", () => {
        handleMenuVisibility(true, true);
    });
    // Add controls button to menu window
    menu.appendChild(controlsButton);

    // Add event listeners for menu buttons
    startGameBtn.addEventListener("click", () => {
        menu.style.display = "none";
        if (running) {
            // Resume game
            togglePaused(false);
            // Resume spook movements
            entities.spooks.forEach(spook => {
                if (spook.active) {
                    spook.startMoving();
                }
            });
            // Resume timer
            timer();
            // Show menu button
            menuButton.style.display = "block";
        } else {
            // Reset all spooks
            entities.spooks.forEach(spook => {
                spook.deactivate();
                spook.stopMoving();
            });
            // Start new game
            startGame();
        }
    });

    document.getElementById("controls-btn").addEventListener("click", () => {
        menu.style.display = "none";
        controlsWindow.style.display = "flex";
    });

    document.getElementById("close-controls-btn").addEventListener("click", () => {
        controlsWindow.style.display = "none";
        menu.style.display = "flex";
    });

    document.getElementById("restart-btn").addEventListener("click", () => {
        location.reload();
    });

    // Add event listener for game over window close button
    document.getElementById("close-game-over-btn").addEventListener("click", () => {
        gameOverWindow.style.display = "none";
        // Show menu button and enable Start Game button
        menuButton.style.display = "block";
        startGameBtn.textContent = "Start Game";
        startGameBtn.disabled = false;
        startGameBtn.style.cursor = "pointer";
        startGameBtn.style.opacity = "1";
    });
}

function handleMenuVisibility(show, showControls = false) {
    const menu = document.getElementById("game-menu");
    const controlsWindow = document.getElementById("controls-window");
    const gameOverWindow = document.getElementById("game-over-window");
    const menuButton = document.getElementById("menu-button");
    const startGameBtn = document.getElementById("start-game-btn");

    if (show) {
        if (showControls) {
            controlsWindow.style.display = "flex";
        } else {
            menu.style.display = "flex";
            // Update button text and state based on game state
            if (running) {
                startGameBtn.textContent = "Resume";
                startGameBtn.disabled = false;
                startGameBtn.style.cursor = "pointer";
                startGameBtn.style.opacity = "1";
            } else {
                startGameBtn.textContent = "Start Game";
                startGameBtn.disabled = false;
                startGameBtn.style.cursor = "pointer";
                startGameBtn.style.opacity = "1";
            }
        }
        menuButton.style.display = "none";
        if (running) {
            togglePaused(true);
        }
    } else {
        menu.style.display = "none";
        controlsWindow.style.display = "none";
        gameOverWindow.style.display = "none";
        menuButton.style.display = "block";
    }
}