let cnv,
	border = -10,
	scl = 0.2,
	rots = 50,
	rows = 10,
	start = 10,
	rowDist = 20;

function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	cnv.position(0, 0);
	background(0);
	noStroke();
	fill(0, 3);
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
	translate(width / 2, height / 2);
	scale(0.5);
	rotate(millis() / 5000);
	background(0, 15);
	fill((millis() / 100) % 256, 256, 256, 1);
	for (let j = 0; j < 100; j++) {
		rotate(sin(j / 2000));
		let x = sin(j / 100 + millis() / 2800) * 200;
		let y = cos(j / 100 + millis() / 4000) * 330;

		x += sin(y / 11) * 10 + cos(y / 5) * 15 + sin(x / 7) * 30 + cos(j / 20) * 15;

		let h = 10;
		rect(0, y, x, h);
		rect(0, y, -x, h);
		rect(0, y, -x * 2, h);
		rect(0, y, x * 2, h);
		rect(0, y, x * 3, h);
		rect(0, y, -x * 3, h);

		rect(0, -y, x, h);
		rect(0, -y, -x, h);
		rect(0, -y, -x * 2, h);
		rect(0, -y, x * 2, h);
		rect(0, -y, x * 3, h);
		rect(0, -y, -x * 3, h);
	}
}
