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

    // ===== COLORS & THEMES =====
    const defaultThemes = {
        'aqua-laguna': {
            accent: '#00FFEF',
            bg1: '#006D66',
            bg2: '#001F1D'
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
        },
        'bloodbath': {
            accent: '#FF4040',
            bg1: '#800000',
            bg2: '#100000'
        },
        'nebula': {
            accent: '#bd00ff',
            bg1: '#140a1f',
            bg2: '#000'
        }
    };

    let customColors = {
        accent: localStorage.getItem('customAccent') || '#48cae4',
        bg1: localStorage.getItem('customBg1') || '#023e8a',
        bg2: localStorage.getItem('customBg2') || '#010214'
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
        const savedTheme = localStorage.getItem('selectedTheme') || 'deep-sea';
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

    // ===== FLOATING LIGHTS TOGGLE =====
    const floatingToggle = document.getElementById('floating-lights-toggle');
    const lightCont = document.querySelector(".floating-lights");

    let lightsEnabled = localStorage.getItem('floatingLights') !== 'false';
    let lightsAnimationFrame = null;

    function startLightsAnimation() {
        if (!lightCont) return;
        if (!lightsEnabled) return; 
        
        const particles = [];
        const particleCount = 20;

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
                    opacity: Math.random() * 0.5 + 0.2
                });
                
                s.style.boxShadow = `0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px ${accentColor}`;

                let x = Math.random() * window.innerWidth;
                let y = Math.random() * window.innerHeight;
                const ang = Math.random() * 2 * Math.PI;
                const spd = 0.2 + Math.random() * 0.3;

                lightCont.appendChild(s);
                particles.push({ el: s, x, y, sx: Math.cos(ang) * spd, sy: Math.sin(ang) * spd });
            }
        }

        createParticles();

        function animate() {
            for (let p of particles) {
                p.x += p.sx; 
                p.y += p.sy;
                
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;

                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            }
            lightsAnimationFrame = requestAnimationFrame(animate);
        }
        animate();

        function onResize() {
            if (lightsEnabled) {
                createParticles();
            }
        }
        window.addEventListener('resize', onResize);
    }

    function stopLightsAnimation() {
        if (lightsAnimationFrame) {
            cancelAnimationFrame(lightsAnimationFrame);
            lightsAnimationFrame = null;
        }
        if (lightCont) {
            lightCont.innerHTML = "";
        }
    }

    function updateFloatingLightsVisibility() {
        if (lightsEnabled) {
            startLightsAnimation();
        } else {
            stopLightsAnimation();
        }
        if (floatingToggle) floatingToggle.checked = lightsEnabled;
        localStorage.setItem('floatingLights', lightsEnabled);
    }

    updateFloatingLightsVisibility();

    if (floatingToggle) {
        floatingToggle.addEventListener('change', function(e) {
            lightsEnabled = e.target.checked;
            updateFloatingLightsVisibility();
            updateAllToggle();
        });
    }

    // ===== PARTICLE TOGGLES (All, Comets, Planets) =====
    const allToggle = document.getElementById('particles-all-toggle');
    const cometsToggle = document.getElementById('comets-toggle');
    const planetsToggle = document.getElementById('planets-toggle');
    const planetContainer = document.querySelector('.space-objects');
    const cometContainer = document.querySelector('.comet-container');

    let cometsEnabled = localStorage.getItem('particlesComets') !== 'false';
    let planetsEnabled = localStorage.getItem('particlesPlanets') !== 'false';

    let planetsAnimationFrame = null;
    let planets = [];

    function startPlanetsAnimation() {
        if (!planetsEnabled) return;
        function animate() {
            if (!planetsEnabled) return;
            for (let p of planets) {
                p.angle += p.speed;
                const x = p.centerX + Math.cos(p.angle) * p.radiusX;
                const y = p.centerY + Math.sin(p.angle) * p.radiusY;
                p.img.style.left = x + 'px';
                p.img.style.top = y + 'px';
            }
            planetsAnimationFrame = requestAnimationFrame(animate);
        }
        animate();
    }

    function stopPlanetsAnimation() {
        if (planetsAnimationFrame) {
            cancelAnimationFrame(planetsAnimationFrame);
            planetsAnimationFrame = null;
        }
    }

    function updatePlanetsVisibility() {
        if (planetContainer) {
            if (planetsEnabled) {
                planetContainer.classList.remove('hidden');
                startPlanetsAnimation();
            } else {
                planetContainer.classList.add('hidden');
                stopPlanetsAnimation();
            }
        }
        if (planetsToggle) planetsToggle.checked = planetsEnabled;
        localStorage.setItem('particlesPlanets', planetsEnabled);
    }

    // Kometen
    let activeComets = 0;
    const MAX_COMETS = 2;
    let cometScheduleTimeout = null;

    function createComet() {
        if (!cometsEnabled || activeComets >= MAX_COMETS) return;
        activeComets++;

        const img = document.createElement('img');
        img.src = imgPath + 'comet.png';
        img.alt = 'Comet';

        const fromTop = Math.random() < 0.5;
        let startX, startY;

        if (fromTop) {
            startX = Math.random() * window.innerWidth;
            startY = -60;
        } else {
            startX = -60;
            startY = Math.random() * window.innerHeight;
        }

        img.style.left = startX + 'px';
        img.style.top = startY + 'px';

        const baseSpeed = 1.5 + Math.random() * 2;
        let speedX = baseSpeed * (0.7 + Math.random() * 0.6);
        let speedY = baseSpeed * (0.7 + Math.random() * 0.6);

        let rotation = Math.random() * 360;
        const rotSpeed = (Math.random() - 0.5) * 4;

        cometContainer.appendChild(img);

        function animateComet() {
            if (!cometsEnabled) {
                img.remove();
                activeComets--;
                return;
            }
            const currentLeft = parseFloat(img.style.left);
            const currentTop = parseFloat(img.style.top);
            const newLeft = currentLeft + speedX;
            const newTop = currentTop + speedY;
            img.style.left = newLeft + 'px';
            img.style.top = newTop + 'px';

            rotation += rotSpeed;
            img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

            if (newLeft < window.innerWidth + 200 && newTop < window.innerHeight + 200) {
                requestAnimationFrame(animateComet);
            } else {
                img.remove();
                activeComets--;
            }
        }
        requestAnimationFrame(animateComet);
    }

    function scheduleComet() {
        if (!cometsEnabled) return;
        const delay = 5000 + Math.random() * 7000;
        cometScheduleTimeout = setTimeout(() => {
            createComet();
            scheduleComet();
        }, delay);
    }

    function stopComets() {
        if (cometScheduleTimeout) {
            clearTimeout(cometScheduleTimeout);
            cometScheduleTimeout = null;
        }
        if (cometContainer) {
            cometContainer.innerHTML = '';
        }
        activeComets = 0;
    }

    function updateCometsVisibility() {
        if (cometsEnabled) {
            cometContainer.classList.remove('hidden');
            scheduleComet();
        } else {
            cometContainer.classList.add('hidden');
            stopComets();
        }
        if (cometsToggle) cometsToggle.checked = cometsEnabled;
        localStorage.setItem('particlesComets', cometsEnabled);
    }

    function updateAllToggle() {
        if (allToggle) {
            allToggle.checked = cometsEnabled && planetsEnabled && lightsEnabled;
        }
    }

    if (planetContainer) {
        const planetFiles = ['planet1.png', 'planet2.png', 'planet3.png'];

        planetFiles.forEach((file, index) => {
            const img = document.createElement('img');
            img.src = imgPath + file;
            img.alt = 'Planet';
            planetContainer.appendChild(img);

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radiusX = 350 + index * 100;
            const radiusY = 220 + index * 80;
            const speed = 0.001 + index * 0.0002;
            let angle = index * (Math.PI / 1.5);

            planets.push({ img, centerX, centerY, radiusX, radiusY, speed, angle });
        });

        window.addEventListener('resize', () => {
            planets.forEach(p => {
                p.centerX = window.innerWidth / 2;
                p.centerY = window.innerHeight / 2;
            });
        });
    }

    updatePlanetsVisibility();
    updateCometsVisibility();
    updateAllToggle();

    if (planetsToggle) {
        planetsToggle.addEventListener('change', function(e) {
            planetsEnabled = e.target.checked;
            updatePlanetsVisibility();
            updateAllToggle();
        });
    }

    if (cometsToggle) {
        cometsToggle.addEventListener('change', function(e) {
            cometsEnabled = e.target.checked;
            updateCometsVisibility();
            updateAllToggle();
        });
    }

    if (allToggle) {
        allToggle.addEventListener('change', function(e) {
            const newState = e.target.checked;
            // Floating Lights
            lightsEnabled = newState;
            updateFloatingLightsVisibility();
            // Comets
            cometsEnabled = newState;
            updateCometsVisibility();
            // Planets
            planetsEnabled = newState;
            updatePlanetsVisibility();
        });
    }


    // ===== LAST.FM WIDGET =====
    const LASTFM_API_KEY = '65ae5ae340310fcf69c1cf58e7d13262';
    const LASTFM_USER = 'Jonatanp_0';

    const widget = document.getElementById('lastfm-widget');
    const handle = document.getElementById('lastfm-handle');
    let isWidgetVisible = false;
    let closeTimeout = null;

    function showWidget() {
        if (closeTimeout) clearTimeout(closeTimeout);
        if (!isWidgetVisible) {
            widget.classList.add('visible');
            isWidgetVisible = true;
        }
    }

    function hideWidget() {
        if (closeTimeout) clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
            widget.classList.remove('visible');
            isWidgetVisible = false;
        }, 300);
    }

    function cancelHide() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    }

    function updateMusic() {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const track = data.recenttracks.track[0];
                if (!track) throw new Error('Keine Tracks gefunden');

                document.getElementById('track-name').innerText = track.name;
                document.getElementById('track-artist').innerText = track.artist['#text'];
                document.getElementById('track-link').href = track.url;

                const imgUrl = track.image.find(img => img.size === 'large')['#text'];
                const imgElement = document.getElementById('track-image');
                if (imgUrl) {
                    imgElement.src = imgUrl;
                    imgElement.style.display = 'block';
                } else {
                    imgElement.style.display = 'none';
                }

                const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
                const statusLabel = document.getElementById('status-label');
                statusLabel.innerText = isPlaying ? '🎵 currently listening' : '⏮ recently played';
                statusLabel.style.borderColor = isPlaying ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)';
            })
            .catch(err => {
                console.warn('Last.fm Fehler:', err);
                document.getElementById('track-name').innerText = 'Error';
                document.getElementById('track-artist').innerText = '';
                document.getElementById('track-image').style.display = 'none';
                document.getElementById('status-label').innerText = '⛔ no connection';
            });
    }

    if (widget && handle) {
        handle.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                cancelHide();
                showWidget();
            }
        });
        handle.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                hideWidget();
            }
        });
        widget.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                cancelHide();
            }
        });
        widget.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                hideWidget();
            }
        });

        // Mobile: Click toggel
        handle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                if (isWidgetVisible) {
                    widget.classList.remove('visible');
                    isWidgetVisible = false;
                } else {
                    widget.classList.add('visible');
                    isWidgetVisible = true;
                }
            }
        });
        widget.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                widget.classList.remove('visible');
                isWidgetVisible = false;
            }
        });
    }

    updateMusic();
    setInterval(updateMusic, 10000);
});