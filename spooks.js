import { running, paused } from "./states.js";
import { entities, delay } from "./game.js";

const spookCheckTime = 8000;

export function activateSpooksOneByOne() {
   
    if (!running || paused) return;
    
    const inactiveSpook = entities.spooks.find(spook => !spook.active);
    if (inactiveSpook) {
        inactiveSpook.activate();
        inactiveSpook.startMoving();
        
        // next activation with delay
        delay(spookCheckTime, activateSpooksOneByOne);
        console.log("Spook is activated")
    } else {
        //keep checking if no inactive
        requestAnimationFrame(activateSpooksOneByOne);
    }
}
