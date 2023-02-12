
// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

var colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];

var gravity = 0.2;
var friction = 0.98;


// Event Listeners
addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("resize", function() {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;
	init();
});

addEventListener("click", function(event) {
	init();
});
addEventListener("keyup", function(event) {
	init();
});


// Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

var gravity=0.23;
var friction=0.79;
// Objects
class Ball {
	constructor(x, y, dx, dy, radius, color) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.color = color;

		this.update = function () {
			if(this.y+this.radius+this.dy>canvas.height){
				this.dy=-this.dy*friction; 
			}
			else{
				this.dy += gravity;
			}
			if((this.x + this.radius + this.dx > canvas.width || this.x - this.radius - this.dx <= 0) && this.y+this.radius!=canvas.height ){
				this.dx = -this.dx;
			}
			this.y += this.dy;
			this.x += this.dx;
		};

		this.draw = function () {
			c.beginPath();
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			c.fillStyle = this.color;
			c.fill();
			c.closePath();
		};
	}
}
let ball;
let balls = [];
// Implementation
function init() {
	balls= []
	for(let i=0; i<600; i++){
		var radius = randomIntFromRange(10,40);
		var x = randomIntFromRange(radius,canvas.width-radius);
		var y = randomIntFromRange(radius,canvas.height-radius);
		var dx = randomIntFromRange(0.1,0.2);
		var dy = randomIntFromRange(0.1,0.3);
		var color = randomColor(colors);
		ball = new Ball(x, y, dx, dy, radius, color);
		balls.push(ball);
	}
}
console.log(balls);

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	balls.forEach((ball)=>{
		ball.draw();
		ball.update();
	});
}

init();
animate();