document.addEventListener("DOMContentLoaded", function() {
    const elements = {
        balance: document.getElementById('balance'),
        dealerCards: document.getElementById('dealer-cards'),
        playerCards: document.getElementById('player-cards'),
        dealerScore: document.getElementById('dealer-score'),
        playerScore: document.getElementById('player-score'),
        status: document.getElementById('status-text'),
        dealerBar: document.getElementById('dealer-bar'),
        playerBar: document.getElementById('player-bar'),
        dealBtn: document.getElementById('deal-btn'),
        hitBtn: document.getElementById('hit-btn'),
        standBtn: document.getElementById('stand-btn'),
        btnText: document.getElementById('btn-text'),
        betControls: document.getElementById('bet-controls'),
        gameActions: document.getElementById('game-actions'),
        betAmount: document.getElementById('bet-amount'),
        futureDisplay: document.getElementById('future-card-display'),
        nextCardPreview: document.getElementById('next-card-preview')
    };

    const adminTrigger = document.getElementById('admin-trigger');
    const adminOverlay = document.getElementById('admin-overlay');
    const adminPwInput = document.getElementById('admin-pw');
    const moneyAmountInput = document.getElementById('money-amount');
    const stepPw = document.getElementById('step-password');
    const stepMoney = document.getElementById('step-money');
    const adminTitle = document.getElementById('admin-title');
    const xrayToggle = document.getElementById('xray-toggle');

    let balance = 1000;
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let currentBet = 0;
    let isGameOver = false;
    let dealerSecondCardHidden = true;
    
    let isXRayActive = false;
    if (xrayToggle) {
        xrayToggle.checked = false;
    }

    // --- Admin Logic ---
    if (adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            adminOverlay.classList.add('active');
            adminPwInput.focus();
        });
    }

    window.closeAdmin = function() {
        adminOverlay.classList.remove('active');
        stepPw.style.display = 'block';
        stepMoney.style.display = 'none';
        adminPwInput.value = '';
        adminTitle.innerText = "Security Check";
    };

    window.checkAdminPw = function() {
        if (adminPwInput.value === "tomato") {
            stepPw.style.display = 'none';
            stepMoney.style.display = 'block';
            adminTitle.innerText = "Admin Panel";
            setTimeout(() => moneyAmountInput.focus(), 50);
        } else {
            alert("Wrong Password!");
            adminPwInput.value = '';
        }
    };

    window.toggleXRay = function(active) {
        isXRayActive = active;
        refreshDealerDisplay();
        updateFutureCard();
        updateBars();
    };

    function updateFutureCard() {
        if (!elements.nextCardPreview) return;
        elements.nextCardPreview.innerHTML = '';
        
        if (isXRayActive && deck.length > 0 && !isGameOver && playerHand.length > 0) {
            const next = deck[deck.length - 1];
            renderCard(next, elements.nextCardPreview, true);
            if (elements.futureDisplay) elements.futureDisplay.style.display = 'block';
        } else {
            if (elements.futureDisplay) elements.futureDisplay.style.display = 'none';
        }
    }

    window.addMoney = function() {
        const val = parseInt(moneyAmountInput.value);
        if (!isNaN(val)) {
            balance += val;
            elements.balance.innerText = balance;
            alert(`${val}$ added!`);
            closeAdmin();
        }
    };

    adminPwInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkAdminPw();
    });

    moneyAmountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addMoney();
    });

    // --- Game Logic ---
    function createDeck() {
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function getCardValue(hand) {
        let score = 0;
        let aces = 0;
        for (let card of hand) {
            if (card.value === 'A') {
                aces++; 
                score += 11;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }
        while (score > 21 && aces > 0) {
            score -= 10; 
            aces--;
        }
        return score;
    }

    function renderCard(card, container, hidden = false) {
        const cardEl = document.createElement('div');
        const isRed = ['♥', '♦'].includes(card.suit);
        
        if (hidden && isXRayActive) {
            cardEl.className = `card-item ${isRed ? 'red' : ''} xray-card`;
            cardEl.innerText = `${card.value}${card.suit}`;
        } else if (hidden) {
            cardEl.className = 'card-item hidden';
            cardEl.innerText = '?';
        } else {
            cardEl.className = `card-item ${isRed ? 'red' : ''}`;
            cardEl.innerText = `${card.value}${card.suit}`;
        }
        
        container.appendChild(cardEl);
    }

    function refreshDealerDisplay() {
        if (dealerHand.length === 0) return;
        elements.dealerCards.innerHTML = '';
        dealerHand.forEach((c, index) => {
            const isHidden = (index === 1 && dealerSecondCardHidden);
            renderCard(c, elements.dealerCards, isHidden);
        });
    }

    function updateBars() {
        const pScore = getCardValue(playerHand);
        let dScore;
        
        if (dealerSecondCardHidden && !isXRayActive) {
            dScore = getCardValue([dealerHand[0]]);
        } else {
            dScore = getCardValue(dealerHand);
        }

        elements.playerScore.innerText = pScore;
        elements.dealerScore.innerText = dScore;
        elements.playerBar.style.setProperty('--progress', `${Math.min((pScore / 21) * 100, 100)}%`);
        elements.dealerBar.style.setProperty('--progress', `${Math.min((dScore / 21) * 100, 100)}%`);
        return pScore;
    }

    elements.dealBtn.addEventListener('click', () => {
        if (isGameOver) {
            resetGame();
            return;
        }

        currentBet = parseInt(elements.betAmount.value);
        if (isNaN(currentBet) || currentBet <= 0) {
            elements.status.innerText = "Invalid bet!"; 
            return;
        }
        if (currentBet > balance) {
            elements.status.innerText = "Insufficient funds!";
            return;
        }

        balance -= currentBet;
        elements.balance.innerText = balance;
        createDeck();
        
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        dealerSecondCardHidden = true;

        elements.playerCards.innerHTML = ''; 
        playerHand.forEach(c => renderCard(c, elements.playerCards));
        
        refreshDealerDisplay();
        updateBars();
        updateFutureCard();

        elements.betControls.style.display = 'none';
        elements.gameActions.style.display = 'flex';
        elements.status.innerText = "Hit or Stand?";
    });

    elements.hitBtn.addEventListener('click', () => {
        const newCard = deck.pop();
        playerHand.push(newCard);
        renderCard(newCard, elements.playerCards);
        updateFutureCard();
        if (updateBars() > 21) endGame("You Busted!");
    });

    elements.standBtn.addEventListener('click', () => {
        dealerSecondCardHidden = false;
        
        while (getCardValue(dealerHand) < 17) {
            const newCard = deck.pop();
            dealerHand.push(newCard);
        }
        
        refreshDealerDisplay();
        updateBars();
        updateFutureCard();
        
        const pScore = getCardValue(playerHand);
        const dScore = getCardValue(dealerHand);
        
        if (dScore > 21 || pScore > dScore) {
            balance += currentBet * 2; endGame("You Win!");
        } else if (dScore > pScore) {
            endGame("Dealer Wins!");
        } else {
            balance += currentBet; endGame("Push!");
        }
    });

    function endGame(msg) {
        elements.status.innerText = msg;
        elements.balance.innerText = balance;
        elements.betControls.style.display = 'block';
        elements.gameActions.style.display = 'none';
        updateFutureCard();

        if (balance <= 0) {
            isGameOver = true;
            elements.btnText.innerText = "PLAY AGAIN";
            elements.status.innerText = "GAME OVER - No money left!";
            elements.status.style.color = "#e63946";
        }
    }

    function resetGame() {
        balance = 1000;
        elements.balance.innerText = balance;
        isGameOver = false;
        dealerHand = [];
        playerHand = [];
        dealerSecondCardHidden = true;
        elements.btnText.innerText = "DEAL";
        elements.status.innerText = "Refilled! Place your bet.";
        elements.status.style.color = "var(--color-accent)";
        elements.playerCards.innerHTML = '';
        elements.dealerCards.innerHTML = '';
        elements.playerScore.innerText = '0';
        elements.dealerScore.innerText = '0';
        elements.playerBar.style.setProperty('--progress', '0%');
        elements.dealerBar.style.setProperty('--progress', '0%');
        updateFutureCard();
    }

    // --- Keyboard Bindings ---
    document.addEventListener('keydown', (e) => {
        if (adminOverlay && adminOverlay.classList.contains('active')) return;
        if (e.target.tagName === 'INPUT') return;
        
        const key = e.key.toLowerCase();

        if ((e.key === 'Enter' || key === 'd') && elements.betControls.style.display !== 'none') {
            elements.dealBtn.click();
        }

        if (elements.gameActions.style.display === 'flex') {
            if (key === 'h') {
                elements.hitBtn.click();
            } else if (key === 's') {
                elements.standBtn.click();
            }
        }
    });
});