let cnv,
	border = -10,
	p,
	v,
	a,
	noiseScl = 0.005,
	noiseShift = 0;

function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	cnv.position(0, 0);

	(p = createVector(0, 0)), (v = createVector(0, 0)), (a = createVector(0, 0));

	background(0);
	strokeWeight(0.2);
	stroke(256);
	frameRate(15);

	colorMode(HSB, 255);

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
	p.set(0, 0);
	v.set(0, 0);
	while (p.mag() < width || p.mag() < height) {
		let x = p.x;
		let y = p.y;
		a = p5.Vector.fromAngle(noise(x * noiseScl + noiseShift, y * noiseScl) * Math.PI * 2);
		a.setMag(20);
		v.add(a);
		v.limit(5);
		p.add(v);

		stroke(
			noise(x * noiseScl * 0.5 + noiseShift, y * noiseScl * 0.5) * 256,
			256,
			noise(x * noiseScl - noiseShift, y * noiseScl) * 200 + 56
		);

		drawMandalaLine(x, y, p.x, p.y, 20);
	}
	noiseShift += 0.008;

	background(0, 15);
}

function drawMandalaLine(ax, ay, bx, by, rots) {
	for (let i = 0; i < rots; i++) {
		line(ax, ay, bx, by);
		line(ax, -ay, bx, -by);
		rotate((Math.PI * 2) / rots);
	}
}
