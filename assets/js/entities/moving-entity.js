class MovingEntity extends Drawable {
    constructor(game) {
        super(game);
        this.speedPerFrame = Math.floor(12 * gameConfig.SPEED_COEFFICIENT);
        this.collisions = {
            bottom: [() => this.isCollision($('#footer'))],
            left: [],
            right: [],
            top: [],
            inside: [() => this.isCollision($('#footer'))],
            isBottom: () => this.collisions.bottom.some((collision) => collision().isBottom),
            isLeft: () => this.collisions.left.some((collision) => collision().isLeft),
            isRight: () => this.collisions.right.some((collision) => collision().isRight),
            isTop: () => this.collisions.top.some((collision) => collision().isTop),
            isInside: (callbackFn) => callbackFn(this.collisions.inside.find((collision) => collision().isInside)),
        }
        this.isFreeze = {
            x: false,
            y: false
        }
    }

    bindCollisions(selector) {
        $all(selector).forEach((element) => {
            Object.entries(this.collisions)
                .forEach(([key, value]) => {
                    if (typeof value !== "function") {
                        this.collisions[key].push(() => this.isCollision(element))
                    }
                })
        })
    }

    isCollision(element) {
        const COLLISION_STEP = this.speedPerFrame * 2;

        const elem1 = this.element.getBoundingClientRect();
        const elem2 = element.getBoundingClientRect();

        const isInside =
            elem1.left <= elem2.right - COLLISION_STEP
            && elem1.right >= elem2.left + COLLISION_STEP
            && elem1.top <= elem2.bottom - COLLISION_STEP
            && elem1.bottom >= elem2.top + COLLISION_STEP

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

        return {
            isLeft,
            isRight,
            isTop,
            isBottom,
            isInside,
            element,
            left: elem2.left,
            right: elem2.right,
            bottom: elem2.bottom,
            top: elem2.top
        }
    }
}