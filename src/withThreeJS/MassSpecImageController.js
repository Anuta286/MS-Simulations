import * as THREE from "three";
import koefM2Px from "./main.js";
import {FieldShiningImage} from "./FieldShiningImage.js";

/**
 * creates all elements of the mass spectrometer and adds them to the scene
 */
export class MassSpecImageController {

    /**
     * @param massSpectrometer{MassSpectrometerTof}
     * @param scene{Scene}
     */
    constructor(massSpectrometer, scene) {
        this.massSpectrometer = massSpectrometer;
        this.scene = scene;

        let massSpecImageHeight = this.massSpectrometer.ionPulser.position.subtractVector(
            this.massSpectrometer.reflectron.position).getLength()*koefM2Px;
        this.initializeMS(massSpecImageHeight);
        this.inilializeReflectron(); //always on
        this.initializeFieldShining(massSpecImageHeight);
        this.initializeFieldLine();

        this.addAllElementsToScene();
    }

    initializeMS (massSpecImageHeight) {
        this.imageFirstpart = new THREE.Mesh( // not transparent
            new THREE.CylinderGeometry( 25, 25, massSpecImageHeight, 30, 30, false, 1.5, 3.14),
            new THREE.MeshToonMaterial({color: 0xffffff, side: THREE.DoubleSide}));
        this.imageFirstpart.rotation.z = Math.PI / 2;
        this.imageFirstpart.position.set(
            koefM2Px*(this.massSpectrometer.ionPulser.position.x+this.massSpectrometer.reflectron.position.x)/2,
            koefM2Px*this.massSpectrometer.ionPulser.position.y, -1);

        this.imageSecondPart = new THREE.Mesh( // transparent (it's only for the view)
            new THREE.CylinderGeometry( 25, 25, massSpecImageHeight, 30, 30, false),
            new THREE.MeshToonMaterial({color: 0xffffff, side: THREE.DoubleSide,  transparent: true, opacity: 0.2}));
        this.imageSecondPart.rotation.z = Math.PI / 2;
        this.imageSecondPart.position.set(
            koefM2Px*(this.massSpectrometer.ionPulser.position.x+this.massSpectrometer.reflectron.position.x)/2,
            koefM2Px*this.massSpectrometer.ionPulser.position.y, -1);
        this.imageSecondPart.renderOrder = 3;
    }

    inilializeReflectron() {
        let ringGeometry = new THREE.TorusGeometry(24, 0.8, 2, 100);
        let ringMaterial = new THREE.MeshToonMaterial({ color:  0x663300});
        this.reflectronRingImageArray = [];
        for (let i = 0; i < 5; i++) {
            let ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.y = Math.PI/3; //Math.PI/2.2 looks better
            ring.rotation.x = Math.PI/2;
            ring.position.set(27 + i*3, 0.18, -1);
            this.reflectronRingImageArray.push(ring);
        }
    }

    initializeFieldShining(massSpecImageHeight) {
        this.fieldShining = new FieldShiningImage(this.imageFirstpart.position.x, this.imageFirstpart.position.y, this.imageFirstpart.position.z,
            massSpecImageHeight, this.imageFirstpart.geometry.parameters.radiusTop*2);
    }

    initializeFieldLine() { //after the line (reflectron-)field=0, but with the current calculations the actual value ist big
        let points = [];
        points.push(new THREE.Vector3(-0.51*koefM2Px, -25, -3));
        points.push(new THREE.Vector3(-0.51*koefM2Px, 25, 0));
        this.fieldLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({color: 0xffffff}));
    }

    addAllElementsToScene() {
        this.scene.add(this.imageFirstpart);
        this.scene.add(this.imageSecondPart);
        this.scene.add(this.fieldShining.pulserFieldShining);
        this.scene.add(this.fieldShining.mirrorFieldShining);
        this.scene.add(this.fieldLine);
        this.reflectronRingImageArray.forEach(ring => this.scene.add(ring));
    }

    turnOffIonPulser() {
        this.massSpectrometer.ionPulser.on = false;
        this.scene.remove(this.fieldShining.pulserFieldShining);
    }

    turnOnIonPulser() {
        this.massSpectrometer.ionPulser.on = true;
        this.scene.add(this.fieldShining.pulserFieldShining);
    }

}
