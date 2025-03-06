export function game() {
    const player = createPlayer();
    setupMovement(player);
}

const svg = document.querySelector('svg');
const svgWidth = svg.getAttribute('width');
const svgHeight = svg.getAttribute('height');
const centerX = svgWidth / 2;
const centerY = svgHeight / 2;

function createPlayer() {
    // Get the player group element from the DOM
    let playerGrp = document.getElementById('playerGrp');

    // Create the player text element
    let player = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    player.classList.add('player');
    player.setAttribute('x', centerX);
    player.setAttribute('y', centerY);
    player.textContent = '😇';

    // Append the player text to the player group
    playerGrp.appendChild(player);
    return player;
}

let startPos = { top: centerY, left: centerX };

function setupMovement(player) {
    let playerPos = startPos;
    const speed = 10;
    const keys = {};

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        console.log(`Key down: ${e.key}`); // Debug log
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        console.log(`Key up: ${e.key}`); // Debug log
    });

    function hasPermanentElems(newX, newY) {
        const permanentGrp = document.querySelectorAll('#permanentGrp rect');
        for (let element of permanentGrp) {
            const rect = element.getBBox();
            if (newX + 40 >= rect.x && newX <= rect.x + rect.width && newY >= rect.y && newY + 40 <= rect.height) {
                return true;
            }
        }
        return false;
    }

    function updatePosition() {
        let newX = playerPos.left;
        let newY = playerPos.top;

        if (keys['ArrowUp'] && playerPos.top > 0) newY -= speed;
        if (keys['ArrowDown'] && playerPos.top < svgHeight - 40) newY += speed;
        if (keys['ArrowLeft'] && playerPos.left > 0) newX -= speed;
        if (keys['ArrowRight'] && playerPos.left < svgWidth - 40) newX += speed;

        console.log(`New position: (${newX}, ${newY})`); // Debug log

        if (!hasPermanentElems(newX, newY)) {
            playerPos = { left: newX, top: newY }; // Update playerPos with new coordinates
            player.setAttribute('x', playerPos.left);
            player.setAttribute('y', playerPos.top);
            console.log(`Player moved to: (${playerPos.left}, ${playerPos.top})`); // Debug log
        }

        requestAnimationFrame(updatePosition);
    }

    updatePosition();
}