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

var auroraPlane;
var auroraGenerator;

var nightSceneDirector = new THREE.Director();

function setupNightScene() {
	initNightScene();
	resizeNightScene();
	window.addEventListener('resize', resizeNightScene, false);
	
	renderCallback = renderNightScene;
	
}

function releaseNightScene() {
	
	renderCallback = null;
	setupSnowScene();
	
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
	
	nightSceneDirector.update();

	// For glittering stars
	for( i = 0; i < starTrailMaterials.length; i ++ ) {
		
		var flux =  Math.sin(time * 50 + i/starTrailLayers * 30 ) * 0.5 + 0.5;
		starTrailMaterials[i].color.setHSV( 0,  0, flux * 0.6 + 0.4 );
		//starTrailMaterials[i].opacity = 0;
	}
	
	auroraGenerator.redraw();
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

		solarSystem.add(particles);
		starTrailParticles.push(particles);
		
		size+=4;		

	}
	
	solarSystem.rotation.x = 0.6;
	
	scene.add( solarSystem );
	
	auroraGenerator = createAuroraTexture(64, 64); //128, 128
	
	auroraPlane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 2, 2),
		new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:false, map:auroraGenerator.texture}) 
	);
	
	auroraPlane.position.set(100, 200, 100);
	auroraPlane.scale.set(1.6, 0.8, 1);
	auroraPlane.rotation.set(2.1, -0.5, -0.7);
	
	auroraPlane.material.opacity = 0; //0.6
	
	scene.add(auroraPlane);
	
	
	
	var starTrailsOpacity = [starTrailMaterials[0], starTrailMaterials[1], starTrailMaterials[2]];
	
	nightSceneDirector.addTween(0, 2, auroraPlane.material,{opacity: 0} ,{opacity: 0.2}, 'Cubic.EaseIn')
		.addTween(2, 4, auroraPlane.material, null, {opacity: 0.2}, 'Cubic.EaseInOut')
		.addTween(6, 4, auroraPlane.material, null, {opacity: 0.4}, 'Bounce.EaseInOut')
		.addTween(10, 4, auroraPlane.material, null, {opacity: 0.6}, 'Cubic.EaseInOut')
		.addTween(14, 4, auroraPlane.material, null, {opacity: 0.01}, 'Cubic.EaseIn')
		.addTween(18, 1, auroraPlane.material, {opacity : 0.1}, {opacity : 0.2}, 'Quadratic.EaseOut')
		.addTween(19, 6, auroraPlane.material, {opacity : 0.4}, {opacity : 0.05}, 'Linear.EaseNone')

		.addTween(0,	10,	starTrailsOpacity, {opacity: 0},	{opacity: 1}, 'Cubic.EaseIn') //Cubic.EaseOut Linear.EaseNone
	
	// .addAction(0, function(){
	// 	var i= 0;
	// 	setInterval(function(){
	// 		i++;
	// 		console.log(i);
	// 		
	// 	}, 1000);
	// })
	.addAction(19, function() {
		
		camera.setLens(80);
		//clear = true;
		// auroraPlane.material.opacity = 0.01;
		// renderer.clear();
		
	})

	
	.addAction(24, function() {
		
		// camera.setLens(35);
		auroraPlane.material.opacity = 0.005;
		clear = false;
		renderer.clear();

	}).addAction(29, function() {
		camera.setLens(35);
		// auroraPlane.material.opacity = 0;
		clear = false;
		renderer.clear();
		starTrailMaterials[0].opacity =
		starTrailMaterials[1].opacity =
		starTrailMaterials[2].opacity = 0.5;
		
	}).addAction(34, function() {
		
		clear = true;
		// renderer.clear();

	}).addTween(34, 5, auroraPlane.material, {opacity: 0.8}, {opacity: 0}, 'Cubic.EaseOut')
	.addTween(40, 5, starTrailsOpacity, {opacity: 1}, {opacity: 0}, 'Cubic.EaseOut')	
	.addTween(38,4, camera, {lens:35}, {lens:28}, 'Linear.EaseNone', function() { //Quadratic.EaseOut Linear.EaseNone
		camera.setLens(camera.lens);
	})
	.addAction(44, function() {

		// Fade out // Unload Scene		
		releaseNightScene();
		nightSceneDirector.stop();
		
	}).start();
	

}

