const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");


const center = 250;
const radius = 220;


// Európai rulett sorrend

const wheelNumbers = [
0,32,15,19,4,21,2,25,17,34,
6,27,13,36,11,30,8,23,10,
5,24,16,33,1,20,14,31,
9,22,18,29,7,28,12,35,3,26
];



const redNumbers=[
32,19,21,25,34,27,
36,30,23,5,16,1,
14,20,31,9,18,7,
12,3
];



let angle=0;

let ballAngle=0;

let spinning=false;



let money = 1000;


let selectedBet=null;

let selectedNumber=null;


let games=0;
let wins=0;
let losses=0;



// ----------------------
// Kerék rajzolása
// ----------------------


function drawWheel(){


ctx.clearRect(
0,
0,
500,
500
);



let slice =
(Math.PI*2)/wheelNumbers.length;



for(let i=0;i<wheelNumbers.length;i++){


let start =
angle+i*slice;


let end =
start+slice;



let number =
wheelNumbers[i];



ctx.beginPath();


ctx.moveTo(center,center);


ctx.arc(
center,
center,
radius,
start,
end
);


ctx.fillStyle =
number===0
?
"#008000"
:
redNumbers.includes(number)
?
"#b00000"
:
"#050505";


ctx.fill();



ctx.strokeStyle="#d4af37";

ctx.stroke();




// számok


ctx.save();


ctx.translate(center,center);


ctx.rotate(
start+slice/2
);


ctx.fillStyle="white";

ctx.font="18px Arial";


ctx.fillText(
number,
radius-35,
5
);


ctx.restore();


}



// közép


ctx.beginPath();

ctx.arc(
center,
center,
70,
0,
Math.PI*2
);


ctx.fillStyle="#ddd";

ctx.fill();


ctx.fillStyle="black";

ctx.font="45px Arial";


ctx.textAlign="center";

ctx.fillText(
"0",
center,
center+15
);



// golyó

let bx =
center+
Math.cos(ballAngle)
*190;


let by =
center+
Math.sin(ballAngle)
*190;



ctx.beginPath();

ctx.arc(
bx,
by,
12,
0,
Math.PI*2
);


ctx.fillStyle="white";

ctx.fill();


}



drawWheel();



// ----------------------
// Számgombok
// ----------------------


const numbers =
document.getElementById("numbers");


for(let i=0;i<=36;i++){


let b =
document.createElement("button");


b.innerHTML=i;


b.onclick=function(){

selectedNumber=i;

selectedBet=null;

updateSelected(
"Szám: "+i
);


};


numbers.appendChild(b);

}



// ----------------------
// Külső fogadások
// ----------------------


function colorBet(type){


selectedBet=type;

selectedNumber=null;


updateSelected(type);


}



function updateSelected(text){


document.getElementById(
"selectedBet"
)
.innerHTML=text;


}



// ----------------------
// Pörgetés
// ----------------------


function spin(){


if(spinning)
return;



if(
!selectedBet &&
selectedNumber===null
){

alert(
"Válassz fogadást!"
);

return;

}



let betAmount =
Number(
document.getElementById(
"betAmount"
).value
);



if(money<betAmount){

alert(
"Nincs elég pénz!"
);

return;

}



money-=betAmount;


games++;


spinning=true;



let winnerIndex =
Math.floor(
Math.random()
*
wheelNumbers.length
);




let targetAngle =
(
Math.PI*2
*
winnerIndex
/
wheelNumbers.length
);



let startAngle=angle;


let totalRotation =
Math.PI*2*8
+
targetAngle;



let start =
performance.now();



function animate(time){



let progress =
(time-start)/5000;



if(progress>1)
progress=1;



let ease =
1-Math.pow(
1-progress,
4
);



angle =
startAngle+
totalRotation*
ease;



ballAngle =
angle*1.3
+
progress*20;



drawWheel();



if(progress<1){

requestAnimationFrame(
animate
);

}

else{


finishSpin(
wheelNumbers[winnerIndex],
betAmount
);


}


}



requestAnimationFrame(
animate
);



}



// ----------------------
// Eredmény
// ----------------------


function finishSpin(number,amount){


spinning=false;



let win=false;


let multiplier=0;



let color =
number===0
?
"green"
:
redNumbers.includes(number)
?
"red"
:
"black";





if(selectedNumber!==null){

if(number===selectedNumber){

win=true;

multiplier=35;

}

}



if(selectedBet==="red"
&& color==="red"){

win=true;

multiplier=1;

}



if(selectedBet==="black"
&& color==="black"){

win=true;

multiplier=1;

}



if(selectedBet==="even"
&& number!==0
&& number%2===0){

win=true;

multiplier=1;

}



if(selectedBet==="odd"
&& number!==0
&& number%2!==0){

win=true;

multiplier=1;

}



if(win){


let prize =
amount*(multiplier+1);


money+=prize;


wins++;


document.getElementById(
"message"
)
.innerHTML=
"🎉 Nyertél! "+
number+
" +"+
prize+
" Ft";


}

else{


losses++;


document.getElementById(
"message"
)
.innerHTML=
"❌ Vesztettél! "+
number+
" ("+
color+
")";


}



updateStats();


}



function updateStats(){


document.getElementById(
"money"
)
.innerHTML=money;


document.getElementById(
"games"
)
.innerHTML=games;


document.getElementById(
"wins"
)
.innerHTML=wins;


document.getElementById(
"losses"
)
.innerHTML=losses;


}
