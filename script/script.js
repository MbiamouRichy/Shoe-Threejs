import * as THREE from 'three';
import { FBXLoader } from 'https://unpkg.com/three@0.150.0/examples/jsm/loaders/FBXLoader.js'


let slides = document.querySelectorAll(".slide");
let btn_left = document.querySelector("#btn_left");
let btn_right = document.querySelector("#btn_right");
let activeSlide = 0;
let text_Logo = document.querySelectorAll("#text p");
let load = document.querySelector(".load")
let load_div = document.querySelector(".load_div")
let count = 0
let load_opacity = document.querySelector(".load_opacity")
let load_svg = document.querySelector(".load_opacity svg")
let container, camera, scene, renderer, time;

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let textures = [],
  objectTab = [];

/*--- Transformer chaque letre du texte du logo en span -----*/
text_Logo.forEach((letter) => {
  letter.innerHTML = letter.innerText
    .split("")
    .map(
      (char, idx) =>
        `<span style="transform:rotate(${idx * 11.6}deg)">${char}</span>`
    )
    .join("");
});

/*------------------ Mise en place du slider -----------------*/
btn_left.addEventListener("click", () => {
  activeSlide++;
  if (activeSlide > slides.length - 1) {
    activeSlide = 0;
  }
  objectTab.forEach((object, idx) => {
    let count = 1;
    round();
    function round() {
      if (count <= 5) {
        let set = setInterval(() => {
            object.position.x += 40;
          if (object.position.x > (objectTab.length - 1) * 200 - 10) {
            objectTab.forEach((obj) => {
              obj.position.x -= objectTab.length * 200;
              clearInterval(set);
            });
          }
          count++;
          clearInterval(set);
          round();
        }, 20);
      }
    }
  });
  changeSlide();
});
btn_right.addEventListener("click", () => {
  activeSlide--;
  if (activeSlide < 0) {
    activeSlide = slides.length - 1;
  }
  objectTab.forEach(object => {
    let count = 1;
    round();
    function round() {
      if (count <= 5) {
        let set = setInterval(() => {
            object.position.x -= 40;
          if (object.position.x < -(objectTab.length - 1) * 200 - 10) {
            objectTab.forEach((obj) => {
              obj.position.x += objectTab.length * 200;
              clearInterval(set);
            });
          }
          count++;
          clearInterval(set);
          round();
        }, 20);
      }
    }
  });

  changeSlide();
});

function changeSlide() {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[activeSlide].className += " active";
}

/*-------------- Genere ma scene threejs --------------------*/

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 250);

  // scene
  scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Point lumineux dans la scene
  const pointLight = new THREE.PointLight(0xcccccc, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onDocumentMouseMove);
  window.addEventListener("resize", onWindowResize);
}

/*----------- chargement du model (mon onjet 3d) ---------*/
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
  }
}

function onError() {}
/*---------- mon objet 3d --------------*/
let imageList = [
  "../assets/shoe-2/source/Sepatu_01_MAT_baseColor.jpg",
  "../assets/shoe-2/source/Sepatu_01_MAT_normal.png",
  "../assets/shoe-2/source/Sepatu_01_MAT_metallic.jpg",
  "../assets/shoe-2/source/Sepatu_01_MAT_roughness.jpg",
]
function loadObject() {
  for (let i = 0; i < imageList.length; i++) {
    function loadModel() {
      objectTab[i].traverse(function (child) {
        if (child.isMesh) {
          child.material.map = textures[i];
        }
      });

       objectTab[i].scale.set(0.15, 0.15, 0.15);
       objectTab[i].position.y = -35;
       objectTab[i].position.x = -10 + (i * 200);
       objectTab[i].rotation.x = 1.3;
       objectTab[i].rotation.y = 45;
       objectTab[i].rotation.z = -1;
      scene.add(objectTab[i]);
    }
    var manager = new THREE.LoadingManager(loadModel);
    // texture Rock
    var textureLoader = new THREE.TextureLoader(manager);
    var textureObject = textureLoader.load(imageList[i]);
    textures.push(textureObject)
    // model Rock
    var loader = new FBXLoader(manager);
    loader.load(
      "../assets/shoe-2/source/Sepatu_01.fbx",
      function (obj) {
        objectTab[i] = obj;
      },
      onProgress,
      onError
    );
  }
}
loadObject();

function onWindowResize() {
  windowHalfX = window.innerWidth;
  windowHalfY = window.innerHeight;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 5;
  mouseY = (event.clientY - windowHalfY) / 5;
  camera.position.x += (mouseX - camera.position.x) * 0.2;
  camera.position.y += (mouseY - camera.position.y) * 0.2;
  camera.lookAt(scene.position);
}
time = 0;
function animate() {
  requestAnimationFrame(animate);
  time -= 0.3;
  for (let i = 0; i < objectTab.length; i++) {
    objectTab[i].position.y += Math.sin(time) / 10;
  }
  if(camera){
    if (document.body.offsetWidth < 768 && document.body.offsetWidth > 400) {
      camera.position.z = 350;
    } else if (document.body.offsetWidth < 400) {
      camera.position.z = 500;
    }
  
  }
  render();
}

function render() {
  renderer.render(scene, camera);
}

let set = setInterval(() =>{
  count++
  load.innerText = `${count.toString().padStart(3, '0')}`
  load_div.style.opacity = scale(count, 0, 100, 1, 0)
  load_svg.style.opacity = scale(count, 0, 100, 0, 1)
  if(count > 99){
  clearInterval(set)
  load_opacity.style.display = "none"
  }
}, 1)

const scale = (num, in_min, in_max, out_min, out_max) =>{
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}