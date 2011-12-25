SPARKS.WindNoise = function() {
	this.id = 0;
	this.noiseScale = 100;
	this.perlin = new SimplexNoise();
	this.direction = 0;
	this.speed = 1;
}

SPARKS.WindNoise.prototype.update = function(emitter, particle, time) {
    var v = particle.velocity;
	var pos = particle.position;
	
	this.direction = this.perlin.noise(time/10, pos.x / this.noiseScale, pos.y / this.noiseScale);
	//this.direction = this.perlin.noise(this.id++, pos.x / this.noiseScale, pos.y / this.noiseScale);
	
	//this.direction += windDir;

	// pos.x += Math.cos(this.direction) * this.speed;
	// pos.y += Math.sin(this.direction) * this.speed;

	v.x += Math.cos(this.direction) * this.speed;
	v.y += Math.sin(this.direction) * this.speed;

};