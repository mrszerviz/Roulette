// Európai rulett kerék számainak sorrendje
const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Játék állapot
let balance = 10000;
let currentChipValue = 1;
let currentBets = {}; // formátum: { "szám/típus": összeg }
let isSpinning = false;

// Forgási és Golyó pozíciók
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;

let currentRotation = 0;
let currentBallAngle = 1.5 * Math.PI; // 1.5 * PI pontosan a 12 óra (a nyíl pozíciója)
let ballRadius = radius * 0.72;      // A számok sávjának sugara
let showBall = true;

// DOM Elemek
const balanceDisplay = document.getElementById('balance');
const totalBetDisplay = document.getElementById('total-bet');
const statusMessage = document.getElementById('status-message');
const spinButton = document.getElementById('spin-btn');
const clearButton = document.getElementById('clear-btn');

// Kerék és a Golyó kirajzolása
function drawWheel() {
    const numSlices = rouletteNumbers.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. A FORGÓ KERÉK KIRAJZOLÁSA
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentRotation);

    for (let i = 0; i < numSlices; i++) {
        const angle = i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + sliceAngle);
        ctx.closePath();

        // Cikkelyek színezése
        const num = rouletteNumbers[i];
        if (num === 0) ctx.fillStyle = '#0e7a32';
        else if (redNumbers.includes(num)) ctx.fillStyle = '#b31212';
        else ctx.fillStyle = '#1c1c1c';
        ctx.fill();
        ctx.stroke();

        // Számok felírása a cikkelyekbe
        ctx.save();
        ctx.rotate(angle + sliceAngle / 2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(num, radius - 25, 4);
        ctx.restore();
    }
    
    // Kerék közepének fa berakása (dekoráció)
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.58, 0, 2 * Math.PI);
    ctx.fillStyle = '#5c3a21';
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // 2. A GOLYÓ KIRAJZOLÁSA (Globális koordináták alapján, nem forog együtt a kerékkel)
    if (showBall) {
        ctx.beginPath();
        const ballX = radius + ballRadius * Math.cos(currentBallAngle);
        const ballY = radius + ballRadius * Math.sin(currentBallAngle);
        ctx.arc(ballX, ballY, 7, 0, 2 * Math.PI); // 7px sugarú fehér golyó
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#bbbbbb';
        ctx.stroke();
    }
}

// Első renderelés betöltéskor
drawWheel();

// Zseton választás kezelése
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        document.querySelector('.chip.active').classList.remove('active');
        e.target.classList.add('active');
        currentChipValue = parseInt(e.target.dataset.value);
    });
});

// Fogadás lerakása a mezőkre
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (isSpinning) return;
        
        const betType = cell.dataset.bet;
        
        if (balance >= currentChipValue) {
            balance -= currentChipValue;
            currentBets[betType] = (currentBets[betType] || 0) + currentChipValue;
            
            cell.setAttribute('data-total-bet', currentBets[betType]);
            updateUI();
        } else {
            statusMessage.textContent = "Nincs elég egyenleged ehhez a zsetonhoz!";
        }
    });
});

// UI frissítése
function updateUI() {
    balanceDisplay.textContent = balance;
    const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
    totalBetDisplay.textContent = totalBet;
}

// Tétek törlése
clearButton.addEventListener('click', () => {
    if (isSpinning) return;
    for (let key in currentBets) {
        balance += currentBets[key];
    }
    currentBets = {};
    document.querySelectorAll('.cell').forEach(cell => cell.removeAttribute('data-total-bet'));
    updateUI();
    statusMessage.textContent = "Tétek törölve.";
});

