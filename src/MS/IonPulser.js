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

        return new Vector2D(
            this.calculateTheFirstCoordinateDefiniteIntegral(a, b),
            this.calculateTheSecondCoordinateDefiniteIntegral(a, b),
            ).multipleByScalar(this.charge*8.9*10e9 /(2*Math.PI));
    }

    /**
     * @param a{number}
     * @param b{number}
     * @returns {number}
     */
    calculateTheFirstCoordinateDefiniteIntegral(a, b) {
        return 2*a*Math.PI*Math.sqrt(2)/this.calculateDenominator(a, b);
    }

    /**
     * @param a{number}
     * @param b{number}
     * @returns {number}
     */
    calculateTheSecondCoordinateDefiniteIntegral(a, b) {
        return (2*b*Math.sqrt(2)*Math.PI) / this.calculateDenominator(a, b);
    }

    /**
     * @param a{number}
     * @param b{number}
     * @returns {number}
     */
    calculateDenominator(a, b) {
        return 3*Math.sqrt(2*a*a + 2*b*b);
    }

}
