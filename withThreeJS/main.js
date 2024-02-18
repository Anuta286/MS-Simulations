import * as THREE from 'three';
import {Vector2D} from "../MathUtils/Vector2D.js";
import {IonPulser} from "../MS/IonPulser.js";
import {MassSpectrometerTof} from "../MS/MassSpectrometerTof.js";
import {ParticleImage} from "./ParticleImage.js";

let koefM2Px= 50; // 1px=0.02m //
export default koefM2Px;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 70;
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(4);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let ionPulser = new IonPulser(10, 1, new Vector2D(-1.1, 0), true);
let oppositeIonPulser = new IonPulser(10, 1, new Vector2D(1.1, 0), true);
let massSpectrometer = new MassSpectrometerTof(ionPulser, oppositeIonPulser);

let massSpecImageHeight = massSpectrometer.ionPulser.position.subtractVector(
    massSpectrometer.mirror.position).getLength()*koefM2Px;
const massSpecImage = new THREE.Mesh(
    new THREE.CylinderGeometry( 25, 25, massSpecImageHeight, 30, 30, false,
        1.5, 3.14), new THREE.MeshToonMaterial({color: 0xffffff, side: THREE.DoubleSide}));
massSpecImage.rotation.z = Math.PI / 2;
massSpecImage.position.x = koefM2Px*(massSpectrometer.ionPulser.position.x+massSpectrometer.mirror.position.x)/2;
massSpecImage.position.y = koefM2Px*massSpectrometer.ionPulser.position.y;
massSpecImage.position.z = -1;
scene.add(massSpecImage);

document.getElementById("button").addEventListener("click", ionPulserChangeState);

const light = new THREE.HemisphereLight(0xffffff, 10, 3);
light.position.set(20, 10, 10);
scene.add(light);

const points = []; //draw a line where the mirror stops working
points.push(new THREE.Vector3(-0.51*koefM2Px, -22, 5));
points.push(new THREE.Vector3(-0.51*koefM2Px, 23, 5));
const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({color: 0xffffff}));
scene.add(line);

let animationFrame = 0;
function animate() {
    animationFrame++;
    requestAnimationFrame(animate);
    let deltaTime = 1e-13;
    if (animationFrame > IonPulser.WORKING_TIME) {
        ionPulser.on = false;
        scene.remove(fieldShining);
    }
    for (let particleImage of particlesArray) {
        let particleNewPosition = massSpectrometer.getParticleNewPosition(particleImage.particle, deltaTime);
        particleImage.image.position.x = koefM2Px*particleNewPosition.x;
        particleImage.image.position.y = koefM2Px*particleNewPosition.y;
        particleImage.particle.position = particleNewPosition;
        particleImage.particle.velocity = massSpectrometer.getParticleNewVelocity(particleImage.particle, deltaTime);
    }
    renderer.render(scene, camera);
}

function ionPulserChangeState() {
    ionPulser.on = !ionPulser.on;
    let state = ionPulser.on ? "ON" : "OFF";
    document.getElementById("button").textContent = "IonPulser " + state;
}

let ionPulserChargeInput = document.getElementById("ionPulserChargeInput");
ionPulserChargeInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        ionPulser.charge = new Vector2D(ionPulserChargeInput.value, 0)
    }
});

let particlesArray = [];
let particleMassesInput = document.getElementById("particleMassesInput");
particleMassesInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let massArray = particleMassesInput.value.split(",");
        let kArray = findArrayOfCoefficients(massArray);
        particlesArray = []; //25734,26734,27734
        for(let i= 0; i<massArray.length; i++)
            particlesArray[i] = new ParticleImage(massArray[i], kArray[i]*0.5);
        for (let particleImage of particlesArray)
            scene.add(particleImage.image);
        animationFrame = 0;
        ionPulser.on = true;
        oppositeIonPulser.on = true;
        scene.add(fieldShining);
        animate();
    }
});

function findArrayOfCoefficients(massArray) {
    let result = [];
    let k = 2/Math.max(...massArray);
    for (let i = 0; i < massArray.length; i++)
        result[i] = k*massArray[i];
    return result;
}

let vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

let fragmentShader = `
  varying vec3 vPosition;

  void main() {
    if (vPosition.x > 0.0) {
        discard;
    }
    gl_FragColor = vec4(1.0, 0.5, 0.2, vPosition.x*vPosition.x*0.0003);
  }
`;

let oppositeFragmentShader = `
  varying vec3 vPosition;

  void main() {
    if (vPosition.x < 0.0) {
        discard;
    }    
    gl_FragColor = vec4(0.6, 0.2, 0.8, vPosition.x*vPosition.x*0.0003);
  }
`;

let fieldShining = new THREE.Mesh(new THREE.BoxGeometry(massSpecImageHeight, 50, 1),
    new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, transparent: true}));
fieldShining.position.x = massSpecImage.position.x;
fieldShining.position.y = massSpecImage.position.y;
fieldShining.position.z = massSpecImage.position.z;
fieldShining.rotation.x = 0.06;
scene.add(fieldShining);


let oppositeFieldShining =  new THREE.Mesh(new THREE.BoxGeometry(massSpecImageHeight, 50, 1),
    new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: oppositeFragmentShader, transparent: true}));
oppositeFieldShining.position.x = massSpecImage.position.x;
oppositeFieldShining.position.y = massSpecImage.position.y;
oppositeFieldShining.position.z = massSpecImage.position.z;
oppositeFieldShining.rotation.x = 0.06;
scene.add(oppositeFieldShining);