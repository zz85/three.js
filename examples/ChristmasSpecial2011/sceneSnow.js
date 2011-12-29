var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
var FLOOR = 0;

var camera, controls, scene, renderer;
var container, stats;

var sceneHUD, cameraOrtho, hudMaterial;

var composer;

var particleCloud, sparksEmitter, attributes, particleProducer;

var light, ambient, backlight;

var clock = new THREE.Clock();

var snowman;

var textParticlesEmitter, textParticlesProducer;

var snowSceneDirector;

var ParticlePool;
var particlePoolCount = 20000;
var particles;

var values_size; // Particle Size
var values_color; // Particle Color

var earthRotation = new THREE.Object3D();

var textMesh;

function setupSnowScene() {
	initSnowScene();
	renderCallback = renderSnowScene;
}



var hoverControls;
var allowCompositing = !true;


var moveSun; 

function SunMovements() {
	
	var me = this;
	
	me.frontAngle = 0.15;
	me.topAngle = 1.73; //1.73
	me.radius = 1400;

	this.update = function() {

		var lx = Math.cos(me.frontAngle) * me.radius;
		var ly = Math.sin(me.frontAngle) * me.radius;

		var lz = Math.sin(me.topAngle) * lx;
		lx = Math.cos(me.topAngle) * lx;


		light.position.set(lx, ly, lz);

	}
}

function renderSnowScene() {
	
	// moveSun.update();
	
	light.color.setHSV(light.h, light.s, light.v);
	backlight.color.setHSV(backlight.h, backlight.s, backlight.v);	
	frontlight.color.setHSV(frontlight.h, frontlight.s, frontlight.v);
	ambient.color.setHSV(ambient.h, ambient.s, ambient.v);
	//THREE.ColorUtils.adjustHSV( scene.fog.color, 0.02, -0.15, -0.65 );
	scene.fog.color.setHSV( scene.fog.h, scene.fog.s, scene.fog.v );
		
		
	var delta = clock.getDelta();
	
	
	//controls.update( delta );
	if (allowCompositing) {
		controls.update( 0.025 );
	} else {
		snowSceneDirector.update();
	}
	
	particleCloud.geometry.__dirtyVertices = true;

	attributes.size.needsUpdate = true;
	attributes.pcolor.needsUpdate = true;
	
	renderer.clear();
	composer.render();
	//renderer.render( scene, camera );
	
	if (playRecording) playbackDirector.update();
	
	// Render debug HUD with shadow map
	// setInterval(function() {light.position.y += 100 ; }, 200);
	// hudMaterial.uniforms.tDiffuse.texture = renderer.shadowMapPlugin.shadowMap[0];
	// renderer.render( sceneHUD, cameraOrtho );
	
}


