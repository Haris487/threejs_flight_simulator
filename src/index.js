const {Singleton} = require('./lib/singleton');
const OrbitControls = require('three-orbitcontrols')
const THREE = Singleton.getInstance().THREE;
const {Rectangle} = require('./lib/rectangle');
const {Terrain} = require('./lib/terrain');
const {Plane} = require('./lib/plane');
const {SceneWidth, SceneHeight} = require('./lib/constants');
(async () => {
	window.Singleton = Singleton;
	const scene = Singleton.getInstance().scene;
	const camera = Singleton.getInstance().camera;
	const renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// const geometry = new THREE.BoxGeometry( 100, 1, 100 );
	// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	// const cube = new THREE.Mesh( geometry, material );
	// scene.add( cube );
	// cube.position.z = 0;
	await Singleton.getInstance().load3dAssets();
	new Terrain(
		new THREE.Vector3(0,0,0),
		new THREE.Vector3(10000,10000,10000)
		).create();
	const plane = new Plane(0,1000,1,0xffffff)
	plane.create();
	console.log("scene" , scene);
	console.log("planeObj" , plane);

	// camera.position.x = SceneWidth / 2;
	// camera.position.y = 5;
	// camera.position.z = 0;
	// camera.lookAt(new THREE.Vector3(150, 5, 100))
	console.log("camera" , camera);
	const controls = new OrbitControls( camera, renderer.domElement );

	const light = 	await Singleton.getInstance().light;

	scene.add( light );


	function animate() {
		requestAnimationFrame( animate );
		controls.update()
		plane.update();
		renderer.render( scene, camera );
	}

	setInterval(()=>{
		Singleton.getInstance().infotaintmentScreen.update(plane);
		Singleton.getInstance().updateDeltaTime();
		plane.calculateSpeed();
	},500);
	animate();
})();