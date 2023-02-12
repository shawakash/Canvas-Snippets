var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");
// c.fillStyle = "rgba(60,60,60,0.5)"
// c.fillRect(20,20,100,100);
// c.fillStyle = "rgba(80,80,80,0.5)"
// c.fillRect(30,30,100,100);
// c.fillStyle = "rgba(120,120,120.0.5)";
// c.fillRect(40,40,100,100);
// c.beginPath();
// c.moveTo(20,20)
// c.lineTo(275,275);
// c.strokeStyle = "rgba(255,255,255,1)";
// c.stroke();

// for(let i = 0; i<3 ; i++){
//     c.beginPath()
//     c.arc(140 + i*60, 140 + i*60, 20 + i*10, -2.2, 0.62, false);
//     c.stroke();
//     c.beginPath();
//     c.arc(140 + i*60, 140 + i*60, 20+i*10, 0.95, 3.8, false);
//     c.stroke();

// }

// logic to create random circles with random colors

// for(let i=0; i<20; i++){
//     var x = Math.random()*(window.innerWidth);
//     var y = Math.random()*(window.innerHeight);
//     var r = 30 + Math.random()*60;
    // var re = Math.floor(Math.random()*255)+1;
    // var g = Math.floor(Math.random()*255)+1;
    // var b = Math.floor(Math.random()*255)+1;
    // var a = (Math.floor(Math.random()*10)+1)/10;

//     c.beginPath();
//     c.arc(x, y, r, 0, 2*Math.PI);
//     c.strokeStyle = `rgba(${re},${g},${b},${a})`;
//     c.stroke();

// }

var mouse = {
    x: undefined,
    y: undefined
}
let maxRadius = 40;
// let minRadius = 4;

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    console.log(mouse);
});

let bubbleColor = [
    '#C92C6D','#F0EEED','#B9F3FC','#EB455F','#2B3A55','#2DCDDF','#fff'
];

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Circle {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color
        this.radius = radius;
        this.minRadius = radius; 
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
            // c.strokeStyle = "rgba(225,232,44,0)";
            // c.stroke();
            c.fillStyle = `${color}`;
            c.fill();
        };
        this.update = () => {
            if ((this.x + this.radius > innerWidth || this.x < this.radius)) {
                this.dx = -this.dx;
            } if ((this.y + this.radius > innerHeight || this.y < this.radius)) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            // interactivity
            if(Math.abs(mouse.x-this.x) < 50 && Math.abs(mouse.y-this.y) < 50 && this.radius < maxRadius){
                this.radius+=1;
            }
            else if(this.radius >this.minRadius ){
                this.radius-=1;
            }
        };
    }
}

let circles = [];
console.log(circles);
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth,window.innerHeight);     
    for(let i=0; i<circles.length; i++){
        circles[i].draw();
        circles[i].update();
    }
};
function init() {
    circles = [];
    for(let i=0; i<1050; i++){
        let radius = Math.random()*3.5 + 1;
        let x = Math.random() * (innerWidth-2*radius) + radius;
        let y = Math.random() * (innerHeight-2*radius) + radius;
        let dx = 10*(Math.random() - 0.5);
        let dy = 10*(Math.random() - 0.5);
        let color = bubbleColor[Math.floor(Math.random()*7)];
        circles.push(new Circle(x,y,dx,dy,radius,color));
    }
}
init();
animate();