import {Vector2D} from "../MathUtils/Vector2D.js";

export class IonPulser {
    static WORKING_TIME = 40 ; // in ms

    /**
     * @param voltage{number}
     * @param charge{number}
     * @param position{Vector2D}
     * @param on{boolean}
     */
    constructor(voltage, charge, position, on) {
        this.voltage = voltage; //qV = 1/2 mu^2 electrical potential
        this.charge = charge;
        this.position = position;
        this.on = on;
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getField(particlePosition) { // should recalculate
        if (!this.on)
            return new Vector2D(0, 0);
        if (particlePosition.subtractVector(this.position).getLength()>0.51)
            return new Vector2D(0, 0); //rewrite with zero-constant


        let a = particlePosition.x - this.position.x;
        let b = particlePosition.y - this.position.y;
        let r  = 0.5; // ?

        return new Vector2D(
            this.calculateTheFirstCoordinateDefiniteIntegral(a, b, r),
            this.calculateTheSecondCoordinateDefiniteIntegral(a, b, r),
            ).multipleByScalar(r*this.charge*8.9*10e9 /(2*Math.PI)); // r!!
    }

    /**
     * @param a{number}
     * @param b{number}
     * @param r{number}
     * @returns {number}
     */
    calculateTheFirstCoordinateDefiniteIntegral(a, b, r) {
        return 2*a*Math.PI*Math.sqrt(2)/this.calculateDenominator(a, b, r, 2*Math.PI);
    }

    /**
     * @param a{number}
     * @param b{number}
     * @param r{number}
     * @returns {number}
     */
    calculateTheSecondCoordinateDefiniteIntegral(a, b, r) {
        let one = r*Math.sqrt(2)/this.calculateDenominator(a, b, r, 0);
        let two = (2*b*Math.sqrt(2)*Math.PI + r*Math.sqrt(2)) /this.calculateDenominator(a, b, r, 2*Math.PI);
        return two-one;
    }

    /**
     * @param a{number}
     * @param b{number}
     * @param r{number}
     * @param x{number}
     * @returns {number}
     */
    calculateDenominator(a, b, r, x) {
        return 3*Math.sqrt(2*Math.pow(a, 2) - 2*r*Math.sin(x) + 2*Math.pow(b, 2) - 4*b*r*Math.sin(x)
            + Math.pow(r, 2) - Math.pow(r, 2)*Math.cos(2*x));
    }

}
