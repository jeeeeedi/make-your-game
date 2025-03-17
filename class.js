export class Entity {
    constructor(id, row, col) {
        this.element = document.getElementById(id);
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
            this.element.style.opacity = 100;  // Show entity
            this.element.style.visibility = 'visible';  // Ensure it's visible
        }
    }
    deactivate() {
        if (this.active) {
            this.active = false;
            this.element.style.opacity = 0;  // Hide entity (keep it in the layout, but invisible)
            this.element.style.visibility = 'hidden';  // Make it non-interactive
        }
    }
    move(rowChange, colChange) {
        if (!this.collide([this.row + rowChange, this.col + colChange])) {
            this.row += rowChange;
            this.col += colChange;
            this.style.transform = `translate(${this.col * 40}px, ${this.row * 40}px)`;
            //this.updatePosition(); // Update position
        }
    }
    collide(position) {
        return this.row === position[0] && this.col === position[1];
    }
    /* updatePosition() {
        this.style.transform = `translate(${this.col * 40}px, ${this.row * 40}px)`;
    } */
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
    }
}

export class Bomb extends Entity {
    constructor(row, col) {
        super('bomb', row, col);
    }
}

export class Explosion extends Entity {
    constructor(row, col) {
        super('explosion', row, col);
    }
}

export class Door extends Entity {
    constructor(row, col) {
        super('door', row, col);
    }
}

export class Floor extends Entity {
    constructor(row, col) {
        super('floor', row, col);
    }
}

export class Destructible extends Entity {
    constructor(row, col) {
        super('destructible', row, col);
    }
}

//instantiate entities
export let player = new Player(9, 9); // Player starts at center
export let spook = new Spook(0, 0);
export let bomb = new Bomb(0, 0);
export let explosion = new Explosion(0, 0);
export let door = new Door(0, 0);
export let floor = new Floor(0, 0);
export let destructible = new Destructible(0, 0);