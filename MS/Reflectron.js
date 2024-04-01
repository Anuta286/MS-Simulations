import {Vector2D} from "../MathUtils/Vector2D.js";
import {IonPulser} from "./IonPulser.js";

export class Reflectron {

    /**
     * @param maxCharge{number}
     * @param maxPosition{Vector2D}
     */
    constructor(maxCharge, maxPosition) {
        this.rings = [
            new IonPulser(10, maxCharge-0.4, new Vector2D(maxPosition.x-0.2, maxPosition.y), true),
            new IonPulser(10, maxCharge-0.3, new Vector2D(maxPosition.x-0.15, maxPosition.y), true),
            new IonPulser(10, maxCharge-0.2, new Vector2D(maxPosition.x-0.1, maxPosition.y), true),
            new IonPulser(10, maxCharge-0.1, new Vector2D(maxPosition.x-0.05, maxPosition.y), true),
            new IonPulser(10, maxCharge, maxPosition, true)];
        this.position = maxPosition;
    }

    /**
     * @param particlePosition{Vector2D}
     * @returns {Vector2D}
     */
    getField(particlePosition) {
        let result = new Vector2D(0, 0);
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
