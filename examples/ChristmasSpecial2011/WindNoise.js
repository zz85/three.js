SPARKS.WindNoise = function() {
	this.noiseAmptitude = 10; 
	this.perlin = new SimplexNoise();

	this.strength = 1; // amptitude
	this.timeScale = 0.01;
	this.noiseScaleX = 1 / 100;
	this.noiseScaleY = 1 / 100;
	
}

SPARKS.WindNoise.prototype.update = function(emitter, particle, time) {
    var v = particle.velocity;
	var pos = particle.position;
	
	var direction = this.perlin.noise3d(time * this.timeScale, pos.x * this.noiseScaleX, pos.z * this.noiseScaleY) * Math.PI * 2;

	v.x += Math.cos(direction) * this.strength;
	v.z += Math.sin(direction) * this.strength;

};