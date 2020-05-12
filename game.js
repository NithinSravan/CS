let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let color = ["#F5FF25", "#B625FF", "#FF2560", "#FF8125"];
let loop;
let balls;
let pause = document.getElementById("pause");
let resume;
let restart;
let start;
let index=0;
let count;
let timer;
let s;
let speed;
let time=5;
let genspeed;
let initballs;
let score;
let beginGame;
let m;
let area;
let scoretimer;
let gen;
let truth;
let gameOver=0;
let overlay = document.getElementById('overlay');

//window event listeners
window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearInterval(loop);
    clearInterval(timer);
    clearInterval(beginGame);
    clearInterval(scoretimer);
    if (typeof (start) != 'undefined' && start != null) {
        start.remove();
    }
    if (typeof (begin) != 'undefined' && begin != null) {
        begin.remove();
    }
    if (typeof (score) != 'undefined' && score != null) {
        score.remove();
    }
    truth=false;
    box.style.display="block";
    clearTimeout(gen);
    setup();
    init();
};
window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearTimeout(gen);
    setup();
};
let mouse = {
    x: undefined,
    y: undefined
};
window.addEventListener("click", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
})
//---------------------X---------------------//

//functions used for manipulating vectors and other general math
function mag(ball) {
    return (Math.sqrt((ball.vx * ball.vx) + (ball.vy * ball.vy)))
}
function angle(ball) {
    return (Math.atan2(ball.vy, ball.vx));
}
function dist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return (Math.sqrt((dx * dx) + (dy * dy)))
}
function rand(min, max) {
    return (Math.random() * (max - min + 1) + min);
};
//---------------------X---------------------//

//very beginning of the game
function init(){
    m=3;
    window.removeEventListener("click",clicked)
    const myH1 = document.createElement('div');
	document.body.appendChild(myH1);
	myH1.setAttribute("id", "countdown");
	begin = document.getElementById('countdown');
    pause.style.display="none";
}
//countdown to launch game
function startCount(){
    canvas.removeEventListener("click",startCount)
    if (m === 3)
	{
        begin.style.fontSize = "200px"
		beginGame = setInterval(function ()
		{
			
			begin.innerHTML = m;
			m--;
			if (m< 0)
			{
				clearInterval(beginGame);
                begin.remove();
                pause.style.display="block";
                truth=true;
                window.addEventListener("click", clicked);
                scoreDis()
;                genBubble();
				
			}
		}, 1000);

	}
}

//balls class defines all properties and behaviours of a ball
class Ball {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = canvas.width / 300;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    };
    update() {

        for (let i = 0; i < balls.length; i++) {
            if (dist(this.x, this.y, balls[i].x, balls[i].y) <= this.radius + balls[i].radius) {
                if (this !== balls[i])
                    collisionCheck(this, balls[i]);
            }
        }
        if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
            this.vy = -this.vy;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    };
    burst() {
        
        window.addEventListener('click', clicked)
        if (dist(mouse.x, mouse.y, this.x, this.y) <=this.radius) {
            sound.play();
            for (let i = balls.length - 1; i >= 0; i--) {
                if (this === balls[i]) {
                    balls.splice(i, 1);
                }
            }
        }
    }
}
//used to setup the game objects and variables
function setup() {
    balls = new Array();
    m=3;
    s=0;
    pause.style.display="none";
    count = 0;
    gameOver=0;
    index=1;
    time=6;
    //checks for the type of device
    if(canvas.width<canvas.height)
    {
        initballs=30;
        genspeed=1100;
        speed=320;
    }
    else
    {  
        initballs=40;
        genspeed=1000;
        speed=300;
    }
    //initial bubbles
    for (let i = 0; i < initballs; i++) {
    createBubbles(i);
    }
    
    if (typeof (restart) != 'undefined' && restart != null) {
        overlay.style.display = "none";
        restart.remove();
    }
    if (typeof (resume) != 'undefined' && resume != null) {
        resume.remove();
    }
    pause.addEventListener('click', pauseGame);
    play();
}
function createBubbles(i=1) {
    
    let r = rand(Math.max(canvas.width * 0.01, 20), Math.min(canvas.width * 0.1, 70));
    let x = rand(r, (canvas.width - r));
    let y = rand(r, (canvas.height - r));
    let dx = rand(-2, 2) * 0.1;
    let dy = rand(-2, 2) * 0.1;
    let colors = color[Math.floor(rand(0, 4))];
    if (i != 0) {
        for (let j = 0; j < balls.length; j++) {
            if (dist(x, y, balls[j].x, balls[j].y) < r + balls[j].radius) {
                x = rand(r, (canvas.width - r));
                y = rand(r, (canvas.height - r));
                j = -1;
            }
        }
    }
    balls.push(new Ball(x, y, dx, dy, r, colors));

}


