import { running, paused } from "./states.js";
import { entities } from "./game.js";

let lastActivationTime = performance.now();
const SPOOK_CHECK_INTERVAL = 8000; // Check every 8 seconds

export function checkAndActivateSpooks(timestamp) {
    // Only continue if game is running and not paused
    if (!running || paused) {
        requestAnimationFrame(checkAndActivateSpooks);
        return;
    }

    // Check if menus are visible
    const menu = document.getElementById('game-menu');
    const controlsWindow = document.getElementById('controls-window');
    if (menu?.style.display === 'flex' || controlsWindow?.style.display === 'flex') {
        entities.spooks.forEach(spook => {
            spook.deactivate();
            spook.stopMoving();
        });
        requestAnimationFrame(checkAndActivateSpooks);
        return;
    }

    // Check if enough time has passed since last activation
    if (timestamp - lastActivationTime >= SPOOK_CHECK_INTERVAL) {
        // Find and activate inactive spooks
        const inactiveSpooks = entities.spooks.filter(spook => !spook.active);
        if (inactiveSpooks.length > 0) {
            const spookToActivate = inactiveSpooks[0];
            spookToActivate.activate();
            spookToActivate.startMoving();
            lastActivationTime = timestamp;
        }
    }

    // Continue checking
    requestAnimationFrame(checkAndActivateSpooks);
}

export function activateSpooksOneByOne() {
    // Only proceed if game is actually running
    if (!running || paused) return;
    
    // Check if any menu is visible
    const menu = document.getElementById('game-menu');
    const controlsWindow = document.getElementById('controls-window');
    if (menu?.style.display === 'flex' || controlsWindow?.style.display === 'flex') {
        // If any menu is visible, deactivate all spooks
        entities.spooks.forEach(spook => {
            spook.deactivate();
            spook.stopMoving();
        });
        return;
    }

    // Activate the first spook immediately
    const inactiveSpooks = entities.spooks.filter(spook => !spook.active);
    if (inactiveSpooks.length > 0) {
        const firstSpook = inactiveSpooks[0];
        firstSpook.activate();
        firstSpook.startMoving();
        lastActivationTime = performance.now(); // Reset the last activation time
    }

    // Start the animation frame loop for the rest of the spooks
    requestAnimationFrame(checkAndActivateSpooks);
}
