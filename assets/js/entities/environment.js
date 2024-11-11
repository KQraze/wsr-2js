class Environment extends Drawable {
    constructor(game) {
        super(game);
        this.offsets = game.player.offsets;
    }

    update(freezeX = false, freezeY = true) {
        if (!freezeY) this.y += this.offsets.y;
        if (!freezeX) this.x += -this.offsets.x;
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

class Block extends Environment {
    constructor(game) {
        super(game);
        this.w = 50;
        this.h = 50;
    }
}

class Brick extends Environment {
    constructor(game, { x, y }) {
        super(game);
        this.x = x || 500;
        this.y = y || gameConfig.BOTTOM_POINT - 250;
        this.w = 320;
        this.h = 80;
        this.blocks = [Block, Block, Block, Block].map((className, index) => {
            const block = (new className(game));
            block.y = this.y;
            block.x = this.x + index * block.w;
            game.generate(Block);
        });
    }
}

