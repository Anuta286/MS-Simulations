import {Vector2D} from "../MathUtils/Vector2D.js";

export class MassSpectrometerTof {
    /**
     * @param {IonPulser} ionPulser
     * @param {Reflectron} reflectron
     */
    constructor(ionPulser, reflectron) {
        this.ionPulser = ionPulser;
        this.reflectron = reflectron;
    }

    /**
     * @param {Particle} particle
     * @returns {Vector2D}
     */
    getParticleAcceleration(particle) {
        // a = E/m        //to do a = E*q1/m
        return this.getField(particle.position).divideByScalar(particle.mass);
    }

    /**
     * @param {Vector2D} particlePosition
     * @returns {Vector2D}
     */
    getField(particlePosition) {
        return this.ionPulser.getField(particlePosition).add(this.reflectron.getField(particlePosition));
    }

    /**
     * @param {Particle} particle
     * @param {number} deltaTime
     * @returns {Vector2D}
     */
    getParticleNewVelocity(particle, deltaTime) {
        // V = V0 + at
        if (Math.abs(particle.position.subtractVector(this.reflectron.position).x) > 2.1)
            return new Vector2D(0, 0);
        return particle.velocity.add(this.getParticleAcceleration(particle).multipleByScalar(deltaTime));
    }

    /**
     * @param {Particle} particle
     * @param {number} deltaTime
     * @returns {Vector2D}
     */
    getParticleNewPosition(particle, deltaTime) {
        // S = S0 + V0*t + (a*t^2)/2
        if (Math.abs(particle.position.subtractVector(this.reflectron.position).x) > 2.1)
            return particle.position;
        return particle.position.add(particle.velocity.multipleByScalar(deltaTime)).add(
            this.getParticleAcceleration(particle).multipleByScalar(0.5*Math.pow(deltaTime, 2)));
    }
}