// aka animation, sequencer, timeline, stage, director, script, tween, secheduler?

// code blocks
// times
// camera movements.

// time based

THREE.Director = function() {
	this._stage = [];
};

THREE.Director.prototype.addAction = function(time, action) {
	this._stage.push({time: time, action: action});
	
	// timeline[];
	
	// to allow chaining
	return this;
};

// For calculations for video rendering
THREE.Director.prototype.setFps = function(fps) {
	this._fps = fps;
};

THREE.Director.Utils = {
	// Frame to Seconds
	frameToTime: function(frame, fps) {
		return frame / fps;
	},
	
	timeToFrame: function(time, fps) {
		return Math.floor(time * fps);
	}
};

THREE.Director.prototype.applyActions = function(currentTime, lastTime) {
	
	// check for past keyframes
	// get all start time and end times in seconds
	var i, stage = this._stage, action;
    
	for (i=stage.length; i--; ) { 
		action = stage[i];
   		if (action.time > lastTime && action.time<= currentTime) {
			action.action();
		}
    }  // certainly can optimize

	// check require interpolation

};

THREE.Director.prototype.start = function() {
	var time = Date.now();
	this._startTime = time;
	this._lastTime = time;
};

THREE.Director.prototype.update = function() {
	var time = Date.now();
	var elapsed = time - this._lastTime;
	var totalElapsed = time - this._startTime;
	var lastElpased = this._lastTime - this._startTime;
	
	this.applyActions(totalElapsed, lastElpased);
	
	this._lastTime = time;
};

// Actions?
THREE.Event = function(time, action) {
	
};
