function Particle() {
	this.pos = createVector(random(width), random(height));
	this.prevPos = this.pos.copy();
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);

	this.hue = 0;
	this.alpha = pow(random(0.5, 1), 3) * 200;

	this.update = function () {
		this.vel.add(this.acc);
		this.vel.limit(maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	};

	this.applyForce = function (force) {
		this.vel.add(force);
	};
	this.calculateForce = function () {
		let force = noise(this.pos.x * scl + xMove, this.pos.y * scl + yMove);

		this.hue = force * hueMultiplier + hueStart;
		this.acc.add(p5.Vector.fromAngle(force * accMultiplier));
	};
	this.show = function () {
		stroke(this.hue % 256, 255, 255, this.alpha);
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

		this.prevPos = this.pos.copy();
	};

	this.edges = function () {
		if (
			this.pos.x > width + width * edges ||
			this.pos.x < -width * edges ||
			this.pos.y > height + height * edges ||
			this.pos.y < height * -edges
		) {
			this.pos = createVector(
				random(width * (1 + edges * 2)) - width * edges,
				random(height * (1 + edges * 2) - height * edges)
			);
			this.vel = createVector(0, 0);

			this.prevPos = this.pos.copy();
		}
	};
}

let scl = 0.001;
let particleCount = 1000;

const maxspeed = 2;
const accMultiplier = Math.PI;
let hueMultiplier;
let hueStart;

let xMove;
let yMove;

let edges = 0.1;

let particles = [];

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);

	resetCanvas();

	// set canvas position
	canvas.position(0, 0);

	// add window resize listener, debounce it
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			resizeCanvas(windowWidth, windowHeight);
			background(0);
			setParticles(particleCount);
		}, 250);
	});
}

function draw() {
	background(0, 10);
	for (var i = 0; i < particles.length; i++) {
		particles[i].calculateForce();
		particles[i].update();
		particles[i].show();
		particles[i].edges();
	}

	xMove += 0.001;
	yMove += 0.001;

	hueStart += 0.1;
}
function setParticles(num) {
	particles = [];
	for (let i = 0; i < num; i++) {
		particles.push(new Particle());
	}
}
function resetCanvas() {
	let seed = floor(random(1000000));
	console.log('seed: ' + seed);
	randomSeed(seed);
	noiseSeed(seed);

	setParticles(particleCount);
	background(0);
	hueStart = random(256);
	hueMultiplier = random(100, 350);
	xMove = random(2000);
	yMove = random(2000);
}
