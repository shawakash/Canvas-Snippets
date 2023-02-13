
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
	'#FAFAF6',
	'#1C6DD0',
	'#00D1FF',
	'#5D3891'
];


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


// Objects
class Circle {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radians = Math.random() * Math.PI * 2;
		this.radius = radius;
		this.color = color;
        this.distanceFromCenter = randomIntFromRange(50,80);
        this.lastMousePoint = {x:x,y:y};

		this.update = function () {
            const lastPoint = {
                x:this.x,
                y:this.y
            };
            this.lastMousePoint.x += (mouse.x - this.lastMousePoint.x)*0.05; 
            this.lastMousePoint.y += (mouse.y - this.lastMousePoint.y)*0.05; 
            this.radians += 0.05;
			this.x = this.lastMousePoint.x + Math.cos(this.radians)*(this.distanceFromCenter);
			this.y = this.lastMousePoint.y + Math.sin(this.radians)*(this.distanceFromCenter);
            this.draw(lastPoint);
		};

		this.draw = function (lastPoint) {
			c.beginPath();
            c.strokeStyle = this.color;
            c.lineWidth = this.radius;
            c.moveTo(lastPoint.x, lastPoint.y);
            c.lineTo(this.x, this.y);
            c.stroke();
			c.closePath();
		};
	}
}
let circles = []
// Implementation
function init() {
    circles = [];
    for(let i=0; i<60; i++){
        let color = randomColor(colors);
        let radius = randomIntFromRange(1,3);
        circles.push(new Circle(canvas.width/2, canvas.height/2, radius, color));
    }
}
console.log(circles);

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
    c.fillStyle = "rgba(255,255,255,0.2)";
    c.fillRect(0,0, canvas.width, canvas.height)
    
	circles.forEach(circle => {
        circle.update();
    });
}
init();
animate();