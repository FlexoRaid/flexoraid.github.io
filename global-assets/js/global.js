document.addEventListener("DOMContentLoaded", function() {

    window.isXRayActive = false;
    
    // ===== PATH =====
    const path = window.location.pathname;
    let imgPath = "img/";

    if (path.includes('/blackjack/') || path.includes('/donate/') || path.includes('/movie/') ||
        path.includes('/poker/') || path.includes('/roulette/') || path.includes('/slots/')) {
        imgPath = "../../../img/";
    }
    else if (path.includes('/about/') || path.includes('/projects/') || path.includes('/weather/') || path.includes('/sitemap/')) {
        imgPath = "../../img/";
    }
    else if (path.includes('/src/')) {
        imgPath = "../img/";
    }
    else {
        imgPath = "img/";
    }

    function getIconPath(iconName, isActive) {
        return isActive ? imgPath + "exit.png" : imgPath + iconName;
    }

    // ===== FARBEN & THEMES =====
    const defaultThemes = {
        'dark-blood': {
            accent: '#b40000',
            bg1: '#1a1a1b',
            bg2: '#000000'
        },
        'deep-sea': {
            accent: '#48cae4',
            bg1: '#023e8a',
            bg2: '#010214'
        },
        'jungle': {
            accent: '#ffff00',
            bg1: '#318145',
            bg2: '#01282b'
        }
    };

    let customColors = {
        accent: localStorage.getItem('customAccent') || '#b40000',
        bg1: localStorage.getItem('customBg1') || '#1a1a1b',
        bg2: localStorage.getItem('customBg2') || '#000000'
    };

    function applyColors(accent, bg1, bg2) {
        const root = document.documentElement;
        root.style.setProperty('--color-accent', accent);
        root.style.setProperty('--bg-color1', bg1);
        root.style.setProperty('--bg-color2', bg2);
        
        const r = parseInt(accent.slice(1,3), 16);
        const g = parseInt(accent.slice(3,5), 16);
        const b = parseInt(accent.slice(5,7), 16);
        root.style.setProperty('--color-accent-rgb', `${r}, ${g}, ${b}`);

        document.querySelectorAll('.floating-lights span').forEach(span => {
            span.style.boxShadow = `0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px ${accent}`;
        });

        localStorage.setItem('customAccent', accent);
        localStorage.setItem('customBg1', bg1);
        localStorage.setItem('customBg2', bg2);
        localStorage.setItem('usingCustomTheme', 'true');
        
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.checked = false;
        });

        updateColorInputs(accent, bg1, bg2);
    }

    function applyTheme(themeId) {
        const theme = defaultThemes[themeId];
        if (!theme) return;

        applyColors(theme.accent, theme.bg1, theme.bg2);
        localStorage.setItem('selectedTheme', themeId);
        localStorage.setItem('usingCustomTheme', 'false');
        
        const radio = document.getElementById(themeId);
        if (radio) radio.checked = true;
    }

    function updateColorInputs(accent, bg1, bg2) {
        const accentInput = document.getElementById('custom-accent');
        const bg1Input = document.getElementById('custom-bg1');
        const bg2Input = document.getElementById('custom-bg2');
        const accentHex = document.getElementById('custom-accent-hex');
        const bg1Hex = document.getElementById('custom-bg1-hex');
        const bg2Hex = document.getElementById('custom-bg2-hex');

        if (accentInput) accentInput.value = accent;
        if (bg1Input) bg1Input.value = bg1;
        if (bg2Input) bg2Input.value = bg2;
        if (accentHex) accentHex.value = accent.toUpperCase();
        if (bg1Hex) bg1Hex.value = bg1.toUpperCase();
        if (bg2Hex) bg2Hex.value = bg2.toUpperCase();
    }

    const usingCustomTheme = localStorage.getItem('usingCustomTheme') === 'true';
    if (usingCustomTheme) {
        applyColors(customColors.accent, customColors.bg1, customColors.bg2);
    } else {
        const savedTheme = localStorage.getItem('selectedTheme') || 'dark-blood';
        applyTheme(savedTheme);
    }

    // ===== NAVIGATION MENU =====
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.nav-overlay');
    const menuIcon = document.querySelector('.menu-icon');

    if (menuIcon) {
        menuIcon.src = imgPath + 'menu.png';
    }

    function closeMenu() {
        if (menuOverlay) menuOverlay.classList.remove('active');
        if (menuIcon) menuIcon.src = getIconPath("menu.png", false);
    }

    if (menuButton && menuOverlay && menuIcon) {
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = menuOverlay.classList.contains('active');
            menuOverlay.classList.toggle('active');
            menuIcon.src = isActive ? getIconPath("menu.png", false) : getIconPath("exit.png", true);
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) closeMenu();
        });
    }

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ===== SETTINGS MENU =====
    const settingsButton = document.querySelector('.settings-button');
    const settingsOverlay = document.querySelector('.settings-overlay');
    const settingsIcon = document.querySelector('.settings-icon');

    if (settingsIcon) {
        settingsIcon.src = imgPath + 'settings.png';
    }

    function closeSettings() {
        if (settingsOverlay) settingsOverlay.classList.remove('active');
        if (settingsIcon) settingsIcon.src = getIconPath("settings.png", false);
    }

    if (settingsButton && settingsOverlay && settingsIcon) {
        settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = settingsOverlay.classList.contains('active');
            settingsOverlay.classList.toggle('active');
            settingsIcon.src = isActive ? getIconPath("settings.png", false) : getIconPath("exit.png", true);
        });
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) closeSettings();
        });
    }

    // ===== CUSTOM COLOR PICKER =====
    function initColorPicker() {
        const accentInput = document.getElementById('custom-accent');
        const bg1Input = document.getElementById('custom-bg1');
        const bg2Input = document.getElementById('custom-bg2');
        const accentHex = document.getElementById('custom-accent-hex');
        const bg1Hex = document.getElementById('custom-bg1-hex');
        const bg2Hex = document.getElementById('custom-bg2-hex');
        const applyCustomBtn = document.getElementById('apply-custom');

        function setColorFromHex(hexInput, colorInput, hexValue) {
            let match6 = hexValue.match(/^#?([0-9A-F]{6})$/i);
            if (match6) {
                let fullHex = '#' + match6[1].toUpperCase();
                colorInput.value = fullHex;
                hexInput.value = fullHex;
                return true;
            }
            return false;
        }

        if (accentInput && accentHex) {
            accentInput.addEventListener('input', function(e) {
                accentHex.value = e.target.value.toUpperCase();
            });
        }
        if (bg1Input && bg1Hex) {
            bg1Input.addEventListener('input', function(e) {
                bg1Hex.value = e.target.value.toUpperCase();
            });
        }
        if (bg2Input && bg2Hex) {
            bg2Input.addEventListener('input', function(e) {
                bg2Hex.value = e.target.value.toUpperCase();
            });
        }

        if (accentHex && accentInput) {
            accentHex.addEventListener('input', function(e) {
                setColorFromHex(accentHex, accentInput, e.target.value);
            });
            accentHex.addEventListener('blur', function(e) {
                let value = e.target.value;
                let match3 = value.match(/^#?([0-9A-F]{3})$/i);
                if (match3) {
                    let expanded = '#' + match3[1].split('').map(c => c + c).join('').toUpperCase();
                    accentInput.value = expanded;
                    accentHex.value = expanded;
                } else {
                    setColorFromHex(accentHex, accentInput, value);
                }
            });
        }

        if (bg1Hex && bg1Input) {
            bg1Hex.addEventListener('input', function(e) {
                setColorFromHex(bg1Hex, bg1Input, e.target.value);
            });
            bg1Hex.addEventListener('blur', function(e) {
                let value = e.target.value;
                let match3 = value.match(/^#?([0-9A-F]{3})$/i);
                if (match3) {
                    let expanded = '#' + match3[1].split('').map(c => c + c).join('').toUpperCase();
                    bg1Input.value = expanded;
                    bg1Hex.value = expanded;
                } else {
                    setColorFromHex(bg1Hex, bg1Input, value);
                }
            });
        }

        if (bg2Hex && bg2Input) {
            bg2Hex.addEventListener('input', function(e) {
                setColorFromHex(bg2Hex, bg2Input, e.target.value);
            });
            bg2Hex.addEventListener('blur', function(e) {
                let value = e.target.value;
                let match3 = value.match(/^#?([0-9A-F]{3})$/i);
                if (match3) {
                    let expanded = '#' + match3[1].split('').map(c => c + c).join('').toUpperCase();
                    bg2Input.value = expanded;
                    bg2Hex.value = expanded;
                } else {
                    setColorFromHex(bg2Hex, bg2Input, value);
                }
            });
        }

        if (applyCustomBtn) {
            applyCustomBtn.addEventListener('click', function() {
                if (accentInput && bg1Input && bg2Input) {
                    applyColors(accentInput.value, bg1Input.value, bg2Input.value);
                    setTimeout(closeSettings, 500);
                }
            });
        }
    }

    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                applyTheme(this.id);
                setTimeout(closeSettings, 300);
            }
        });
    });

    initColorPicker();

    // ===== OVERLAY SCROLL FIX =====
    const overlays = document.querySelectorAll('.overlay');
    const body = document.body;

    overlays.forEach(overlay => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (overlay.classList.contains('active')) {
                        body.classList.add('overlay-open');
                    } else {
                        const anyActive = Array.from(overlays).some(o => o.classList.contains('active'));
                        if (!anyActive) {
                            body.classList.remove('overlay-open');
                        }
                    }
                }
            });
        });
        observer.observe(overlay, { attributes: true });
    });

    // ===== SECTION ANIMATIONS =====
    const sections = document.querySelectorAll('.section-center');
    const backToTopBtn = document.getElementById('back-to-top');

    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('visible', entry.isIntersecting);
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        sections.forEach(sec => observer.observe(sec));
    }

    // ===== ADMIN LOGIC =====
    const adminTrigger = document.getElementById('admin-trigger');
    const adminOverlay = document.getElementById('admin-overlay');
    const adminPwInput = document.getElementById('admin-pw');
    const moneyAmountInput = document.getElementById('money-amount');
    const stepPw = document.getElementById('step-password');
    const stepMoney = document.getElementById('step-money');
    const adminTitle = document.getElementById('admin-title');
    const xrayToggle = document.getElementById('xray-toggle');

    if (adminTrigger && adminOverlay) {
        adminTrigger.addEventListener('click', () => {
            adminOverlay.classList.add('active');
            if (adminPwInput) adminPwInput.focus();
        });
    }

    window.closeAdmin = function() {
        if (adminOverlay) adminOverlay.classList.remove('active');
        if (stepPw) stepPw.style.display = 'block';
        if (stepMoney) stepMoney.style.display = 'none';
        if (adminPwInput) adminPwInput.value = '';
        if (adminTitle) adminTitle.innerText = "Security Check";
    };

    window.checkAdminPw = function() {
        if (adminPwInput && adminPwInput.value === "tomato") {
            if (stepPw) stepPw.style.display = 'none';
            if (stepMoney) stepMoney.style.display = 'block';
            if (adminTitle) adminTitle.innerText = "Admin Panel";
            setTimeout(() => { if (moneyAmountInput) moneyAmountInput.focus(); }, 50);
        } else {
            alert("Wrong Password!");
            if (adminPwInput) adminPwInput.value = '';
        }
    };

    window.toggleXRay = function(active) {
        window.isXRayActive = active;
        if (typeof refreshDealerDisplay === 'function') refreshDealerDisplay();
        if (typeof updateFutureCard === 'function') updateFutureCard();
        if (typeof updateBars === 'function') updateBars();
        if (typeof window.updateBotCardsVisibility === 'function') {
            window.updateBotCardsVisibility();
        }
    };

    window.addMoney = function() {
        console.warn("addMoney() wurde aufgerufen, aber kein Spiel hat eine eigene Funktion bereitgestellt.");
        alert("Geld hinzufügen ist auf dieser Seite nicht verfügbar.");
    };

    if (adminPwInput) {
        adminPwInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.checkAdminPw();
        });
    }

    if (moneyAmountInput) {
        moneyAmountInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.addMoney();
        });
    }

    // ===== BACK TO TOP BUTTON =====
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ===== FLOATING LIGHT PARTICLES =====
    const lightCont = document.querySelector(".floating-lights");
    if (lightCont) {
        const particles = [];
        const particleCount = 40;

        function createParticles() {
            lightCont.innerHTML = "";
            particles.length = 0;
            
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#b40000';

            for (let i = 0; i < particleCount; i++) {
                const s = document.createElement("span");
                const size = Math.random() * 5 + 2;
                Object.assign(s.style, { 
                    width: size + "px", 
                    height: size + "px",
                    opacity: Math.random() * 0.5 + 0.3
                });
                
                s.style.boxShadow = `0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px ${accentColor}`;

                let x = Math.random() * window.innerWidth;
                let y = Math.random() * window.innerHeight;
                const ang = Math.random() * 2 * Math.PI;
                const spd = 0.3 + Math.random() * 0.5;

                lightCont.appendChild(s);
                particles.push({ el: s, x, y, sx: Math.cos(ang) * spd, sy: Math.sin(ang) * spd });
            }
        }

        createParticles();
        window.addEventListener('resize', createParticles);

        function animate() {
            particles.forEach(p => {
                p.x += p.sx; 
                p.y += p.sy;
                
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;

                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});