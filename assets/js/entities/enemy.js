class Enemy extends Environment {
    constructor(game, { x }) {
        super(game);
        this.x = x;
        this.h = 80;
        this.w = 80;
        this.y = gameConfig.BOTTOM_POINT - 200;
        this.offsets.y = 0;
        this.xFromEnvironment = -this.speedPerFrame;
        this.inFall = false;
        this.interval = setInterval(() => this.rotateEnemy(), 3000)
        this.bindCollisions('.player')
    }

    resetFall() {
        this.inFall = false;
        this.offsets.y = 0;
    }

    rotateEnemy() {
        this.xFromEnvironment = -this.xFromEnvironment
        this.element.classList.toggle('_go-right')
    }

    onFalling() {
        if (this.collisions.isBottom()) this.resetFall()
        else {
            this.inFall = true;
            const progress = Math.abs((this.y - gameConfig.BOTTOM_POINT) / gameConfig.BOTTOM_POINT);
            this.offsets.y = Math.abs(this.speedPerFrame * 2 * progress * 3);
        }
    }

    kill() {
        this.dropCollisions();
        clearInterval(this.interval);
        this.element.classList.add('_killed')
        setTimeout(() => this.removeElement(),1000)
    }

    update(freezeX = false, freezeY = false) {
        this.onFalling();

        this.collisions.isInside((collisionEl) => {
            const { top } = collisionEl();

            if (this.offsets.y > 0) {
                this.y = top - this.h;
                this.resetFall();
            }
        })

        this.collisions.isTop((collisionEl) => {
            if (collisionEl().classList.includes('player')) {
                this.kill();
            }
        })

        this.collisions.isBottom((collisionEl) => {
            if (collisionEl().classList.includes('player')) {
                // this.removeElement()
                // clearInterval(this.interval)
            }
        })

        this.collisions.isLeft((collisionElement) => {
            if (collisionElement().classList.includes('player')) {
                this.game.player.inJump = true;
                this.game.player.onJump();
                this.rotateEnemy()
            }
        })

        this.collisions.isRight((collisionElement) => {
            if (collisionElement().classList.includes('player')) {
                this.game.player.inJump = true;
                this.game.player.onJump();
                this.rotateEnemy()
            }
        })

        if (!freezeX && this.game.player.isFreeze.x) this.x += -this.offsets.x + this.xFromEnvironment
        if (!freezeY) this.y += this.offsets.y
    }
}