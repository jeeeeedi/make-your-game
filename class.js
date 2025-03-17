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

        if (!this.collide([newRow, newCol])) {
            this.row = newRow;
            this.col = newCol;
            this.element.style.transform = `translate(${this.col * 40}px, ${this.row * 40}px)`;
        }
    }
    collide(position) {
        return this.row === position[0] && this.col === position[1];
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
        super('floor', row, col);
    }
}
