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
	context.arc( 64, 64, 30, 0, Math.PI * 2, false) ;
	context.closePath();

	//context.lineWidth = 0.5; //0.05
	context.fill();

	// var idata = context.getImageData(0, 0, canvas.width, canvas.height);
	// document.body.appendChild(canvas);
	return canvas;

}