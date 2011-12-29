function runTheEndScene() {
	var theEndDirector = new THREE.Director();

	theEndDirector
	// snowman jumps
	.addTween(0, 0.25, snowman.position, {y: 250}, {y: 400}, 'Linear.EaseNone')
	.addTween(0.5, 0.25, snowman.position, {y: 400}, {y: 0}, 'Linear.EaseNone')
	
	// snowman turns
	.addTween(1, 0.25, snowman.rotation, {y: 0}, {y: 0.5}, 'Linear.EaseNone')
	
	// snowman shuffles
	.addTween(2, 0.5, snowman.rotation, {y: 0}, {y: 0.25}, 'Linear.EaseNone')
	.addTween(2, 0.5, snowman.position, {x: -1100}, {x: -1050}, 'Linear.EaseNone')

	.addTween(3, 0.5, snowman.rotation, {y: 0}, {y: 0.75}, 'Linear.EaseNone')
	.addTween(3, 0.5, snowman.position, null, {x: -1000}, 'Linear.EaseNone')
	
	.addTween(4, 0.5, snowman.rotation, {y: 0}, {y: 0.25}, 'Linear.EaseNone')
	.addTween(4, 0.5, snowman.position, null, {x: -950}, 'Linear.EaseNone')	
	
	.addTween(4, 0.5, snowman.rotation, {y: 0}, {y: 0.75}, 'Linear.EaseNone')
	.addTween(4, 0.5, snowman.position, null, {x: -900}, 'Linear.EaseNone')
	.start();
	
	snowSceneDirector = theEndDirector;
}