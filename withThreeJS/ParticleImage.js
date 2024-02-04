import {Particle} from "../MS/Particle.js";
import * as THREE from 'three';
import {Vector2D} from "../MathUtils/Vector2D.js";
import koefM2Px from "../withThreeJS/main.js";

export class ParticleImage {

    /**
     * @param mass{number} in daltons
     * @param k{number} //write description
     */
    constructor(mass, k) {
        this.particle = new Particle(ParticleImage.randomHexColor(), ParticleImage.convertToKg(mass),
            1.60217663e-19 /* e */, new Vector2D(-1, 0), new Vector2D(0, 10e8));
        let sphereGeometry = new THREE.SphereGeometry( k, 32, 16 );
        let material = new THREE.MeshToonMaterial({color: this.particle.colorHex});
        this.image = new THREE.Mesh(sphereGeometry, material);
        this.image.position.x = koefM2Px*this.particle.position.x;
        this.image.position.y = koefM2Px*this.particle.position.y;
    }

    static randomHexColor() {
        let n = (Math.random()*0xfffff*1000000).toString(16);
        return '#' + n.slice(0, 6);
    };

    /**
     * @param daltons{number}
     */
    static convertToKg(daltons) {
        return daltons/6.022e+26;
    }

}
