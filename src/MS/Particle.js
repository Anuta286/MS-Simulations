import {Vector2D} from "../MathUtils/Vector2D.js";

export class Particle {
    /**
     * @type{Vector2D}
     */
    velocity;
    /**
     * @param colorHex{String}
     * @param mass{number}
     * @param charge{number}
     * @param position{Vector2D}
     * @param velocity{Vector2D}
     */
    constructor(colorHex, mass, charge, position, velocity) {
        this.colorHex = colorHex;
        this.mass = mass;
        this.charge = charge; // why is it unused? to check: getParticleNewPosition()
        this.position = position;
        this.velocity = velocity;
    }

}
