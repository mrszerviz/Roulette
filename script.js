const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const center = 250;
const wheelRadius = 220;
const ballRadius = 185;


const wheelNumbers = [
    0,32,15,19,4,21,2,25,17,34,
    6,27,13,36,11,30,8,23,10,
    5,24,16,33,1,20,14,31,
    9,22,18,29,7,28,12,35,3,26
];


const redNumbers = [
    32,19,21,25,34,27,
    36,30,23,5,16,1,
    14,20,31,9,18,7,
    12,3
];


let wheelAngle = 0;
let ballAngle = 0;

let spinning = false;


let money = 1000;

let selectedBet = null;
let selectedNumber = null;



// =========================
// KERÉK RAJZOLÁS
// =========================

function drawWheel(){

    ctx.clearRect(0,0,500,500);


    const slice =
    (Math.PI * 2) / wheelNumbers.length;



    for(let i=0;i<wheelNumbers.length;i++){


        let start =
        wheelAngle + i * slice;


        let end =
        start + slice;


        let number =
        wheelNumbers[i];



        ctx.beginPath();

        ctx.moveTo(center,center);

        ctx.arc(
            center,
            center,
            wheelRadius,
            start,
            end
        );



        if(number === 0){

            ctx.fillStyle="#008000";

        }
        else if(redNumbers.includes(number)){

            ctx.fillStyle="#b00000";

        }
        else{

            ctx.fillStyle="#050505";

        }


        ctx.fill();


        ctx.strokeStyle="gold";

        ctx.stroke();



        // szám felirat

        ctx.save();

        ctx.translate(center,center);

        ctx.rotate(start + slice/2);

        ctx.fillStyle="white";

        ctx.font="18px Arial";

        ctx.fillText(
            number,
            wheelRadius-40,
            5
        );

        ctx.restore();


    }



    // közép

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        65,
        0,
        Math.PI*2
    );


    ctx.fillStyle="#ddd";

    ctx.fill();



    ctx.fillStyle="black";

    ctx.font="35px Arial";

    ctx.textAlign="center";


    ctx.fillText(
        "🎰",
        center,
        center+12
    );



    // GOLYÓ

    let bx =
    center +
    Math.cos(ballAngle) *
    ballRadius;


    let by =
    center +
    Math.sin(ballAngle) *
    ballRadius;



    ctx.beginPath();

    ctx.arc(
        bx,
        by,
        11,
        0,
        Math.PI*2
    );


    ctx.fillStyle="white";

    ctx.shadowColor="black";

    ctx.shadowBlur=12;

    ctx.fill();

    ctx.shadowBlur=0;

}


drawWheel();




// =========================
// SZÁMGOMBOK
// =========================

const numbersBox =
document.getElementById("numbers");


for(let i=0;i<=36;i++){


    let button =
    document.createElement("button");


    button.innerHTML=i;



    button.onclick=function(){


        selectedNumber=i;

        selectedBet=null;


        clearActive();


        button.classList.add("active");


        document.getElementById("selectedBet")
        .innerHTML =
        "Szám: " + i;

    };


    numbersBox.appendChild(button);

}





// =========================
// KÜLSŐ FOGADÁS
// =========================


function setBet(type, button){


    selectedBet = type;

    selectedNumber = null;


    clearActive();


    button.classList.add("active");



    document.getElementById("selectedBet")
    .innerHTML =
    type;


}



function clearActive(){

    document.querySelectorAll("button")
    .forEach(btn=>{

        btn.classList.remove("active");

    });

}





// =========================
// TÉT
// =========================

function getBetAmount(){

    return Number(
        document.getElementById("betAmount").value
    );

}





// =========================
// PÖRGETÉS
// =========================

function spin(){


    if(spinning)
    return;



    if(
        selectedBet===null &&
        selectedNumber===null
    ){

        alert("Válassz fogadást!");

        return;

    }



    let amount =
    getBetAmount();



    if(money < amount){

        alert("Nincs elég pénz!");

        return;

    }



    money -= amount;



    spinning=true;



    const winnerIndex =
    Math.floor(
        Math.random()*wheelNumbers.length
    );



    const slice =
    (Math.PI*2) /
    wheelNumbers.length;



    // A nyertes mező a mutatóhoz kerül

    let wheelTarget =
    Math.PI*1.5
    -
    (winnerIndex * slice)
    -
    (slice/2);



    let ballTarget =
    wheelTarget;



    let startWheel =
    wheelAngle;


    let startBall =
    ballAngle;



    let progress=0;



    function animate(){


        progress +=0.012;



        if(progress>1)
        progress=1;



        let ease =
        1-Math.pow(1-progress,4);



        wheelAngle =
        startWheel +
        (
            wheelTarget +
            Math.PI*16 -
            startWheel
        )
        *
        ease;



        ballAngle =
        startBall +
        (
            ballTarget -
            startBall -
            Math.PI*12
        )
        *
        ease;



        drawWheel();



        if(progress<1){

            requestAnimationFrame(
                animate
            );

        }
        else{


            wheelAngle =
            wheelTarget;


            ballAngle =
            ballTarget;


            drawWheel();



            finish(
                wheelNumbers[winnerIndex],
                amount
            );


        }

    }


    requestAnimationFrame(
        animate
    );


}





// =========================
// EREDMÉNY
// =========================


function finish(number, amount){


    spinning=false;


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



    let win=false;

    let multiplier=0;



    if(selectedNumber===number){

        win=true;

        multiplier=35;

    }



    if(selectedBet==="red" && color==="red"){

        win=true;

        multiplier=1;

    }



    if(selectedBet==="black" && color==="black"){

        win=true;

        multiplier=1;

    }



    if(
        selectedBet==="even" &&
        number!==0 &&
        number%2===0
    ){

        win=true;

        multiplier=1;

    }



    if(
        selectedBet==="odd" &&
        number!==0 &&
        number%2!==0
    ){

        win=true;

        multiplier=1;

    }





    if(win){


        let prize =
        amount * (multiplier+1);


        money += prize;


        document.getElementById("message")
        .innerHTML =
        "🎉 Nyertél! "
        + number +
        " +" +
        prize +
        " Ft";


    }
    else{


        document.getElementById("message")
        .innerHTML =
        "❌ Vesztettél! "
        + number +
        " ("+
        color+
        ")";


    }



    document.getElementById("money")
    .innerHTML =
    money;


}
