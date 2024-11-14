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
        this.bindCollisions('.element.castle')
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

    takeDamage() {
        this.game.hp -= 4;
        this.game.player.inJump = true;
        this.game.player.onJump();
        this.rotateEnemy()
    }

    kill() {
        this.game.points += 200;
        this.dropCollisions();
        clearInterval(this.interval);
        this.element.classList.add('_killed')
        setTimeout(() => this.removeElement(),1000)
    }

    update(freezeX = false, freezeY = false) {
        this.onFalling();

        this.collisions.isInside((collisionEl) => {
            const { top } = collisionEl();

            if (collisionEl().classList.includes('castle')) {
                this.xFromEnvironment = -this.xFromEnvironment
            }

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

        this.collisions.isLeft((collisionElement) => {
            console.log(collisionElement().classList);
            if (collisionElement().classList.includes('castle')) {
                this.xFromEnvironment = -this.xFromEnvironment
            }
            if (collisionElement().classList.includes('player')) {
                this.takeDamage();
            }
        })

        this.collisions.isRight((collisionElement) => {
            console.log(collisionElement().classList);
            if (collisionElement().classList.includes('castle')) {
                this.xFromEnvironment = -this.xFromEnvironment;
                console.log('collision')

            }
            if (collisionElement().classList.includes('player')) {
                this.takeDamage();
            }
        })

        if (!freezeX && this.game.player.isFreeze.x) this.x += -this.offsets.x + this.xFromEnvironment
        if (!freezeY) this.y += this.offsets.y
    }
}