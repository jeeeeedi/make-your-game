import { entities } from "./game.js";
import { checkCollisions } from "./states.js";

export const gameBoard = document.getElementById('game-board');

export class Entity {
    constructor(id, row, col) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.classList.add(`${id}`);
        gameBoard.appendChild(this.element);
        // if (!this.element) {
        //     console.error(`Element with ID "${id}" not found.`);
        //     return;
        // }
        this.row = row;
        this.col = col;
        this.position = [row, col];
        this.element.style.opacity = 0;
        this.element.style.visibility = 'hidden';
        this.active = false;
        if (this.element.classList.contains('wall') || this.element.classList.contains('floor')) {
            this.activate();
        };
    }
    activate() {
        if (!this.active) {
            this.active = true;
            this.element.style.opacity = '1';  // Show entity
            this.element.style.visibility = 'visible';  // Ensure it's visible
        }
    }
    deactivate() {
        if (this.active) {
            this.active = false;
            this.element.style.opacity = '0';  // Hide entity (keep it in the layout, but invisible)
            this.element.style.visibility = 'hidden';  // Make it non-interactive
        }
    }
    move(rowChange, colChange) {
        let newRow = this.row + rowChange;
        let newCol = this.col + colChange;
        const targetEntity = entities.all.find(entity => entity.row === newRow && entity.col === newCol);
        if (targetEntity && targetEntity.element.classList.contains('floor')) {
            this.row = newRow;
            this.col = newCol;
            this.element.style.gridArea = `${this.row} / ${this.col}`;
            console.log(`Moved to: row=${this.row}, col=${this.col}`);
            checkCollisions();
        } else {
            console.log(`Collision detected at: row=${newRow}, col=${newCol}`); // Log collision
            if (this instanceof Spook) {
                this.randomMove(); // Retry movement in a different direction
            }
        }
    }


    updatePosition(row, col) {
        this.row = row;
        this.col = col;
        this.element.style.gridArea = `${this.row} / ${this.col}`;
    }
}

export class Player extends Entity {
    constructor(row, col) {
        super('player', row, col);
        this.activate();
        this.element.textContent = '😇';
    }
}

export class Spook extends Entity {
    constructor(row, col) {
        super('spook', row, col);
        this.element.textContent = '👻';
    }
    randomMove() {
        const directions = [
            { rowChange: -1, colChange: 0 }, // Up
            { rowChange: 1, colChange: 0 },  // Down
            { rowChange: 0, colChange: -1 }, // Left
            { rowChange: 0, colChange: 1 }   // Right
        ];
        let canMove = false;
        while (!canMove) {
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            const newRow = this.row + randomDirection.rowChange;
            const newCol = this.col + randomDirection.colChange;
            const targetEntity = entities.all.find(entity => entity.row === newRow && entity.col === newCol);
            if (targetEntity && targetEntity.element.classList.contains('floor')) {
                this.move(randomDirection.rowChange, randomDirection.colChange);
                canMove = true;
            }
        }
    }
}

export class Bomb extends Entity {
    constructor(row, col) {
        super('bomb', row, col);
        this.element.textContent = '💣';
    }
}

export class Explosion extends Entity {
    constructor(row, col) {
        super('explosion', row, col);
        this.element.textContent = '💥';
    }
}

export class Door extends Entity {
    constructor(row, col) {
        super('door', row, col);
        this.element.textContent = '🚪';
    }
}

export class Floor extends Entity {
    constructor(row, col) {
        super(`floor`, row, col);
        this.activate();
    }
}

export class Destructible extends Entity {
    constructor(row, col) {
        super(`destructible`, row, col);
        this.activate();
    }
}

export class Wall extends Entity {
    constructor(row, col) {
        super(`wall`, row, col);
        this.activate();
    }
}
