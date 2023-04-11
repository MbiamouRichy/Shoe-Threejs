import * as THREE from 'three';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../three/examples/jsm/loaders/FBXLoader.js'


let container;

let camera, scene, renderer;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let object;
let objectObj

init();
animate();


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-200, 200, -500);
   
    // scene

    scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xcccccc, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        object.traverse(function (child) {

            if (child.isMesh) child.material.map = texture;

        });

        object.position.y = 0;
        object.position.x = 0;
        scene.add(object);

    }

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
        }

    }

    function onError() { }
    const manager = new THREE.LoadingManager(loadModel);
    // texture Rock
    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load('./assets/Model/Shoe_Color.jpg');

    // const loader = new FBXLoader(manager);
    // loader.load('./assets/shoe/source/Shoe/Model/Shoe.FBX', function (obj) {
    //     object = obj;
    //     object.scale.set(5,5,5)
    // }, onProgress, onError);

    const loadObj = new FBXLoader();
    loadObj.load('./assets/sci-fi-shoe_2/source/Shoe.fbx', function (obj) {
        objectObj = obj;
        objectObj.scale.set(10,10,10)
        scene.add(objectObj)
    }, onProgress, onError);

    renderer

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

// control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = true;
controls.enableDamping = true;


function animate() {
    requestAnimationFrame(animate);
    render();
}
function render() {
  renderer.render( scene, camera );
}
