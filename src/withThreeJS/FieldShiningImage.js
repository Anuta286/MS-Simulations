import * as THREE from "three";

export class FieldShiningImage {

     vertexShader = `
        varying vec3 vPosition;

         void main() {
             vPosition = position;
             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

     fragmentShader = `
        varying vec3 vPosition;
        uniform float coef; // 1 means it's for ionPulser and -1 means for mirror
        
        void main() {
            float value = coef * vPosition.x;
            if (value > 0.0) {
                discard;
            }
            gl_FragColor = vec4(1.0, 0.5, 0.2, vPosition.x*vPosition.x*0.0003);
        }
    `;

    /**
     * @param x{number}
     * @param y{number}
     * @param z{number}
     * @param width{number}
     * @param height{number}
     */
    constructor(x, y, z, width, height) {
        let geometry = new THREE.BoxGeometry(width, height, 1);
        let pulserMaterial = new THREE.ShaderMaterial(
            {vertexShader: this.vertexShader, fragmentShader: this.fragmentShader, transparent: true,
                       uniforms: {coef: {value: 1} }});
        let mirrorMaterial = new THREE.ShaderMaterial(
            {vertexShader: this.vertexShader, fragmentShader: this.fragmentShader, transparent: true,
                       uniforms: {coef: {value: -1} }});
        this.pulserFieldShining = new THREE.Mesh(geometry, pulserMaterial);
        this.mirrorFieldShining = new THREE.Mesh(geometry, mirrorMaterial);

        this.pulserFieldShining.position.set(x, y, z);
        this.pulserFieldShining.rotation.x = 0.06;
        this.mirrorFieldShining.position.set(x, y, z);
        this.mirrorFieldShining.rotation.x = 0.06;

        this.mirrorFieldShining.renderOrder = 1;
        this.pulserFieldShining.renderOrder = 2;
    }

}
