var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1.0, 100 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1.0;
controls.enableZoom = true;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(255, 100%, 100%)'), 1.0);
keyLight.position.set(100, 100, -100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(255, 100%, 100%)'), 1.0);
fillLight.position.set(-100, -100, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(50, -100, 100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/examples/3d-obj-loader/assets/');
mtlLoader.setPath('/examples/3d-obj-loader/assets/');
mtlLoader.load('df576acba3c64a398eb1ce61c644ff9e_50k.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/examples/3d-obj-loader/assets/');
    objLoader.load('df576acba3c64a398eb1ce61c644ff9e_50k.obj', function (object) {

        scene.add(object);
        object.position.x -= 2.5;

    });

});

var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};

animate();