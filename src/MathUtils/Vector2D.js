export class Vector2D {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {number}
     */
    getLength() {
        return Math.sqrt(this.dot(this));
    }

    dot(another) {
        return this.x*another.x + this.y*another.y;
    }

    /**
     * @param {number} number
     * @returns {Vector2D}
     */
    multipleByScalar(number) {
        return new Vector2D(this.x*number, this.y*number);
    }

    /**
     * @param {number} number
     * @returns {Vector2D}
     */
    divideByScalar(number) {
        return this.multipleByScalar(1/number);
    }

    /**
     * @param {Vector2D} another
     * @returns {Vector2D}
     */
    add(another) {
        return new Vector2D(this.x+another.x, this.y+another.y);
    }

    /**
     * @param {Vector2D} another
     * @returns {Vector2D}
     */
    subtractVector(another) {
        return new Vector2D(this.x-another.x, this.y-another.y);
    }

    /**
     * @returns {Vector2D}
     */
    getUnitVector() {
        return this.divideByScalar(this.getLength());
    }

}