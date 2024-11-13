class Game {
    constructor(user) {
        this.user = user;
        this.elements = [];
        this.player = this.generate(this.user.character === 'mario' ? Mario : Luigi);
        this.generateBricks(15);
        this.generateSpawners(15)
        this.background = this.generate(Background);
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

    generateSpawners(count) {
        for (let i = 0; i < count; i++) {
            this.generate(MushroomSpawner, {
                x: getRandom(400, 10000),
            })
        }

        this.player.bindCollisions('.element.mushroomspawner');
    }

    generateBricks(count) {
        for (let i = 0; i < count; i++) {
            this.generate(Brick, {
                x: getRandom(400, 10000),
            })
        }

        this.player.bindCollisions('.element.brick');
    }

    generate(className, options = {}) {
        let element = new className(this, options);
        this.elements.push(element);
        return element;
    }

    updateElements() {
        this.elements.forEach((element) => {
            element.update();
            element.draw();
        })
    }
}