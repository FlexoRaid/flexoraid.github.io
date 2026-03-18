document.addEventListener("DOMContentLoaded", function() {

    // --- Slot Game ---
    const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
    let balance = 1000;
    let isGameOver = false;

    const balanceDisplay = document.getElementById('balance');
    const statusText = document.getElementById('status-text');
    const spinBtn = document.getElementById('spin-btn');
    const betInput = document.getElementById('bet-amount');
    const reels = [
        document.getElementById('reel1'), 
        document.getElementById('reel2'), 
        document.getElementById('reel3')
    ];

    betInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !spinBtn.disabled) {
            spinBtn.click();
        }
    });

    spinBtn.addEventListener('click', () => {
        if (isGameOver) {
            resetGame();
            return;
        }

        const amount = parseInt(betInput.value);

        if (isNaN(amount) || amount <= 0) {
            statusText.innerText = "Please enter a valid amount!";
            return;
        }
        if (amount > balance) {
            statusText.innerText = "Insufficient funds!";
            return;
        }

        balance -= amount;
        balanceDisplay.innerText = balance;
        spinBtn.disabled = true;
        statusText.innerText = "Spinning...";
        statusText.style.color = "var(--color-accent)";

        let startTime = Date.now();
        const duration = 2000;

        const interval = setInterval(() => {
            reels.forEach(reel => {
                reel.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            });

            if (Date.now() - startTime > duration) {
                clearInterval(interval);
                calculateResult(amount);
                checkGameOver();
                
                if (!isGameOver) {
                    spinBtn.disabled = false;
                }
            }
        }, 100);
    });

    function calculateResult(bet) {
        const luck = Math.random();
        let win = 0;
        let finalSymbols = ["", "", ""];
        let multiplier = 0;

        if (luck <= 0.001) { // 0,1% – 7️⃣7️⃣7️⃣
            multiplier = 10000;
            finalSymbols = ["7️⃣", "7️⃣", "7️⃣"];
            statusText.innerText = `JACKPOT! ${multiplier}x WIN!!!`;
            statusText.style.color = "gold";
        } 
        else if (luck <= 0.011) { // 1% – 7️⃣7️⃣
            multiplier = 100;
            finalSymbols = ["7️⃣", "7️⃣", "7️⃣"];
            let others = symbols.filter(s => s !== "7️⃣");
            let randomPos = Math.floor(Math.random() * 3);
            finalSymbols[randomPos] = others[Math.floor(Math.random() * others.length)];
            statusText.innerText = `MINI JACKPOT: ${multiplier}x!`;
            statusText.style.color = "gold";
        }
        else if (luck <= 0.013) { // 0,2% – 💎💎💎
            multiplier = 500;
            finalSymbols = ["💎", "💎", "💎"];
            statusText.innerText = `SUPER WIN: 3x 💎!`;
            statusText.style.color = "#ff00ff";
        }
        else if (luck <= 0.033) { // 2% – 💎💎
            multiplier = 25;
            finalSymbols = ["💎", "💎", "💎"];
            let others = symbols.filter(s => s !== "💎");
            let randomPos = Math.floor(Math.random() * 3);
            finalSymbols[randomPos] = others[Math.floor(Math.random() * others.length)];
            statusText.innerText = `Win: ${multiplier}x!`;
            statusText.style.color = "var(--color-accent)";
        }
        else if (luck <= 0.039) { // 0,6% – 🔔🔔🔔
            multiplier = 150;
            finalSymbols = ["🔔", "🔔", "🔔"];
            statusText.innerText = `SUPER WIN: 3x 🔔!`;
            statusText.style.color = "#ff00ff";
        }
        else if (luck <= 0.059) { // 2% – 🔔🔔
            multiplier = 10;
            finalSymbols = ["🔔", "🔔", "🔔"];
            let others = symbols.filter(s => s !== "🔔");
            let randomPos = Math.floor(Math.random() * 3);
            finalSymbols[randomPos] = others[Math.floor(Math.random() * others.length)];
            statusText.innerText = `Win: ${multiplier}x!`;
            statusText.style.color = "var(--color-accent)";
        }
        else if (luck <= 0.071) { // 1,2% – 🍋🍋🍋
            multiplier = 50;
            finalSymbols = ["🍋", "🍋", "🍋"];
            statusText.innerText = `Win: 3x 🍋!`;
            statusText.style.color = "var(--color-accent)";
        }
        else if (luck <= 0.121) { // 5% – 🍋🍋
            multiplier = 5;
            finalSymbols = ["🍋", "🍋", "🍋"];
            let others = symbols.filter(s => s !== "🍋");
            let randomPos = Math.floor(Math.random() * 3);
            finalSymbols[randomPos] = others[Math.floor(Math.random() * others.length)];
            statusText.innerText = `Win: ${multiplier}x!`;
            statusText.style.color = "var(--color-accent)";
        }
        else if (luck <= 0.141) { // 2% – 🍒🍒🍒
            multiplier = 20;
            finalSymbols = ["🍒", "🍒", "🍒"];
            statusText.innerText = `Win: 3x 🍒!`;
            statusText.style.color = "var(--color-accent)";
        }
        else if (luck <= 0.261) { // 12% – 🍒🍒
            multiplier = 2;
            finalSymbols = ["🍒", "🍒", "🍒"];
            let others = symbols.filter(s => s !== "🍒");
            let randomPos = Math.floor(Math.random() * 3);
            finalSymbols[randomPos] = others[Math.floor(Math.random() * others.length)];
            statusText.innerText = `Win: ${multiplier}x!`;
            statusText.style.color = "var(--color-accent)";
        } 
        else {
            let available = [...symbols];
            for(let i = 0; i < 3; i++) {
                let idx = Math.floor(Math.random() * available.length);
                finalSymbols[i] = available[idx];
                available.splice(idx, 1);
            }
            statusText.innerText = "No luck this time!";
            statusText.style.color = "var(--color-accent)";
        }

        reels[0].innerText = finalSymbols[0];
        reels[1].innerText = finalSymbols[1];
        reels[2].innerText = finalSymbols[2];

        win = bet * multiplier;
        balance += win;
        balanceDisplay.innerText = balance;
    }

    function checkGameOver() {
        if (balance <= 0) {
            isGameOver = true;
            spinBtn.innerText = "PLAY AGAIN";
            spinBtn.disabled = false;
            statusText.innerText = "GAME OVER - Out of money!";
            statusText.style.color = "#e63946";
        }
    }

    function resetGame() {
        balance = 1000;
        balanceDisplay.innerText = balance;
        isGameOver = false;
        spinBtn.innerText = "SPIN";
        statusText.innerText = "Balance refilled! Good luck!";
        statusText.style.color = "var(--color-accent)";
    }
});