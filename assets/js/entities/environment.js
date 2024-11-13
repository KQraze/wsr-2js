class Environment extends CollisionEntity {
    constructor(game) {
        super(game);
        this.offsets = game.player.offsets;
    }

    update(freezeX = false, freezeY = true) {
        if (!freezeY) this.y += this.offsets.y;
        if (!freezeX && this.game.player.isFreeze.x) this.x += -this.offsets.x;
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
        this.x = x || 500;
        this.y = gameConfig.BOTTOM_POINT - 280;
        this.w = 70;
        this.h = 70;
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
            if (collisionElem().classList.some((className) => ['player'].includes(className))) {
                this.spawn()
            }
        })

        super.update(freezeX, freezeY);
    }
}