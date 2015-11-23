/**
 * @author zz85 / http://github.com/zz85
 */

THREE.RaytracingWorkerRenderer = function ( parameters ) {

	console.log( 'THREE.RaytracingWorkerRenderer', THREE.REVISION );

	parameters = parameters || {};

	var scope = this;

	var canvas = document.createElement( 'canvas' );
	var context = canvas.getContext( '2d', {
		alpha: parameters.alpha === true
	} );

	var maxRecursionDepth = 3;

	var canvasWidth, canvasHeight;
	var canvasWidthHalf, canvasHeightHalf;

	var clearColor = new THREE.Color( 0x000000 );

	this.domElement = canvas;

	this.autoClear = true;

	this.setClearColor = function ( color, alpha ) {

		clearColor.set( color );

	};

	this.setPixelRatio = function () {};

	this.setSize = function ( width, height ) {

		canvas.width = width;
		canvas.height = height;

		canvasWidth = canvas.width;
		canvasHeight = canvas.height;

		canvasWidthHalf = Math.floor( canvasWidth / 2 );
		canvasHeightHalf = Math.floor( canvasHeight / 2 );

		context.fillStyle = 'white';

	};

	this.setSize( canvas.width, canvas.height );

	this.clear = function () {

	};

	//

	this.render = function ( scene, camera ) {
		reallyThen = Date.now()

		// context.putImageData( imagedata, blockX, blockY );

	};

	this.ctx = context;

};

THREE.EventDispatcher.prototype.apply( THREE.RaytracingWorkerRenderer.prototype );
