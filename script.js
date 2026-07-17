let money = 1000;


let currentAmount = 100;


let bet = null;

let selectedNumber = null;


let games = 0;

let wins = 0;

let losses = 0;


let totalBet = 0;

let totalReturn = 0;



const redNumbers = [

1,3,5,7,9,
12,14,16,18,
19,21,23,25,
27,30,32,34,36

];




// számgombok létrehozása

const numbers =
document.getElementById("numbers");


for(let i=1;i<=36;i++){


let button =
document.createElement("button");


button.innerHTML=i;


button.onclick=function(){

chooseNumber(i);

};


numbers.appendChild(button);


}




function changeAmount(){


currentAmount =
Number(
document.getElementById("amount").value
);


document.getElementById("currentAmount")
.innerHTML=currentAmount;


}





function chooseNumber(number){


selectedNumber=number;

bet=null;


clearButtons();


event.target.classList.add("active");



document.getElementById("message")
.innerHTML=
"Szám fogadás: "
+number+
" | Tét: "
+currentAmount+
" Ft";


}




function setBet(type,button){


bet=type;

selectedNumber=null;


clearButtons();


button.classList.add("active");



document.getElementById("message")
.innerHTML=
"Fogadás: "
+type+
" | Tét: "
+currentAmount+
" Ft";


}





function clearButtons(){


document.querySelectorAll("button")
.forEach(btn=>{

btn.classList.remove("active");

});


}





function getColor(number){


if(number===0)

return "green";


if(redNumbers.includes(number))

return "red";


return "black";


}





function spin(){



if(!bet && selectedNumber===null){

alert("Válassz fogadást!");

return;

}



if(money<currentAmount){

alert("Nincs elég pénz!");

return;

}




money-=currentAmount;

totalBet+=currentAmount;

games++;



let wheel =
document.getElementById("wheel");



let rotation =
Math.floor(Math.random()*7200)+1440;


wheel.style.transform =
`rotate(${rotation}deg)`;



let result =
Math.floor(Math.random()*37);



setTimeout(function(){



document.getElementById("resultNumber")
.innerHTML=result;



let win=false;

let multiplier=0;



let color =
getColor(result);





if(selectedNumber!==null){

if(result===selectedNumber){

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



if(bet==="even" && result!==0 && result%2===0){

win=true;

multiplier=1;

}



if(bet==="odd" && result!==0 && result%2!==0){

win=true;

multiplier=1;

}





if(win){


let prize =
currentAmount*(multiplier+1);


money+=prize;


totalReturn+=prize;


wins++;


document.getElementById("message")
.innerHTML=
"🎉 NYERTÉL! +"
+prize+
" Ft";


}

else{


losses++;


document.getElementById("message")
.innerHTML=
"❌ Vesztettél! "
+result+
" ("+color+")";


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

rtp =
(totalReturn/totalBet)*100;

}


document.getElementById("rtp")
.innerHTML=
rtp.toFixed(2);


}
