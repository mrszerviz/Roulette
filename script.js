// Hivatalos Európai Rulett kerék sorrend
const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

let balance = 10000;
let currentChipValue = 1;
let currentBets = {}; 
let isSpinning = false;

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;

let currentRotation = 0;
let currentBallAngle = 1.5 * Math.PI; // Felső pozíció (12 óra)
let ballRadius = radius * 0.74;

const balanceDisplay = document.getElementById('balance');
const totalBetDisplay = document.getElementById('total-bet');
const statusMessage = document.getElementById('status-message');
const spinButton = document.getElementById('spin-btn');
const clearButton = document.getElementById('clear-btn');

// Szög normalizáló segédfüggvény [0, 2*PI) közé
function normalizeAngle(angle) {
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function drawWheel() {
    const numSlices = rouletteNumbers.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Kerék kirajzolása
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentRotation);

    for (let i = 0; i < numSlices; i++) {
        const angle = i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius - 5, angle, angle + sliceAngle);
        ctx.closePath();

        const num = rouletteNumbers[i];
        if (num === 0) ctx.fillStyle = '#136330';
        else if (redNumbers.includes(num)) ctx.fillStyle = '#9e1c1c';
        else ctx.fillStyle = '#1a1a1a';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.rotate(angle + sliceAngle / 2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(num, radius - 18, 4);
        ctx.restore();
    }
    
    // Belső fa textúra kör
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.62, 0, 2 * Math.PI);
    ctx.fillStyle = '#422817';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    ctx.restore();

    // Golyó kirajzolása globális koordinátákkal
    ctx.beginPath();
    const ballX = radius + ballRadius * Math.cos(currentBallAngle);
    const ballY = radius + ballRadius * Math.sin(currentBallAngle);
    ctx.arc(ballX, ballY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 1;
    ctx.stroke();
}

drawWheel();

// Zsetonválasztó
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        document.querySelector('.chip.active').classList.remove('active');
        e.target.classList.add('active');
        currentChipValue = parseInt(e.target.dataset.value);
    });
});

// Fogadások elhelyezése
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
            statusMessage.textContent = "NOT ENOUGH BALANCE!";
        }
    });
});

function updateUI() {
    balanceDisplay.textContent = balance;
    const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
    totalBetDisplay.textContent = totalBet;
}

clearButton.addEventListener('click', () => {
    if (isSpinning) return;
    for (let key in currentBets) {
        balance += currentBets[key];
    }
    currentBets = {};
    document.querySelectorAll('.cell').forEach(cell => cell.removeAttribute('data-total-bet'));
    updateUI();
    statusMessage.textContent = "BET CLEARED";
});

// Pörgetés animáció szögkorrekcióval
spinButton.addEventListener('click', () => {
    const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) {
        statusMessage.textContent = "PLEASE PLACE A BET!";
        return;
    }
    if (isSpinning) return;

    isSpinning = true;
    statusMessage.textContent = "BALL IS SPINNING...";
    
    const winningIndex = Math.floor(Math.random() * rouletteNumbers.length);
    const winningNumber = rouletteNumbers[winningIndex];
    const sliceAngle = (2 * Math.PI) / rouletteNumbers.length;
    
    // --- Kerék forgás matek ---
    const currentRotationNormalized = normalizeAngle(currentRotation);
    const targetRotationNormalized = normalizeAngle((1.5 * Math.PI) - (winningIndex * sliceAngle) - (sliceAngle / 2));
    let wheelDelta = targetRotationNormalized - currentRotationNormalized;
    if (wheelDelta < 0) wheelDelta += 2 * Math.PI;
    
    const startWheelRotation = currentRotation;
    const finalWheelRotation = currentRotation + (4 * 2 * Math.PI) + wheelDelta;

    // --- Golyó forgás matek ---
    const currentBallAngleNormalized = normalizeAngle(currentBallAngle);
    let ballDelta = currentBallAngleNormalized - (1.5 * Math.PI); // Mindig a felső nyílnál áll meg
    if (ballDelta < 0) ballDelta += 2 * Math.PI;
    
    const startBallAngle = currentBallAngle;
    const finalBallAngle = currentBallAngle - (6 * 2 * Math.PI) - ballDelta; // Ellentétes irány

    const outerRadius = radius - 15;
    const innerRadius = radius * 0.74;

    let startTime = null;
    const duration = 4000; 

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const t = Math.min(progress / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - t, 3);
        
        currentRotation = startWheelRotation + (finalWheelRotation - startWheelRotation) * easeOut;
        currentBallAngle = startBallAngle + (finalBallAngle - startBallAngle) * easeOut;
        
        if (t < 0.6) {
            ballRadius = outerRadius;
        } else {
            const t2 = (t - 0.6) / 0.4;
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

// Kijavított, atombiztos kiértékelés (Nincs több parseInt hiba)
function evaluateResults(winningNumber) {
    let totalWon = 0;
    const isRed = redNumbers.includes(winningNumber);
    const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
    const isOdd = winningNumber !== 0 && winningNumber % 2 !== 0;

    let colorName = "Green";
    if (winningNumber !== 0) colorName = isRed ? "Red" : "Black";

    for (let bet in currentBets) {
        const amount = currentBets[bet];
        
        // 1. Tiszta szám fogadások ellenőrzése (Kizárólag ha valódi szám a string)
        if (!isNaN(bet) && Number(bet) === winningNumber) {
            totalWon += amount * 36;
        }
        // 2. Színek (1:1)
        else if (bet === 'red' && isRed && winningNumber !== 0) totalWon += amount * 2;
        else if (bet === 'black' && !isRed && winningNumber !== 0) totalWon += amount * 2;
        // 3. Páros / Páratlan (1:1)
        else if (bet === 'even' && isEven) totalWon += amount * 2;
        else if (bet === 'odd' && isOdd) totalWon += amount * 2;
        // 4. Kis / Nagy (1:1)
        else if (bet === '1-18' && winningNumber >= 1 && winningNumber <= 18) totalWon += amount * 2;
        else if (bet === '19-36' && winningNumber >= 19 && winningNumber <= 36) totalWon += amount * 2;
        // 5. Tucatok (2:1)
        else if (bet === 'doz_1' && winningNumber >= 1 && winningNumber <= 12) totalWon += amount * 3;
        else if (bet === 'doz_2' && winningNumber >= 13 && winningNumber <= 24) totalWon += amount * 3;
        else if (bet === 'doz_3' && winningNumber >= 25 && winningNumber <= 36) totalWon += amount * 3;
        // 6. Oszlopok (2:1)
        else if (bet === 'col_3' && winningNumber % 3 === 0 && winningNumber !== 0) totalWon += amount * 3;
        else if (bet === 'col_2' && winningNumber % 3 === 2) totalWon += amount * 3;
        else if (bet === 'col_1' && winningNumber % 3 === 1) totalWon += amount * 3;
    }

    balance += totalWon;
    
    if (totalWon > 0) {
        statusMessage.innerHTML = `WINNING NUMBER: <strong style="color: #ffd700">${winningNumber} (${colorName})</strong>. YOU WON: <strong style="color: #4eff82">${totalWon} €</strong>!`;
    } else {
        statusMessage.innerHTML = `WINNING NUMBER: <strong>${winningNumber} (${colorName})</strong>. YOU LOST.`;
    }

    currentBets = {};
    document.querySelectorAll('.cell').forEach(cell => cell.removeAttribute('data-total-bet'));
    updateUI();
}
