import { togglePause } from './game.js';

const menuButton = document.getElementById("menuButton");
const popupMenu = document.getElementById("popupMenu");
const closeMenu = document.getElementById("closeMenu");
const resumeGame = document.getElementById("resumeGame");
const howToPlay = document.getElementById("howToPlay");
const gameTheme = document.getElementById("gameTheme");


export function setupMenu() {
    console.log("✅ menu.js is loaded!1");


    menuButton.addEventListener("click", () => {
        menuState("block");
        togglePause(); // Function to pause the game
    });

    closeMenu.addEventListener("click", () => {
        menuState("none");
    });

    resumeGame.addEventListener("click", () => {
        menuState("none");
        togglePause(); // Function to resume the game
    });

    howToPlay.addEventListener("click", () => {
        alert(
            "Press 'Enter' to start a game. Move using arrow keys. \n" +
            "Avoid or kill ghosts. Every destroyed wall or killed spook will give you XP. \n" +
            "Controls \n" +

            "enter starts the game. \n" +
            "x	drops a bomb on the current tile. \n" +
            "left, right, up, down	moves the player left, right, up, or down, respectively. \n" +
            "esc	quits the current game and starts a new game. \n " +

            "Good luck!");
    });

    let red = false
    gameTheme.addEventListener("click", () => {
            red = !red;
            document.body.style.backgroundColor = red ? "pink" : "black";
    });
    console.log("Menu displayed")
}

// menu states: "block" = show the menu, "none" = hide it.
export function menuState(state) {
    popupMenu.style.display = state;
}