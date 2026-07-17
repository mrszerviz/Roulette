// Európai rulett kerék számainak sorrendje
const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Játék állapot
let balance = 10000;
let currentChipValue = 1;
let currentBets = {}; // formátum: { "szám/típus": összeg }
let isSpinning = false;
let currentRotation = 0;

// DOM Elemek
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const balanceDisplay = document.getElementById('balance');
const totalBetDisplay = document.getElementById('total-bet');
const statusMessage = document.getElementById('status-message');
const spinButton = document.getElementById('spin-btn');
const clearButton = document.getElementById('clear-btn');

// Kerék kirajzolása (Canvas)
function drawWheel() {
    const numSlices = rouletteNumbers.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentRotation);

    for (let i = 0; i < numSlices; i++) {
        const angle = i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + sliceAngle);
        ctx.closePath();

        // Színezés
        const num = rouletteNumbers[i];
        if (num === 0) ctx.fillStyle = '#0e7a32';
        else if (redNumbers.includes(num)) ctx.fillStyle = '#b31212';
        else ctx.fillStyle = '#1c1c1c';
        ctx.fill();
        ctx.stroke();

        // Számok felírása
        ctx.save();
        ctx.rotate(angle + sliceAngle / 2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(num, radius - 10, 5);
        ctx.restore();
    }
    
    // Belső kör a szép dizájnhoz
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#5c3a21';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

// Kezdeti rajzolás
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

// Pörgetés animáció és logika
spinButton.addEventListener('click', () => {
    const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) {
        statusMessage.textContent = "Kérlek, tégy meg legalább egy tétet!";
        return;
    }
    if (isSpinning) return;

    isSpinning = true;
    statusMessage.textContent = "A golyó úton van...";
    
    const winningIndex = Math.floor(Math.random() * rouletteNumbers.length);
    const winningNumber = rouletteNumbers[winningIndex];
    
    // Animáció kiszámítása
    const sliceAngle = (2 * Math.PI) / rouletteNumbers.length;
    // Úgy forgatjuk, hogy a nyíl (fent, azaz -Math.PI/2-nél) a jó számra mutasson
    const targetRotation = (2 * Math.PI) - (winningIndex * sliceAngle) - (sliceAngle / 2) - (Math.PI / 2);
    const extraSpins = 5 * 2 * Math.PI; // 5 teljes extra pördület az animációhoz
    const finalRotation = currentRotation + extraSpins + targetRotation;

    let startTime = null;
    const duration = 4000; // 4 másodperces pörgetés

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const t = Math.min(progress / duration, 1);
        
        // Ease-out hatás (lassuló forgás)
        const easeOut = 1 - Math.pow(1 - t, 3);
        currentRotation = easeOut * finalRotation;
        
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

    // Szín meghatározása szöveghez
    let colorName = "Zöld";
    if (winningNumber !== 0) colorName = isRed ? "Piros" : "Fekete";

    for (let bet in currentBets) {
        const amount = currentBets[bet];
        
        // Szám fogadás (35:1 kifizetés + az eredeti tét vissza)
        if (parseInt(bet) === winningNumber) {
            totalWon += amount * 36;
        }
        // Piros / Fekete (1:1 kifizetés)
        else if (bet === 'red' && isRed && winningNumber !== 0) {
            totalWon += amount * 2;
        }
        else if (bet === 'black' && !isRed && winningNumber !== 0) {
            totalWon += amount * 2;
        }
        // Páros / Páratlan (1:1 kifizetés)
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

    // Tábla alaphelyzetbe állítása a következő körhöz
    currentBets = {};
    document.querySelectorAll('.cell').forEach(cell => cell.removeAttribute('data-total-bet'));
    updateUI();
}