function initSnowScene() {
	// SCENE CAMERA

	camera = new THREE.PerspectiveCamera( 23, TARGET_RATIO, NEAR, FAR );
	camera.position.set( 700, 50, 1900 ); //700, 50, 1900
	
	controls = new THREE.FirstPersonControls( camera );

	// controls.lookSpeed = 0.01;
	// controls.movementSpeed = 100;
	controls.lookSpeed = 0.02;
	controls.movementSpeed = 500;

	controls.noFly = false;
	controls.lookVertical = true;
	controls.constrainVertical = true;
	controls.verticalMin = 1.5;
	controls.verticalMax = 3.0;

	controls.lon = -110;
	controls.lat = 64.64555278652584;
	//controls.lon = 246.43799999999848;

	// SCENE

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xfffefe, 1400, FAR );
	THREE.ColorUtils.adjustHSV( scene.fog.color, 0.02, -0.15, -0.65 );

	// LIGHTS

	ambient = new THREE.AmbientLight( 0xffffff );
	ambient.color.setHSV(0,0,0.5);
	scene.add( ambient );
	
	backlight = new THREE.PointLight( 0xffffff );  //DirectionalLight
	backlight.position.set(0, FLOOR + 30, -100);
	scene.add(backlight);
	
	//PointLight


	light = new THREE.SpotLight( 0xffffff ); // Sun light which casts shadows.
	light.position.set( 0, 1500, 1000 ); // front light
	
	// light.position.set( 0, 500, 500 );
	// light.position.set( -800,000, -1000 ); // morning light
	// light.position.set( 300,400, -600 ); // backlight

	// earthRotation.add(light);
	// earthRotation.rotation.y = Math.PI ;	

	light.target.position.set( 0, 0, 0 );
	light.castShadow = true;
	scene.add( light );
	// scene.add( earthRotation );

	createHUD();
	createScene();


	// lens flares

	var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare0.png" );
	var textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare2.png" );
	var textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare3.png" );

	// FLARES
	//var frontlight;
	frontlight = new THREE.PointLight( 0xffffff, 1.0, 4500 );
	frontlight.position.set( 100,100, 600); //300,400, -600 
	// frontlight.position = pos;

	scene.add( frontlight );
	// earthRotation.add( light );

	frontlight.color.setHSV( 0.08, 0.825, 0.99 ); // Warmish
	// White 	// addLight( 0.995, 0.025, 0.99, light.position );

	var flareColor = new THREE.Color( 0xffffff );
	flareColor.copy( frontlight.color );
	THREE.ColorUtils.adjustHSV( flareColor, 0, -0.5, 0.5 );

	var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	lensFlare.position = light.position;

	scene.add( lensFlare );
	// earthRotation.add( lensFlare );



	// PARTICLE SYSTEMS

	particles = new THREE.Geometry();

	function newVertex( x, y, z ) {
		return new THREE.Vertex( new THREE.Vector3( x, y, z ) );
	}


	// This pool is for grabbing a particle used in Three.js
	// It doesn't store any stuff, just indinces 
	ParticlePool = {

		__pools: [],
		__forloan: [],

		// Get a new Vector / Borrow

		get: function() {

			if ( this.__forloan.length > 0 ) {

				return this.__forloan.pop();

			}

			console.log( "pool ran out!" );

			var r = this.__pools[Math.floor(Math.random()*this.__pools.length)];
			if (r.stolen) {
				r.stolen++;
			} else {
				r.stolen = 1;
			}

			return r;

		},

		// Release a vector back into the pool, Return / add

		add: function( v ) {
			this.__forloan.push( v );
			this.__pools.push( v );

		},

		return: function( v ) {
			if (!v.stolen) {
				this.__forloan.push( v );
			} else {
				v.stolen--;
			}

		}



	};

	for ( i = 0; i < particlePoolCount; i ++ ) {

		particles.vertices.push( newVertex( Math.random() * 200 - 100, Math.random() * 100 + 150, Math.random() * 50 ) );
		ParticlePool.add( i );

	}

	// Create pools of vectors

	var sprite = generateSnowSprite() ;

	texture = new THREE.Texture( sprite );
	texture.needsUpdate = true;

	function generateSnowSprite() {
		// Generate a texture
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

		context.fillStyle = gradient;

		context.fill();

		return canvas;

	}

	attributes = {

		size:  { type: 'f', value: [] },
		pcolor: { type: 'c', value: [] }

	};

	var uniforms = {

		texture:   { type: "t", value: 0, texture: texture }

	};

	var shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: 		uniforms,
		attributes:     attributes,

		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

		blending: 		THREE.AdditiveBlending, //AdditiveBlending THREE.Subtractive
		depthWrite:		false,
		transparent:	true

	});

	particleCloud = new THREE.ParticleSystem( particles, shaderMaterial );

	particleCloud.castShadow = true;
	particleCloud.receiveShadow = true;

	particleCloud.dynamic = true;
	//particleCloud.sortParticles = true;

	var vertices = particleCloud.geometry.vertices;
	values_size = attributes.size.value; // Particle Size
	values_color = attributes.pcolor.value; // Particle Color

	for( var v = 0; v < vertices.length; v ++ ) {

		values_size[ v ] = 30;
		values_color[ v ] = new THREE.Color( 0xffffff );
		particles.vertices[ v ].position.set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

	}

	scene.add( particleCloud );
	//particleCloud.y = 800;

	var onParticleCreated = function( p ) {

		var target = ParticlePool.get();

		p.target = target;	

		var position = p.position;

		// var shadow = ParticlePool.get();
		// p.shadow = shadow;

		if ( target ) {
			particles.vertices[ target ].position = p.position;

			values_color[ target ].setHSV( 0, 0, 0.4 + Math.random() * 0.4 );
			values_size[ target ] = 10 +  Math.random() * 80;

			// values_color[ shadow ].setHSV( 0.5, 0, 0.5 );
			// //values_color[ shadow ].setRGB( 10, 10, 100 );
			// values_size[ shadow ] = 15; //values_size[ target ];

		};

	};

	var onParticleDead = function( particle ) {

		var target = particle.target;

		if ( target ) {

			// Hide the particle
			values_color[ target ].setHSV( 0, 0, 0 );
			particles.vertices[ target ].position.set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

			// Mark particle system as available by returning to pool
			ParticlePool.return( particle.target );

			// var shadow = particle.shadow;
			// 
			// values_color[ shadow ].setHSV( 0, 0, 0 );
			// particles.vertices[ shadow ].position.set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
			// 
			// ParticlePool.return( shadow );

		}

	};

	var onParticleUpdate = function( particle ) {

		// particles.vertices[ particle.shadow ].position.set(
		// 	particle.position.x,
		// 	FLOOR + 5,
		// 	particle.position.z);
		// 	// SHould do some projection from light to particles to floor.

	}
	
	
	initTextParticles();
	

	particleProducer = new SPARKS.SteadyCounter( 50 );

	sparksEmitter = new SPARKS.Emitter( particleProducer );


	var zone = new SPARKS.ParallelogramZone( 
		new THREE.Vector3(-1400,800,-1000), 
		new THREE.Vector3(2800,0,0),
		new THREE.Vector3(0,0,2000)	);

	sparksEmitter.addInitializer(new SPARKS.Position( zone ) );
	sparksEmitter.addInitializer(new SPARKS.Lifetime(5, 8));

	sparksEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 0, -100, 0 ) ) ) );

	sparksEmitter.addAction( new SPARKS.Age() );
	sparksEmitter.addAction( new SPARKS.Move() );

	sparksEmitter.addAction( new SPARKS.Accelerate( 40, -100, 50  ) );				
	sparksEmitter.addAction( new SPARKS.RandomDrift( 800 , 100, 800 ) );
	
	// sparksEmitter.addAction( new SPARKS.WindNoise() );

	sparksEmitter.addAction( new SPARKS.DeathZone( new SPARKS.CubeZone(
			new THREE.Vector3(-5000, FLOOR, -5000),
			10000, -5000, 10000
		) ) );


	sparksEmitter.addCallback( "created", onParticleCreated );
	sparksEmitter.addCallback( "dead", onParticleDead );
	sparksEmitter.addCallback( "updated", onParticleUpdate );

	sparksEmitter.start();

	// RENDERER

	renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: false,
		canvas: renderer.domElement } );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";
	renderer.domElement.style.top = MARGIN + 'px';
	// container.appendChild( renderer.domElement );

	renderer.setClearColor( scene.fog.color, 1 );
	renderer.autoClear = false;

	renderer.shadowCameraNear = 1;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 70;

	//renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness = 0.3;
	renderer.shadowMapWidth = SHADOW_MAP_WIDTH;
	renderer.shadowMapHeight = SHADOW_MAP_HEIGHT;

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

	// PHYSICAL SHADING

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.physicallyBasedShading = true;
	// 				

	// POSTPROCESSING

	renderer.autoClear = false;

	var renderScene = new THREE.RenderPass( scene, camera );

	thblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalTiltShift" ] );
	tvblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalTiltShift" ] );

	var bluriness = 6;

	thblur.uniforms[ 'h' ].value = bluriness / SCREEN_WIDTH * RESIZE_FACTOR;
	tvblur.uniforms[ 'v' ].value = bluriness / SCREEN_HEIGHT * RESIZE_FACTOR;

	thblur.uniforms[ 'r' ].value = tvblur.uniforms[ 'r' ].value = 0.5;

	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBufer: false };
	renderTarget = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );


	composer = new THREE.EffectComposer( renderer, renderTarget );
	composer.addPass( renderScene );
	composer.addPass( thblur );
	composer.addPass( tvblur );

	composer.passes[composer.passes.length-1].renderToScreen = true;
	
	
	//Cubic.EaseInOut Bounce.EaseInOut
	// anim("Camera Position",camera.position)
	// 		.to({x: 700, y:50, z:2900},0)
	// 		.to({x: 700, y:50, z:-1900},5, Timeline.Easing.Cubic.EaseIn);

	// anim("snowman position",camera.position.y).to({"y":100},0).to({"y":1000},1, Timeline.Easing.Cubic.EaseOut).to({"y":100},1, Timeline.Easing.Bounce.EaseOut);
	// anim("Camera Position",camera.position.x).to({"x":700},0).to({"x":697.8725114754761},2.87, Timeline.Easing.Cubic.EaseIn).to({"x":-200},3.415, Timeline.Easing.Cubic.EaseIn);
	// anim("Camera Position",camera.position.y).to({"y":100},0).to({"y":150},2.88, Timeline.Easing.Cubic.EaseIn);
	// anim("Camera Position",camera.position.z).to({"z":2900},0).to({"z":1900},2.88, Timeline.Easing.Cubic.EaseIn);
	// 


	// anim("snowman position",snowman.position)
	// 		.to({ y: 100},0)
	// 		.to({ y: 300},1, Timeline.Easing.Cubic.EaseOut) //Bounce -> Goes , end. / EaseInOut
	// 		.to({ y: 100},1, Timeline.Easing.Bounce.EaseOut);
	// 

	// anim("Camera Position",camera.position)
	// 		.to({x: -280,
	// 			y: 280,
	// 			z: -3000},0)
	// 		.to({x: -280,
	// 			y: 100,
	// 			z: -1000},8, Timeline.Easing.Linear.None) //Cubic.EaseOut
	// 		.to({	x: 2665.2575969466884,
	// 			y: 300.73770261364837,
	// 			z: 145.81159082687202},5);
	// 	// -1500 155
	// anim("Camera Rotation", camera.rotation)
	// 	.to({x: -Math.PI,
	// 		y: 0,
	// 		z: -Math.PI
	// 		}, 0);
	// 	// .to({x: -Math.PI,
	// 	// 		y: 0,
	// 	// 		z: -Math.PI
	// 	// 		}, 8)
	// 	// .to({x:0, y:0, z:0}, 5);
		
	anim("Light", light)
		.to({h:0.08, s:0.325, v:0}, 0)
		.to({h:0.08, s:0.325, v:0.8}, 5)
		.to({h:0.08, s:0, v:0.8}, 5)
		;
	anim("Backlight", backlight)
		.to({h:0, s:0, v:0}, 0)
		.to({h:0, s:0, v:0.8}, 5)
		;
	anim("Frontlight", frontlight)
		.to({h:0, s:0, v:0}, 0)
		.to({h:0, s:0, v:1}, 5);
		;
		//.to({h:0, s:0, v:0}, 0);
	anim("Ambientlight", ambient)
		
		.to({h:0.08, s:0.325, v:0.2}, 0)
		.to({h:0.08, s:0.325, v:0.5}, 5);
	
	anim("Fog", scene.fog)

		// .to({h:0.08, s:0.325, v:0.2}, 0)
		// .to({h:0.08, s:0.325, v:1}, 5);
		
		.to({h:0, s:0, v:0.2}, 0)
		.to({h:0, s:0, v:0.4}, 5);
		
		//.to({h:0, s:0, v:0}, 0);
		
	// Timeline.getGlobalInstance().loop(-1); //loop forever

	var orbitTarget = new THREE.Vector3(0, 200,0);
	//camera, target, distance, height
	hoverControls = new THREE.OrbitControls(camera, orbitTarget, 800, 200);
	moveSun = new SunMovements();

	snowSceneDirector = new THREE.Director();
	
	var backview = function() {
		camera.rotation.set(-Math.PI, 0, -Math.PI);
	};
	
	var frontview = function() {
		camera.rotation.set(0, 0, 0);
	};
	
	
	// 		.to({x: -280,
	// 			y: 280,
	// 			z: -3000},0)
	// 		.to({x: -280,
	// 			y: 100,
	// 			z: -1000},8, Timeline.Easing.Linear.None)
	
	
	snowSceneDirector
	.addAction(0, backview)
	.addTween(0, 4, camera.position, { x: -280,	y: 280, z: -3000},
		{ x: -280,	y: 280, z: -2800}, 'Linear.EaseNone')
	.addAction(4.0, function() {
		console.log('frontview pls!!')
		camera.position.set(700, 50, 1900);
		frontview();
	})
	.addTween(4, 1.5, camera.position, null,
		{ x: 700, y: 50, z: 1900 }, 'Always.One')
	.addTween(5.5, 1, camera.position, null, { x: -600,	y: 80, z: -1700}, 'Always.One')
	.addTween(5.5, 1, camera.rotation, null, { x:-Math.PI, y:0, z:-Math.PI }, 'Always.One')
	
	.addAction(6.5, backview)
	.addTween(6.5, 2 , camera.position, { x: -280,	y: 280, z: -2800},
		{ x: -280, y: 240,z: -2400 }, 'Linear.EaseNone')
		
	.addAction(8.5, frontview)
	.addTween(8.5, 0.5, camera.position, null, { x: -397, y: 260, z: 2133}, 'Always.One')
	
	// Panning
	.addAction(9.5, backview)
	.addTween(9.5, 8, camera.position, { x: -1400,y: 200, z: -1490},
		 { x: 1000, y: 200, z: -1490}, 'Quadratic.EaseInOut')
	
	// Front view
	.addAction(17.5, frontview)
	.addTween(17.5, 0.5, camera.position, null, { x: -152, y: 50, z: 2080}, 'Always.One')
		
	
	// .addTween(8.5, 5 , camera.position, { x: -280, y: 240,z: -2400 },
	// 	{x: -280, y: 100, z: -1000}, 'Linear.EaseNone')


	
	.addTween(0, 10, moveSun, { frontAngle: 0 }, 
		{ frontAngle: 0.15 }, 'Linear.EaseNone', moveSun.update) 
	.addTween(0, 20, renderer, { shadowMapDarkness: 0 }, 
		{ shadowMapDarkness: 0.3 }, 'Cubic.EaseIn', moveSun.update)
		

	// .addTween(0, 10, hoverControls, {rotation: 0, height: 20, distance: 800}, 
	// 	{rotation: 0.5, height: 700, distance: 1400}, 'Cubic.EaseInOut', hoverControls.update) //Linear.EaseNone
	// // .addAction(8, function() {
	// // 	// Setup lens 
	// // 	camera.setLens(35);
	// // })
	// // .addTween(8, 1, camera, null,  
	// // 	{fov: 63}, 'Cubic.EaseInOut', camera.updateProjectionMatrix)
	// 
	// .addTween(2, 10, orbitTarget, null, {y: 300}, 'Linear.EaseNone')
	// .addTween(12, 6, orbitTarget, null, {y: 200}, 'Linear.EaseNone')	
	// 	
	// .addTween(4, 12, camera, {lens: 105}, {lens: 50}, 'Linear.EaseNone', function() {camera.setLens(camera.lens);})
	// 
	// .addTween(12, 8, hoverControls, null, 
	// 	{ rotation: 1, height: 200, distance: 600}, 'Cubic.EaseInOut', hoverControls.update) //Linear.EaseNone
	// .addTween(0, 30, moveSun, null, 
	// 	{ frontAngle: Math.PI - 0.3}, 'Cubic.EaseInOut', moveSun.update) //Linear.EaseNone
	// .addTween(20, 4, camera.position, null, 
	// 	{ y:318, z:1400}, 'Cubic.EaseInOut', function() { // x:-514,
	// 		camera.lookAt(orbitTarget);
	// 	}) //Linear.EaseNone
	// .addTween(22, 2, camera, {lens: 50}, {lens: 70}, 'Linear.EaseNone', function() {camera.setLens(camera.lens);})
	// 
	// .addTween(24, 0.5, textMesh.position, null, { y: FLOOR + 60 }, 'Cubic.EaseInOut') //Linear.EaseNone
	// .addTween(24.5, 0.25, textMesh.position, null, { y: FLOOR + 10 }, 'Cubic.EaseInOut') //Linear.EaseNone
	// .addTween(24.5, 0.25, textMesh.scale, null, { y: 0.8 }, 'Cubic.EaseInOut') //Linear.EaseNone
	// .addTween(25, 0.5, textMesh.position, null, { y: FLOOR + 60 }, 'Bounce.EaseOut') //Linear.EaseNone
	// .addTween(25.5, 0.25, textMesh.position, null, { y: FLOOR + 10 }, 'Bounce.EaseOut') //Linear.EaseNone
	// .addTween(25.25, 0.25, textMesh.scale, null, { y: 0.25 }, 'Bounce.EaseOut') //Linear.EaseNone
	// .addTween(26, 0.5, textMesh.position, null, { y: FLOOR + 60 }, 'Bounce.EaseOut') //Linear.EaseNone
	// .addTween(26.5, 0.25, textMesh.position, null, { y: FLOOR + 10 }, 'Bounce.EaseOut') //Linear.EaseNone
	// .addTween(26.25, 0.25, textMesh.scale, null, { y: 0 }, 'Bounce.EaseOut') //Linear.EaseNone
	// .addAction(27, function() { scene.remove(textMesh); particleProducer.rate = 0; })
	
	// .addAction(0, function() {
	// 	// Setup lens 
	// 	// camera.setLens(108); //105
	// })
	// .addAction(2, function() {
	// 	console.log("Snowman front view");
	// 	camera.position.set(-152, 50, 2080);
	// })
	// .addAction(4, function() {
	// 	console.log("Snowman front view - zoom out1");
	// 
	// 	camera.position.set(-397, 260, 2133);
	// })
	// .addAction(6, function() {
	// 	console.log("Snowman front view - zoom out2");
	// 	camera.position.set(-514, 218, 2400);
	// })
	// .addAction(8, function() {
	// 	// 
	// 	console.log("CHRIST");
	// 	camera.position.set(-350, 162, 1032);
	// })
	// .addAction(10, function() {
	// 	// 
	// 	console.log("MAS");
	// 	camera.position.set(510, 161, 1054);
	// })
	// .addAction(12, function() {
	// 	console.log("Snowman Front");
	// 	camera.position.set(-1360, 230, 1036);
	// })
	// .addAction(14, function() {
	// 	// 
	// 	console.log("Snowman Back");
	// 	camera.position.set(-560, 257, -900);
	// 	camera.position.set(-560, 257, -1200);
	// 	camera.rotation.set(-Math.PI, 0, Math.PI);
	// 			// camera.rotation.set(-3, 0, 3.1);
	// })
	// .addAction(16, function() {
	// 	// Snowman Back
	// 	console.log("Snowman Back");
	// 
	// 
	// })
	// .addAction(18, function() {
	// 	// 
	// 	console.log("Mas Back");
	// 	camera.position.set(-310, 298, -1445);
	// })
	// .addAction(20, function() {
	// 	// Mas Back
	// 	console.log("Mas Back2");
	// 	camera.position.set(-200, 214, -1050);
	// })
	// .addAction(22, function() {
	// 	// 
	// 	console.log("Snowman Back 2"); //XXX
	// 	camera.position.set(-1204, 231, -1088);
	// })
	// .addAction(28, function() {
	// 	snowSceneDirector.stop();
	// })
	
	.start();
	
	// var i= 0;
	// setInterval(function(){
	// 	i++;
	// 	console.log(i);
	// 	
	// }, 1000);
	

}



