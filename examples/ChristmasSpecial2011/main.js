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


// Whole Bunch of Variables

var container, stats;
var camera, scene, renderer, particles;

var i;
var starFieldMaterials = [];

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var current = 0;

var renderCallback;

var itemsToLoad = [ 'music' ];

function init() {
	
	// Setup DOM and Renderers

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
	renderer.autoClearColor = false;
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

}

// actually, do we need to preload? Largest files are three.js ~300kb, font~60kb, and shaders~40kb.

function preloaded(item) {
	
	var index = itemsToLoad.indexOf(item);
	
	if (index>-1) {
		itemsToLoad.splice(index, 1);
	}
	
	if (itemsToLoad.length > 0) {
		document.getElementById('stillLoading').innerHTML = itemsToLoad.join(', ');
	} else {
		document.getElementById('stillLoading').innerHTML = 'Load completed';
	}
	
}

function startChristmas() {

	if (itemsToLoad.length > 0) {
		return;
	}
	
	document.getElementById('intro').style.display = 'none';
	unloadSceneIntro();
	playMusic();
	setupNightScene();
	
	//
	releaseNightScene();

}

function showAbout() {
	document.getElementById('about').style.display = 'table';
}

init();
setupSceneIntro();

animate();
