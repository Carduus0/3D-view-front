import * as THREE from "three";
import {
  OrbitControls,
  MTLLoader,
  PLYLoader,
  OBJLoader,
} from "three/examples/jsm/Addons.js";
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.setScalar(10);
var renderer = new THREE.WebGLRenderer({
  antialias: true,
});
// renderer.setClearColor(0x404040); //green
var canvas = renderer.domElement;
document.body.appendChild(canvas);
// const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, canvas);

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// var loader = new PLYLoader();
// loader.load("./assets/dolphins.ply", function (geometry) {
//   //geometry.computeVertexNormals();

//   var material = new THREE.MeshStandardMaterial({
//     color: 0x0055ff,
//     flatShading: true,
//   });
//   var mesh = new THREE.Mesh(geometry, material);

//   mesh.position.y = -0.2;
//   mesh.position.z = 0.3;
//   mesh.rotation.x = -Math.PI / 2;
//   mesh.scale.multiplyScalar(0.01);

//   scene.add(mesh);
// });

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

document.addEventListener("mousedown", onDocumentMouseDown, false);

var points = [new THREE.Vector3(), new THREE.Vector3()];
var clicks = 0;

var markerA = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 10, 20),
  new THREE.MeshBasicMaterial({
    color: 0xff5555,
  })
);
var markerB = markerA.clone();
var markers = [markerA, markerB];
scene.add(markerA);
scene.add(markerB);

var lineGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(),
  new THREE.Vector3(),
]);
var lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff5555,
});
var line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

function getIntersections(event) {
  var vector = new THREE.Vector2();

  vector.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(vector, camera);

  var intersects = raycaster.intersectObjects(scene.children);

  return intersects;
}

function setLine(vectorA, vectorB) {
  line.geometry.attributes.position.setXYZ(0, vectorA.x, vectorA.y, vectorA.z);
  line.geometry.attributes.position.setXYZ(1, vectorB.x, vectorB.y, vectorB.z);
  line.geometry.attributes.position.needsUpdate = true;
}

function onDocumentMouseDown(event) {
  var intersects = getIntersections(event);

  if (intersects.length > 0) {
    points[clicks].copy(intersects[0].point);
    markers[clicks].position.copy(intersects[0].point);
    setLine(intersects[0].point, intersects[0].point);
    clicks++;
    if (clicks > 1) {
      var distance = points[0].distanceTo(points[1]);
      distancePlace.innerText = distance;
      setLine(points[0], points[1]);
      clicks = 0;
    }
  }
}

renderer.setAnimationLoop(function () {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
});

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
