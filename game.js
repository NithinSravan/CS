let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let count = 0;
let loop;

window.onload = window.onresize = function () {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup();

}
let color = ["yellow", "#B625FF", "#FF2560", "#FF8125"];
let truth = [false, true];
let curr;
var rand=function(min,max){
    return(Math.random()*(max-min)+min);
  }
function Ball(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = color;
        ctx.fill();
    };
    this.update = function () {
        this.y -= this.vy;
        curr = this.y;
        this.vy -= 0.25;
        this.draw();
    };
}
function Particle(x,y,vx,vy,radius,color){
    this.x=x;
    this.y=y;
    this.vx=vx;
    this.vy=vy;
    this.radius=radius;
    this.draw=function(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,true);
      ctx.fillStyle=color;
      ctx.fill();
    };
    this.update=function(){
        if(this.x+this.radius>innerWidth||this.x-this.radius<0)
        {
          this.vx=-this.vx;
        }
        if(this.y+this.radius>innerHeight||this.y-this.radius<0)
        {
          this.vy=-this.vy;
        }
        this.x+=this.vx;
        this.y+=this.vy;
        this.draw();
      };
}
function Part(start, end, color) {
    this.start = start;
    this.end = end;
    this.color = color;
}
var parts;
var particles;
function Obstacle(x, y, radius, startAngle, endAngle) {
    this.x = x;
    this.y = y;
    this.vy = 1.2;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.angVel = (Math.PI) / 200;
    this.dir = Math.floor(Math.random() * 2);

    this.draw = function () {
        var df = 0;
        parts = new Array();

        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.strokeStyle = color[i];
            parts.push(new Part(this.startAngle + df, this.endAngle + df, color[i]));
            ctx.arc(this.x, this.y, this.radius, df + this.startAngle, df + this.endAngle, false);
            ctx.lineWidth = canvas.height / 40;
            ctx.stroke();
            df += Math.PI / 2;
        }
    };
    this.update = function () {

        //if(this.dir===0)
        {
            this.startAngle += this.angVel;
            this.endAngle += this.angVel;
        }
        /* else
          {
              this.startAngle-=this.angVel;
              this.endAngle-=this.angVel;
          }
      */

        if ((canvas.height / 2) - curr > 5) {
            this.y += this.vy;
        }
        this.draw();
    };
    this.collide = function () {
        var dist = (ball.y - this.y);
        if (dist <= (ball.radius + this.radius + canvas.height / 80) && dist >=(this.radius - ball.radius - canvas.height / 80))
         {
            for (let j = 0; j < 4; j++) {
                if ((parts[j].start % (Math.PI * 2) > 0) && (parts[j].start % (Math.PI * 2)) < (Math.PI / 2) && (parts[j].color !== ball.color)) 
                {

                    clearInterval(loop);
                  
                    ctx.clearRect(0, 0, innerWidth, innerHeight);
                    particles=new Array();
                    for (let i = 0; i < 20; i++) {
                        var r= rand(3, 5);
                        var x = ball.x;
                        var y = ball.y;
                        var dx = rand(-15, 15);
                        var dy = rand(-15, 15);
                        var colors = color[Math.floor(rand(0, 4))];
                        particles.push(new Particle(x, y, dx, dy, r, colors));
                    }
                    setInterval(function () {
                        ctx.clearRect(0, 0, innerWidth, innerHeight);
                        for (let i = 0; i < obs.length; i++) {
                            obs[i].draw();
                         }
                        for(let i=0;i<particles.length;i++)
                        {
                          particles[i].update();
                        }
                    }, 10);
                    f = 1;
                    console.log("Game Over");

                }
            }
        }
        var dist = (this.y - ball.y);
     if(dist <= (ball.radius + this.radius + canvas.height / 80) &&dist >=(this.radius - ball.radius - canvas.height / 80))
        {
            for (let j = 0; j < 4; j++) {
                if ((parts[j].start % (Math.PI * 2) > (Math.PI)) && (parts[j].start % (Math.PI * 2)) < (3*Math.PI / 2) && (parts[j].color !== ball.color)) 
                {

                    clearInterval(loop);
                    ctx.clearRect(0, 0, innerWidth, innerHeight);
                 
                    particles=new Array();
                    for (let i = 0; i < 20; i++) {
                        var r= rand(3, 5);
                        var x = ball.x;
                        var y = ball.y;
                        var dx = rand(-15, 15);
                        var dy = rand(-15, 15);
                        var colors = color[Math.floor(rand(0, 4))];
                        particles.push(new Particle(x, y, dx, dy, r, colors));
                    }
                     setInterval(function () {
                        ctx.clearRect(0, 0, innerWidth, innerHeight);
                        for (let i = 0; i < obs.length; i++) {
                            obs[i].draw();
                         }
                        for(let i=0;i<particles.length;i++)
                        {
                          particles[i].update();
                        }
                    }, 10);
                    f = 1;
                    console.log("Game Over");

                }
            }
        }
    };

}
let ball;

let obs = [];
let click;

var setup = function () {

    ball = new Ball(canvas.width / 2, (canvas.height / 2 + canvas.height * 0.3), canvas.height * 0.02, "yellow");
    obs.push(new Obstacle((canvas.width / 2), (canvas.height / 6), canvas.height * 0.15, 0, (Math.PI / 2)));
    ball.draw();
    obs[0].draw();
    setInterval(function () {

        obs.push(new Obstacle((canvas.width / 2), (-canvas.height / 3 - (count * (canvas.height / 2))), canvas.height * 0.15, 0, (Math.PI / 2)));
        count++;
    }, 12)
    click = 0;
    document.addEventListener('click', play);
    document.addEventListener('click', function () {
        if (click === 0) {
            ball.vy = 10;
            click++;
        }
        else
            ball.vy = 5;
    });
};

function play() {

    document.removeEventListener('click', play);
    loop = setInterval(function () {
        render();
    }, 10);
}

var render = function () {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ball.update();
    for (let i = 0; i < obs.length; i++) {
        obs[i].update();
        obs[i].collide();
    }
}
