class Game {
    constructor(user) {
        this.user = user;
        this.elements = [];
        this.player = this.generate(this.user.character === 'mario' ? Mario : Luigi);
        this.background = this.generate(Background);
        this.brick = this.generate(Brick);
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