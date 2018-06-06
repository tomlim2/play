var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();

function createHelix( material, radius, tube, radialSegments, tubularSegments, height, arc, clockwise )
{
	
	tubularSegments = (tubularSegments === undefined) ? 32 : tubularSegments;
	arc = (arc === undefined) ? 1 : arc;
	clockwise = (clockwise === undefined) ? true : clockwise;

	var helix = new THREE.Object3D();

	var top = new THREE.Vector3();

	var sine_sign = clockwise ? 1 : -1;

	
	var sphGeom = new THREE.SphereGeometry( tube, tubularSegments, tubularSegments/2 );
	for ( var i = 0; i <= arc*radialSegments ; i++ ){
		top.set( radius * Math.cos( i * 2*Math.PI / radialSegments ),
		height * (i/(arc*radialSegments)) - height/2,
		sine_sign * radius * Math.sin( i * 2*Math.PI / radialSegments ) );

		var sphere = new THREE.Mesh( sphGeom, material );
		sphere.position.copy( top );

		helix.add( sphere );
	}

	return helix;
}


function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	var redMaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	

	var radius = 60;
	var tube = 10;
	var radialSegments = 24;
	var height = 300;
	var segmentsWidth = 12;
	var arc = 2;

	var helix;
	helix = createHelix( redMaterial, radius, tube, radialSegments, segmentsWidth, height, arc, true );
	helix.position.y = height/2;
	scene.add( helix );

}

function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;

	var canvasRatio = canvasWidth / canvasHeight;


	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );


	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 10000 );
	camera.position.set( -528, 513, 92 );

	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,200,0);

}

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	fillScene();

	renderer.render(scene, camera);
}

	init();
	addToDOM();
	animate();