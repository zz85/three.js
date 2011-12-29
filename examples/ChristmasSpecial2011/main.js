/*
 * Main entrance for "It Came Upon"
 * http://www.lab4games.net/zz85/blog
 * @blurspline twitter.com/blurspline
 * https://github.com/zz85/
 */


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
	if (stats) stats.update();

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

var toggleAbout = false;

function init() {
	
	// Setup DOM and Renderers

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
	renderer.autoClearColor = false;
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

}

function showFPS() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	document.getElementById('showStats').style.display = 'none';
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
		document.getElementById('stillLoading').innerHTML = '<p><button onclick="startChristmas();">Start</button></p>';
		//Load completed.
	}
	
}

function hideAllDialogs() {
	var dialogs = document.getElementsByClassName("overlay");
	
	for (var i=0; i< dialogs.length;i++) {
		dialogs[i].style.display = 'none';
	}
	
	// var dialogs = ['intro', 'about'];
	// dialogs.forEach(function(a,b) {
	// 	document.getElementById(a).style.display = 'none';
	// }) 
	
}

function startChristmas() {

	if (itemsToLoad.length > 0) {
		return;
	}
	
	
	document.getElementById('returnToStart').style.display = 'none';
	hideAllDialogs();
	
	unloadSceneIntro();
	playMusic();
	setupNightScene();
	
	// releaseNightScene();

	
}

function showStart() {
	hideAllDialogs();
	document.getElementById('intro').style.display = 'table';
}

function showAbout() {
	hideAllDialogs();
	document.getElementById('about').style.display = 'table';
}

function toggleAboutDialog() {

	if (!toggleAbout) {
		toggleAbout = true;
		showAbout();
	} else {
		toggleAbout = false;
		hideAllDialogs();
	}
}

function showCredits() {
	hideAllDialogs();
	document.getElementById('credits').style.display = 'table';
	
}

function showSnowDialog() {
	hideAllDialogs();
	document.getElementById('snow').style.display = 'table';
}


init();
setupSceneIntro();

animate();
loadMusic('music/ItCameUponAMidniteClear.mid');