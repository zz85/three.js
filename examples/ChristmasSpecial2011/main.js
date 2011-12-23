// First things first, check for WebGL support

if ( !Detector.webgl ) {
	document.getElementById('startInfoPass').style.display = 'none';
	document.getElementById('startInfoFail').style.display = 'block';			
} else {
	document.getElementById('startInfoFail').style.display = 'none';
}


function render() {
	if (renderCallback) renderCallback();
}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}


init();
setupSceneIntro();
animate();
