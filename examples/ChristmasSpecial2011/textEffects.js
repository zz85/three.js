var chars = [], xpos;
var recording;
var textGeometries = {};
var lastTextMesh;

var allParticlePoints = [];
var allParticleTargets = [];

function bindTextRecording() {
	
	recording = new Recorder();
	lastTextMesh = new THREE.Object3D();
	chars = [], xpos = 0;
	scene.add(lastTextMesh);
	
	document.addEventListener( 'keypress', onDocumentKeyPress, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
}

function unbindTextRecording() {
	document.removeEventListener( 'keypress', onDocumentKeyPress, false );
	document.removeEventListener( 'keydown', onDocumentKeyDown, false );
	
}



function refreshText() {

	console.log("chars", chars);
	
	return;
	
	
	xpos = 0;
	chars.forEach(function(a,b) {
		getTextMesh(a);
	});
		

}



function initTextParticles() {
	var onParticleCreated = function( p ) {

		// p.target = ParticlePool.get();
		// var target = p.target;
		
		

		if (allParticlePoints.length>0) {
			// var position = allParticlePoints.pop();			
			// p.position = position;
			
			
			if (allParticlePoints.length==0) {
				textParticlesProducer.rate = 0;
				console.log('stop');
			}
			
		} else {
			p.isDead = true;
		}

		if ( target ) {
			// particles.vertices[ target ].position = p.position;
			// 
			// values_color[ target ].setHSV( 0, 0, 0.4 + Math.random() * 0.4 );
			// values_size[ target ] = 10 +  Math.random() * 80;
		};

	};

	var onParticleDead = function( particle ) {

		var target = particle.target;

		if ( target ) {

			// Hide the particle

			values_color[ target ].setHSV( 0, 0, 0 );
			particles.vertices[ target ].position.set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

			ParticlePool.return( particle.target );
	
		}

	};
	
	textParticlesProducer = new SPARKS.SteadyCounter( 0 );
	textParticlesEmitter = new SPARKS.Emitter( textParticlesProducer );
	textParticlesEmitter.addInitializer(new SPARKS.Lifetime(1,5));
	textParticlesEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 0, 500, 50 ) ) ) );
	textParticlesEmitter.addAction( new SPARKS.Age() );
	textParticlesEmitter.addAction( new SPARKS.Move() );
	textParticlesEmitter.addAction( new SPARKS.Accelerate( 40, -100, 50  ) );				
	textParticlesEmitter.addAction( new SPARKS.RandomDrift( 200 , 100, 200 ) );
	textParticlesEmitter.addCallback( "created", onParticleCreated );
	textParticlesEmitter.addCallback( "dead", onParticleDead );
	// textParticlesEmitter.addCallback( "updated", onParticleUpdate );
	
	
	textParticlesEmitter.start();
	
}




function onDocumentKeyDown( event ) {

	console.log('down', event);


	var keyCode = event.keyCode;

	// backspace

	if ( keyCode == 8 ) {

		event.preventDefault();

		// text = text.substring( 0, text.length - 1 );
		if (chars.length>0) {
			chars.pop();
		}
		refreshText();

		return false;

	}

}

function onDocumentKeyPress( event ) {
	console.log('press', event);
	var keyCode = event.which;

	if ( keyCode == 8 ) {
		// backspace
		event.preventDefault();

	} else if ( keyCode == 13 ) {
		// enter;
		event.preventDefault();
		chars = [];
		refreshText();
		
		// Turn to particles.
		particleCount = 400; // 20 fps 20k
		
		
		var matrix = new THREE.Matrix4();
		
		var i,m, j;
		for (i=0, il=lastTextMesh.children.length; i<il; i++) {
			m = lastTextMesh.children[i];
			particlePoints = THREE.GeometryUtils.randomPointsInGeometry( m.geometry, particleCount );
			// console.log(m, m.matrix.getPosition(), m.matrixWorld.getPosition(), m.matrixRotationWorld.getPosition());
			// 
			// matrix.compose(m.position, m.rotation, m.scale); 
			// console.log(matrix.getPosition());
			
			//setPosition(particlePoints[j]).
			
			for (j=0; j<particleCount; j++) {
				
				particlePoints[j].addSelf(m.position);
				
			 	var target = ParticlePool.get();
			
				particles.vertices[ target ].position = particlePoints[j];

				values_color[ target ].setHSV( 0, 0, 1 );
				values_size[ target ] = 40;
				allParticleTargets.push(target);
				
			}
			
			allParticlePoints = allParticlePoints.concat(particlePoints);
		}
		
		
		for (i=lastTextMesh.children.length;i--;) {
			lastTextMesh.remove(lastTextMesh.children[i]);
		}
		
		
		// console.log(allPoints);
		
		
	} else {

		var ch = String.fromCharCode( keyCode );
		chars.push(ch);
		//text += ch;

		var charMesh = getTextMesh(ch);
		lastTextMesh.add(charMesh);
		
		refreshText();

	}

}

function getTextMesh(text) {
	

	var textGeo = generateTextGeometry(text);
	//var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	
	
	var textMesh = new THREE.Mesh( textGeo, faceMaterial );

	textMesh.position.x = xpos;
	xpos += ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	
	textMesh.position.y = FLOOR + 10;
	textMesh.position.z = 200;

	textMesh.rotation.x = 0;
	textMesh.rotation.y = Math.PI * 2;

	//scene.add( textMesh );
	
	return textMesh;

}

function generateTextGeometry(text) {
	
	if (textGeometries[text]) {
		return textGeometries[text];
	}
	
	// textMaterialFront = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
	// textMaterialSide = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );


	var textOptions = {

		size: 200,
		height: 50,
		curveSegments: 12,
		
		font: "helvetiker",
		weight: "bold",
		style: "normal",

		bevelThickness: 2,
		bevelSize: 5,
		bevelEnabled: true,

		bend: false,

		material: 0,
		extrudeMaterial: 1

	};


	

	var textGeometry = new THREE.TextGeometry( text, textOptions);

	textGeometry.materials = [ textMaterialFront, textMaterialSide ];

	textGeometry.computeBoundingBox();
	textGeometry.computeVertexNormals();
	
	return textGeometry;

}




var Recorder = function() {
	
	this._started = false;
	this._recordings = [];
	
	this.start = function() {
		this._started = true;
		this._startTime = Date.now();
	};
	
	// records event
	this.record = function(event) {
		
		var time = Date.now();
		var runningTime = time - this._startTime;
		
		this._recording.push({
			time: runningTime,
			event: event
			// todo: copies argument too?
		});
		
	};
	
	this.stop = function() {
		this._started = false;
	};
	
	this.hasStarted = function() {
		return this._started;
	};
	
};