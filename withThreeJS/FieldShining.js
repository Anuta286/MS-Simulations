import * as THREE from "three";

export class FieldShining {

     vertexShader = `
        varying vec3 vPosition;

         void main() {
             vPosition = position;
             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

     pulserFragmentShader = `
        varying vec3 vPosition;

        void main() {
            if (vPosition.x > 0.0) {
                discard;
            }
            gl_FragColor = vec4(1.0, 0.5, 0.2, vPosition.x*vPosition.x*0.0003);
        }
    `;

     mirrorFragmentShader = `
        varying vec3 vPosition;

        void main() {
            if (vPosition.x < 0.0) {
                discard;
            }    
            gl_FragColor = vec4(0.6, 0.2, 0.8, vPosition.x*vPosition.x*0.0003);
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
            {vertexShader: this.vertexShader, fragmentShader: this.pulserFragmentShader, transparent: true});
        let mirrorMaterial = new THREE.ShaderMaterial(
            {vertexShader: this.vertexShader, fragmentShader: this.mirrorFragmentShader, transparent: true});
        this.pulserFieldShining = new THREE.Mesh(geometry, pulserMaterial);
        this.mirrorFieldShining = new THREE.Mesh(geometry, mirrorMaterial);

        this.pulserFieldShining.position.x = x;
        this.pulserFieldShining.position.y = y;
        this.pulserFieldShining.position.z = z;
        this.pulserFieldShining.rotation.x = 0.06;

        this.mirrorFieldShining.position.x = x;
        this.mirrorFieldShining.position.y = y;
        this.mirrorFieldShining.position.z = z;
        this.mirrorFieldShining.rotation.x = 0.06;
    }

}
