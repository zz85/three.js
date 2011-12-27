var chars = [], xpos;
var recording;
var textGeometries = {};
var lastTextMesh;

var allParticlePoints = [];
var allParticleTargets = [];

function bindTextRecording() {
	
	recording = new Recorder();
	lastTextMesh = new THREE.Object3D();
	newTextLine();
	scene.add(lastTextMesh);
	
	document.addEventListener( 'keypress', onDocumentKeyPress, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
}

function unbindTextRecording() {
	document.removeEventListener( 'keypress', onDocumentKeyPress, false );
	document.removeEventListener( 'keydown', onDocumentKeyDown, false );
	
}


function newTextLine() {
	chars = [], xpos = 0;
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

		if (allParticleTargets.length>0) {
			//var target = allParticleTargets.shift();
			
			var random = (Math.random() * allParticleTargets.length) << 0; //Math.floor
			var target = allParticleTargets.splice(random, 1);
			
			p.target = target;
			
			p.position = particles.vertices[ target ].position;
			
			
			if (allParticleTargets.length==0) {
				textParticlesProducer.rate = 0;
				console.log('stop');
			}
			
		} else {
			p.isDead = true;
		}

		// if ( target ) {
		// 	// particles.vertices[ target ].position = p.position;
		// 	// 
		// 	// values_color[ target ].setHSV( 0, 0, 0.4 + Math.random() * 0.4 );
		// 	// values_size[ target ] = 10 +  Math.random() * 80;
		// };

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
	textParticlesEmitter.addInitializer(new SPARKS.Lifetime(1,3));
	textParticlesEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 10, 20, 50 ) ) ) );
	textParticlesEmitter.addAction( new SPARKS.Age() );
	textParticlesEmitter.addAction( new SPARKS.Move() );
	textParticlesEmitter.addAction( new SPARKS.Accelerate( 100, 100, 50  ) );				
	textParticlesEmitter.addAction( new SPARKS.RandomDrift( 2000 , 500, 1000 ) );
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
		
		refreshText();
		
		// Turn to particles.
		particleCount = 500; // 20 fps 20k
		
		
		var matrix = new THREE.Matrix4();
		
		var i,m, j;
		
		
			
			randomH = function() {
				return 0.24;
			}
			
			randomS = function() {
				return Math.random() * 0.5;
			}
			
			randomV = function() {
				return Math.random() * 0.5 + 0.5;
			}
			
			
		for (i=0, il=lastTextMesh.children.length; i<il; i++) {
			m = lastTextMesh.children[i];
			if (m.geometry.faces.length==0) continue;
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

				values_color[ target ].setHSV( randomH(), randomS(), randomV() );
				values_size[ target ] = 20 + Math.random() * 80;
				allParticleTargets.push(target);
				
			}
			
			allParticlePoints = allParticlePoints.concat(particlePoints);
		}
		
		
		for (i=lastTextMesh.children.length;i--;) {
			lastTextMesh.remove(lastTextMesh.children[i]);
		}
		
		textParticlesProducer.rate = 4000;
		
		newTextLine();
		
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

	// textMesh.rotation.x = 0;
	//textMesh.rotation.y = Math.PI / 3 * (Math.random() - 0.5);

	//scene.add( textMesh );
	
	return textMesh;

}

function generateTextGeometry(text) {
	
	if (textGeometries[text]) {
		return textGeometries[text];
	}
	
	if (text == " ") {
		var blank = new THREE.Geometry();;
		blank.boundingBox = { min: new THREE.Vector3(0,0,0), 
			max: new THREE.Vector3(100,0,0) };
		
		return blank;
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
	
	
	textGeometries[text] = textGeometry;
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