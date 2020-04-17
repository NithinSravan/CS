var start;
var box=document.getElementById('container');
var i;
var j;
var k=[0,0,0];
var index;
var count;
var myVar;
var end=0;
var diff;
var  s=0;
var body;
var ms=0;
var t=0;
var best=new Array(3);
for(let i=0;i<3;i++)
{
    best[i]=new Array(3);
}
var sound=new Audio("Repulsor.mp3");
var audio=new Audio("button.wav");
var bs=0;
var bms=0;
var randomnos=[];
var modeSelect;
var toptext=document.getElementById('toptext');
var newgame=document.getElementById('newgame');
var besttime=document.getElementById('best');
var sec=document.getElementById('sec');
var msec=document.getElementById('msec');
var btime=document.getElementsByClassName('btime');
var restart;
var gridblock=document.getElementsByClassName('blocks');
var number=document.getElementsByClassName('numbers');

//setup
var setup=function(){
    i=3;
    j=1;
    randomnos=[];
    sec.innerHTML="0";
    msec.innerHTML="000";
    btime=document.getElementsByClassName('btime');
    toptext.innerHTML="Click Away!!";
    box.style.backgroundColor="transparent";
    box.innerHTML="";
    box.style.border="1px solid #fff";
    const myH1 = document.createElement('h1');
    box.appendChild(myH1);
    myH1.setAttribute("id","countdown");
    start=document.getElementById('countdown');
    start.innerHTML="Click To Start";
    box.addEventListener('click',begin);
};
var display=function(index){ 
    best[index].sort(); 
    let m=k[index];
    for(let i=0;i<m;i++)
    {
        bs=Math.floor(best[index][i]/1000);
        bms=best[index][i]-(Math.floor(best[index][i]/1000)*1000);
        if(Math.floor(bms/10)===0)
        {
            btime[i].innerHTML=bs+'.00'+bms+' s';
        }
        else if(Math.floor(bms/100)===0)
        {
            btime[i].innerHTML=bs+'.0'+bms+' s';
        }
       else
            btime[i].innerHTML=bs+'.'+bms+' s'; 
    }
 
};
var disp=function(index){
    for(let i=0;i<k[index];i++)
    {
        bestrec();
    }
    display(index);
}
var colorPicker=function(i){
    if(i>=0&&i<=4)
    {
        gridblock[i].style.backgroundImage="linear-gradient(#845ec2,#d65db1,#ff6f91)";
    }
    else if(i>=5&&i<=9)
    {
        gridblock[i].style.backgroundImage="linear-gradient(#ff6f91,#ff9671,#ffc75f)";
    }
    else if(i>=10&&i<=14)
    {
        gridblock[i].style.backgroundImage="linear-gradient(#ffc75f,#f9f871)";
    }
    else{
        gridblock[i].style.backgroundImage="linear-gradient(#f9f871,#fff)";
    }
};
//adds best scores to the array in local storage
var bestScore=function(index){
    let f=0;
    if(k[index]===0) {
        best[index][0]=diff;
        bs=Math.floor(diff/1000);
        bms=diff-(Math.floor(diff/1000)*1000);
        if(Math.floor(bms/10)===0)
        {
            btime[0].innerHTML=bs+'.00'+bms+' s';
        }
        else if(Math.floor(bms/100)===0)
        {
            btime[0].innerHTML=bs+'.0'+bms+' s';
        }
       else
            btime[0].innerHTML=bs+'.'+bms+' s'; 
            k[index]++;
        localStorage.setItem("best", JSON.stringify(best));
    }
    else{
            if(best[index].includes(undefined)){
                best[index][k[index]]=diff;
                bestrec();
                localStorage.setItem("best", JSON.stringify(best));
                k[index]++;
                display(index);
            }
         else{
            best[index].sort();
             for(let i=0;i<k[index];i++){
                if(best[index][i]>diff){
                    bs=Math.floor(diff/1000);
                    bms=diff-(Math.floor(diff/1000)*1000);
                    best[index][2]=diff;
                    if(Math.floor(bms/10)===0)
                    {
                        btime[i].innerHTML=bs+'.00'+bms+' s';
                    }
                    else if(Math.floor(bms/100)===0)
                    {
                        btime[i].innerHTML=bs+'.0'+bms+' s';
                    }
                   else
                        btime[i].innerHTML=bs+'.'+bms+' s';
                    best[index].sort();
                    localStorage.setItem("best", JSON.stringify(best));
                    break;
                
                 }
             }
        }
    }
};
//timer function
var timer=function(){
      s=0;
      ms=0;
      var initial=Date.now();
      var current;
      var mseconds=setInterval(function(){
        if(!end){ 
          current=Date.now();
          diff=current-initial;
          s=Math.floor(diff/1000);
          ms=diff-(Math.floor(diff/1000)*1000);
          sec.innerHTML=s;
          if(Math.floor(ms/10)===0){
              msec.innerHTML='00'+ms;
          }
          else if(Math.floor(ms/100)===0) {
              msec.innerHTML='0'+ms;
          }
         else
          msec.innerHTML=ms;
        } 
         else{
             clearInterval(mseconds);
         }
         
    },1);
               
}
//random number generator
var random=function(number){
    return Math.floor(Math.random() * number)+1;
};
//assign random numbers to array
var assign=function(){
    randomnos[0]=random(20);
    var flag=0;
    for(let i=0;;i++) {
        var randomnumber=random(20);
        for(let j=0;j<randomnos.length;j++){
                if(randomnumber===randomnos[j]){
                    flag=1;
                }
          }
        if(flag===0){
            randomnos.push(randomnumber);
            if(randomnos.length===20)
              break;
        }
        else
            flag=0;
    }
};

