class Drawable {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offsets = {
            x: 0,
            y: 0,
            xFromEnvironment: 0,
        }
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.setClassName();
        $('#gameplay').append(this.element);
    }

    setClassName(className = `element ${this.constructor.name.toLowerCase()}`) {
        this.element.className = className;
    }

    removeElement() {
        if(this.game.removeElement(this)) {
            this.element.remove();
        }
    }


    draw() {
        this.element.style = `
            top: ${this.y}px;
            left: ${this.x}px;
            width: ${this.w}px;
            height: ${this.h}px;
        `
    }

    update(freezeX = false, freezeY = false) {
        if (!freezeY) this.y += this.offsets.y;
        if (!freezeX) this.x += this.offsets.x;
    }
}