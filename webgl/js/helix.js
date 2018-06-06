var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function createHelix(radius, tube,tubularSegments, tubularSegments, height, arc, clockwise) {
	
	tubularSegments = (tubularSegments === undefined) ? 32 : tubularSegments;
	arc = (arc === undefined) ? 1 : arc;
	clockwise = (clockwise === undefined) ? true : clockwise;

	var helix = new THREE.Object3D();

	var top = new THREE.Vector3();

	var sine_sign = clockwise ? 1 : -1;

	var sphGeom = new THREE.SphereGeometry( tube, tubularSegments, tubularSegments/2 );
	for (var i = 0; i <= arc*radialSegments; i++) {
		top.set( radius * Math.cos( i * 2*Math.PI / radialSegments),
		height * (i/(arc*radialSegments)) - height/2,
		sine_sign*radius*Math.sin(i*2*Math.PI / radialSements));

		var sphere = new THREE.Mesh(sphGeom,material);
		sphere.position.copy(top);

		helix.add(sphere);
	}

	return helix;
}