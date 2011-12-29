var chars = [], xpos, allwords = [];
var recorder;
var textGeometries = {};
var lastTextMesh;
var playRecording = false;
var playbackDirector;

var allParticlePoints = [];
var allParticleTargets = [];

var cameraBaseX, cameraBaseY, cameraBaseZ;

var windEffect;

function bindTextRecording() {
	
	recorder = new Recorder();
	recorder.start();
	lastTextMesh = new THREE.Object3D();
	allwords = [];
	newTextLine();
	scene.add(lastTextMesh);
	
	cameraBaseX = camera.position.x;
	cameraBaseY = camera.position.y;
	cameraBaseZ = camera.position.z;
	
	document.addEventListener( 'keypress', onDocumentKeyPress, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
}

function unbindTextRecording() {
	recorder.stop();
	scene.remove(lastTextMesh);
	
	document.removeEventListener( 'keypress', onDocumentKeyPress, false );
	document.removeEventListener( 'keydown', onDocumentKeyDown, false );
	
}

function playbackRecording() {
	playbackDirector = recorder.getDirector(recordEventHandler);
	playbackDirector.start();
	playRecording = true;
	// setInterval(function() { r.update(); }, 50);
}


function newTextLine() {
	allwords.push(chars);
	chars = [], xpos = -600;
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
	textParticlesEmitter.addInitializer(new SPARKS.Lifetime(0.1,2));
	textParticlesEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 10, 20, 20 ) ) ) );
	textParticlesEmitter.addAction( new SPARKS.Age() );
	textParticlesEmitter.addAction( new SPARKS.Move() );
	textParticlesEmitter.addAction( new SPARKS.Accelerate( 50, 100, 50  ) );				
	textParticlesEmitter.addAction( new SPARKS.RandomDrift( 2000 , 500, 1000 ) );
	
	// windEffect = new SPARKS.WindNoise() ;
	// textParticlesEmitter.addAction( windEffect );
	
	textParticlesEmitter.addCallback( "created", onParticleCreated );
	textParticlesEmitter.addCallback( "dead", onParticleDead );
	// textParticlesEmitter.addCallback( "updated", onParticleUpdate );
	
	
	textParticlesEmitter.start();
	
}


function typeBackspace() {
	// text = text.substring( 0, text.length - 1 );
	if (chars.length>0) {
		chars.pop();
	}
	
	// TYPE BACKSPACE
	if (lastTextMesh.children.length>0) {
		
		var last = lastTextMesh.children[lastTextMesh.children.length-1];
		
		xpos = last.position.x;
		lastTextMesh.remove(last);
	}
	
	followCamera();
	
	refreshText();
}

var h = 0.1135;

function typeEnter() {
	refreshText();
	
	// Turn to particles.
	particleCount = 500; // 20 fps 20k
	
	
	var matrix = new THREE.Matrix4();
	
	var i,m, j;
	
	
		
		randomH = function() {
			return h;
		}
		
		randomS = function() {
			return Math.random() * 0.75 + 0.25;
		}
		
		randomV = function() {
			return Math.random() * 0.5 ;	 //+ 0.5
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
	//followCamera();
	camera.position.y = cameraBaseY + (Math.random() - 0.5) * 80 + 10;
	// camera.position.z += 50;
}

function followCamera() {
	// var x, y;
	// 
	// x = xpos + Math.random() * 100;;
	// y = cameraBaseY + (Math.random() - 0.5) * 150;
	// 
	// camera.position.x = x;
	// camera.position.y += (y - camera.position.y ) * 0.5;
	
	camera.position.x = xpos + Math.random() * 50;
	camera.position.y = cameraBaseY + (Math.random() - 0.5) * 80;
	frontlight.position.x = xpos;
}

function typeCharacter(ch) {
	chars.push(ch);
	//text += ch;

	var charMesh = getTextMesh(ch);
	
	charMesh.castShadow = true;
	charMesh.receiveShadow = true;
	
	lastTextMesh.add(charMesh);
	
	followCamera();

	refreshText();
}

function recordEventHandler(event) {
	
	console.log('recordEventHandler', event);
	
	switch (event.action) {
		case 'backspace':
			typeBackspace();
			break;
		case 'enter':
			typeEnter();
			break;
		case 'type':
			typeCharacter(event.character);
			break;

	}
	
}


function onDocumentKeyDown( event ) {

	console.log('down', event);


	var keyCode = event.keyCode;

	// backspace

	if ( keyCode == 8 ) {

		event.preventDefault();
		recorder.record({
			action: 'backspace'
		});

		typeBackspace();

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
		
		// TYPE ENTER
		typeEnter();
		recorder.record({
			action: 'enter'
		});
		
	} else {

		// TYPE CHARACTER
		
		var ch = String.fromCharCode( keyCode );
		recorder.record({
			action: 'type',
			character: ch
		});
		typeCharacter(ch);

	}

}

function getTextMesh(text) {
	

	var textGeo = generateTextGeometry(text);
	//var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	
	
	var textMesh = new THREE.Mesh( textGeo, faceMaterial );

	textMesh.position.x = xpos;
	xpos += ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x ) + 10;
	
	// var yy =  -textGeo.boundingBox.max.y + 200;

	var yy = 0;
	if (textGeo.boundingBox.min.y < 0) {
		yy = - textGeo.boundingBox.min.y;
		yy *= 0.5;
	}
	//yy = 10 
	textMesh.position.y = FLOOR + yy;
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
	
	
	// Cache geometries
	textGeometries[text] = textGeometry;
	
	// Testing.	
	// var textPath = new THREE.TextPath( text, textOptions );
	// var textShapes = textPath.toShapes();
	// console.log(textShapes);
	// 
	// textShapes[0].debug();
	
	return textGeometry;

}




var Recorder = function() {
	
	this.reset = function() {
		this._started = false;
		this._recordings = [];
	}
	
	this.start = function() {
		this._started = true;
		this._startTime = Date.now();
	};
	
	// records event
	this.record = function(event) {
		
		if (!this._started) return;
		
		var time = Date.now();
		var runningTime = time - this._startTime;
		
		this._recordings.push({
			time: runningTime,
			event: event
			// todo: copies argument too?
		});
		
	};
	
	this.getDirector = function(callback) {
		
		var recordings = this._recordings;
		var director = new THREE.Director();
		
		function callBackEvent(event) {
			return function() {
				callback(event)
			};
		}
		
		for (var i=0,il=recordings.length;i<il;i++) {
			
			var event = recordings[i].event;
			
			var closure = callBackEvent(event);
			
			director.addAction(recordings[i].time / 1000, closure);
		}
		
		return director;
		
	}
	
	this.stop = function() {
		this._started = false;
	};
	
	this.hasStarted = function() {
		return this._started;
	};
	
	this.toJSON = function() {
		return JSON.stringify(this._recordings);
	}
	
	this.fromJSON = function(json) {
		this._recordings = JSON.parse(json);
	}
	
	this.reset();
	
};