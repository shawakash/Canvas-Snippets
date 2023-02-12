
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
	'#CF0A0A',
	'#000000'
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

function getDistance(x1,x2,y1,y2) {
    return (Math.sqrt(Math.pow(((x1)-(x2)),2) + Math.pow(((y2)-(y1)),2)));
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// Objects
class Ball {
	constructor(x, y, dx, dy, radius, color, opacity) {
		this.x = x;
		this.y = y;
		this.opacity = opacity;
        this.velocity = {
            x: dx,
            y: dy
        };
		this.radius = radius;
		this.color = color
        this.mass = 1; 

		this.update = (balls) => {

			
            
            for(let i=0; i<balls.length; i++) {
                if(this === balls[i]) continue;
                if(getDistance(this.x,balls[i].x,this.y,balls[i].y) < this.radius+balls[i].radius){
                    console.log("Collided");
                    resolveCollision(this, balls[i]);
                }
            }
            if ((this.x + this.radius+this.velocity.x > innerWidth || this.x < this.radius)) {
                this.velocity.x = -this.velocity.x;
            } if ((this.y + this.radius+this.velocity.y > innerHeight || this.y< this.radius)) {
                this.velocity.y = -this.velocity.y;
            }

            if(getDistance(mouse.x,this.x,mouse.y,this.y) < 120 && this.opacity < 0.2){
                this.opacity += 0.04;
            }else if(this.opacity >0) { 
                this.opacity -= 0.02;
                this.opacity = Math.max(0, this.opacity);
            }

            this.x += this.velocity.x;
            this.y += this.velocity.y;
            // interactivity
		};

		this.draw = function () {
			c.beginPath();
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			c.save();
            c.globalAlpha = this.opacity;
            c.fillStyle = this.color;
			c.fill();
            c.restore();
            c.strokeStyle = this.color;
            c.stroke();
			c.closePath();
		};
	}
}
let ball;
let balls = [];
// Implementation
function init() {
    balls = []
    for(let i=0; i<200; i++){
        let radius = randomIntFromRange(8,30);
        let dx = (Math.random() - 0.5)*5;
        let x = randomIntFromRange(radius,canvas.width-radius-dx);
        let dy = (Math.random() - 0.5)*5;
        let y = randomIntFromRange(radius,canvas.height-radius-dy);
        let color = randomColor(colors);
        let opacity = Math.random() ;
        if(i != 0){
            for(let j=0; j<balls.length; j++){
                if(getDistance(x,balls[j].x,y,balls[j].y) < radius+balls[j].radius){
                    x = randomIntFromRange(radius,canvas.width-radius-dx);
                    y = randomIntFromRange(radius,canvas.height-radius-dy);
                    j = -1;
                }
            }
        }
        balls.push(new Ball(x, y, dx, dy, radius, color, opacity));
    }    
}

// Collision Detection
//function animate() {
    // 	requestAnimationFrame(animate);
    // 	c.clearRect(0, 0, canvas.width, canvas.height);
    //     ball2.x=mouse.x;
    //     ball2.y=mouse.y;
    //     ball1.draw();
    //     ball2.draw();
    //     if(getDistance(ball1.x, ball2.x, ball1.y, ball2.y) <= (ball1.radius + ball2.radius)){
    //         ball1.color = "#00425A";
    //         ball2.color = "#E90064"
    //     }else{
    //         ball1.color = "#E90064"
    //         ball2.color = "#00425A";
    //     }
    // }

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.draw();
        ball.update(balls);
    });
}
// 

init();
animate();