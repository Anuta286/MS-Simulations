import {Vector2D} from "../MathUtils/Vector2D.js";

export class IonPulser {
    static WORKING_TIME = 40 ; // in ms // for reflectron ignored

    /**
     * @param voltage{number}
     * @param charge{number}
     * @param position{Vector2D}
     * @param on{boolean}
     * @param angle{number} //in radians
     */
    constructor(voltage, charge, position, on, angle) {
        this.voltage = voltage; //qV = 1/2 mu^2 electrical potential //to be used instead of charge
        this.charge = charge;
        this.position = position;
        this.on = on;
        this.angle = angle; // for rotating the reflectron
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getField(particlePosition) {
        if (!this.on)
            return new Vector2D(0, 0);
        if (particlePosition.subtractVector(this.position).getLength()>0.51)
            return new Vector2D(0, 0); //rewrite with zero-constant


        let newPosition = particlePosition.subtractVector(this.position);
        newPosition = newPosition.rotate(this.angle);

        return new Vector2D( // very simplified because of integrating from 0 to 2pi
            this.calculateTheFirstCoordinateDefiniteIntegral(newPosition.x, newPosition.y),
            this.calculateTheSecondCoordinateDefiniteIntegral(newPosition.x, newPosition.y),
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