function createHUD() {

	cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2,  SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, -10, 1000 );
	cameraOrtho.position.z = 10;

	var shader = THREE.ShaderExtras[ "screen" ];
	var uniforms = new THREE.UniformsUtils.clone( shader.uniforms );

	hudMaterial = new THREE.ShaderMaterial( { vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader, uniforms: uniforms } );

	var hudGeo = new THREE.PlaneGeometry( SHADOW_MAP_WIDTH / 2, SHADOW_MAP_HEIGHT / 2 );
	var hudMesh = new THREE.Mesh( hudGeo, hudMaterial );
	hudMesh.position.x = ( SCREEN_WIDTH - SHADOW_MAP_WIDTH / 2 ) * -0.5;
	hudMesh.position.y = ( SCREEN_HEIGHT - SHADOW_MAP_HEIGHT / 2 ) * -0.5;

	sceneHUD = new THREE.Scene();
	sceneHUD.add( hudMesh );

	cameraOrtho.lookAt( sceneHUD.position );

}

function createScene( ) {

	// GROUND

	var geometry = new THREE.PlaneGeometry( 100, 100 );
	var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xfefefe } ); //0xffdd99
	var redMaterial = new THREE.MeshLambertMaterial( { color: 0xffdd99 } ); 
	THREE.ColorUtils.adjustHSV( planeMaterial.color, 0, 0, 0.9 );
	planeMaterial.ambient = planeMaterial.color;

	var ground = new THREE.Mesh( geometry, planeMaterial );

	ground.position.set( 0, FLOOR, 0 );
	ground.rotation.x = -Math.PI/2;
	ground.scale.set( 100, 100, 100 );

	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add( ground );

	// TEXT
	
	faceMaterial = new THREE.MeshFaceMaterial();

	textMaterialFront = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
	textMaterialSide = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );

	var textGeo = new THREE.TextGeometry( "CHRISTMAS", {

		size: 200,
		height: 50,
		curveSegments: 12,

		font: "helvetiker",
		weight: "bold",
		style: "normal",

		bevelThickness: 2,
		bevelSize: 5,
		bevelEnabled: true

		,
		material: 0,
		extrudeMaterial: 1

	});

	textGeo.materials = [ textMaterialFront, textMaterialSide ];

	textGeo.computeBoundingBox();
	
	//
	textGeo.computeVertexNormals();

	
	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff, ambient: 0xaa0000 } );
	var snowMaterial = new THREE.MeshPhongMaterial( { color: 0xfefefe, specular: 0xfefefe, ambient: 0xdedede } );

	textMesh = new THREE.Mesh( textGeo, faceMaterial ); //planeMaterial faceMaterial 
	textMesh.position.x = centerOffset;
	textMesh.position.y = FLOOR + 10;

	textMesh.castShadow = true;
	textMesh.receiveShadow = !true;

	scene.add( textMesh );

	// SNOW MAN
	
	var head = new THREE.OctahedronGeometry( 100, 4 ); //SphereGeometry
	var body = new THREE.OctahedronGeometry( 140, 4 ); // new THREE.SphereGeometry( 140, 20, 20 );
	var fist = new THREE.OctahedronGeometry( 20, 2 ); //SphereGeometry
	
	var cone = new THREE.CylinderGeometry(0, 30, 100, 10, 10, false);
 	
	
	//body.applyMatrix( new THREE.Matrix4().setScale( 1, 1, 1 ) );
	
	
	var headMesh = new THREE.Mesh( head, planeMaterial ); //planeMaterial
	var bodyMesh = new THREE.Mesh( body, planeMaterial ); //snowMaterial
	
	//noseMesh = new THREE.Mesh( fist, planeMaterial );
	noseMesh = new THREE.Mesh( cone, redMaterial );
	noseMesh.scale.set(0.5, 0.5, 0.5);
	noseMesh.position.z = 100;
	noseMesh.position.y = 10;
	noseMesh.rotation.x = Math.PI  * 5 /2;
	
	
	
	eyesRight = new THREE.Mesh( fist, planeMaterial );
	eyesLeft = new THREE.Mesh( fist, planeMaterial );
	
	eyesRight.scale.set(0.25, 0.25, 0.25);
	eyesLeft.scale.set(0.25, 0.25, 0.25);
	
	eyesRight.position.set(-45, 50, 76);
	eyesLeft.position.set(50,50,70);
	
	bodyMesh.position.y -= 180;
	
	snowman = new THREE.Object3D();
	//snowman.position.set(-1000, 250, 400);
	snowman.position.set(-1100, 250, 0);
	
	headMesh.castShadow = !false;
	headMesh.receiveShadow = !false;
	
	bodyMesh.castShadow = !false;
	bodyMesh.receiveShadow = !false;
	
	//bodyMesh.scale.y = 1.2;

	
	// TODO Create Scarf, Hat & face
	snowman.castShadow = false;
	snowman.receiveShadow = false;
	
	snowman.add(headMesh);
	snowman.add(bodyMesh);
	
	snowman.add(noseMesh);
	snowman.add(eyesLeft);
	snowman.add(eyesRight);
	
	// Create hands for snowman.
	
	// Can use cyclinder / lines
	var stick = new THREE.CylinderGeometry(5,5, 70);
	armMesh = new THREE.Mesh( stick, planeMaterial );
	armMesh.castShadow = true;
	armMesh.receiveShadow = true;

	fistMesh = new THREE.Mesh( fist, planeMaterial );
	fistMesh.position.y = 55; // 20 - 60 // funny ordering bug in clone 
	fistMesh.castShadow = true;
	fistMesh.receiveShadow = true;

	// finger1 = new THREE.Mesh( stick, planeMaterial );
	// finger2 = new THREE.Mesh( stick, planeMaterial );
	// finger3 = new THREE.Mesh( stick, planeMaterial );
	// 
	// finger1.rotation.z = Math.PI / 6;
	// finger2.rotation.z = Math.PI / 6 * 2;
	// finger3.rotation.z = Math.PI / 6 * 3;
	// 
	// finger2.position.set(-10, -10, 0);
	// finger3.position.set(-20, -30, 0);
	// 
	// fingers = new THREE.Object3D();
	// fingers.scale.set(0.5,0.5,0.5);
	// fingers.position.y = 60;
	// fingers.rotation.z = -Math.PI / 6;
	// 
	// fingers.add(finger1);
	// fingers.add(finger2);
	// fingers.add(finger3);
	
	// hands
	handMesh = new THREE.Object3D();
	handMesh.add(armMesh);
	handMesh.add(fistMesh);
	// handMesh.add(fingers);
	
	handMesh.rotation.z = 1;
	handMesh.position.y = -100;
	handMesh.position.x = -150;
	// handMesh.position.z = 200;
	handMesh.castShadow = true;
	handMesh.receiveShadow = true;
	
	// SCARF??
	// using donut and ribbon?
	
	cloned = THREE.SceneUtils.cloneObject(handMesh); //THREE.GeometryUtils.merge
	handsRight = new THREE.Object3D();
	handsRight.add(cloned);
	handsRight.scale.x = -1
	
	snowman.add(handsRight);
	snowman.add(handMesh);
	
	scene.add(snowman);
	

}

function lensFlareUpdateCallback( object ) {

	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;


	for( f = 0; f < fl; f++ ) {

		   flare = object.lensFlares[ f ];

		   flare.x = object.positionScreen.x + vecX * flare.distance;
		   flare.y = object.positionScreen.y + vecY * flare.distance;

		   flare.rotation = 0;

	}

	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + 45 * Math.PI / 180;

}




/*
 * @author @blurspline https://github.com/zz85
 * Similar to a turntable or a hovering camera?
 */
THREE.OrbitControls = function( camera, target, distance, height ) {


	this.rotation = 0;
	this.height = height;
	this.distance = distance;
	
	var me = this;

	this.update = function() {
		
		var angle =  me.rotation * Math.PI * 2;

		camera.position.x = Math.sin(angle) * me.distance + target.x;
		camera.position.z = Math.cos(angle) * me.distance + target.z;
		camera.position.y = me.height + target.z;
		camera.lookAt(target);
	}

};