var modes=function(){
    sec.innerHTML="0";
    msec.innerHTML="000";
    btime=document.getElementsByClassName('btime')
    const myDiv = document.createElement('div');
    box.appendChild(myDiv);
    myDiv.setAttribute('id','gamemodes');
    var modeBox=document.getElementById('gamemodes');
   
    for(let i = 0; i <3; i++){
        const Div = document.createElement('div');
        modeBox.appendChild(Div);
        Div.classList.add("mode");
    }
    modeSelect=document.getElementsByClassName('mode');
    for(let i=0;i<3;i++){
        const modetxt=document.createElement('h4');
        modeSelect[i].appendChild(modetxt);
        modetxt.classList.add('modetext');
    }
     body=document.querySelector('body');
    var modetext=document.getElementsByClassName('modetext');
    for(let i = 0; i <3; i++){
        modeSelect[i].addEventListener('mouseover',function(){
            if(i===0){
                toptext.innerHTML="Click numbers from 1-40";
                body.style.backgroundColor="#77e83f";
                modetext[i].style.color="#77e83f";
                modeSelect[i].style.backgroundColor="#fff";
            }
            if(i===1){
                toptext.innerHTML="Click numbers from 1-60";
                body.style.backgroundColor="#ffa02b";
                modetext[i].style.color="#ffa02b";
                modeSelect[i].style.backgroundColor="#fff";
            }
       
            if(i===2){
                toptext.innerHTML="Click numbers from 1-80";
                body.style.backgroundColor="#ff2f2b";
                modetext[i].style.color="#ff2f2b";
                modeSelect[i].style.backgroundColor="#fff";
            }
               
        });
        modeSelect[i].addEventListener('mouseout',function(){
            body.style.backgroundColor="#343633";
            toptext.innerHTML="Choose Difficulty:";
            if(i===0){
                modetext[i].style.color="#fff";
                modeSelect[i].style.backgroundColor="#77e83f";
            }
            if(i===1){
                modetext[i].style.color="#fff";
                modeSelect[i].style.backgroundColor="#ffa02b";
            }
       
            if(i===2){
                modetext[i].style.color="#fff";
                modeSelect[i].style.backgroundColor="#ff2f2b";
            }
               
        });
        modeSelect[i].addEventListener('click',function(e){
              count=i*20;
            if(i===0){
                body.style.backgroundColor="#77e83f";
                index=i;
                if(k[i]===0)
                    btime[0].innerHTML="0.000 s";
                else
                disp(i);
            }
            if(i===1){
                body.style.backgroundColor="#ffa02b";
                index=i;
                if(k[i]===0)
                btime[0].innerHTML="0.000 s";
            else
            disp(i);
            }
            if(i===2){
                body.style.backgroundColor="#ff2f2b";
                index=i;
                if(k[i]===0)
                btime[0].innerHTML="0.000 s";
            else
            disp(i);
            }
              e.stopPropagation();
              setup();
        });
    }
    for(let i=0;i<3;i++){
        if(i===0){
            modetext[i].innerHTML="Easy";
            modeSelect[i].style.backgroundColor="#77e83f";
        }
        if(i===1){
            modetext[i].innerHTML="Medium";
            modeSelect[i].style.backgroundColor="#ffa02b";
        }
  
        if(i===2){
            modetext[i].innerHTML="Hard";
            modeSelect[i].style.backgroundColor="#ff2f2b";
        }
    }
};
//generated playing blocks with numbers on it
var createDiv=function(){
    
        for(let i = 0; i <20; i++){
           const myDiv = document.createElement('div');
           box.appendChild(myDiv);
           myDiv.classList.add("blocks");
           const divNumber = document.createElement('strong');
           divNumber.classList.add("numbers");
           myDiv.appendChild(divNumber);
           divNumber.innerHTML=randomnos[i];
       }
 
};
//best time record
var bestrec=function(){
        const bestsecs = document.createElement('h3');
        besttime.appendChild(bestsecs);
        bestsecs.classList.add("btime");
};
//game logic: what happens when a block is clicked
var game=function(){
  for(let i=0;i<gridblock.length;i++) {
    gridblock[i].addEventListener('click',function(e) {
        e.stopPropagation();
        if(randomnos[i]===j&&j<=20+count) {
           colorPicker(i);
           audio.play();
           number[i].style.color = "#000000";
           var changenum=20+j;
           randomnos[i]=changenum;
           number[i].innerHTML=changenum;
           j++;
        }
         if(randomnos[i]===j&&j>20+count){
            number[i].innerHTML="";
            audio.play();
            gridblock[i].style.backgroundImage="none";
            gridblock[i].style.backgroundColor = "#000000";
            j++;
         }   
        if(j>40+count){
            end=1;
            //these while loops are used to remove classes
            while(gridblock[0]){
                gridblock[0].classList.remove('blocks');
            }
            while(number[0]) {
                number[0].classList.remove('numbers');
            }
            box.style.backgroundColor="transparent";
            restart = document.createElement('h1');
            box.appendChild(restart);
            restart.setAttribute("id","res");
            restart.innerHTML='Your time is: '+sec.innerHTML+'.'+msec.innerHTML+'s'+'<br>'+' Restart';
            bestScore(index);
            box.addEventListener("click",playagain);
        }      
   });
  }
};

//triggers the actual game
var run=function(){
    timer();
    assign();
    createDiv();
    game();
};
//playgain used for restart
var playagain=function(){
    restart.remove();
    box.removeEventListener('click',playagain);
    setup();
};
//the actual game begins after user clicks and this function is fired
var begin=function(){
    sound.play();
    end=0;

    box.removeEventListener('click',begin);
    if(i===3){   
         myVar=setInterval(function(){ 
            start.style.fontSize="200px"
            start.style.color="#fff";
            start.innerHTML=i;
             i--; 
             if(i<0){
                 clearInterval(myVar);
                 start.remove();
                 box.style.backgroundColor="#fff";
                 run();
             }
            }, 1000);
           
    }
};
modes();
newgame.addEventListener('click',function(){
    end=1;
    box.innerHTML="";
    for(let i=k[index]-1;i>0;i--)
    { 
        btime[i].parentNode.removeChild(btime[i]);
    };
    clearInterval(myVar);
    box.removeEventListener('click',begin);
    btime[0].innerHTML="0.000 s";
    body.style.backgroundColor="rgb(52, 54, 51)";
    box.style.backgroundColor="transparent";
    box.style.border="none";
    modes();
});