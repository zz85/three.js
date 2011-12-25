SPARKS.WindNoise = function() {
	this.noiseAmptitude = 10; 
	this.perlin = new SimplexNoise();

	this.speed = 1;
	this.timeScale = 0.01;
	this.noiseScaleX = 1/ 1230;
	this.noiseScaleY = 1 /1230;
	
}

SPARKS.WindNoise.prototype.update = function(emitter, particle, time) {
    var v = particle.velocity;
	var pos = particle.position;
	
	var direction = this.perlin.noise3d(time * this.timeScale, pos.x * this.noiseScaleX, pos.y * this.noiseScaleY) * Math.PI * 2;


	v.x += Math.cos(direction) * this.speed;
	v.z += Math.sin(direction) * this.speed;

};