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
        this.voltage = voltage;
        this.charge = charge;
        this.position = position;
        this.chargesPosition = [new Vector2D(position.x, position.y-0.05), new Vector2D(position.x, position.y+0.05)];
        this.on = on;
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getField(particlePosition) {
        if (!this.on)
            return new Vector2D(0, 0);

        //assume that q1=1 so E= (q2/r^2) * separated vector
        let separationVector1 = this.getSeparationVector(particlePosition, this.chargesPosition[0]);
        let separationVector2 = this.getSeparationVector(particlePosition, this.chargesPosition[1]);
        return separationVector1.getUnitVector().multipleByScalar(
            this.charge/separationVector1.dot(separationVector1)) .add(
                separationVector2.getUnitVector().multipleByScalar(
            this.charge/separationVector2.dot(separationVector2)))
    }

    /**
     * @param particlePosition{Vector2D}
     * @param chargePosition{Vector2D}
     * @returns {Vector2D}
     */
    getSeparationVector(particlePosition, chargePosition) {
        return particlePosition.subtractVector(chargePosition)
    }

}
