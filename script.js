const canvas=document.getElementById("wheel");
const ctx=canvas.getContext("2d");


const center=250;
const radius=220;


const numbers=[

0,32,15,19,4,21,2,25,
17,34,6,27,13,36,
11,30,8,23,10,5,
24,16,33,1,20,14,
31,9,22,18,29,7,
28,12,35,3,26

];


const reds=[

32,19,21,25,34,
27,36,30,23,5,
16,1,14,20,31,
9,18,7,12,3

];


let rotation=0;

let spinning=false;


let money=1000;


let bet=null;

let numberBet=null;



function drawWheel(){


ctx.clearRect(0,0,500,500);


let slice=
Math.PI*2/numbers.length;



for(let i=0;i<numbers.length;i++){


let start=
rotation+i*slice;


let end=start+slice;


let n=numbers[i];


ctx.beginPath();

ctx.moveTo(center,center);


ctx.arc(
center,
center,
radius,
start,
end
);



if(n===0)

ctx.fillStyle="#009900";

else if(reds.includes(n))

ctx.fillStyle="#b00000";

else

ctx.fillStyle="#050505";


ctx.fill();


ctx.strokeStyle="gold";

ctx.stroke();



ctx.save();


ctx.translate(center,center);

ctx.rotate(start+slice/2);


ctx.fillStyle="white";

ctx.font="18px Arial";


ctx.fillText(
n,
radius-35,
5
);


ctx.restore();


}



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
"🎰",
center,
center+15
);


}



drawWheel();




// szám gombok

const box=document.getElementById("numbers");


for(let i=0;i<=36;i++){


let b=document.createElement("button");


b.innerHTML=i;


b.onclick=function(){

numberBet=i;

bet=null;

clearActive();

b.classList.add("active");


document.getElementById("selectedBet")
.innerHTML="Szám: "+i;


};


box.appendChild(b);

}





function setBet(type){


bet=type;

numberBet=null;


clearActive();


document.getElementById("selectedBet")
.innerHTML=type;


}





function clearActive(){

document.querySelectorAll("button")
.forEach(b=>{

b.classList.remove("active");

});

}




function spin(){


if(spinning)return;


if(!bet && numberBet===null){

alert("Válassz fogadást!");

return;

}



let amount=
Number(
document.getElementById("betAmount").value
);



if(money<amount){

alert("Nincs elég pénz!");

return;

}


money-=amount;


spinning=true;



let winnerIndex=
Math.floor(
Math.random()*numbers.length
);



let slice=
Math.PI*2/numbers.length;



let target=

-(winnerIndex*slice)
-
(slice/2)
+
Math.PI*1.5;



let start=rotation;


let end=
target+
Math.PI*2*8;



let startTime=null;



function animate(t){


if(!startTime)
startTime=t;



let p=
(t-startTime)/5000;


if(p>1)p=1;



let ease=
1-Math.pow(1-p,4);



rotation=
start+
(end-start)*ease;



drawWheel();



if(p<1)

requestAnimationFrame(animate);


else{


finish(
numbers[winnerIndex],
amount
);


}



}



requestAnimationFrame(animate);



}




function finish(result,amount){


spinning=false;


let win=false;

let multiplier=0;



let color=
result===0?
"green":
reds.includes(result)?
"red":
"black";



if(numberBet===result){

win=true;

multiplier=35;

}



if(bet==="red"&&color==="red"){

win=true;

multiplier=1;

}


if(bet==="black"&&color==="black"){

win=true;

multiplier=1;

}


if(bet==="even"&&result!==0&&result%2===0){

win=true;

multiplier=1;

}


if(bet==="odd"&&result!==0&&result%2!==0){

win=true;

multiplier=1;

}



if(win){

let prize=
amount*(multiplier+1);


money+=prize;


document.getElementById("message")
.innerHTML=
"🎉 NYERTÉL! "+result+
" +"+prize+" Ft";


}

else{


document.getElementById("message")
.innerHTML=
"❌ Veszítettél! "+result+
" ("+color+")";


}



document.getElementById("money")
.innerHTML=money;


}
