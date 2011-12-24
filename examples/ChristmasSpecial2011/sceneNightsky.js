var clear = true;
var cameraTarget ;
var solarSystem = new THREE.Object3D();

var starTrailLayers = 3;
var starTrailParticles = [];
var starTrailGeometries = [];
var starTrailMaterials = [];

// init/setup/load release/teardown|destory/unload render

// Scenes = Sequences? | Timeline > Tween
// Movie/ Clip / Stage / Library / Director
// Sequence : Add update clear
// Effect : init, load, show, hide, update

// Init Load RenderLoop Unload

var SCREEN_WIDTH, SCREEN_HEIGHT, WINDOW_RATIO, TARGET_RATIO, RESIZE_FACTOR,
	MARGIN, RESIZE_FACTOR;
	
var NEAR = 5, FAR = 3000;

var testPlane;

function setupNightScene() {
	initNightScene();
	resizeNightScene();
	window.addEventListener('resize', resizeNightScene, false);
	
	renderCallback = renderNightScene;
	
}

function resizeNightScene() {
	// Stage Properties
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	
	TARGET_RATIO = 2.93; // Ultra Wide screen format
	var OPTIMIZED_WIDTH = 1440;
	
	var WINDOW_RATIO = SCREEN_WIDTH/SCREEN_HEIGHT;
	
	var TARGET_HEIGHT = Math.round(SCREEN_WIDTH / TARGET_RATIO);
	var DIFF = SCREEN_HEIGHT - TARGET_HEIGHT;
	
	SCREEN_HEIGHT = TARGET_HEIGHT;
	
	var MARGIN = DIFF / 2;
	if (MARGIN < 0) MARGIN = 0;
	
	RESIZE_FACTOR = SCREEN_WIDTH / OPTIMIZED_WIDTH;
	
	// Resize Stage
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";
	renderer.domElement.style.top = MARGIN + 'px';
	
	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();
	
}


function renderNightScene() {
	var time = Date.now() * 0.00005;

	for ( i = 0; i < starTrailLayers; i ++ ) {	
		starTrailParticles[i].rotation.y -= 0.001;
	}

	// For glittering stars
	for( i = 0; i < starTrailMaterials.length; i ++ ) {
		
		var flux =  Math.sin(time * 50 + i/starTrailLayers * 30 ) * 0.5 + 0.5;
		starTrailMaterials[i].color.setHSV( 0,  0, flux * 0.6 + 0.4 );
	
	}
	
	if (clear) renderer.clear();
	renderer.render( scene, camera );
}

function initNightScene() {

	// container;

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.setLens(24);
	cameraTarget = new THREE.Vector3(100, 200, 100);
	camera.lookAt(cameraTarget);

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xfffefe, 0.0007, 1000 );
	
	// scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( 0xfffefe, 1400, FAR );
	// THREE.ColorUtils.adjustHSV( scene.fog.color, 0.02, -0.15, -0.65 );
	

	var starTrailRadius = 1000;
	var starTrailParticlesCount = 2000;

	for (var j = 0; j< starTrailLayers; j++) {
		
		var geometry = new THREE.Geometry();
	
		for ( i = 0; i < starTrailParticlesCount; i ++ ) {
			// Not the most accurate distribution of 
			// points on sphere surface, but works.

			var angle = Math.random() * Math.PI * 2;
			var x = Math.cos(angle) * starTrailRadius;
			var y = Math.sin(angle) * starTrailRadius;
		
			var angle2 = Math.random() * Math.PI  ;
			var z = Math.sin(angle2) * x;
			x = Math.cos(angle2) * x;
		
			vector = new THREE.Vector3( x, y, z );

			geometry.vertices.push( new THREE.Vertex( vector ) );

		}
		
		starTrailParticlesCount *= 0.5;
		starTrailGeometries.push(geometry);
	}

	

	var canvas = generateSprite();
	
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	
	var size  = 2 ;

	for ( i = 0; i < starTrailLayers; i ++ ) {

		starTrailMaterials[i] = new THREE.ParticleBasicMaterial( { size: size, map: texture, color: 0xffffff } );
		starTrailMaterials[i].color.setRGB(255-size*2, 255-size*2, 255-size*2);
		
		
		var particles = new THREE.ParticleSystem( starTrailGeometries[i], starTrailMaterials[i] );

		// particles.rotation.x = Math.random() * 6;
		// particles.rotation.y = Math.random() * 6;
		// particles.rotation.z = Math.random() * 6;
		
		solarSystem.add(particles);
		starTrailParticles.push(particles);
		
		size+=4;		

	}
	
	solarSystem.rotation.x = 0.6;
	
	scene.add( solarSystem );
	
	testPlane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
		new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true, map: aurora})
	);
	
	testPlane.position.set(100, 200, 100);
	testPlane.rotation.set(1.9, -0.4, -0.9);
	
	scene.add(testPlane);
	
}

function generateSprite() {

	var canvas = document.createElement( 'canvas' );
	canvas.width = 128;
	canvas.height = 128;

	var context = canvas.getContext( '2d' );


	context.beginPath();
	context.arc( 64, 64, 60, 0, Math.PI * 2, false) ;
	context.closePath();

	context.lineWidth = 0.5; //0.05
	context.stroke();
	context.restore();

	var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );

	gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.4, 'rgba(200,200,200,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

	//context.fillStyle = gradient;
	context.fillStyle = 'white';

	context.fill();

	//var idata = context.getImageData(0, 0, canvas.width, canvas.height);
	//document.body.appendChild(canvas);
	return canvas;

}
