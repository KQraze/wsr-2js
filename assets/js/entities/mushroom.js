class Mushroom extends Environment {
    constructor(game, { x, y }) {
        super(game);
        this.h = 50;
        this.w = 50;
        this.x = x + this.w / 2;
        this.y = y - this.h;
        this.speedX = 5;
        this.offsets.y = 0;
        this.inFall = false;

        this.interval = setInterval(() => {
            this.speedX = -this.speedX;
        }, 3000)
        this.bindCollisions('.player')
        this.bindCollisions('.element.brick')
        this.bindCollisions('.element.mushroomspawner')
    }

    resetFall() {
        this.inFall = false;
        this.offsets.y = 0;

    }

    onFalling() {
        if (this.collisions.isBottom()) {
            this.resetFall()
        } else {
            this.inFall = true;
            const progress = Math.abs((this.y - gameConfig.BOTTOM_POINT) / gameConfig.BOTTOM_POINT);
            this.offsets.y = Math.abs(this.speedPerFrame * 2 * progress * 3);
        }
    }

    update(freezeX = false, freezeY = false) {
        this.onFalling();

        this.collisions.isInside((collisionEl) => {
            const { top, selector } = collisionEl();

            if (collisionEl().classList.includes('player')) {
                this.removeElement()
            }

            console.log(selector)
            if (this.offsets.y > 0) {
                this.y = top - this.h;
                this.resetFall();
            }
        })

        this.collisions.isLeft((collisionElement) => {
            if (collisionElement().classList.includes('player')) {
                return;
            }
            this.speedX = 0
        })

        this.collisions.isRight((collisionElement) => {
            if (collisionElement().classList.includes('player')) {
                return;
            }
            this.speedX = 0;
        })

        this.offsets.x = this.game.player.offsets.x + -this.speedX;




        super.update(freezeX, freezeY);
    }
}