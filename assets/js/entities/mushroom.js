class Mushroom extends Environment {
    constructor(game, { x, y }) {
        super(game);
        this.h = 50;
        this.w = 50;
        this.x = x + this.w / 2;
        this.y = y - this.h;
        this.offsets.y = 0;
        this.xFromEnvironment = -this.speedPerFrame / 4;
        this.inFall = false;
        this.interval = setInterval(() => this.xFromEnvironment = -this.xFromEnvironment, 3000)

        this.bindCollisions('.player');
        this.bindCollisions('.element.brick');
        this.bindCollisions('.element.mushroomspawner');
    }

    resetFall() {
        this.inFall = false;
        this.offsets.y = 0;
    }

    onFalling() {
        if (this.collisions.isBottom()) this.resetFall()
        else {
            this.inFall = true;
            const progress = Math.abs((this.y - gameConfig.BOTTOM_POINT) / gameConfig.BOTTOM_POINT);
            this.offsets.y = Math.abs(this.speedPerFrame * 2 * progress * 3);
        }
    }

    update(freezeX = false, freezeY = false) {
        this.onFalling();


        this.collisions.isInside((collisionEl) => {
            const { top } = collisionEl();

            if (collisionEl().classList.includes('player')) {
                this.removeElement()
                clearInterval(this.interval)
            }

            if (this.offsets.y > 0) {
                this.y = top - this.h;
                this.resetFall();
            }
        })

        this.collisions.isBottom((collisionEl) => {
            if (collisionEl().classList.includes('player')) {
                this.removeElement()
                clearInterval(this.interval)
            }
        })

        this.collisions.isLeft((collisionElement) => {
            if (collisionElement().classList.includes('player')) {
                return;
            }
            this.xFromEnvironment = -this.xFromEnvironment;
        })

        this.collisions.isRight((collisionElement) => {
            if (collisionElement().classList.includes('player')) {
                return;
            }
            this.xFromEnvironment = -this.xFromEnvironment;
        })

        if (!freezeX) this.x += -this.offsets.x + this.xFromEnvironment
        if (!freezeY) this.y += this.offsets.y
    }
}