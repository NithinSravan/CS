let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let ballX;
let ballY;
let ballRad;
let count;
let loop;
let blast;
let bestScore=document.getElementById('show');
let s = 0;
let color = ["#F5FF25", "#B625FF", "#FF2560", "#FF8125"];
let truth = [false, true];
let curr;
let pause=document.getElementById("pause");
let restart;
let overlay=document.getElementById('overlay');
let parts;
let particles;
window.onload = window.onresize = function () {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup();

}

var rand = function (min, max) {
    return (Math.random() * (max - min+1) + min);
};
var explode = function () {
    clearInterval(loop);

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles = new Array();
    for (let i = 0; i < 20; i++) {
        var r = rand(3, 5);
        var x = ball.x;
        var y = ball.y;
        var dx = rand(-15, 15);
        var dy = rand(-15, 15);
        var colors = color[Math.floor(rand(0, 4))];
        particles.push(new Particle(x, y, dx, dy, r, colors));
    }
   blast=setInterval(function () {
       ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < obs.length; i++) {
            obs[i].draw();
        }
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        score();
        best();
    }, 10);
    f = 1;

    overlay.style.display="block";
    const rest= document.createElement('img');
    document.body.appendChild(rest);
    rest.setAttribute("id","restart");
    restart=document.getElementById("restart");
    restart.src="restart.svg";
    restart.addEventListener('click',function(e){
        e.stopPropagation();
        restartGame();
    });
}
var endgame = function (start, end, portion,dir) {
    if (portion === 0&&dir===0||portion===1&&dir===1) {//bottom and clockwise
        for (let j = 0; j < parts.length; j++) {
       
            if (parts[j].color !== ball.color) {
                if ((Math.abs(parts[j].end % (Math.PI * 2)) > Math.abs(start) && Math.abs(parts[j].end % (Math.PI * 2)) < Math.abs(end))) {

                    explode();
                }
            }
        }
    } else  if (portion === 0&&dir===1||portion===1&&dir===0) {
        for (let j = 0; j < parts.length; j++) {
            
            if (parts[j].color !== ball.color) {
                if ((Math.abs(parts[j].start% (Math.PI * 2)) > Math.abs(start) && Math.abs(parts[j].start % (Math.PI * 2)) < Math.abs(end))) {

                    explode();
                }
            }
        }
    }
};
class Ball {
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
    }
  
    draw  () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle =this.color;
        ctx.fill();
    };
    update  () {
        this.y -= this.vy;
        curr = this.y;
        this.vy -= 0.17;
        if (this.y >= canvas.height-this.radius) {
         
            clearInterval(loop);
            explode();
        }
        this.draw();
    };
}
class Particle extends Ball{
    constructor(x, y, vx, vy, radius, color){
        super(x, y, radius, color);
        this.vx=vx;
        this.vy=vy;
    }
    update () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    };
}
class Part{
    constructor(start, end, color) {
        this.start = start;
        this.end = end;
        this.color = color;
    }
   
}

class Obstacle {
    constructor(x, y, radius, startAngle, endAngle,segments){
        this.x = x;
        this.y = y;
        this.vy = 1.2;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.segments=segments;
        this.angVel = (Math.PI) / 200;
        this.dir = Math.floor(rand(0, 1));
        this.truth;
        let k;
        if (this.dir === 0) {
            k = 1;
            this.truth = false;
        }
        else {
            k = -1;
            this.endAngle *= k;
            this.truth = true;
        }
    }
   
