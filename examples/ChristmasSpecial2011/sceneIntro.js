var starFieldLength = 2000;
var starFieldsCount = 3;
var starFields = new THREE.Object3D();


function renderIntro() {
	// Render
	var time = Date.now() * 0.00005;

	camera.position.x += ( mouseX * 0.15 - camera.position.x ) * 0.04;
	camera.position.y += ( - mouseY * 0.15	 - camera.position.y ) * 0.04;
	

	var position; 
	for ( i = 0; i < starFieldsCount; i ++ ) {
		position = starFields.children[i].position;
		position.z += 1;
		
		if (position.z > 400) { 
			position.z -= starFieldLength ;
		}
	}

	
	// Vary Brightness
	for( i = 0; i < starFieldMaterials.length; i ++ ) {
		
		starFieldMaterials[i].color.setHSV( 0, 0, Math.sin( time * 100 + i* 50) * 0.5  * 0.2 + 0.6) ;
		// starFieldMaterials[i].color.setHSV( 0, 0, 0.4 ) ;
	
	}
	
	renderer.clear();
	renderer.render( scene, camera );

}


function unloadSceneIntro() {
	
	scene.remove(starFields);
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'touchstart', onDocumentTouchStart, false );
	document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
	
}

function setupSceneIntro() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 120, 3000 );
	camera.setLens(100);

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

	var geometry = new THREE.Geometry();
					
	var halfStarFieldLength = starFieldLength / 2;

	for ( i = 0; i < 30000; i ++ ) {

		vector = new THREE.Vector3( Math.random() * starFieldLength - halfStarFieldLength, Math.random() * starFieldLength - halfStarFieldLength, Math.random() * starFieldLength - halfStarFieldLength );
		
		geometry.vertices.push( new THREE.Vertex( vector ) );

	}

	var starCanvas = generateStarCanvas();			
	var starTexture = new THREE.Texture(starCanvas);
	starTexture.needsUpdate = true;
	
	var z = -1000;

	for ( i = 0; i < starFieldsCount; i ++ ) {

		size = 8;


		starFieldMaterials[i] = new THREE.ParticleBasicMaterial( { size: size, 
			map: starTexture,
			color: 0xffffff
		} );
		
		var particles = new THREE.ParticleSystem( geometry, starFieldMaterials[i] );
		particles.position.z = z;
		z -= 500;
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		starFields.add( particles );
		

	}
	
	renderCallback = renderIntro;
	
	scene.add(starFields);
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}


function generateStarCanvas() {

	var canvas = document.createElement( 'canvas' );
	
	var width = 128;
	var height = 128;
	var halfWidth = width / 2;
	var halfHeight = height / 2;
	
	canvas.width = width;
	canvas.height = height;

	var context = canvas.getContext( '2d' );

	context.globalCompositeOperation = 'lighter';

	context.fillStyle = 'grey';
	
	context.beginPath();
	context.moveTo(halfWidth, 0);
	context.quadraticCurveTo(halfWidth, halfHeight, width, halfHeight);
	context.quadraticCurveTo(halfWidth, halfHeight, halfWidth, height);
	context.quadraticCurveTo(halfWidth, halfHeight, 0, halfHeight);
	context.quadraticCurveTo(halfWidth, halfHeight, halfWidth, 0);
	context.closePath();
	context.fill();

	var gradient = context.createRadialGradient( halfWidth, halfHeight, 0, halfWidth, halfHeight, halfWidth );
	
	gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.4, 'rgba(200,200,200,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
	
	context.fillStyle = gradient;
	
	// context.fillStyle = 'grey';

	context.beginPath();
	context.arc( 64, 64, 24, 0, Math.PI * 2, false) ;
	context.closePath();

	//context.lineWidth = 0.5; //0.05
	context.fill();

	// var idata = context.getImageData(0, 0, canvas.width, canvas.height);
	// document.body.appendChild(canvas);
	return canvas;

}