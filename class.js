import { entities } from "./game.js";

export class Entity {
    constructor(id, row, col) {
        this.element = document.getElementById(id);
        if (!this.element) {
            console.error(`Element with ID "${id}" not found.`);
            return;
        }
        this.row = row;
        this.col = col;
        this.position = [row, col];
        this.element.style.opacity = 0;
        this.element.style.visibility = 'hidden';
        this.active = false;
        entities.push(this);
        if (this.element.classList.contains('wall') || this.element.classList.contains('floor')){
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

        console.log(`Attempting to move to: row=${newRow}, col=${newCol}`);

        if (!this.collide(newRow, newCol)) {
            this.row = newRow;
            this.col = newCol;
            this.element.style.gridArea = `${this.row} / ${this.col}`;
            console.log(`Moved to: row=${this.row}, col=${this.col}`);
        }else {
            console.log(`Collision detected at: row=${newRow}, col=${newCol}`); // Log collision
        }
    }

    // The only identifier of the empty floor tile is backgound color
    // It have to be changed when we change colors or add emoji for the white floor tile.
    collide(newRow, newCol) {
        for (let entity of entities) {
            if (entity !== this && entity.row === newRow && entity.col === newCol && entity.active) {
                const backgroundColor = window.getComputedStyle(entity.element).backgroundColor;
                if (backgroundColor !== 'rgb(255, 255, 255)') { // Assuming white is the floor color
                    console.log("collide");
                    return true;
                }
            }
        }
        return false;
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
        this.element.textContent = '😇';
    }
}

export class Spook extends Entity {
    constructor(row, col) {
        super('spook', row, col);
        this.element.textContent = '👻';
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
        super(`floor-${row}-${col}`, row, col);
    }
}

export class Wall extends Entity {
    constructor(row, col) {
        super(`wall-${row}-${col}`, row, col);
        //this.element.textContent = '🪨'//
    }
}
