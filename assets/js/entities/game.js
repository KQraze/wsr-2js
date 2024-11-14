class Game {
    constructor(user) {
        this.user = user;
        this.chunkW = 70;
        this.startGamePos = 500;
        this.elements = [];
        this.player = this.generate(this.user.character === 'mario' ? Mario : Luigi);
        this.generateEnvironment();
    }

    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => {
            this.updateElements();
            this.loop();
        })
    }

    generateEnvironment() {
        this.background = this.generate(Background);
        this.generateElementsByChunk(MushroomSpawner, '.element.mushroomspawner', 5, 34, 58, 88)
        this.generateElementsByChunk(Brick, '.element.brick',
            1, 2, 3, 4,
            6,
            14, 15, 16,
            24, 25, 26, 27,
            33, 35,
            43,
            53, 54, 55, 56, 57,
            67, 68, 69, 70,
            77,
            86, 87, 89,
            102, 103, 104
        )
        this.generateElementsByChunk(Enemy, '.element.enemy', 10, 24, 46, 68, 83, 108)
    }

    generateElementsByChunk(className, collisionSelector, ...chunkNumbers) {
        chunkNumbers.forEach((chunkNumber) => {
            this.generate(className, { x: this.startGamePos + this.chunkW * chunkNumber })
        })

        collisionSelector ? this.player.bindCollisions(collisionSelector) : null;
    }

    generate(className, options = {}) {
        let element = new className(this, options);
        this.elements.push(element);
        return element;
    }

    removeElement(el) {
        let index = this.elements.indexOf(el);
        if (index !== -1) {
            this.elements.splice(index, 1);
            return true;
        }
        return false;
    }

    updateElements() {
        this.elements.forEach((element) => {
            element.update();
            element.draw();
        })
    }
}