// Pörgetés animáció precíz golyó- és kerékszinkronnal
spinButton.addEventListener('click', () => {
    const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) {
        statusMessage.textContent = "Kérlek, tégy meg legalább egy tétet!";
        return;
    }
    if (isSpinning) return;

    isSpinning = true;
    statusMessage.textContent = "A golyó pörög...";
    
    const winningIndex = Math.floor(Math.random() * rouletteNumbers.length);
    const winningNumber = rouletteNumbers[winningIndex];
    
    const sliceAngle = (2 * Math.PI) / rouletteNumbers.length;
    
    // --- 1. KERÉK LOGIKA ---
    // Kiszámoljuk, hol áll most a kerék, és mennyit kell fordulnia, hogy a jó szelet legyen a nyílnál (1.5 * PI)
    const currentRotationNormalized = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const baseTargetRotation = (1.5 * Math.PI) - (winningIndex * sliceAngle) - (sliceAngle / 2);
    let wheelDelta = baseTargetRotation - currentRotationNormalized;
    if (wheelDelta < 0) wheelDelta += 2 * Math.PI;
    
    const startWheelRotation = currentRotation;
    const finalWheelRotation = currentRotation + (4 * 2 * Math.PI) + wheelDelta; // 4 teljes kör + igazítás

    // --- 2. GOLYÓ LOGIKA ---
    // A golyó az ellenkező irányba száguld (visszafelé), és a végén PONTOSAN a nyílnál (1.5 * PI) áll meg
    const currentBallAngleNormalized = ((currentBallAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let ballDelta = currentBallAngleNormalized - 1.5 * Math.PI;
    if (ballDelta < 0) ballDelta += 2 * Math.PI;
    
    const startBallAngle = currentBallAngle;
    const finalBallAngle = currentBallAngle - (6 * 2 * Math.PI) - ballDelta; // 6 teljes kör visszafelé a nyílig

    // Sugár határok (a golyó kívülről spirálozik befelé)
    const outerRadius = radius - 12;
    const innerRadius = radius * 0.72;

    let startTime = null;
    const duration = 4500; // 4.5 másodperces pörgetés

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const t = Math.min(progress / duration, 1);
        
        // Lassulási görbe (Cubic Ease-Out)
        const easeOut = 1 - Math.pow(1 - t, 3);
        
        // Pozíciók frissítése az idő függvényében
        currentRotation = startWheelRotation + (finalWheelRotation - startWheelRotation) * easeOut;
        currentBallAngle = startBallAngle + (finalBallAngle - startBallAngle) * easeOut;
        
        // Golyó bespirálozódása: A pörgetés első 60%-ában a külső peremen marad, majd beesik a zsebbe
        if (t < 0.6) {
            ballRadius = outerRadius;
        } else {
            const t2 = (t - 0.6) / 0.4; // 0 és 1 közötti skála a beeséshez
            const easeDrop = 1 - Math.pow(1 - t2, 2);
            ballRadius = outerRadius - (outerRadius - innerRadius) * easeDrop;
        }
        
        drawWheel();

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            evaluateResults(winningNumber);
        }
    }

    requestAnimationFrame(animate);
});

// Eredmények kiértékelése
function evaluateResults(winningNumber) {
    let totalWon = 0;
    const isRed = redNumbers.includes(winningNumber);
    const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
    const isOdd = winningNumber !== 0 && winningNumber % 2 !== 0;

    let colorName = "Zöld";
    if (winningNumber !== 0) colorName = isRed ? "Piros" : "Fekete";

    for (let bet in currentBets) {
        const amount = currentBets[bet];
        
        if (parseInt(bet) === winningNumber) {
            totalWon += amount * 36;
        }
        else if (bet === 'red' && isRed && winningNumber !== 0) {
            totalWon += amount * 2;
        }
        else if (bet === 'black' && !isRed && winningNumber !== 0) {
            totalWon += amount * 2;
        }
        else if (bet === 'even' && isEven) {
            totalWon += amount * 2;
        }
        else if (bet === 'odd' && isOdd) {
            totalWon += amount * 2;
        }
    }

    balance += totalWon;
    
    if (totalWon > 0) {
        statusMessage.innerHTML = `Nyertes szám: <strong style="color: #ffcc00">${winningNumber} (${colorName})</strong>. Nyertél: <strong>${totalWon} €</strong>!`;
    } else {
        statusMessage.innerHTML = `Nyertes szám: <strong>${winningNumber} (${colorName})</strong>. A ház nyert.`;
    }

    currentBets = {};
    document.querySelectorAll('.cell').forEach(cell => cell.removeAttribute('data-total-bet'));
    updateUI();
}
