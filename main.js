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
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.geometry.computeVertexNormals();
          }
        });
        object.position.x -= 2.5;
        object.position.y -= 1.5; //
        object.rotation.x = -Math.PI / 2; //
        scene.add(object);
        camera.lookAt(object.position);
      }
    );
  }
);
camera.position.z = 7; //2

// const axesHelper = new THREE.AxesHelper(3); // Аргумент определяет длину линий осей
// scene.add(axesHelper);
//------------------------
//Предполагаемые координаты камеры на полу комнаты, лицом к двери
var targetPosition = new THREE.Vector3(0, 0, 1.5);
var targetLookAt = new THREE.Vector3(0, 0, 0); // Направление взгляда камеры

// Функция для плавного перемещения камеры
function moveCamera(targetPosition, targetLookAt, duration = 2000) {
  // Интерполяция позиции камеры
  new TWEEN.Tween(camera.position)
    .to(
      {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
      },
      duration
    )
    .easing(TWEEN.Easing.Quadratic.Out) // Функция плавности
    .start();

  // Интерполяция направления взгляда камеры
  const lookAtTween = new TWEEN.Tween({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  })
    .to(
      {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
      },
      duration
    )
    .onUpdate(function () {
      camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
    })
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

// Вызов функции для начала анимации
moveCamera(targetPosition, targetLookAt);

// Обновление TWEEN в цикле анимации
var animate = function () {
  requestAnimationFrame(animate);
  TWEEN.update(); // Добавьте это для работы анимации
  controls.update();
  renderer.render(scene, camera);
};

animate();
//--------------
let point1 = null;
let point2 = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function addPointIndicator(point) {
  const geometry = new THREE.SphereGeometry(0.01, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(point);
  scene.add(sphere);
}

function onMouseClick(event) {
  event.preventDefault();
  // Преобразование координат мыши в нормализованные координаты устройства
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Обновление луча raycaster с учетом позиции мыши и камеры
  raycaster.setFromCamera(mouse, camera);

  // Получение массива точек пересечения
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Если есть пересечения, сохраняем координаты первой точки пересечения
  if (intersects.length > 0) {
    const point = intersects[0].point;
    addPointIndicator(point);
    if (!point1) {
      point1 = intersects[0].point;
    } else if (!point2) {
      point2 = intersects[0].point;
      // Теперь у вас есть point1 и point2, и вы можете измерить расстояние между ними
      const distance = point1.distanceTo(point2);
      console.log("Расстояние между точками:", distance);
      // Сброс точек для нового измерения
      point1 = null;
      point2 = null;
    }
  }
}

renderer.domElement.addEventListener("click", onMouseClick);
