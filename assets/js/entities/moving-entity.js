class MovingEntity extends Drawable {
    constructor(game) {
        super(game);
        this.speedPerFrame = Math.floor(12 * gameConfig.SPEED_COEFFICIENT);
        this.collisions = {
            bottom: [() => this.isCollision($('#footer'))],
            left: [],
            right: [],
            top: [],
            isBottom: () => this.collisions.bottom.some((collision) => collision().isBottom),
            isLeft: () => this.collisions.left.some((collision) => collision().isLeft),
            isRight: () => this.collisions.right.some((collision) => collision().isRight),
            isTop: () => this.collisions.top.some((collision) => collision().isTop),
        }
        this.isFreeze = {
            x: false,
            y: false
        }
    }

    bindCollisions(selector) {
        $all(selector).forEach((element) => {
            this.collisions.bottom.push(() => this.isCollision(element));
            this.collisions.left.push(() => this.isCollision(element));
            this.collisions.right.push(() => this.isCollision(element));
            this.collisions.top.push(() => this.isCollision(element));
        })
    }

    isCollision(element) {
        const COLLISION_STEP = 24;

        const elem1 = this.element.getBoundingClientRect();
        const elem2 = element.getBoundingClientRect();

        const isLeft = elem1.left <= elem2.right && elem2.right - elem1.left < COLLISION_STEP && intersectionY();
        const isRight = elem1.right >= elem2.left && elem1.right - elem2.left < COLLISION_STEP && intersectionY();
        const isTop = elem1.top <= elem2.bottom && elem2.bottom - elem1.top < COLLISION_STEP && intersectionX();
        const isBottom = elem1.bottom >= elem2.top && elem1.bottom - elem2.top < COLLISION_STEP && intersectionX();

        function intersectionX() {
            return (elem1.left - elem2.right) * (elem2.left - elem1.right) > 0
        }
        function intersectionY() {
            return (elem1.top - elem2.bottom) * (elem2.top - elem1.bottom) > 0
        }

        return { isLeft, isRight, isTop, isBottom }
    }
}