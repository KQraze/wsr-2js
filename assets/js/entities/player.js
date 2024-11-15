class Player extends CollisionEntity {
    constructor(game) {
        super(game);
        this.h = 120;
        this.w = this.h * 0.7;
        this.x = 100;
        this.y = gameConfig.BOTTOM_POINT - 200;
        this.jumpHeight = 300;
        this.targetY = null;
        this.inJump = false;
        this.inFall = false;
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
        }
        this.bindKeyEvents();
    }

    bindKeyEvents() {
        document.onkeydown = (e) => this.changeKeyStatus(e.code, true);
        document.onkeyup = (e) => this.changeKeyStatus(e.code, false);
    }

    changeKeyStatus(code, value) {
        if (code in this.keys) this.keys[code] = value;
    }

    resetFall() {
        this.inFall = false;
        this.offsets.y = 0;
        this.element.classList.remove('_jumped')
    }

    onFalling() {
        if (this.inJump) return;
        if (this.collisions.isBottom()) {
            this.resetFall()
        } else {
            this.inFall = true;
            const progress = Math.abs((this.y - gameConfig.BOTTOM_POINT) / gameConfig.BOTTOM_POINT);
            this.offsets.y = Math.abs(this.speedPerFrame * 2 * progress * 3);
        }
    }

    resetJump() {
        this.targetY = null;
        this.inJump = false;
    }

    onJump() {
        requestAnimationFrame(() => {
            if (!this.inJump) return;

            let isTop = this.collisions.isTop()

            if (this.targetY && (this.targetY + 10 >= this.y) || isTop) {
                this.resetJump()
                return;
            }
            if (!this.targetY) this.targetY = this.y - this.jumpHeight;

            const progress = Math.abs((this.targetY - this.y) / this.jumpHeight);
            this.offsets.y = -Math.abs(this.speedPerFrame * 2 * progress * 2);

            this.onJump();
        })
    }

    onArrowLeft() {
        this.element.classList.add('_go-left');
        this.offsets.x = -this.speedPerFrame;

        let isLeft = this.collisions.isLeft()

        if (this.x < 0 || isLeft) {
            this.offsets.x = 0;
        }
    }

    unArrowLeft() {
        this.element.classList.remove('_go-left');
        this.offsets.x = 0;
    }

    onArrowRight() {
        this.element.classList.add('_go-right');
        this.offsets.x = this.speedPerFrame;

        this.collisions.isRight(() => {
            this.offsets.x = 0;
        })
    }

    unArrowRight() {
        this.element.classList.remove('_go-right');
        this.offsets.x = 0;
    }

    onArrowUp() {
        if (this.inJump || this.inFall) return;
        this.element.classList.add('_jumped');
        this.inJump = true;
        this.onJump()
    }

    update(freezeX = false, freezeY = false) {
        this.onFalling();

        this.collisions.isInside((collisionEl) => {
            const { top, bottom, COLLISION_STEP, element, selector } = collisionEl();

            console.log(selector)
            if (this.offsets.y > 0) {
                this.y = top - this.h;
                this.resetFall();
            } else {
                this.y = bottom + COLLISION_STEP;
            }
        })

        if (this.keys.ArrowUp) this.onArrowUp();
        if (this.x > innerWidth / 3) this.isFreeze.x = true;
        if (this.keys.ArrowLeft) {
            this.onArrowLeft()

            return super.update(this.isFreeze.x, this.isFreeze.y);
        }
        else this.unArrowLeft();

        if (this.keys.ArrowRight) {
            this.onArrowRight()

            return super.update(this.isFreeze.x, this.isFreeze.y);
        }
        else this.unArrowRight();

        return super.update(this.isFreeze.x, this.isFreeze.y);
    }
}

class Mario extends Player {
    constructor(game) {
        super(game);
        this.setClassName(`element player mario`)
    }
}

class Luigi extends Player {
    constructor(game) {
        super(game);
        this.setClassName(`element player luigi`)
    }
}