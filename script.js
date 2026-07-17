const canvas =
document.getElementById("wheel");


const ctx =
canvas.getContext("2d");



const center=250;

const radius=220;



const wheelNumbers=[

0,32,15,19,4,21,2,25,
17,34,6,27,13,36,
11,30,8,23,10,5,
24,16,33,1,20,14,
31,9,22,18,29,7,
28,12,35,3,26

];



const redNumbers=[

32,19,21,25,34,27,
36,30,23,5,16,1,
14,20,31,9,18,7,
12,3

];



let angle=0;

let spinning=false;



let money=1000;


let selectedBet=null;

let selectedNumber=null;



let games=0;

let wins=0;

let losses=0;





// tét kijelzés

document
.getElementById("betAmount")
.addEventListener("change",function(){

document
.getElementById("showBet")
.innerHTML=this.value;

});





function drawWheel(){


ctx.clearRect(
0,
0,
500,
500
);


let slice=
Math.PI*2/
wheelNumbers.length;



for(let i=0;i<wheelNumbers.length;i++){


let start=
angle+i*slice;


let end=
start+slice;



let num=
wheelNumbers[i];


ctx.beginPath();


ctx.moveTo(
center,
center
);


ctx.arc(
center,
center,
radius,
start,
end
);



if(num===0)

ctx.fillStyle="#009900";


else if(redNumbers.includes(num))

ctx.fillStyle="#b00000";


else

ctx.fillStyle="#111";



ctx.fill();



ctx.strokeStyle="gold";

ctx.stroke();




ctx.save();


ctx.translate(
center,
center
);


ctx.rotate(
start+slice/2
);


ctx.fillStyle="white";

ctx.font="18px Arial";


ctx.fillText(
num,
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
60,
0,
Math.PI*2
);


ctx.fillStyle="white";

ctx.fill();



ctx.fillStyle="black";

ctx.font="40px Arial";

ctx.textAlign="center";


ctx.fillText(
"0",
center,
center+15
);



}



drawWheel();




// szám gombok


const box=
document.getElementById("numbers");



for(let i=0;i<=36;i++){


let b=
document.createElement("button");


b.innerHTML=i;


b.onclick=function(){

selectedNumber=i;

selectedBet=null;


clearActive();


b.classList.add("active");


document.getElementById("selectedBet")
.innerHTML=
"Szám "+i;


};



box.appendChild(b);

}





function colorBet(type){


selectedBet=type;

selectedNumber=null;


clearActive();



document.getElementById("selectedBet")
.innerHTML=type;


}





function clearActive(){

document
.querySelectorAll("button")
.forEach(b=>{

b.classList.remove("active");

});

}





function getAmount(){


return Number(

document
.getElementById("betAmount")
.value

);

}




function spin(){



if(!selectedBet && selectedNumber===null){

alert("Válassz fogadást!");

return;

}



let amount=getAmount();



if(money<amount){

alert("Nincs elég pénz!");

return;

}



money-=amount;

games++;



let winner=

Math.floor(
Math.random()*
wheelNumbers.length
);



let rotations=
Math.PI*2*8;



let target=

winner*
(
Math.PI*2/
wheelNumbers.length
);



let start=angle;


let end=
angle+
rotations+
target;



let startTime=null;



function animate(time){


if(!startTime)
startTime=time;


let progress=
(time-startTime)/5000;


if(progress>1)
progress=1;


let ease=
1-Math.pow(
1-progress,
4
);



angle=
start+
(end-start)*ease;



drawWheel();



if(progress<1)

requestAnimationFrame(
animate
);


else

finish(
wheelNumbers[winner],
amount
);


}



requestAnimationFrame(
animate
);


}





function finish(number,amount){


let win=false;

let multi=0;


let color=
number===0
?
"green"
:
redNumbers.includes(number)
?
"red"
:
"black";



if(selectedNumber===number){

win=true;

multi=35;

}



if(selectedBet==="red" && color==="red"){

win=true;

multi=1;

}


if(selectedBet==="black" && color==="black"){

win=true;

multi=1;

}


if(selectedBet==="even" && number!==0 && number%2===0){

win=true;

multi=1;

}


if(selectedBet==="odd" && number!==0 && number%2!==0){

win=true;

multi=1;

}





if(win){


let prize=
amount*(multi+1);


money+=prize;


wins++;


document.getElementById("message")
.innerHTML=
"🎉 Nyertél! +"+prize+" Ft";


}

else{


losses++;


document.getElementById("message")
.innerHTML=
"❌ Vesztettél! "+number;


}



update();


}




function update(){


document.getElementById("money")
.innerHTML=money;


document.getElementById("games")
.innerHTML=games;


document.getElementById("wins")
.innerHTML=wins;


document.getElementById("losses")
.innerHTML=losses;


}
