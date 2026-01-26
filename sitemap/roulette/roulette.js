document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleIcon = document.getElementById('toggle-icon');

    function closeMenu() {
        navOverlay.classList.remove('active');
        // Pfad korrigiert
        toggleIcon.src = "../../icons/menu.png";
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = navOverlay.classList.toggle('active');
        // Pfade korrigiert
        toggleIcon.src = active ? "../../icons/exit.png" : "../../icons/menu.png";
    });

    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) closeMenu();
    });

    // GAME LOGIC
    let balance = 1000;
    let currentBetType = null;
    const balanceDisplay = document.getElementById('balance');
    const wheelResult = document.getElementById('wheel-result');
    const statusText = document.getElementById('status-text');
    const spinBtn = document.getElementById('spin-btn');
    const betButtons = document.querySelectorAll('.bet-btn');

    betButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            betButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentBetType = btn.dataset.bet;
        });
    });

    spinBtn.addEventListener('click', () => {
        const amount = parseInt(document.getElementById('bet-amount').value);
        if (!currentBetType || amount > balance || amount <= 0) {
            statusText.innerText = !currentBetType ? "Select a color!" : "Invalid amount!";
            return;
        }

        balance -= amount;
        balanceDisplay.innerText = balance;
        spinBtn.disabled = true;
        statusText.innerText = "Spinning...";

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
                    const win = currentBetType === "0" ? amount * 35 : amount * 2;
                    balance += win;
                    statusText.innerText = `WIN! +${win}$`;
                } else {
                    statusText.innerText = "Lost!";
                }
                balanceDisplay.innerText = balance;
                spinBtn.disabled = false;
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

    // LIGHTS
    const lightCont = document.querySelector(".floating-lights");
    const particles = [];
    for (let i = 0; i < 30; i++) {
        const s = document.createElement("span");
        const size = Math.random() * 4 + 2;
        Object.assign(s.style, { width: size + "px", height: size + "px", left: "0", top: "0" });
        lightCont.appendChild(s);
        particles.push({ el: s, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, sx: Math.random() * 0.4 - 0.2, sy: Math.random() * 0.4 - 0.2 });
    }
    function animate() {
        particles.forEach(p => {
            p.x = (p.x + p.sx + window.innerWidth) % window.innerWidth;
            p.y = (p.y + p.sy + window.innerHeight) % window.innerHeight;
            p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        });
        requestAnimationFrame(animate);
    }
    animate();
});