var canvas = document.getElementById( 'myCanvas' ),
    c = canvas.getContext( '2d' );

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// c.fillStyle = 'rgba(255,0,0,0.5)'
// c.fillRect(10,10,100,100);

// c.fillStyle = 'rgba(0,255,0,0.5)'
// c.fillRect(100,150,100,100);


//line
// c.beginPath();
// c.moveTo( 1000, 200 );
// c.lineTo( 200, 300 );
// c.lineTo( 100,400 );
// c.strokeStyle = '#ff00cf'
// c.stroke();

//arc / circle
 
 
 // for (var i=0; i<100; i++) {
 // 	var x = Math.random() * window.innerWidth;
 // 	var y = Math.random() * window.innerHeight;
 // 	var color = ["red","blue","green","pink","black"];
 // 	var randomColor = Math.floor(Math.random() * 5);
 // 	var getRandomColor = color[randomColor];
    

	//  c.beginPath();
	//  c.arc(x, y, 30, 0, Math.PI * 2, false);
	//  c.strokeStyle = getRandomColor
	//  c.stroke();	
 // }

var mouse = {
	x: undefined,
	y: undefined
}

// var maxRadius = 40;

var mouseradius = 70;

var colorArray = [
	'#3C989E',
	'#5DB5A4',
	'#F4CDA5',
	'#F57A82',
	'#ED5276'
]

var getRandomColor = colorArray[Math.floor( Math.random () * colorArray.length )]

 window.addEventListener('mousemove', 
 	function (event) {
 		mouse.x = event.x;
 		mouse.y = event.y;
 	
 	})

 window.addEventListener('resize', function () {
 	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	init();
 })

function Circle (x, y, dx, dy, radius) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.maxRadius = radius + 40;
	this.minRadius = radius;

	this.color = colorArray[Math.floor( Math.random () * colorArray.length )]

	this.draw = function () {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		// c.strokeStyle = 'white';
		// c.stroke();
		c.fillStyle = this.color;
		c.fill();

	}

	this.update = function () {
		if ( this.x + this.radius > innerWidth || this.x - this.radius < 0 ) {
			this.dx = -this.dx;
		}
		if ( this.y + this.radius > innerHeight || this.y - this.radius < 0 ) {
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;


		// interactivity

		if (mouse.x - this.x < mouseradius && mouse.x - this.x > -mouseradius 
			&& mouse.y - this.y < mouseradius && mouse.y - this.y > -mouseradius) {
			if (this.radius < this.maxRadius) {
			this.radius += 4;	
			}
			
		} else if (this.radius > this.minRadius) {
			this.radius -= .5;
		}

		this.draw();
	}
}



var circleArray = [];

function init () {
	circleArray = [];

	for (var i = 0; i < 600; i++) {
		var	x = Math.random() * (innerWidth - radius * 2) + radius;
		var y = Math.random() * (innerHeight - radius * 2) + radius;
		var dx = (Math.random() - 0.5) * 2;
		var dy = (Math.random() - 0.5) * 2;
		var radius = Math.random() * 3 + 1;

		circleArray.push( new Circle(x, y, dx, dy, radius) );
	}

}

 function animate() {
 	requestAnimationFrame(animate);	
 	c.clearRect(0, 0, innerWidth, innerHeight);

 	for (var i = 0; i < circleArray.length ; i++) {
 		circleArray[i].update();
 	}


 }

 init();

 animate();