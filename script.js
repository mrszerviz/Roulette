let money = 1000;

let bet = null;

let selectedNumber = null;


let games=0;
let wins=0;
let losses=0;

let totalBet=0;
let totalReturn=0;



const redNumbers=[

1,3,5,7,9,
12,14,16,18,
19,21,23,25,
27,30,32,34,36

];



function chooseNumber(number){

selectedNumber=number;

bet=null;


document.getElementById("message")
.innerHTML=
"Szám: "+number;

}



function setBet(type){

bet=type;

selectedNumber=null;


document.getElementById("message")
.innerHTML=
"Fogadás: "+type;

}



function color(number){

if(number===0)
return "green";


if(redNumbers.includes(number))
return "red";


return "black";

}




function spin(){


let amount=

Number(
document.getElementById("amount").value
);



if(!bet && selectedNumber===null){

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



let wheel=

document.getElementById("wheel");



let rotate=

Math.floor(Math.random()*7200)+1440;



wheel.style.transform=

`rotate(${rotate}deg)`;




let number=

Math.floor(Math.random()*37);



setTimeout(()=>{


document.getElementById("resultNumber")
.innerHTML=number;



let win=false;

let multiplier=0;



let c=color(number);



if(selectedNumber!==null){

if(number===selectedNumber){

win=true;

multiplier=35;

}

}



if(bet==="red" && c==="red"){

win=true;

multiplier=1;

}



if(bet==="black" && c==="black"){

win=true;

multiplier=1;

}



if(bet==="even" && number!==0 && number%2===0){

win=true;

multiplier=1;

}



if(bet==="odd" && number!==0 && number%2!==0){

win=true;

multiplier=1;

}



if(win){


let prize=

amount*(multiplier+1);


money+=prize;

totalReturn+=prize;

wins++;


document.getElementById("message")
.innerHTML=

"🎉 NYERTÉL! "+
number+
" +"+
prize+
" Ft";


}

else{


losses++;


document.getElementById("message")
.innerHTML=

"❌ Vesztettél! "+
number+
" ("+
c+
")";


}



update();


},5000);


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

(totalReturn/totalBet)*100;

}


document.getElementById("rtp")
.innerHTML=

rtp.toFixed(2);


}
