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

const massSpecImage = new THREE.Mesh(
    new THREE.CylinderGeometry( 25, 25, 150, 30, 30, false, 1.5, 3.14),
    new THREE.MeshToonMaterial({color: 0xffffff, side: THREE.DoubleSide}));
massSpecImage.rotation.z = Math.PI / 2;
massSpecImage.position.x = massSpectrometer.ionPulser.position.x;
massSpecImage.position.y = massSpectrometer.ionPulser.position.y + 10;
massSpecImage.position.z = -1;
scene.add(massSpecImage);

document.getElementById("button").addEventListener("click", ionPulserChangeState);
let time = performance.now() +1; //in ms
let newTime;

const light = new THREE.HemisphereLight(0xffffff, 10, 3);
light.position.set(20, 10, 10);
scene.add(light);

let animationFrame = 0;
function animate() {
    animationFrame++;
    requestAnimationFrame(animate);
    let deltaTime = 1e-13;
    if (animationFrame > IonPulser.WORKING_TIME) {
        ionPulser.on = false;
    }
    for (let particleImage of particlesArray) {
        let particleNewPosition = massSpectrometer.getParticleNewPosition(particleImage.particle, deltaTime);
        time = newTime;
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
            particlesArray[i] = new ParticleImage(massArray[i], kArray[i]);
        for (let particleImage of particlesArray)
            scene.add(particleImage.image);
        animationFrame = 0;
        ionPulser.on = true;
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



