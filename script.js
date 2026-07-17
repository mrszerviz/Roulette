let money = 1000;
let bet = null;
let amount = 100;

const redNumbers = [
    1,3,5,7,9,12,14,16,18,
    19,21,23,25,27,30,32,34,36
];

function placeBet(type){
    bet = type;
    document.getElementById("result").innerHTML =
        "Tét: " + type;
}


function spin(){

    if(!bet){
        alert("Válassz először tétet!");
        return;
    }

    if(money < amount){
        alert("Nincs elég pénzed!");
        return;
    }


    let number = Math.floor(Math.random()*37);

    let color;

    if(number === 0){
        color="green";
    }
    else if(redNumbers.includes(number)){
        color="red";
    }
    else{
        color="black";
    }


    document.getElementById("number").innerHTML = number;


    let win=false;


    if(bet==="red" && color==="red")
        win=true;

    if(bet==="black" && color==="black")
        win=true;

    if(bet==="even" && number!==0 && number%2===0)
        win=true;

    if(bet==="odd" && number!==0 && number%2!==0)
        win=true;



    if(win){
        money += amount;
        document.getElementById("result").innerHTML =
            "🎉 Nyertél! " + color;
    }
    else{
        money -= amount;
        document.getElementById("result").innerHTML =
            "❌ Vesztettél! " + color;
    }


    document.getElementById("money").innerHTML = money;
}