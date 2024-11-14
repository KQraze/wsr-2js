class Environment extends CollisionEntity {
    constructor(game) {
        super(game);
        this.offsets = game.player.offsets;
    }

    update(freezeX = false, freezeY = true) {
        if (!freezeY) this.y += this.offsets.y;
        if (!freezeX && this.game.player.isFreeze.x) this.x += -this.offsets.x
    }
}

class Background extends Environment {
    constructor(game) {
        super(game);
    }

    update(freezeX = false, freezeY = false) {
        $('body').style.backgroundPositionX = `${this.x}px`
        super.update(freezeX, freezeY)
    }


    draw() {
        return null;
    }

    createElement() {
        return null;
    }
}

class Brick extends Environment {
    constructor(game, { x }) {
        super(game);
        this.x = x || this.chunkW;
        this.y = gameConfig.BOTTOM_POINT - 280;
        this.w = this.chunkW;
        this.h = this.chunkW;
    }
}

class MushroomSpawner extends Brick {
    constructor(game, { x }) {
        super(game, { x });
        this.spawned = false;
        this.bindCollisions('.player')
    }

    spawn() {
        if (this.spawned) return;
        this.spawned = true;
        this.game.generate(Mushroom, { x: this.x, y: this.y })
        this.element.classList.add('_spawned');
    }

    update(freezeX = false, freezeY = true) {
        this.collisions.isBottom((collisionElem) => {
            if (collisionElem().classList.some((className) => className === 'player')) {
                this.spawn()
            }
        })

        super.update(freezeX, freezeY);
    }
}

class Castle extends Environment {
    constructor(game, { x }) {
        super(game);
        this.w = 320;
        this.h = 376;
        this.y = gameConfig.BOTTOM_POINT - this.h - 18;
        this.x = x;
        this.bindCollisions('.player')
    }

    finish() {
        this.game.end(true);
    }

    update(freezeX = false, freezeY = true) {
        this.collisions.isInside((collisionElem) => {
            if (collisionElem().classList.some((className) => className === 'player')) {
                this.finish();
            }
        })

        super.update(freezeX, freezeY);
    }
}