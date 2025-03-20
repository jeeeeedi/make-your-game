import { startGame, togglePaused, running, paused } from "./states.js";
import { entities, activateSpooksOneByOne, resetGame } from "./game.js";

export function setupMenu() {
    // Create main menu
    const menu = document.createElement('div');
    menu.id = 'game-menu';
    menu.innerHTML = `
        <div class="menu-content">
            <h2>Bomberman</h2>
            <div class="menu-buttons">
                <button id="start-game-btn" style="cursor: pointer;">Start Game</button>
                <button id="controls-btn">Controls</button>
            </div>
        </div>
    `;
    document.body.appendChild(menu);

    // Create controls window
    const controlsWindow = document.createElement('div');
    controlsWindow.id = 'controls-window';
    controlsWindow.style.display = 'none';
    controlsWindow.innerHTML = `
        <div class="controls-content">
            <h2>Controls</h2>
            <div class="controls-text">
                <p><strong>Key</strong> <strong>Action</strong></p>
                <p>enter starts the game and timer</p>
                <p>x drops a bomb on the current tile</p>
                <p>left, right, up, down moves the player left, right, up, or down, respectively</p>
                <p>space pauses the game or continues a paused game</p>
                <p>esc quits the current game and starts a new game</p>
            </div>
            <button id="close-controls-btn">Close</button>
        </div>
    `;
    document.body.appendChild(controlsWindow);

    // Get menu button from HTML
    const menuButton = document.getElementById("menu-button");
    menuButton.addEventListener("click", () => {
        handleMenuVisibility(true);
    });

    // Add resize observer to update button position
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const gameBoard = entry.target;
            const boardRect = gameBoard.getBoundingClientRect();
            const boardRight = boardRect.right;
            const windowWidth = window.innerWidth;
            const buttonWidth = 120; // Width of the menu button
            const margin = 20; // Margin from the edge
            
            // Calculate the maximum allowed position
            const maxPosition = windowWidth - buttonWidth - margin;
            
            // Set the button position, ensuring it doesn't go beyond the window
            menuButton.style.left = `${Math.min(boardRight + margin, maxPosition)}px`;
        }
    });

    // Start observing the game board
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
        resizeObserver.observe(gameBoard);
    }

    // Create controls button for during gameplay
    const controlsButton = document.createElement("button");
    controlsButton.id = "controls-button";
    controlsButton.textContent = "Controls";
    controlsButton.addEventListener("click", () => {
        handleMenuVisibility(true, true);
    });
    document.body.appendChild(controlsButton);

    // Function to check if any menu is visible
    const isMenuVisible = () => {
        return menu.style.display === 'flex' || controlsWindow.style.display === 'flex';
    };

    // Function to handle menu visibility
    const handleMenuVisibility = (show, showControls = false) => {
        const menu = document.getElementById("game-menu");
        const controlsWindow = document.getElementById("controls-window");
        const menuButton = document.getElementById("menu-button");
        const controlsButton = document.getElementById("controls-button");
        const startGameBtn = document.getElementById("start-game-btn");

        if (show) {
            if (showControls) {
                controlsWindow.style.display = "flex";
                menuButton.style.display = "none";
                controlsButton.style.display = "none";
            } else {
                menu.style.display = "flex";
                menuButton.style.display = "none";
                controlsButton.style.display = "none";
                // Change Start Game button to Resume if game is running
                if (running) {
                    startGameBtn.textContent = "Resume Game";
                    startGameBtn.disabled = false;
                }
            }
            togglePaused(true);
            // Stop all spooks when menu is shown
            entities.spooks.forEach(spook => spook.stopMoving());
        } else {
            menu.style.display = "none";
            controlsWindow.style.display = "none";
            menuButton.style.display = "block";
            togglePaused(false);
            // Resume all spooks when menu is hidden
            entities.spooks.forEach(spook => spook.startMoving());
            // Reset the Start Game button if game is not running
            if (!running) {
                startGameBtn.textContent = "Start Game";
                startGameBtn.disabled = false;
            }
        }
    };

    // Add event listeners for menu buttons
    document.getElementById("start-game-btn").addEventListener("click", () => {
        if (running) {
            menu.style.display = "none";
            handleMenuVisibility(false);
        } else {
            menu.style.display = "none";
            startGame();
        }
    });

    document.getElementById("controls-btn").addEventListener("click", () => {
        menu.style.display = "none";
        controlsWindow.style.display = "flex";
    });

    // Add event listener for close controls button
    document.getElementById("close-controls-btn").addEventListener("click", () => {
        controlsWindow.style.display = "none";
        menu.style.display = "flex";
    });
}