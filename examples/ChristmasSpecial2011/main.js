// First things first, check for WebGL support

if ( !Detector.webgl ) {
	document.getElementById('startInfoPass').style.display = 'none';
	document.getElementById('startInfoFail').style.display = 'block';			
} else {
	document.getElementById('startInfoFail').style.display = 'none';
}


function render() {

	var time = Date.now() * 0.00005;

	// camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	// camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	
	// camera.position.z -= 0.05;
	// camera.position.z -= 2;
	// camera.position.z -= 15;
	
	var position; 
	for ( i = 0; i < starFieldsCount; i ++ ) {
		position = starFields.children[i].position;
		position.z += 10;
		
		if (position.z > 400) { 
			// use larger neg number to keep distance from star fields, but compensate with closer star fields
			console.log('ping!');
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

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}


init();
setupSceneIntro();
animate();