    draw  () {
        var df = 0;
        parts = new Array();
  
        for (let i = 0; i < this.segments; i++) {
        
            ctx.beginPath();
            ctx.strokeStyle = color[i];
            parts.push(new Part(this.startAngle + df, this.endAngle + df, color[i]));
            ctx.arc(this.x, this.y, this.radius, df + this.startAngle, df +this.endAngle,this.truth );
            ctx.lineWidth = canvas.height / 40;
            ctx.stroke();
           if (this.dir === 0) {
                df +=(2* Math.PI / this.segments);
            }
            else {
               df -=(2* Math.PI / this.segments);
            }

        }
    };
    update () {

        if (this.dir === 0) {
            this.startAngle += this.angVel;
          this.endAngle += this.angVel;
        }
        else {
            this.startAngle -= this.angVel;
            this.endAngle -= this.angVel;
        }
        this.draw();

        if ((canvas.height / 2) - curr > 1.2) {
            this.y += this.vy;
        }
        this.draw();
    };
    collide  () {
        var dist = (ball.y - this.y);
        //bottom half
        if (dist <= (ball.radius + this.radius + canvas.height / 80) && dist >= (this.radius - ball.radius - canvas.height / 80)) {
            if (this.dir === 0)
                endgame((Math.PI/2), ( (Math.PI/2)+(2*Math.PI/this.segments)),0,0);//clockwise
            else
                endgame(( (2*Math.PI/this.segments)-(3*Math.PI/2)),(-3*Math.PI/2),1,0);//anti-clockwise
        }
        dist = (this.y - ball.y);
        //top half
        if (dist <= (ball.radius + this.radius + canvas.height / 80) && dist >= (this.radius - ball.radius - canvas.height / 80)) {
            if (this.dir === 0)
                endgame(((3*Math.PI/2)-(2*Math.PI/this.segments)), (3 * Math.PI / 2),0,1);//clockwise
            else
                endgame((-Math.PI/2), ( (-Math.PI/2)-(2*Math.PI/this.segments)),1,1);//anti-clockwise
        }
    };
}
let ball;
let obs;
let click;
var setup = function () {
    ball = new Ball(canvas.width / 2, (canvas.height / 2 + canvas.height * 0.3), canvas.height * 0.02, "#F5FF25");
    s=0;
    count=-1;
    click = 0;
    score();
    ball.draw();
    pause.addEventListener('click',pauseGame);
    obs=new Array();
   setInterval(function () {
        let seg=Math.floor(rand(2,4));
        obs.push(new Obstacle((canvas.width / 2), (-2 * canvas.height / 5 - (count * (3 * canvas.height / 5))), canvas.height * 0.15, 0, (2*Math.PI/seg),seg));
        count++;
        obs[count].draw();
    }, 120)
    document.addEventListener('click', play);
    document.addEventListener('click', setBallVel);
};
var pauseGame=function(){
    pause.removeEventListener('click', pauseGame);
    clearInterval(loop);
    pause.src="play.svg";
    ctx.fillStyle="rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pause.addEventListener('click',resume);
}
var resume=function()
{
   pause.removeEventListener('click', resume);
   pause.src="pause.svg";
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   pause.addEventListener('click', pauseGame);
   play();
}
var restartGame=function(){
    overlay.style.display="none";
    bestScore.style.display="none";
    restart.parentNode.removeChild(restart);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    clearInterval(blast);
    setup();
}
var score = function () {
    let fontSize =Math.min(canvas.width*0.1,canvas.height*0.1);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    if (localStorage.getItem('high') === null)
        localStorage.setItem(`high`, JSON.stringify(s));
    else if (s > JSON.parse(localStorage.getItem(`high`)))
        localStorage.setItem(`high`, JSON.stringify(s));
    ctx.fillText(s, canvas.width / 10, Math.min(canvas.height*0.1,500));
}
var play = function () {

    document.removeEventListener('click', play);
    loop = setInterval(function () {
        render();
        score();
    }, 10);
}
var setBallVel=function(){
    if (click === 0) {
        ball.vy = 8;
        click++;
    }
    else
        ball.vy = 4.5;
}
var best=function(){
    if (localStorage.getItem('high') === null)
        localStorage.setItem(`high`, JSON.stringify(s));
    else if (s > JSON.parse(localStorage.getItem(`high`)))
        localStorage.setItem(`high`, JSON.stringify(s));
    bestScore.innerHTML=`Score: ${s}<br>Best Score: ${JSON.parse(localStorage.getItem(`high`))}`;
    bestScore.style.display="block";
}
var render = function () {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ball.update();
    for (let i = 0; i < obs.length; i++) {
        obs[i].update();
        obs[i].collide();
        if (ball.y <= obs[i].y && ball.y >= obs[i].y - obs[i].radius) {
            s = i + 1;
        }
    }

}
