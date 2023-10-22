import {Vector2D} from "../MathUtils/Vector2D.js";

export class IonPulser {
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
        this.on = on;
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getField(particlePosition) {
        //assume that q1=1 so E= (q2/r^2) * separated vector
        let separationVector = this.getSeparationVector(particlePosition); //maybe the sign must be different
        return separationVector.getUnitVector().multipleByScalar(
            this.charge/separationVector.dot(separationVector))
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getSeparationVector(particlePosition) {
        return particlePosition.subtractVector(this.position)
    }

}
