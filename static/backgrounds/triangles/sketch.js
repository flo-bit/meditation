function tri(x, y, scl) {
	noStroke();
	fill(
		(frameCount + x / scl + y / scl) % 256,
		256,
		noise(x / scl + frameCount / 100, y / scl) * 256,
		20
	);
	push();
	translate(x, y);
	let n = (((x / scl + frameCount / 3) % 4) + ((y / scl + frameCount / 5) % 4)) / 8;

	// + noise(x * 0.01, y * 0.01, frameCount * 0.05) / 2;
	//rotate(n < 0.5 ? 0 : Math.PI);
	rotate((floor(n * 4) * Math.PI) / 2);
	triangle(-scl / 2, -scl / 2, scl / 2, -scl / 2, -scl / 2, scl / 2);
	pop();
}

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);

	// set canvas position
	canvas.position(0, 0);
	frameRate(20);

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
	//background(256);
	background(0, 10);
	let num = 50;
	let scl = Math.max(width, height) / num;

	translate(scl / 2, scl / 2);
	for (let x = 0; x < num + 1; x++) {
		for (let y = 0; y < num + 1; y++) {
			tri(x * scl, y * scl, scl);
		}
	}
}