//the master function where the whole game runs...at almost 60FPS
function play() {
    loop = setInterval(function () {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }
        if(m===-1)
        {
            areaCheck();
        }
            
    }, 16);
}
//fired when clicked on window
function clicked() {
    window.removeEventListener('click', clicked)
    for (let i = balls.length - 1; i >= 0; i--) {
        balls[i].burst();
    }
}
//compares the area of balls and the canvas
function areaCheck() {
    area = 0;
    for (let i = 0; i < balls.length; i++) {
        area += (Math.PI * balls[i].radius * balls[i].radius);
    }
    if(count!==0){
        if(area < 0.3 * (canvas.width * canvas.height))
        {
            start.remove();
            clearInterval(timer)
            count=0;
        }
    }
   
    if (area >= 0.2 * (canvas.width * canvas.height)) {
        if (count === 0)
        {  count++;
            time=6;
            countDown();
        }
    }

}
//tick tick tick the game's gonna end in 5...4...3...2...1!!
function countDown() {
    
    const myDiv = document.createElement('div');
	document.body.appendChild(myDiv);
	myDiv.setAttribute("id", "countdown");
    start = document.getElementById('countdown');
    start.style.fontFamily="Arial"
    start.style.color = "rgb(245, 94, 83)";
    let Size = Math.min(canvas.width * 0.1, canvas.height * 0.1);
    start.style.fontSize = `${Size}px`;
   
    timer = setInterval(function () {
        console.log(time)
        if(time>5)
        start.innerHTML = "Hurry!";
        else
        start.innerHTML = time;
        time--;
        if (time< 0) {
            clearInterval(timer);
            clearInterval(loop);
            clearTimeout(gen);
            clearInterval(scoretimer);
            gameOver=1;
            best();
            count=0;
            restartButton();
        }
            

    }, 1000);

}
//uses 2D oblique collision formula to detect collision between balls
function collisionCheck(ball, otherball) {
    let dx = (otherball.x - ball.x);
    let dy = (otherball.y - ball.y);

    if ((dx * (ball.vx - otherball.vx) + dy * (ball.vy - otherball.vy)) >= 0) {
        let phi = Math.abs(Math.atan2(dy, dx));
        const magBall = mag(ball);
        const magOther = mag(otherball);
        const angleBall = angle(ball);
        const angleOther = angle(otherball)
        ball.vx = magOther * Math.cos(angleOther - phi) * Math.cos(phi) + magBall * Math.sin(angleBall - phi) * Math.cos(phi + (Math.PI / 2));
        ball.vy = magOther * Math.cos(angleOther - phi) * Math.sin(phi) + magBall * Math.sin(angleBall - phi) * Math.sin(phi + (Math.PI / 2));
        otherball.vx = magBall * Math.cos(angleBall - phi) * Math.cos(phi) + magOther * Math.sin(angleOther - phi) * Math.cos(phi + (Math.PI / 2));
        otherball.vy = magBall * Math.cos(angleBall - phi) * Math.sin(phi) + magOther * Math.sin(angleOther - phi) * Math.sin(phi + (Math.PI / 2));

    }


}
//display score at all times
function scoreDis(){
        const myDiv = document.createElement('div');
        document.body.appendChild(myDiv);
        myDiv.setAttribute("id", "score");
        score = document.getElementById('score');
        let Size = Math.min(canvas.width * 0.1, canvas.height * 0.1);
        score.style.fontSize = `${Size}px`;
        score.style.fontFamily="Arial"
    scoretimer = setInterval(function () {
        s++;
        score.innerHTML=s;
        },1000)
           
}
//best score finder
function best() {
    if (localStorage.getItem('high') === null)
        localStorage.setItem(`high`, JSON.stringify(s));
    else if (s > JSON.parse(localStorage.getItem(`high`)))
        localStorage.setItem(`high`, JSON.stringify(s));
    start.style.color="#fff";
    start.style.fontSize = `4vh`;
    start.innerHTML = `Score: ${s}<br>Best Score: ${JSON.parse(localStorage.getItem(`high`))}`;
    start.style.display = "block";
}
//generates bubbles after game is fired. Pace of generation increases with time linearly
function genBubble()
{
    if(truth)
    {
        if(genspeed>400)
        genspeed-=index*10;
        else
        genspeed=speed;
        createBubbles();
        index++;
        //increases speed of bubbles for every 5th bubble created
        if(index%5===0)
        {
           for(let i=0;i<balls.length;i++)
            {
                balls[i].dx=rand(-(index*0.1+2),(index*0.1+2))*0.1;
                balls[i].dy=rand(-(index*0.1+2),(index*0.1+2))*0.1;
            }
        }
        gen=setTimeout(genBubble,genspeed)
    }
    else
    clearTimeout(gen)
}