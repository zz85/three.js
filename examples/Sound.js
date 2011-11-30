//jabtunes = (jabtunes==undefined) ? {} : jabtunes;

jabtunes = {};


// *** start audiolet

var Synth = function(audiolet, frequency) {
	AudioletGroup.apply(this, [audiolet, 0, 1]);

	this.sine = new Sine( this.audiolet, frequency );
	
	this.modulator = new Saw(this.audiolet, frequency * 2);
	this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency );
	
	this.gain = new Gain(this.audiolet);
	
	this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.2, 0.5,
		function() {
              this.audiolet.scheduler.addRelative(0,
               this.remove.bind(this));
          }.bind(this)
      );


	// Saw modulation
	this.modulator.connect(this.modulatorMulAdd);
	this.modulatorMulAdd.connect(this.sine);
	this.envelope.connect(this.gain, 0, 1);
	
	
	this.sine.connect(this.gain);
	this.gain.connect(this.outputs[0]);
	
	
};
extend(Synth, AudioletGroup);

var audiolet = new Audiolet();

// *** end audiolet


jabtunes.Sound = function() {
	var notes = [
	'c', 'c#',
	'd', 'd#',
	'e', 
	'f', 'f#',
	'g', 'g#',
	'a', 'a#',
	'b'
	];
	
	// http://en.wikipedia.org/wiki/Werckmeister_temperament
	// Werckmeister I (III): "correct temperament" based on 1/4 comma divisions
	var werckmeister = [
		1, // c
		256/243, // c#
		64 / 81 * Math.pow(2, 1/2), // d 
		32/27, // d#
		256 / 243 * Math.pow(2, 1/4), // e
		4/3, //f
		1024 / 729, // f#
		8/9 * Math.pow(8, 1/4), // g
		128/81, // g#
		1024 / 729 * Math.pow(2, 1/4), // a
		16/9, // a#
		128/ 81 * Math.pow(2, 1/4) // b
		
	];
	
	for (i=0;i<werckmeister.length;i++) {
		console.log(notes[i], werckmeister[i], Math.log(werckmeister[i])/Math.log(2)* 1200 ) ;
	}
	
	var baseFrequency = 261.625565;
	//var baseCFrequency = 415 / Math.pow(2, 9/12);
	// 246.76047636306464(A415) 231.89538742553063(A390) | 248.43808299685796
	var baseCFrequency = 415 / werckmeister[9];
	
	
	console.log ('baseCFrequency', baseCFrequency);
	// console.log('werckmeister', werckmeister);
	this.werckmeister = werckmeister;
	this.baseCFrequency = baseCFrequency;
	
	
	var noteMidiMap = {};
	var midiNoteMap = {};
	var noteNameMap = {};
	for (j=0,jl=notes.length; j<jl;j++) {
		noteNameMap[ notes[j] ] = j;
	}
	
	var octaves = 4, i=0, j, jl, n=48;
	for (;i<octaves;i++) {
		for (j=0,jl=notes.length; j<jl;j++, n++) {
			noteMidiMap[ notes[j] + i ] = n;
			midiNoteMap[ n ] = notes[j] + i;
		}
	}
	
	this.noteMidiMap = noteMidiMap;
	this.noteNameMap = noteNameMap;
	
};


jabtunes.Sound.prototype.playNote = function(note, duration, start) {
	
	// // Equal Temp
	// var midi = this.noteToMidiNumber( note );
	// console.log(midi, ' midi ');
	// var freq = this.midiToFreq( midi );
	// console.log(freq, ' freq ');
	
	// werckmeister
	var octaveOffset = parseInt(note.substring(note.length-1)) - 1;
	var noteName = note.substring(0, note.length-1);
	var freq = this.werckmeister [ this.noteNameMap[ noteName ] ] * Math.pow( 2, octaveOffset ) * this.baseCFrequency;

	// midi to werckmeister converter 
	var midi = this.noteToMidiNumber( note );
	var middle_c_midi = 60;
	var semitones, noteIndex, ocatve;
	if (midi < middle_c_midi) {
		semitones = middle_c_midi - midi;
		noteIndex = semitones % 12;
		if (noteIndex>0) noteIndex = 12 - noteIndex;
		octave = -Math.ceil( semitones/12 );
	} else {
		semitones = midi - middle_c_midi;
		noteIndex = semitones % 12;
		octave = Math.floor( semitones/12 );
	}
	
	var freq = this.werckmeister [ noteIndex ] * Math.pow( 2, octave ) * this.baseCFrequency;
	
	// console.log('noteIndex', noteIndex, 'note', note, this.werckmeister [ noteIndex ], 'midi', midi , freq, ' freq ');
	
	
	
	var synth = new Synth(audiolet, freq);
	synth.connect(audiolet.output);
	
	// var test = new Audiolet();
	// var synth = new Synth(test, freq);
	// synth.connect(test.output);
};


/* converts a note string to midi number */
jabtunes.Sound.prototype.noteToMidiNumber = function( note ) {
	return this.noteMidiMap[ note ];
};

/* converts a midi number to note frequency */ 
jabtunes.Sound.prototype.midiToFreq = function( n ) {
	//http://subsynth.sourceforge.net/midinote2freq.html
	
	var interval = n - 69;
	return 440 * Math.pow(2, interval / 12);
	
};


