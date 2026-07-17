let money = 1000;

let bet = null;

let numberBet = null;

let games=0;
let wins=0;
let losses=0;

let totalBet=0;
let totalWin=0;



const reds=[
1,3,5,7,9,12,
14,16,18,19,
21,23,25,27,
30,32,34,36
];



function createNumbers(){

let box=document.getElementById("numbers");


for(let i=0;i<=36;i++){

let b=document.createElement("button");

b.innerHTML=i;

b.onclick=()=>{

numberBet=i;

bet=null;

document.getElementById("message").innerHTML=
"Szám fogadás: "+i;

}

box.appendChild(b);

}

}


createNumbers();



function setBet(type){

bet=type;

numberBet=null;

document.getElementById("message").innerHTML=
"Fogadás: "+type;

}




function getColor(num){

if(num===0)
return "green";

if(reds.includes(num))
return "red";

return "black";

}




function spin(){


let amount=
Number(
document.getElementById("betAmount").value
);



if(!bet && numberBet===null){

alert("Válassz fogadást!");

return;

}



if(money<amount){

alert("Nincs elég pénz!");

return;

}



money-=amount;

totalBet+=amount;

games++;



let wheel=document.getElementById("wheel");


let rotation=
Math.floor(Math.random()*3600)+720;


wheel.style.transform=
`rotate(${rotation}deg)`;



let number=
Math.floor(Math.random()*37);



setTimeout(()=>{


document.getElementById("resultNumber")
.innerHTML=number;



let color=getColor(number);


let win=false;

let multiplier=0;



if(numberBet!==null){

if(number===numberBet){

win=true;

multiplier=35;

}

}



if(bet==="red" && color==="red"){

win=true;
multiplier=1;

}



if(bet==="black" && color==="black"){

win=true;
multiplier=1;

}



if(bet==="even" &&
number!==0 &&
number%2===0){

win=true;
multiplier=1;

}



if(bet==="odd" &&
number!==0 &&
number%2!==0){

win=true;
multiplier=1;

}



if(win){

let prize=
amount*(multiplier+1);


money+=prize;

totalWin+=prize;

wins++;


document.getElementById("message")
.innerHTML=
"🎉 NYERTÉL! +" + prize+" Ft";


}

else{

losses++;

document.getElementById("message")
.innerHTML=
"❌ Vesztettél ("+
number+" "+color+")";


}



update();


},4000);



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



let rtp=0;


if(totalBet>0){

rtp=
(totalWin/totalBet)*100;

}


document.getElementById("rtp")
.innerHTML=
rtp.toFixed(2);


}
