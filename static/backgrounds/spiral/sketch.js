function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);

	noFill();
	strokeWeight(0.5);
	stroke(256, 50);

	// add window resize listener, debounce it
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			resizeCanvas(windowWidth, windowHeight);
			background(0);
		}, 250);
	});
}

function draw() {
	background(0, 5);
	let s = Math.max(width, height);
	beginShape();
	let t = millis() * 0.5;
	let num = 10000,
		scl = 150; //(Math.sin(t * 0.0001) + 1) * 500 + 10;
	for (let i = 0; i < num; i++) {
		let r = (i / num) * s + noise(i * 20, millis() * 0.001) * 50;
		let x = Math.sin((i / num) * scl + t * 0.00014) * r + s / 2;
		let y = Math.cos((i / num) * scl + t * 0.00015) * r + s / 2;
		vertex(x, y);
	}
	endShape();
}
