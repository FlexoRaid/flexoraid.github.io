document.addEventListener("DOMContentLoaded", function() {

    // --- GAME LOGIC ---
    let balance = 1000;
    let currentBetType = null;
    let isGameOver = false;

    const balanceDisplay = document.getElementById('balance');
    const wheelResult = document.getElementById('wheel-result');
    const statusText = document.getElementById('status-text');
    const spinBtn = document.getElementById('spin-btn');
    const betButtons = document.querySelectorAll('.bet-btn');
    const betAmountInput = document.getElementById('bet-amount');
    const adminOverlay = document.getElementById('admin-overlay');

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {

        if (adminOverlay && adminOverlay.classList.contains('active')) return;

        const key = e.key.toLowerCase();

        if ((e.key === 'Enter' || key === 's') && !spinBtn.disabled) {
            spinBtn.click();
            e.preventDefault();
            return;
        }

        if (e.target.tagName === 'INPUT') return;

        if (key === 'r') {
            const redBtn = document.querySelector('.bet-btn.red');
            if (redBtn) redBtn.click();
        } else if (key === 'b') {
            const blackBtn = document.querySelector('.bet-btn.black');
            if (blackBtn) blackBtn.click();
        } else if (key === 'g') {
            const greenBtn = document.querySelector('.bet-btn.green');
            if (greenBtn) greenBtn.click();
        }
    });

    betButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isGameOver) return;
            betButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentBetType = btn.dataset.bet;
        });
    });

    // SPIN-Button
    spinBtn.addEventListener('click', () => {
        if (isGameOver) {
            resetGame();
            return;
        }

        const amount = parseInt(betAmountInput.value);

        if (!currentBetType || isNaN(amount) || amount > balance || amount <= 0) {
            statusText.innerText = !currentBetType ? "Select a color!" : "Invalid amount!";
            statusText.style.color = "#e63946";
            return;
        }

        balance -= amount;
        balanceDisplay.innerText = balance;
        spinBtn.disabled = true;
        statusText.innerText = "Spinning...";
        statusText.style.color = "var(--color-accent)";

        let ticks = 0;
        const interval = setInterval(() => {
            const tempNum = Math.floor(Math.random() * 37);
            wheelResult.innerText = tempNum;
            wheelResult.style.color = getNumberStyle(tempNum);

            if (++ticks > 20) {
                clearInterval(interval);
                const res = Math.floor(Math.random() * 37);
                const col = getNumberColor(res);
                wheelResult.innerText = res;
                wheelResult.style.color = getNumberStyle(res);

                if (currentBetType === col || (currentBetType === "0" && res === 0)) {
                    const winMultiplier = currentBetType === "0" ? 35 : 2;
                    const win = amount * winMultiplier;
                    balance += win;
                    statusText.innerText = `WIN! +${win}$`;
                    statusText.style.color = "#2b9348";
                } else {
                    statusText.innerText = "Lost!";
                    statusText.style.color = "#e63946";
                }

                balanceDisplay.innerText = balance;

                if (balance <= 0) {
                    checkGameOver();
                } else {
                    spinBtn.disabled = false;
                }
            }
        }, 80);
    });

    function getNumberColor(n) {
        if (n === 0) return "0";
        return [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n) ? "red" : "black";
    }

    function getNumberStyle(n) {
        if (n === 0) return "#2b9348";
        return getNumberColor(n) === "red" ? "#e63946" : "#000";
    }

    function checkGameOver() {
        if (balance <= 0) {
            isGameOver = true;
            spinBtn.innerText = "PLAY AGAIN";
            spinBtn.disabled = false;
            statusText.innerText = "GAME OVER - No money left!";
            statusText.style.color = "#e63946";
        }
    }

    function resetGame() {
        balance = 1000;
        balanceDisplay.innerText = balance;
        isGameOver = false;
        spinBtn.innerText = "SPIN (S / Enter)";
        currentBetType = null;
        betButtons.forEach(b => b.classList.remove('selected'));
        statusText.innerText = "Refilled! Pick a color.";
        statusText.style.color = "#fff";
    }

});