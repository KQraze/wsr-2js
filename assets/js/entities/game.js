class Game {
    constructor(user) {
        this.user = user;
        this.chunkW = 70;
        this.startGamePos = 600;
        this.elements = [];
        this.points = 0;
        this.hp = 20;
        this.player = this.generate(this.user.character === 'mario' ? Mario : Luigi);
        this.frames = 0;
        this.timer = 0;
        this.ended = false;
        this.setTimer();
        this.generateEnvironment();
    }

    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => {
            if (this.ended) return;
            this.frames++;
            if (this.frames % getFps() === 0 && this.player.isFreeze.x) {
                this.timer++
                this.setTimer();
            }

            if (this.hp <= 0) {
                this.end()
            }

            this.updateElements();
            this.setParams();
            this.loop();
        })
    }

    setTimer() {
        const minutes = Math.trunc(this.timer / 60);
        const seconds = this.timer % 60;
        $(`#time`).innerHTML = `${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0')
        $(`#end-time`).innerHTML = `${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0')
    }

    generateEnvironment() {
        this.background = this.generate(Background);
        this.generateElementsByChunk(MushroomSpawner, '.element.mushroomspawner', 5, 34, 58, 88);
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
        );
        this.generateElementsByChunk(Castle, null, 118);
        this.generateElementsByChunk(Enemy, null, 10, 24, 46, 68, 83, 108);
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

    setParams() {
        let params = ['name', 'points', 'hp']
        let values = [this.user.name, this.points, this.hp];

        params.forEach((param, index) => $(`#${param}`).innerHTML = values[index])
    }

    end(fromFinish = false) {
        this.ended = true;
        if (fromFinish) {
            $('#end-title').innerHTML = 'WON';
            $('#end-title').className = 'text-success'
        } else {
            $('#end-title').innerHTML = 'LOSE';
            $('#end-title').className = 'text-danger'
        }
        $('#end-score').innerHTML = this.points;
        go('end');
    }
}