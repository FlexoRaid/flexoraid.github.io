document.addEventListener("DOMContentLoaded", function() {

    // ===== DOM ELEMENTE =====
    const elements = {
        balance: document.getElementById('balance'),
        pot: document.getElementById('pot-amount'),
        status: document.getElementById('status-text'),
        player: document.getElementById('player-cards'),
        community: document.getElementById('community-cards'),
        actions: document.getElementById('game-actions'),
        betControls: document.getElementById('bet-controls'),
        startBtn: document.getElementById('start-btn'),
        callBtn: document.getElementById('call-btn'),
        raiseBtn: document.getElementById('raise-btn'),
        raiseAmount: document.getElementById('raise-amount'),
        foldBtn: document.getElementById('fold-btn'),
        allinBtn: document.getElementById('allin-btn'),
        handName: document.getElementById('hand-name')
    };

    // ===== GLOBALE VARIABLEN =====
    let balance = 1000;
    let pot = 0;
    let currentBet = 0;
    let deck = [];
    let playerHand = [];
    let communityCards = [];
    let phase = 0;
    let isGameOver = false;
    let userCurrentBet = 0;
    let isUserAllIn = false;

    const bots = [
        { id: 'bot1', hand: [], active: true, label: "Peter", currentBotBet: 0 },
        { id: 'bot2', hand: [], active: true, label: "Samuel", currentBotBet: 0 },
        { id: 'bot3', hand: [], active: true, label: "Bartek", currentBotBet: 0 },
        { id: 'bot4', hand: [], active: true, label: "Natan", currentBotBet: 0 }
    ];

    const cardValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

    // ===== HILFSFUNKTIONEN =====
    function createDeck() {
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];
        suits.forEach(s => values.forEach(v => deck.push({ s, v })));
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function renderCard(card, container, hidden = false) {
        const div = document.createElement('div');
        const isRed = ['♥', '♦'].includes(card.s);
        const xray = window.isXRayActive === true; // globaler X-Ray-Status

        if (hidden && xray) {
            // X-Ray aktiv: Karte wird durchsichtig mit Akzentfarbe dargestellt
            div.className = `card-item xray-card ${isRed ? 'red' : ''}`;
            div.innerText = `${card.v}${card.s}`;
        } else if (hidden) {
            div.className = `card-item hidden`;
            div.innerText = '?';
        } else {
            div.className = `card-item ${isRed ? 'red' : ''}`;
            div.innerText = `${card.v}${card.s}`;
        }
        container.appendChild(div);
    }

    // ===== BOT-KARTEN AKTUALISIEREN (bei X-Ray-Umschaltung) =====
    window.updateBotCardsVisibility = function() {
        bots.forEach(bot => {
            if (bot.hand.length > 0) {
                const container = document.getElementById(`${bot.id}-cards`);
                container.innerHTML = '';
                // Im X-Ray-Modus werden die Karten sichtbar, sonst verdeckt
                const hidden = !window.isXRayActive;
                bot.hand.forEach(c => renderCard(c, container, hidden));
            }
        });
    };

    // ===== POKER-HAND-AUSWERTUNG =====
    function evaluateHand(hand, community) {
        const all = [...hand, ...community];
        if (all.length < 2) return { rank: 0, val: 0, label: "Dealing...", cards: [] };

        const suits = {}, vals = {};
        all.forEach(c => {
            suits[c.s] = suits[c.s] || [];
            suits[c.s].push(c);
            vals[c.v] = vals[c.v] || [];
            vals[c.v].push(c);
        });

        const sortedAllValues = [...all].sort((a, b) => cardValues[b.v] - cardValues[a.v]);
        const sortedUniqueCards = sortedAllValues.filter((c, i, a) => i === 0 || c.v !== a[i-1].v);

        const flushSuit = Object.keys(suits).find(s => suits[s].length >= 5);
        let flushCards = flushSuit ? suits[flushSuit].sort((a,b) => cardValues[b.v] - cardValues[a.v]) : [];

        let straightCards = [];
        for (let i = 0; i <= sortedUniqueCards.length - 5; i++) {
            if (cardValues[sortedUniqueCards[i].v] - cardValues[sortedUniqueCards[i+4].v] === 4) {
                straightCards = sortedUniqueCards.slice(i, i + 5);
                break;
            }
        }
        if (straightCards.length === 0 && [14, 5, 4, 3, 2].every(v => sortedUniqueCards.some(c => cardValues[c.v] === v))) {
            straightCards = sortedUniqueCards.filter(c => [14, 5, 4, 3, 2].includes(cardValues[c.v])).sort((a,b) => cardValues[b.v] - cardValues[a.v]);
        }

        const getKickerVal = (excludeVals, num = 5) => {
            const kickers = sortedAllValues.filter(c => !excludeVals.includes(c.v)).slice(0, num);
            return kickers.reduce((acc, c, i) => acc + cardValues[c.v] * Math.pow(15, -i - 1), 0);
        };

        if (flushSuit && straightCards.length > 0) {
            const sFlushUnique = flushCards.filter((c, i, a) => i === 0 || c.v !== a[i-1].v);
            let sFlushRes = [];
            for (let i = 0; i <= sFlushUnique.length - 5; i++) {
                if (cardValues[sFlushUnique[i].v] - cardValues[sFlushUnique[i+4].v] === 4) {
                    sFlushRes = sFlushUnique.slice(i, i + 5);
                    break;
                }
            }
            if (sFlushRes.length === 0 && [14,5,4,3,2].every(v => flushCards.some(c => cardValues[c.v] === v))) {
                sFlushRes = flushCards.filter(c => [14,5,4,3,2].includes(cardValues[c.v]));
            }
            if (sFlushRes.length >= 5) {
                const high = cardValues[sFlushRes[0].v];
                return { rank: 9, val: 900 + high, label: high === 14 ? "Royal Flush" : "Straight Flush", cards: sFlushRes.map(c => `${c.v}${c.s}`) };
            }
        }

        const counts = Object.entries(vals).sort((a,b) => b[1].length - a[1].length || cardValues[b[0]] - cardValues[a[0]]);

        if (counts[0][1].length === 4) {
            const v0 = cardValues[counts[0][0]];
            return { rank: 8, val: 800 + v0 + getKickerVal([counts[0][0]], 1), label: "Four of a Kind", cards: counts[0][1].map(c => `${c.v}${c.s}`) };
        }

        if (counts[0][1].length === 3 && counts[1] && counts[1][1].length >= 2) {
            const v0 = cardValues[counts[0][0]], v1 = cardValues[counts[1][0]];
            return { rank: 7, val: 700 + v0 + (v1 / 15), label: "Full House", cards: [...counts[0][1], ...counts[1][1].slice(0,2)].map(c => `${c.v}${c.s}`) };
        }

        if (flushSuit) {
            const fKickers = flushCards.slice(0, 5).map(c => cardValues[c.v]);
            const fVal = fKickers.reduce((acc, v, i) => acc + v * Math.pow(15, -i), 0);
            return { rank: 6, val: 600 + fVal, label: "Flush", cards: flushCards.slice(0, 5).map(c => `${c.v}${c.s}`) };
        }

        if (straightCards.length >= 5) {
            return { rank: 5, val: 500 + cardValues[straightCards[0].v], label: "Straight", cards: straightCards.map(c => `${c.v}${c.s}`) };
        }

        if (counts[0][1].length === 3) {
            const v0 = cardValues[counts[0][0]];
            return { rank: 4, val: 400 + v0 + getKickerVal([counts[0][0]], 2), label: "Three of a Kind", cards: counts[0][1].map(c => `${c.v}${c.s}`) };
        }

        if (counts[0][1].length === 2 && counts[1] && counts[1][1].length === 2) {
            const v0 = cardValues[counts[0][0]], v1 = cardValues[counts[1][0]];
            return { rank: 3, val: 300 + v0 + (v1 / 15) + getKickerVal([counts[0][0], counts[1][0]], 1), label: "Two Pair", cards: [...counts[0][1], ...counts[1][1]].map(c => `${c.v}${c.s}`) };
        }

        if (counts[0][1].length === 2) {
            const v0 = cardValues[counts[0][0]];
            return { rank: 2, val: 200 + v0 + getKickerVal([counts[0][0]], 3), label: "Pair", cards: counts[0][1].map(c => `${c.v}${c.s}`) };
        }

        return { rank: 1, val: 100 + getKickerVal([], 5) * 15, label: "High Card", cards: [] };
    }

    // ===== UI AKTUALISIEREN =====
    function updateUI() {
        elements.balance.innerText = balance;
        elements.pot.innerText = pot;
        const result = evaluateHand(playerHand, communityCards);
        elements.handName.innerText = result.label;

        const callCost = currentBet - userCurrentBet;
        elements.callBtn.innerText = callCost > 0 ? `Call (${callCost}$)` : "Check (C)";
        elements.raiseAmount.placeholder = `Raise by...`;

        document.querySelectorAll('.player-slot#user-slot .card-item, .community-area .card-item').forEach(el => {
            if (result.cards.length > 0 && result.cards.includes(el.innerText)) {
                el.classList.add('highlight');
            } else {
                el.classList.remove('highlight');
            }
        });
    }

    // ===== NEUES SPIEL STARTEN =====
    async function startNewGame() {
        if (isGameOver) {
            resetGame();
            return;
        }
        if (balance < 50) {
            elements.status.innerText = "Minimum 50 Chips required!";
            return;
        }

        balance -= 10;
        pot = 10;
        currentBet = 10;
        userCurrentBet = 0;
        isUserAllIn = false;

        createDeck();
        playerHand = [deck.pop(), deck.pop()];
        bots.forEach(b => {
            b.hand = [deck.pop(), deck.pop()];
            b.active = true;
            b.currentBotBet = 0;
            const botEl = document.getElementById(b.id);
            botEl.style.opacity = "1";
            const botCardsContainer = document.getElementById(`${b.id}-cards`);
            botCardsContainer.innerHTML = '';
            // Karten verdeckt oder je nach X-Ray
            const hidden = !window.isXRayActive;
            b.hand.forEach(c => renderCard(c, botCardsContainer, hidden));
        });

        communityCards = [];
        phase = 1;
        elements.player.innerHTML = '';
        playerHand.forEach(c => renderCard(c, elements.player, false)); // Spieler-Karten immer offen
        elements.community.innerHTML = '';
        elements.betControls.style.display = 'none';
        elements.actions.style.display = 'grid';
        updateUI();
        elements.status.innerText = "Your turn! Call or raise.";
    }

    // ===== RUNDE VERARBEITEN =====
    async function processRound(action, amount = 0) {
        if (action === 'raise') {
            const totalNewBet = currentBet + amount;
            const costToUser = totalNewBet - userCurrentBet;
            if (costToUser <= balance) {
                balance -= costToUser;
                pot += costToUser;
                currentBet = totalNewBet;
                userCurrentBet = totalNewBet;
            }
        } else if (action === 'allin') {
            const costToUser = balance;
            userCurrentBet += costToUser;
            balance = 0;
            pot += costToUser;
            if (userCurrentBet > currentBet) currentBet = userCurrentBet;
            isUserAllIn = true;
        } else if (action === 'call') {
            const callAmount = currentBet - userCurrentBet;
            if (callAmount > 0) {
                balance -= callAmount;
                pot += callAmount;
                userCurrentBet = currentBet;
            }
        }
        updateUI();
        elements.actions.style.display = 'none';

        let someoneRaised = false;
        for (let bot of bots) {
            if (!bot.active) continue;

            const botEl = document.getElementById(bot.id);
            botEl.classList.add('active-turn');
            elements.status.innerText = `${bot.label} thinking...`;
            await new Promise(r => setTimeout(r, 800));

            const res = evaluateHand(bot.hand, communityCards);
            let botAction = "";
            const randomFactor = Math.random();

            if (res.rank >= 4) {
                if (randomFactor > 0.5) {
                    const botRaiseBy = Math.floor(Math.random() * 40) + 20;
                    currentBet += botRaiseBy;
                    const costToBot = currentBet - bot.currentBotBet;
                    pot += costToBot;
                    bot.currentBotBet = currentBet;
                    botAction = `raises to ${currentBet}$`;
                    someoneRaised = true;
                } else {
                    const costToBot = currentBet - bot.currentBotBet;
                    pot += costToBot;
                    bot.currentBotBet = currentBet;
                    botAction = currentBet > bot.currentBotBet ? "calls" : "checks";
                }
            } else if (res.rank >= 2 || (phase < 4 && randomFactor > 0.7)) {
                if (randomFactor > 0.85) {
                    const botRaiseBy = 20;
                    currentBet += botRaiseBy;
                    const costToBot = currentBet - bot.currentBotBet;
                    pot += costToBot;
                    bot.currentBotBet = currentBet;
                    botAction = `raises to ${currentBet}$`;
                    someoneRaised = true;
                } else {
                    const costToBot = currentBet - bot.currentBotBet;
                    if (costToBot <= 120) {
                        pot += costToBot;
                        bot.currentBotBet = currentBet;
                        botAction = currentBet > 0 ? "calls" : "checks";
                    } else {
                        bot.active = false;
                        botAction = "folds";
                        botEl.style.opacity = "0.5";
                    }
                }
            } else {
                if (currentBet === bot.currentBotBet) {
                    botAction = "checks";
                } else if (currentBet - bot.currentBotBet <= 30) {
                    const costToBot = currentBet - bot.currentBotBet;
                    pot += costToBot;
                    bot.currentBotBet = currentBet;
                    botAction = "calls";
                } else {
                    bot.active = false;
                    botAction = "folds";
                    botEl.style.opacity = "0.5";
                }
            }

            elements.status.innerText = `${bot.label} ${botAction}`;
            await new Promise(r => setTimeout(r, 600));
            updateUI();
            botEl.classList.remove('active-turn');
        }

        if (!isUserAllIn && (someoneRaised || currentBet > userCurrentBet)) {
            elements.actions.style.display = 'grid';
            elements.status.innerText = "Someone raised! Your turn.";
        } else {
            advancePhase();
        }
    }

    // ===== NÄCHSTE STRASSE =====
    function advancePhase() {
        currentBet = 0;
        userCurrentBet = 0;
        bots.forEach(b => b.currentBotBet = 0);

        if (phase < 4) {
            const draw = phase === 1 ? 3 : 1;
            for (let i = 0; i < draw; i++) {
                communityCards.push(deck.pop());
            }
            phase++;
            elements.community.innerHTML = '';
            communityCards.forEach(c => renderCard(c, elements.community, false)); // Community-Karten immer offen

            if (!isUserAllIn) {
                elements.actions.style.display = 'grid';
            } else {
                setTimeout(() => processRound('call'), 1000);
            }
            updateUI();
        } else {
            showdown();
        }
    }

    // ===== SHOWDOWN =====
    function showdown() {
        const playerRes = evaluateHand(playerHand, communityCards);
        let bestBot = { val: 0, name: '', label: '' };
        bots.forEach(b => {
            if (b.active) {
                const slot = document.getElementById(`${b.id}-cards`);
                slot.innerHTML = '';
                b.hand.forEach(c => renderCard(c, slot, false)); // im Showdown immer offen
                const res = evaluateHand(b.hand, communityCards);
                if (res.val > bestBot.val) {
                    bestBot = { val: res.val, name: b.label, label: res.label };
                }
            }
        });

        if (playerRes.val >= bestBot.val) {
            balance += pot;
            elements.status.innerText = `YOU WIN ${pot}$!`;
        } else {
            elements.status.innerText = `${bestBot.name} wins with ${bestBot.label}.`;
        }
        pot = 0;
        currentBet = 0;
        userCurrentBet = 0;
        isUserAllIn = false;
        updateUI();
        elements.betControls.style.display = 'block';
        elements.actions.style.display = 'none';
        if (balance < 50) {
            isGameOver = true;
            elements.startBtn.innerText = "PLAY AGAIN";
            elements.status.innerText = "GAME OVER - No chips left!";
        }
    }

    // ===== SPIEL ZURÜCKSETZEN =====
    function resetGame() {
        balance = 1000;
        isGameOver = false;
        currentBet = 0;
        userCurrentBet = 0;
        isUserAllIn = false;
        elements.startBtn.innerText = "Start Game";
        elements.status.innerText = "Refilled! Ready to play?";
        elements.player.innerHTML = '';
        elements.community.innerHTML = '';
        bots.forEach(b => {
            const botEl = document.getElementById(b.id);
            botEl.style.opacity = "1";
            document.getElementById(`${b.id}-cards`).innerHTML = '';
        });
        updateUI();
    }

    // ===== EVENT LISTENER =====
    elements.startBtn.addEventListener('click', startNewGame);
    elements.callBtn.addEventListener('click', () => processRound('call'));
    elements.raiseBtn.addEventListener('click', () => {
        const val = parseInt(elements.raiseAmount.value);
        if (val > 0) {
            processRound('raise', val);
            elements.raiseAmount.value = '';
        }
    });
    elements.allinBtn.addEventListener('click', () => processRound('allin'));
    elements.foldBtn.addEventListener('click', () => {
        elements.status.innerText = "You Folded.";
        pot = 0;
        updateUI();
        elements.betControls.style.display = 'block';
        elements.actions.style.display = 'none';
        if (balance < 50) {
            isGameOver = true;
            elements.startBtn.innerText = "PLAY AGAIN";
        }
    });

    elements.raiseAmount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            elements.raiseBtn.click();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (elements.actions.style.display === 'grid') {
            const key = e.key.toLowerCase();
            if (key === 'f') {
                elements.foldBtn.click();
            } else if (key === 'c') {
                elements.callBtn.click();
            } else if (key === 'r') {
                elements.raiseAmount.focus();
                e.preventDefault();
            } else if (key === 'a') {
                elements.allinBtn.click();
            }
        }
    });

    // Initiale UI
    updateUI();
});