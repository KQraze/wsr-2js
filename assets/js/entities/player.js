class Player extends Drawable {
    constructor(game) {
        super(game);
        this.h = 120;
        this.w = this.h * 0.7;
        this.x = 700;
        // this.y = gameConfig.BOTTOM_POINT - 200;
        this.y = 0;
        this.jumpHeight = 200;
        this.targetY = null;
        this.speedPerFrame = Math.floor(12 * gameConfig.SPEED_COEFFICIENT);
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

    onFalling() {
        if (this.inJump) return;
        if (
            this.isCollision($('#footer')).isBottom || this.isCollision($('.element.brick')).isBottom
        ) {
            this.inFall = false;
            this.offsets.y = 0;
            this.element.classList.remove('_jumped')
        } else {
            this.inFall = true;
            this.offsets.y = this.speedPerFrame  * 2;
        }
    }

    onJump() {
        requestAnimationFrame(() => {
            if (!this.inJump) return;

            if (
                this.targetY && (this.targetY + 10 >= this.y) ||
                this.isCollision($('.element.brick')).isTop
            ) {
                this.targetY = null;
                this.inJump = false;
                return;
            }
            if (!this.targetY) this.targetY = this.y - this.jumpHeight;

            const progress = Math.abs((this.targetY - this.y) / this.jumpHeight);
            this.offsets.y = progress < 0.05 ? -Math.abs(this.speedPerFrame * 2 * progress) : -this.speedPerFrame;

            this.onJump();
        })
    }

    onArrowLeft() {
        this.element.classList.add('_go-left');
        this.offsets.x = -(this.speedPerFrame);
        if (this.x < 0 || this.isCollision($('.element.brick')).isLeft) {
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
        if (this.isCollision($('.element.brick')).isRight) {
            this.offsets.x = 0;
        }
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

        if (this.keys.ArrowUp) this.onArrowUp();
        if (this.x > innerWidth / 3) freezeX = true;
        if (this.keys.ArrowLeft) {
            this.onArrowLeft()

            return super.update(freezeX);
        }
        else this.unArrowLeft();

        if (this.keys.ArrowRight) {
            this.onArrowRight()

            return super.update(freezeX);
        }
        else this.unArrowRight();

        return super.update(freezeX, freezeY);
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