import {Vector2D} from "../MathUtils/Vector2D.js";
import {IonPulser} from "./IonPulser.js";

export class Reflectron {

    /**
     * @param maxCharge{number}
     * @param maxPosition{Vector2D}
     * @param angle{number} //in radians
     */
    constructor(maxCharge, maxPosition, angle) {
        this.rings = [];
        for(let i=0; i<5; i++) { // they have linearly decreasing potential
            this.rings.push(new IonPulser(10, maxCharge-maxCharge*i/5, new Vector2D(maxPosition.x-0.05*i, maxPosition.y), true, angle));
        }
        this.position = maxPosition;
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getField(particlePosition) {
        let result = new Vector2D(0, 0); // the sum from all rings
        for(let i = 0; i < this.rings.length; i++) {
            let vec = this.rings[i].getField(particlePosition);
            result = new Vector2D(result.x+vec.x, result.y+vec.y);
        }
        return result;
    }

    /**
     * @param on{boolean}
     */
    on(on) {
        for(let i = 0; i < this.rings.length; i++)
            this.rings[i].on = on;
    }

}
