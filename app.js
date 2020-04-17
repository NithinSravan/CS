var start;
var box=document.getElementById('container');
var i;
var j;
var k=0;
var end=0;
var diff;
var  s=0;
var ms=0;
var t=0;
var best=new Array(5);
var sound=new Audio("Repulsor.mp3");
var audio=new Audio("button.wav");
var bs=0;
var bms=0;
var randomnos=[];
var newgame=document.getElementById('newgame');
var besttime=document.getElementById('best');
var btime=document.getElementsByClassName('btime');
var sec=document.getElementById('sec');
var msec=document.getElementById('msec');
var restart;
var gridblock=document.getElementsByClassName('blocks');
var number=document.getElementsByClassName('numbers');

//setup
var setup=function(){
    i=3;
    j=1;
    sec.innerHTML="0";
    msec.innerHTML="000";
    randomnos=[];
    box.style.backgroundColor="transparent";
    box.innerHTML="";
    const myH1 = document.createElement('h1');
    box.appendChild(myH1);
    myH1.setAttribute("id","countdown");
    start=document.getElementById('countdown');
    start.innerHTML="Click To Start";
    box.addEventListener('click',begin);
};
var display=function(k){
    best.sort();  
    for(let i=0;i<=k;i++)
    {
        bs=Math.floor(best[i]/1000);
        bms=best[i]-(Math.floor(best[i]/1000)*1000);
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
var bestScore=function(){
    let f=0;
    if(k===0) {
        best[0]=diff;
        k++;
        bs=Math.floor(diff/1000);
        bms=diff-(Math.floor(diff/1000)*1000);
        if(Math.floor(bms/10)===0){
            btime[0].innerHTML=bs+'.00'+bms+' s';
        }
        else if(Math.floor(ms/100)===0){
            btime[0].innerHTML=bs+'.0'+bms+' s';
        }
       else
       btime[0].innerHTML=bs+'.'+bms+' s';
        localStorage.setItem("best", JSON.stringify(best));
    }
    else{
            if(best.includes(undefined)){
                bs=Math.floor(diff/1000);
                bms=diff-(Math.floor(diff/1000)*1000);
                best[k]=diff;
                bestrec(); 
                display(k);
                localStorage.setItem("best", JSON.stringify(best));
                k++;
            }
         else{
            best.sort();
             for(let i=0;i<k;i++){
                if(best[i]>diff){
                    bs=Math.floor(diff/1000);
                    bms=diff-(Math.floor(diff/1000)*1000);
                    best[4]=diff;
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
                    best.sort();
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
}
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
}
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
}
//game logic: what happens when a block is clicked
var game=function(){
  for(let i=0;i<gridblock.length;i++) {
    gridblock[i].addEventListener('click',function(e) {
        e.stopPropagation();
        if(randomnos[i]===j&&j<=20) {
           colorPicker(i);
           audio.play();
           number[i].style.color = "#000000";
           var changenum=20+j;
           randomnos[i]=changenum;
           number[i].innerHTML=changenum;
           j++;
        }
         if(randomnos[i]===j&&j>20){
            number[i].innerHTML="";
            audio.play();
            gridblock[i].style.backgroundImage="none";
            gridblock[i].style.backgroundColor = "#000000";
            
            j++;
         }   
        if(j>40){
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
            bestScore();
            box.addEventListener("click",playagain);
        }      
   });
  }
}
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
}
//the actual game begins after user clicks and this function is fired
var begin=function(){
    sound.play();
    end=0;
    box.removeEventListener('click',begin);
    if(i===3){   
        var myVar=setInterval(function(){ 
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
setup();
newgame.addEventListener('click',function(){
    end=1;
    setup();
});