class Mushroom extends Environment {
    constructor(game, { x, y }) {
        super(game);
        this.h = 50;
        this.w = 50;
        this.x = x + this.w / 2;
        this.y = y - this.h;
        this.speedX = 5;
        this.interval = setInterval(() => {
            this.speedX = -5;
        }, 3000)
        this.bindCollisions('.player')
        this.bindCollisions('.element.brick')
    }

    update(freezeX = false, freezeY = false) {

        this.collisions.isLeft(() => {
            this.speedX = 0
        })

        this.collisions.isRight(() => {
            this.speedX = 0;
        })

        this.offsets.x = this.game.player.offsets.x + -this.speedX;
        this.offsets.y = 0;



        super.update(freezeX, freezeY);
    }
}