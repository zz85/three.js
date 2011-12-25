// aka animation, sequencer, scheduler, timeline, stage, director, script, tween, secheduler?

/*
 * TODO: new TweenAction() API?
 tween = new TweenAction()
 director.add(tween);

tween.run(currentTime);

Refactor tweens to repeating actions!


------


tween(startTime, duration, easing, callback) 

function(k) {
	startValue + k* diff;	
	startValue + k* (endValue - startValue);
}

---------

.addSetAction

*/

// code blocks
// timeings
// camera movements.

// time based

THREE.Director = function() {
	this._actions = [];
	this._tweens = [];
};

/*
 * Schedules a tween to run at a particular time 
 */
THREE.Director.prototype.addTween = function(startTime, duration, 
	property, startValues, endValues, easing, callback) {
		
		var easingFunction = this.getEasingFunction(easing);
		
		if (startTime===null) startTime = this.__lastTime;
		if (property===null) property = this.__lastTarget;
		
		// TODO Support multiple targets
		
		this.__lastProperty = property;
		this.__lastTime = (startTime + duration)  * 1000;
		this.__lastTarget = property;
		
		var tween = {
			startTime: startTime * 1000,
			duration: duration * 1000,
			endTime: this.__lastTime,
			property: property, 
			startValues: startValues, 
			endValues: endValues,
			easing: easingFunction,
			callback: callback
		};
		
		this._tweens.push(tween);
		
		return this;
};

/*
 * Returns easing function based on its string named
 */
THREE.Director.prototype.getEasingFunction = function(name) {
	
	var pointer = TWEEN.Easing;
	var paths = name.split('.');
	
	for (var i=0; i<paths.length;i++) {
		pointer = pointer[paths[i]];
	}
	
	return pointer;
};


THREE.Director.prototype.applyTweens = function(currentTime, lastTime) {
	
	var i, tweens = this._tweens, tween;
    
	for (i=tweens.length; i--; ) { 
		tween = tweens[i];
   		if (tween.startTime <= currentTime && currentTime <= tween.endTime) {
			
			this.runTween(tween, currentTime);
			
		}
		// if (tween.startTime <= lastTime && lastTime <= tween.endTime) 
		// (currentTime > tween.endTime) && (lastTime < tween.endTime)
    }


};

THREE.Director.prototype.runTween = function(tween, currentTime) {
	var startTime = tween.startTime,
		duration = tween.duration,
		endTime = tween.endTime,
		property = tween.property, 
		startValues = tween.startValues, 
		endValues = tween.endValues,
		easing = tween.easing,
		callback = callback;
	
	
	var passedTime = currentTime - startTime;
	
	var k = easing( passedTime / duration );

	if (!startValues) {
		// If no start values are specified, use exisiting values
		startValues = {};
		
		for (var v in endValues) {
			startValues[v] = property[v];
		}
		
		tween.startValues = startValues;
	}
	
	var startValue, endValue;
	for (var v in startValues) {
		startValue = startValues[v];
		endValue = endValues[v];
		var value = startValue + k * (endValue - startValue);
		
		property[v] = value;
	}
	
	// TODO nested properties
	
};


/*
 * Schedules an action to run at a particular time 
 */
THREE.Director.prototype.addAction = function(time, action) {
	this._actions.push({time: time * 1000, action: action});
	
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
	var i, stage = this._actions, action;
    
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
	this._lastTime = time - 1;
};

THREE.Director.prototype.update = function() {
	var time = Date.now();
	var elapsed = time - this._lastTime;
	var totalElapsed = time - this._startTime;
	var lastElpased = this._lastTime - this._startTime;
	
	this.applyActions(totalElapsed, lastElpased);
	this.applyTweens(totalElapsed, lastElpased);
	
	this._lastTime = time;
};

// Actions?
THREE.Event = function(time, action) {
	
};



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