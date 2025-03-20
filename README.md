# make-your-game TO-DO LIST 📋

Game runs at at least 60 FPS at all times

No frame drops!

Proper use of RequestAnimationFrame

It is very hard to predict performances in JS. So measure performances to see if your code is fast. This will be tested!

Pause menu, that includes:
    - Continue
    - Restart
    - For the pause menu you must be able to pause, restart, and continue the game whenever you want to do so. The frames should not drop if paused.

✔️ A score board that displays the following metrics:
    - Countdown clock or Timer that will indicate the amount of time the player has until the game ends or the time that the game has been running
    - ✔️ Score that will display the current score (XP or points)
    - ✔️ Lives that shows the number of lives that the player has left

The use of layers must be minimal but not zero in order to optimize the rendering performance.

✔️ You must not use frameworks or canvas, the game must be implemented using plain JS/DOM and HTML only

✔️ the player must only use the keyboard

✔️ no key spamming: if a key is kept pressed, the player must continue to do the relevant action. If the key is released the player should stop doing the action.

✔️ motions triggered by a key must not jank or stutter.


Some current issues that would be good to fix also:
- Pause: should also pause spooks movement and spawning
- Win: should stop everything and maybe open a dialog to congratulate and ask if user wants to play again.
- ✔️ Bomb: if player is on adjacent tile (not just on the same tile), then lives should also be decreased
- Instructions and controls can be a pop-up
- Layers: some unnecessary layers are being repainted sometimes when bomb is dropped

Additional features:
- bonus that can add lives or add time
- player/theme options
- bomberman name/label changes
- overall design
- 