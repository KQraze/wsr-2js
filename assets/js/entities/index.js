class Drawable {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offsets = {
            x: 0,
            y: 0
        }
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.setClassName();
        $('#gameplay').append(this.element);
    }

    setClassName(className = `element ${this.constructor.name.toLowerCase()}`) {
        this.element.className = className;
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



        function isAll() {
            return isLeft && isRight && isTop && isBottom;
        }

        return { isLeft, isRight, isTop, isBottom, isAll }
    }

    draw() {
        this.element.style = `
            top: ${this.y}px;
            left: ${this.x}px;
            width: ${this.w}px;
            height: ${this.h}px;
        `
    }

    update(freezeX = false, freezeY = false) {
        if (!freezeY) this.y += this.offsets.y;
        if (!freezeX) this.x += this.offsets.x;
    }
}