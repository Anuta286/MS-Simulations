import * as THREE from 'three';
import {Vector2D} from "../MathUtils/Vector2D.js";
import {IonPulser} from "../MS/IonPulser.js";
import {MassSpectrometerTof} from "../MS/MassSpectrometerTof.js";
import {ParticleImage} from "./ParticleImage.js";
import {MassSpecImageController} from "./MassSpecImageController.js";
import {Reflectron} from "../MS/Reflectron.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js"; //not to forget ".js" !!!


let koefM2Px= 50; // 1px=0.02m // the scene size is much smaller than the real physical one
export default koefM2Px;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 70;
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(4);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let massSpecController = new MassSpecImageController(new MassSpectrometerTof(
    new IonPulser(10, 10e-10, new Vector2D(-1.1, 0), true, 0),
    new Reflectron(0.5*10e-10, new Vector2D(1.1, 0), -Math.PI/6)), scene);

const light = new THREE.HemisphereLight(0xffffff, 10, 3);
light.position.set(20, 10, 10);
scene.add(light);

let controls = new OrbitControls(camera, renderer.domElement); // for rotating camera

let animationFrame = 0;
function animate() {
    animationFrame++;
    requestAnimationFrame(animate);
    let deltaTime = 1e-13;
    if (animationFrame > IonPulser.WORKING_TIME)
        massSpecController.turnOffIonPulser();
    for (let particleImage of particlesArray) {
        let particleNewPosition = massSpecController.massSpectrometer.getParticleNewPosition(particleImage.particle, deltaTime);
        particleImage.image.position.x = koefM2Px*particleNewPosition.x;
        particleImage.image.position.y = koefM2Px*particleNewPosition.y;
        particleImage.particle.position = particleNewPosition;
        particleImage.particle.velocity = massSpecController.massSpectrometer.getParticleNewVelocity(particleImage.particle, deltaTime);
    }
    renderer.render(scene, camera);
}

function ionPulserChangeState() { //make work with field-shining
    massSpecController.massSpectrometer.ionPulser.on = !massSpecController.massSpectrometer.ionPulser.on;
    let state = massSpecController.massSpectrometer.ionPulser.on ? "ON" : "OFF";
    document.getElementById("button").textContent = "IonPulser " + state;
}

document.getElementById("button").addEventListener("click", ionPulserChangeState);
let ionPulserChargeInput = document.getElementById("ionPulserChargeInput");
ionPulserChargeInput.addEventListener("keydown", function(event) { //regulate intensity for field-shining
    if (event.key === "Enter") {
        event.preventDefault();
        massSpecController.massSpectrometer.ionPulser.charge = new Vector2D(ionPulserChargeInput.value, 0)
    }
});

let particlesArray = [];
let particleMassesInput = document.getElementById("particleMassesInput");
particleMassesInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (particlesArray.length!==0) { // old particles are removed after starting the next time
            for (let particleImage of particlesArray)
                scene.remove(particleImage.image);
        }

        let massArray =  createBunchOfParticlesMasses(500);
        let kArray = findArrayOfCoefficients(massArray);
        particlesArray = []; //25734,26734,27734
        for(let i= 0; i<massArray.length; i++)
            particlesArray[i] = new ParticleImage(massArray[i], kArray[i]*0.5);
        for (let particleImage of particlesArray)
            scene.add(particleImage.image);
        animationFrame = 0;
        massSpecController.massSpectrometer.reflectron.on(true);
        massSpecController.turnOnIonPulser();
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

function createBunchOfParticlesMasses(n) {
    let massArray = [];
    for (let i=0; i<n; i++)
        massArray[i] = 10000 + i*1000;
    return massArray;
}
