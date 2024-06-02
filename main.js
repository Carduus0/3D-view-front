import * as THREE from "three";
import {
  OrbitControls,
  MTLLoader,
  OBJLoader,
} from "three/examples/jsm/Addons.js";
// import { GLTFLoader, PLYLoader } from "three/examples/jsm/Addons.js"; //PLYExporter
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1.0,
  100
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement); //THREE.
controls.enableDamping = true;
controls.dampingFactor = 1.0;
controls.enableZoom = true;

const keyLight = new THREE.DirectionalLight(
  new THREE.Color("hsl(255, 100%, 100%)"),
  1.0
);
keyLight.position.set(100, 100, -100);

const fillLight = new THREE.DirectionalLight(
  new THREE.Color("hsl(255, 100%, 100%)"),
  1.0
);
fillLight.position.set(-100, -100, 100);

const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(50, -100, 100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

const mtlLoader = new MTLLoader(); //THREE.
mtlLoader.setResourcePath("/assets/");
mtlLoader.setPath("/assets/");
mtlLoader.load(
  "df576acba3c64a398eb1ce61c644ff9e_50k.mtl",
  function (materials) {
    materials.preload();

    const objLoader = new OBJLoader(); //THREE.
    objLoader.setMaterials(materials);
    objLoader.setPath("/assets/");
    objLoader.load(
      "df576acba3c64a398eb1ce61c644ff9e_50k.obj",
      function (object) {
        scene.add(object);
        object.position.x -= 2.5;
      }
    );
  }
);

const animate = function () {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
