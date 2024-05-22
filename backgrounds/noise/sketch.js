const border = 20;

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);

	noStroke();
	colorMode(HSB, 256);

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
	let stepSize = 20;
	let scl = 0.0005;
	background(0, 5);
	for (let x = -stepSize; x < width; x += stepSize) {
		for (let y = -stepSize; y < height; y += stepSize) {
			let n = (noise(x * scl + noise(x, y) * 0.1, y * scl, frameCount * scl * 2) * 500) % 256;
			fill(n, 256, 256, 10);
			rect(x + random() * stepSize * 0.5, y + random() * stepSize * 0.5, stepSize, stepSize);
		}
	}
}
