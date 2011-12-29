var replayer, synth, audio;

function musicReady(midifile) {
	synth = Synth(44100);
	replayer = Replayer(midiFile, synth);
	
	preloaded('music');
	
}

function playMusic() {
	if (replayer) {
		audio = AudioPlayer(replayer);
	}
}

function stopMusic() {
	if (audio) {
		audio.stop();
	}
}

function loadMusic(file) {
	loadRemote(file, function(data) {
		midiFile = MidiFile(data);
		musicReady(midiFile);
	});
}


// A HTML5 Audio experiment by @blurspline http://www.lab4games.net/zz85/blog/ 
// 29 November 2011
// - perhaps we can do keyboard lights up animation for clavier solo in revision 2?
//      and add a real stop playing function too! :)

// Credits to gasman for jasmid (http://matt.west.co.tt/music/jasmid-midi-synthesis-with-javascript-and-html5-audio/).

var useWerckmeister = true, played = false;

function switchTemperament() {
    useWerckmeister = !useWerckmeister;
    if (useWerckmeister) {
        document.getElementById('tuning').innerHTML = '<a href="http://en.wikipedia.org/wiki/Werckmeister_temperament#Werckmeister_I_.28III.29:_.22correct_temperament.22_based_on_1.2F4_comma_divisions" target="_blank">' 
        + 'Werckmeister I (III) temperament' + '</a>';
    } else {
        document.getElementById('tuning').innerHTML = '<a href="http://en.wikipedia.org/wiki/Equal_temperament" target="_blank">Equal temperament temperament</a>';
    }
}
        
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

var baseCFrequency = 415 / werckmeister[9];

function werckmeisterFrequency(note) {
    // midi to werckmeister converter 
    var midi = note;
    var middle_c_midi = 60 - 12;
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
    
    var freq = werckmeister [ noteIndex ] * Math.pow( 2, octave ) * baseCFrequency;
    
    return freq;
}
    
function equalTuningFrequency(note) {
    return 440 * Math.pow(2, (note-57)/12); // A440 should be midi 69 instead of 57?
}


function noteToFrequency(note) {
    if (useWerckmeister) return werckmeisterFrequency(note);
    return equalTuningFrequency(note);

}

/* We are overwritting the default midi programs */
/* Keep TWEAKING the values!!! */


PianoProgram = {
    'attackAmplitude': 0.2,
    'sustainAmplitude': 0.1,
    'attackTime': 0.02,
    'decayTime': 0.3,
    'releaseTime': 0.02,
    'createNote': function(note, velocity) {
        var frequency = noteToFrequency(note);
        return ADSRGenerator(
            SineGenerator(frequency),
            this.attackAmplitude * (velocity / 128), this.sustainAmplitude * (velocity / 128),
            this.attackTime, this.decayTime, this.releaseTime
        );
    }
}

StringProgram = {
    'createNote': function(note, velocity) {
        var frequency = noteToFrequency(note);
        return ADSRGenerator(
            SineGenerator(frequency),
            0.3 * (velocity / 128), 0.2 * (velocity / 128),
            0.4, 0.4, 0.4
        );
    }
}


FluteProgram = {
    'createNote': function(note, velocity) {
        var frequency = noteToFrequency(note);
        return ADSRGenerator(
            SineGenerator(frequency),
            0.2 * (velocity / 128), 0.25 * (velocity / 128),
            0.2, 0.8, 0.2
        );
    }
}

HarpsichordProgram = {
    'createNote': function(note, velocity) {
        var frequency = noteToFrequency(note);
        return ADSRGenerator(
            SineGenerator(frequency),
            //attackAmplitude
            0.4 * (velocity / 128), //0.2,
            
            //sustainAmplitude
            0.001,
            
            //this.attackTime, 
            0.001,
            
            //this.decayTime, 
            0.25,           
            //this.releaseTime
            1
        );
    }
}


PROGRAMS = {
    73: FluteProgram,
    6:  HarpsichordProgram, 
    39: PianoProgram, //Fake solo violin instrument to give more colour
    40: StringProgram, 
    41: StringProgram,
    42: StringProgram,
    43: StringProgram,
    44: StringProgram,
    45: StringProgram,
    46: StringProgram,
    47: StringProgram,
    49: StringProgram,
    50: StringProgram
};
 
function loadRemote(path, callback) {
	var fetch = new XMLHttpRequest();
	fetch.open('GET', path);
	fetch.overrideMimeType("text/plain; charset=x-user-defined");
	fetch.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			/* munge response into a binary string */
			var t = this.responseText || "" ;
			var ff = [];
			var mx = t.length;
			var scc= String.fromCharCode;
			for (var z = 0; z < mx; z++) {
				ff[z] = scc(t.charCodeAt(z) & 255);
			}
			callback(ff.join(""));
		}
	}
	fetch.send();
}