// Approaches. 
// plane + regenerating canvas.
// multi planes + static canvas.
// single plane + fragment shader.
// swap plane with skydom and repeat.

// 

/* CPU + Canvas Based method */
function createAuroraTexture(width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	var context = canvas.getContext('2d');

	var simplex = new SimplexNoise();

	var me = this;
	var texture;

	this.redraw = function() {
		var now = Date.now();
		var time = now / 4000;

		context.clearRect(0, 0, width, height);
		//context.fillStyle = 'white';
		//context.fillRect(0, 0, width, height);


		// Shine Rays map next time!!!!

		//createRadialGradient(x1,y1,r1,x2,y2,r2)
		// var gradient = context.createLinearGradient( 0,0, width, height );
		// var gradient = context.createLinearGradient( 0 ,height, width, height );
		var gradient = context.createLinearGradient( 0,  (Math.sin(time / 2)+1) * 0.5 * height, width, height - (Math.sin(time / 2)+1) * 0.5* height  );

		gradient.addColorStop( 0, 'rgba(200,200,0,0.9)' );
		gradient.addColorStop( (Math.sin(time)+1) * 0.5 * 0.2, 'rgba(100,0,0,1)' );

		gradient.addColorStop( (Math.cos(time)+1) * 0.5 * 0.2 + 0.4 , 'rgba(0,200,0,1)' ); // 0.6
		gradient.addColorStop( 0.8, 'rgba(0,0,200,1)' );
		gradient.addColorStop( 1, 'rgba(200,200,200,1)' );

		context.fillStyle = gradient;
		context.fillRect(0,0, width, height);

		context.save();
		context.globalCompositeOperation = 'lighter';
		var gradient = context.createLinearGradient( 0, 0, 0, height );
		gradient.addColorStop( 0, 'rgba(0,0,0,0.2)' );
		gradient.addColorStop( 1, 'rgba(200,200,200,0.5)' );


		context.fillStyle = gradient;
		context.fillRect(0,0, width, height);

		context.restore();

		// var image = context.getImageData( 0, 0, width, height );
		var image = context.createImageData( width, height );

		var image2 = context.getImageData( 0, 0, width, height );

		var imageData = image.data;
		var imageData2 = image2.data;


		var w,h, n;

		// settings
		var octaves = 1;				
		var scaleX = 4 /octaves, scaleY = 0.25 /octaves;

		var w,h, n;

		for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++  ) {

			h = Math.floor( j/width );
			w = j % width;

			n = 0;
			var frequency = 1;
			var persistance = 0.5;
			var amptitude ;

			for (var oi=0; oi < octaves; oi++) {
				frequency *= 2;
				amptitude =  Math.pow(persistance, oi);

				n += simplex.noise3d(w/width * frequency * scaleX, h/height* frequency * scaleY, time)  * amptitude ;
			}


			var m = n;
			var factor = n* 0.5 + 0.5; // + 1 ) * 0.5
			n = Math.floor( factor * 255); //Math.floor


			// Multiply ** (best!!!)
			imageData[ i ] = Math.floor( factor * imageData2[ i ]);
			imageData[ i + 1 ] = Math.floor( factor * imageData2[ i + 1]);
			imageData[ i + 2 ] = Math.floor( factor * imageData2[ i + 2 ]);
			imageData[ i + 3 ] = 255;



		}
		context.putImageData( image, 0, 0 );

		//console.log('done', Date.now() - now);
		
		texture.needsUpdate = true; 

	}

	texture = new THREE.Texture(  canvas  );
	this.texture = texture;
	this.redraw();

	return this;
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
