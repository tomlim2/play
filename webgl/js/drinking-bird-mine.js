var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var ground = true;
var bevelRadius = 1.9;

function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );
	renderer.shadowMapEnabled = true;

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);

	camera.position.set( -680, 609, -619 );
	cameraControls.target.set(4,201,62);

	fillScene();
}
function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
	// LIGHTS
	

	spotlight = new THREE.SpotLight( 0xFFFFFF, 1.0 );
	spotlight.position.set( -400, 1200, 300 );
	spotlight.angle = 20 * Math.PI / 180;
	spotlight.exponent = 1;
	spotlight.target.position.set( 0, 200, 0 );
	spotlight.castShadow = true;
	scene.add( spotlight );

	var lightSphere = new THREE.Mesh(
		new THREE.SphereGeometry( 10, 12, 6 ),
		new THREE.MeshBasicMaterial() );
	lightSphere.position.copy( spotlight.position );

	scene.add( lightSphere );

	//ground
	var texture = THREE.ImageUtils.loadTexture( '../img/grass512x512.jpg' ); 
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 10, 10 ); 

	var solidGround = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000, 100, 100 ), 
		new THREE.MeshLambertMaterial( { map: texture } ) ); 
	solidGround.rotation.x = - Math.PI / 2;

	// var solidGround = new THREE.Mesh(
	// 	new THREE.PlaneGeometry( 10000, 10000 ),
	// 	new THREE.MeshPhongMaterial({ color: 0xFFFFFF,
	// 		polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
	// 	}));
	solidGround.rotation.x = -Math.PI / 2;
	solidGround.receiveShadow = true;
	scene.add( solidGround );

	// var light = new THREE.DirectionalLight( 0xFFFFFF, 1.5 ); light.position.set( -200, 200, -400 ); 
	// scene.add( light );
	// headlight = new THREE.PointLight( 0xFFFFFF, 1.0 );
	// headlight.position.copy( camera.position );
	// scene.add( headlight );
	// var light2 = new THREE.SpotLight( 0xFFFFFF, 1.5 ); 
	// light2.position.set( -400, 1200, 300 ); 
	// light2.angle = 20 * Math.PI / 180; 
	// light2.exponent = 1; 
	// light2.target.position.set( 0, 200, 0 ); 
	// scene.add( light2 ); 

	// var ambientLight = new THREE.AmbientLight( 0x222222 );
	// scene.add(ambientLight);	

	// var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
	// light.position.set( 200, 400, 500 );
	// scene.add(light);
	
	// var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
	// light2.position.set( -400, 200, -300 );
	// scene.add(light2);
	scene.add(camera);
	var glass = createGlass(260);
	glass.position = new THREE.Vector3( -245, 125, 0);
	scene.add(glass);

	var bird = new THREE.Object3D();
	createDrinkingBird(bird);

	scene.add(bird);

	var x,z;
	
	for ( x = -4500; x <= 4500; x += 1000 ) {
		for ( z = -4500; z <= 4500; z += 1000 ) {
			var coneMaterial = new THREE.MeshLambertMaterial();
			// color wheel
			var coneDistance = Math.sqrt( x*x + z*z );
			// convert from angle to value in 2*PI range
			var colorHue = Math.acos( x / coneDistance );
			if ( z > 0 )
			{
				colorHue = Math.PI*2 - colorHue;
			}
			var colorSat = 1 - (coneDistance / 6364);
			coneMaterial.color.setHSL((colorHue+1)/(Math.PI*2), colorSat, 0.6 );
			coneMaterial.ambient.copy( coneMaterial.color );
			var cone = new THREE.Mesh( 
				new THREE.CylinderGeometry( 100 - colorSat*100, colorSat*100, 300 ), coneMaterial );
			cone.position.set( x, 150, z );
			scene.add( cone );
		}
	}

	// for ( x = -4500; x <= 4500; x += 1000 ) {
	// 	for ( z = -4500; z <= 4500; z += 1000 ) {
	// 		var blockMaterial = new THREE.MeshLambertMaterial();
	// 		// sort-of random but repeatable colors
	// 		blockMaterial.color.setRGB( ((x+4500)%373)/373, ((x+z+9000)%283)/283, ((z+4500)%307)/307 );
	// 		blockMaterial.ambient.copy( blockMaterial.color );
	// 		var block = new THREE.Mesh( 
	// 			new THREE.CubeGeometry( 100, 300, 100 ), blockMaterial );
	// 		block.position.set( x, 150, z );
	// 		scene.add( block );
	// 	}
	// }
}
function createGlass(height) {
	var cupMaterial = new THREE.MeshPhongMaterial( { color: 0x0, specular: 0xFFFFFF, shininess: 100, opacity: 0.3, transparent: true } );
	var waterMaterial = new THREE.MeshLambertMaterial( {
		color: 0x1F8BAF
		//opacity: 0.7,
		//transparent: true
	} );

	var glassGeometry = new THREE.CylinderGeometry(120, 100, height, 32);
	var glassMesh = new THREE.Mesh( glassGeometry, cupMaterial );
	var glassObject = new THREE.Object3D();
	glassObject.add(glassMesh);
	
	var glassWater = new THREE.Mesh( new THREE.CylinderGeometry(120, 100, height, 32), waterMaterial);
	glassWater.scale = new THREE.Vector3(0.9, 0.85, 0.9);
	glassWater.position = new THREE.Vector3(0, -10, 0);
	glassObject.add(glassWater);

	glassMesh.receiveShadow = true;
	glassMesh.castShadow = true;

	return glassObject;
}
function createDrinkingBird( dbird ) {
	var support = new THREE.Object3D();
	var body = new THREE.Object3D();
	var head = new THREE.Object3D();

	createSupport(support);
	createBody(body);
	createHead(head);

	dbird.add(support);
	dbird.add(body);
	dbird.add(head);

	dbird.traverse( function ( object ) {
		if ( object instanceof THREE.Mesh ) {
			object.castShadow = true;
			object.receiveShadow = true;
		}
	} );
}
// Supporting frame for the bird - base + legs + feet
function createSupport(dbsupport) {
	var legMaterial = new THREE.MeshPhongMaterial( { shininess: 4 } ); 
		legMaterial.color.setHex( 0xe8e9eb ); 
		legMaterial.specular.setRGB( 0.5, 0.5, 0.5 ); 

	var footMaterial = new THREE.MeshPhongMaterial( { color: 0xee4130, shininess: 30 } ); 
		footMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
	var cube;
	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 20+64+90, 4, 2*77+4, bevelRadius ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 4/2;	// half of height
	cube.position.z = 4;	// centered at origin
	dbsupport.add( cube );
	
	// left foot
	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 20+64+90, 52, 6, bevelRadius ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 52/2;	// half of height
	cube.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	dbsupport.add( cube );

	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 20+64-10, 42, 6, bevelRadius ), footMaterial );
	cube.position.x = -0;
	cube.position.y = 52+42/2-bevelRadius*2;
	cube.position.z = 77 + 6/2;
	dbsupport.add( cube );
	
	// left leg
	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 60, 300, 4, bevelRadius ), legMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = 52+42+300/2-bevelRadius*4;
	cube.position.z = 77 + 4/2 + 1;
	dbsupport.add( cube );
	
	// right foot
	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 20+64-10, 42, 6, bevelRadius ), footMaterial );
	cube.position.x = 0;
	cube.position.y = 52+42/2-bevelRadius*2;
	cube.position.z = -77 + 6/2;
	dbsupport.add( cube );

	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 20+64+90, 52, 6, bevelRadius ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 52/2;	// half of height
	cube.position.z = -77 + 6/2;	// offset 77 + half of depth 6/2
	dbsupport.add( cube );
	
	// right leg
	cube = new THREE.Mesh( 
		new THREE.BeveledBlockGeometry( 60, 300, 4, bevelRadius ), legMaterial );
	cube.position.x = 0;
	cube.position.y = 52+42+300/2-bevelRadius*4;
	cube.position.z = -77 + 6/2;
	dbsupport.add( cube );
}
function createBody(dbbody){
	var bodyMaterial = new THREE.MeshPhongMaterial( { shininess: 100 } ); 
		bodyMaterial.color.setRGB( 12/255, 72/255, 100/255 ); 
		bodyMaterial.specular.setRGB( 0.5, 0.5, 0.5 ); 

	//body water
	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x0c4864 } );
	var sphere;
	sphere = new THREE.Mesh( new THREE.SphereGeometry(52, 32, 16, 0, Math.PI * 2, Math.PI/2, Math.PI), bodyMaterial );
	sphere.position.x = 0;
	sphere.position.y = 120;
	sphere.position.z = 0;
	dbbody.add(sphere);

	var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0xf3f5f4});
	var cylinder;
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry(8,8,340-100,32), bodyMaterial);
	cylinder.position.x = 0;
	cylinder.position.y = 60+80+340/2-10-100/2-20;
	cylinder.position.z = 0;

	dbbody.add(cylinder);

	//body glass
	var glassMaterial = new THREE.MeshPhongMaterial( { color: 0x0, specular: 0xFFFFFF,
    shininess: 100, opacity: 0.3, transparent: true } );

	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x0c4864 } );
	var sphere;

	sphere = new THREE.Mesh( new THREE.SphereGeometry(60,32,23), glassMaterial );
	sphere.position.x = 0;
	sphere.position.y = 120;
	sphere.position.z = 0;
	dbbody.add(sphere);



	var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0xf3f5f4});
	var cylinder;
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry(16,16,340,32), glassMaterial);
	cylinder.position.x = 0;
	cylinder.position.y = 60+80+340/2-10;
	cylinder.position.z = 0;

	dbbody.add(cylinder);

	// body-leg connector
	var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x929196});
	var cube;
	cube = new THREE.Mesh( new THREE.CubeGeometry( 20, 204, 6 ), cubeMaterial );
	cube.rotation.x = 90 * Math.PI/180;
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = 320;
	cube.position.z = 0;	// offset 77 + half of depth 6/2
	dbbody.add( cube );

	var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0x929196});
	var cylinder;
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry(20,20,30,32), cylinderMaterial);
	cylinder.position.x = 0;
	cylinder.position.y = 320;
	cylinder.position.z = 0;

	dbbody.add(cylinder);
}
function createHead(dbhead) {
	var hatMaterial = new THREE.MeshPhongMaterial( { shininess: 100 } ); 
		hatMaterial.color.r = 24/255; 
		hatMaterial.color.g = 38/255; 
		hatMaterial.color.b = 77/255; 
		hatMaterial.specular.setRGB( 0.5, 0.5, 0.5 ); 

	//head
	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xee4130 } );
	var sphere;
	sphere = new THREE.Mesh( new THREE.SphereGeometry(40,32,23), sphereMaterial );
	sphere.position.x = 0;
	sphere.position.y = 60+50+80+340-10-10-10;
	sphere.position.z = 0;
	dbhead.add(sphere);

	//right-eye1
	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	var sphere;
	sphere = new THREE.Mesh( new THREE.SphereGeometry(14,32,23), sphereMaterial );
	sphere.position.x = -30;
	sphere.position.y = 60+50+80+340-10-10-10+2;
	sphere.position.z = -20;
	dbhead.add(sphere);

	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x000000 } );
	var sphere;
	sphere = new THREE.Mesh( new THREE.SphereGeometry(4,32,23), sphereMaterial );
	sphere.position.x = -30-14;
	sphere.position.y = 60+50+80+340-10-10-10+2;
	sphere.position.z = -20;
	dbhead.add(sphere);

	//left-eye2
	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	var sphere;
	sphere = new THREE.Mesh( new THREE.SphereGeometry(14,32,23), sphereMaterial );
	sphere.position.x = -30;
	sphere.position.y = 60+50+80+340-10-10-10+2;
	sphere.position.z = 20;
	dbhead.add(sphere);

	var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x000000 } );
	var sphere;
	sphere = new THREE.Mesh( new THREE.SphereGeometry(4,32,23), sphereMaterial );
	sphere.position.x = -30-14;
	sphere.position.y = 60+50+80+340-10-10-10+2;
	sphere.position.z = 20;
	dbhead.add(sphere);

	//peak
	var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0xee4130});
	var cylinder;
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry(0,14,50,32), cylinderMaterial);
	cylinder.rotation.z = 90 * Math.PI/180;
	cylinder.position.x = -40-50/2 +10;
	cylinder.position.y = 60+80+340 + 14/2 + 40 +20/2 -50;
	cylinder.position.z = 0;

	dbhead.add(cylinder);

	//hat
	var cylinder;
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry(50,50,10,32), hatMaterial);
	cylinder.position.x = 0;
	cylinder.position.y = 60+80+340 + 100 -50;
	cylinder.position.z = 0;

	dbhead.add(cylinder);


	var cylinder;
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry(30,30,60,32), hatMaterial);
	cylinder.position.x = 0;
	cylinder.position.y = 60+80+340 + 100 -40 +20;
	cylinder.position.z = 0;
	dbhead.add(cylinder);
}

//
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
	
	renderer.render(scene, camera);
}


try {
  init();
  addToDOM();
  animate();
} catch(e) {
    var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
    $('#container').append(errorReport+e);
}