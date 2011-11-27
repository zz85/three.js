//jabtunes = (jabtunes==undefined) ? {} : jabtunes;

jabtunes = {};


// *** start audiolet

var Synth = function(audiolet, frequency) {
	AudioletGroup.apply(this, [audiolet, 0, 1]);

    this.audiolet = new Audiolet();
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
	
	var noteMidiMap = {};
	var midiNoteMap = {};
	
	var octaves = 4, i=0, j, jl, n=48;
	for (;i<octaves;i++) {
		for (j=0,jl=notes.length; j<jl;j++, n++) {
			noteMidiMap[ notes[j] + i ] = n;
			midiNoteMap[ n ] = notes[j] + i;
		}
	}
	
	this.noteMidiMap = noteMidiMap;
	
};


jabtunes.Sound.prototype.playNote = function(note, duration, start) {
	
	var midi = this.noteToMidiNumber( note );
	console.log(midi, ' midi ');
	var freq = this.midiToFreq( midi );
	console.log(freq, ' freq ');
	
	var synth = new Synth(audiolet, freq);
	synth.connect(audiolet.output);
	
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


