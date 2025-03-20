import { togglePause, pauseGame, resumeGame } from './game.js';

const menuButton = document.getElementById("menuButton");
const popupMenu = document.getElementById("popupMenu");
const closeMenu = document.getElementById("closeMenu");
const resumeGameButton = document.getElementById("resumeGame");
const howToPlay = document.getElementById("howToPlay");
const gameTheme = document.getElementById("gameTheme");

export function setupMenu() {
    console.log("menu.js is loaded!");

    // Display the menu at the start of the game
    menuState("block");
    pauseGame(); // Pause the game when the menu is displayed

    menuButton.addEventListener("click", () => {
        menuState("block");
        pauseGame(); // Pause the game when the menu is displayed
    });

    closeMenu.addEventListener("click", () => {
        menuState("none");
        resumeGame(); // Resume the game when the menu is closed
    });

    resumeGameButton.addEventListener("click", () => {
        menuState("none");
        resumeGame(); // Resume the game when the menu is closed
    });

    howToPlay.addEventListener("click", () => {
        alert(
            "Press 'Enter' to start a game. Move using arrow keys. \n" +
            "Avoid or kill ghosts. Every destroyed wall or killed spook will give you XP. \n" +
            "Controls \n" +
            "enter starts the game. \n" +
            "x drops a bomb on the current tile. \n" +
            "left, right, up, down moves the player left, right, up, or down, respectively. \n" +
            "esc quits the current game and starts a new game. \n " +
            "Good luck!"
        );
    });

    let red = false;
    gameTheme.addEventListener("click", () => {
        red = !red;
        document.body.style.backgroundColor = red ? "pink" : "black";
    });
    console.log("Menu displayed");
}

// Menu states: "block" = show the menu, "none" = hide it.
export function menuState(state) {
    popupMenu.style.display = state;
}