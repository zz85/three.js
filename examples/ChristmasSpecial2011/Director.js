/*
 * This is a prototypal Time based scheduler for animations
 * Supporting Tweens and Actions
 * @author https://github.com/zz85/ 
 * TOFIX: Goto Time
 * ordering of tween/ actions
 */

THREE.Director = function() {
	this._actions = [];
	this._tweens = [];
};

/*
 * Schedules a tween to run at a particular time 
 */
THREE.Director.prototype.addTween = function(startTime, duration, 
	object, startValues, endValues, easing, callback) {
		
		if (startTime===null) startTime = this.__lastTime;
		if (object===null) object = this.__lastObject;
		if (easing==null) easing = this.__lastEasing;
		if (easing==null) easing = 'Linear.EaseNone';
		var easingFunction = this.getEasingFunction(easing);
		
		
		object = (object instanceof Array) ? object : [object];
		//Object.prototype.toString.call(o) === '[object Array]'
		this.__lastObject = object;
		this.__lastTime = (startTime + duration)  * 1000;
		this.__lastEasing = easing;
		
		var tween = {
			startTime: startTime * 1000,
			duration: duration * 1000,
			endTime: this.__lastTime,
			object: object, 
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
	
	if (name=="Always.One") {
		return function() {
			return 1;
		}
	} else if (name=="Always.Zero") {
		return function() {
			return 0;
		}
	}
	
	
	var pointer = TWEEN.Easing;
	var paths = name.split('.');
	
	for (var i=0; i<paths.length;i++) {
		pointer = pointer[paths[i]];
	}
	
	if (pointer===undefined) {
		console.log("warning, tween " + name + " not found." )
	}
	
	return pointer;
};


THREE.Director.prototype.applyTweens = function(currentTime, lastTime) {
	
	var i, tweens = this._tweens, tween;
    
	for (i=tweens.length; i--; ) { 
		tween = tweens[i];
   		if (tween.startTime <= currentTime && currentTime <= tween.endTime) {
			
			this.runTween(tween, currentTime);
			
		} else if ((currentTime > tween.endTime) && (lastTime < tween.endTime)) {
			
			this.runTween(tween, tween.endTime);
			
		}
    }


};

THREE.Director.prototype.runTween = function(tween, currentTime) {
	var startTime = tween.startTime,
		duration = tween.duration,
		endTime = tween.endTime,
		objects = tween.object, 
		startValues = tween.startValues, 
		endValues = tween.endValues,
		easing = tween.easing,
		callback = tween.callback;
	
	
	var passedTime = currentTime - startTime;
	
	var k = easing( passedTime / duration );

	var object;
	for (var i=objects.length;i--;) {
		object = objects[i];
		
		if (!startValues) {
			// If no start values are specified, use exisiting values
			startValues = {};

			for (var v in endValues) {
				startValues[v] = object[v];
			}

			tween.startValues = startValues;
		}

		var startValue, endValue;
		for (var v in startValues) {
			startValue = startValues[v];
			endValue = endValues[v];
			var value = startValue + k * (endValue - startValue);

			object[v] = value;
		}
		
		// TODO nested properties
		
	}
	
	// Trigger callback
	if (callback) {
		callback();
	}

	
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
    
	// for (i=stage.length; i--; ) { 
	for (i=0, il=stage.length; i<il;i++) {
		action = stage[i];
   		if (action.time > lastTime && action.time<= currentTime) {
			action.action();
		}
    }

};

THREE.Director.prototype.start = function() {
	var time = Date.now();
	this._started = true;
	this._startTime = time;
	this._lastTime = time - 1;
};

THREE.Director.prototype.stop = function() {
	this._started = false;
};

THREE.Director.prototype.pause = function() {
	//TODO pause
	
	var time = Date.now();
	var elapsed = time - this._lastTime;
	var totalElapsed = time - this._startTime;
	var lastElpased = this._lastTime - this._startTime;
	
	
};

THREE.Director.prototype.update = function() {
	
	if (!this._started) return;
	
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
