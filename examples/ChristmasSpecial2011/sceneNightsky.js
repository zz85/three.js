var clear = true;
var cameraTarget ;
var solarSystem = new THREE.Object3D();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.setLens(24);
	cameraTarget= new THREE.Vector3(100, 200, 100);
	camera.lookAt(cameraTarget);
	//camera.position.z = 1000;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

	geometry = new THREE.Geometry();
	
	var radius = 1000;

	for ( i = 0; i < 10000; i ++ ) {

		//vector = new THREE.Vector3( Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000 );
		
		var angle = Math.random() * Math.PI * 2;
		var x = Math.cos(angle) * radius;
		var y = Math.sin(angle) * radius;
		
		var angle2 = Math.random() * Math.PI  ;
		var z = Math.sin(angle2) * x;
		x = Math.cos(angle2) * x;

		// var angle = Math.random() * Math.PI * 2;
		// var x = Math.sin(angle) * radius;
		// var angle = Math.random() * Math.PI * 2;
		// var y = Math.sin(angle) * radius;
		// var angle = Math.random() * Math.PI * 2;
		// var z = Math.sin(angle) * radius;

		
		vector = new THREE.Vector3( x, y, z );
		
		// vector = new THREE.Vector3( Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000 );
		
		
		geometry.vertices.push( new THREE.Vertex( vector ) );

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
	
	var canvas = generateSprite();
	
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	

	for ( i = 0; i < 1; i ++ ) {

		//size  = 20 * Math.random() + 0 ;
		size  = 5 ;
		//color = [1,0.7, 0.4];

		//materials[i] = new THREE.ParticleBasicMaterial( { color: color, size: size } );

		materials[i] = new THREE.ParticleBasicMaterial( { size: size, map: texture, color: 0xffffff } );
		//materials[i].color.setHSV( color[0], color[1], color[2] );

		particles = new THREE.ParticleSystem( geometry, materials[i] );

		// particles.rotation.x = Math.random() * 6;
		// particles.rotation.y = Math.random() * 6;
		// particles.rotation.z = Math.random() * 6;
		solarSystem.add(particles);
		

	}
	
	solarSystem.rotation.x = 0.6;
	
	scene.add( solarSystem );