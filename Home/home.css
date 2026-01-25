document.addEventListener("DOMContentLoaded", function() {
    const username = 'FlexoRaid';
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleIcon = document.getElementById('toggle-icon');
    const header = document.getElementById('main-header');
    const profile = document.querySelector('.Profile');
    const sections = document.querySelectorAll('.section-center');
    const backToTopBtn = document.getElementById('back-to-top');

    // GitHub API Integration
    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const data = await response.json();
            if (data) {
                document.getElementById('current-streak').innerText = data.public_repos;
                document.getElementById('longest-streak').innerText = data.followers;
                document.getElementById('total-contributions').innerText = data.public_repos * 12 + data.followers; 
            }
        } catch (error) { 
            console.error("Fehler beim Laden der GitHub Stats:", error); 
        }
    }
    fetchGitHubStats();

    // Scroll-Konstanten
    const getScrollParams = () => {
        const vh = window.innerHeight;
        return {
            startPoint: vh * 0.8,
            displayDuration: vh * 1.5,
            fadeGap: vh * 0.8
        };
    };

    function updateScroll() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const { startPoint, displayDuration, fadeGap } = getScrollParams();
        
        // Header Handling: Profil verblassen lassen
        let profileOpacity = Math.max(1 - (scrollY / (vh * 0.8)), 0);
        if (profile) profile.style.opacity = profileOpacity;

        // Back-to-Top Button Sichtbarkeit (erscheint nach 100vh)
        if (backToTopBtn) {
            if (scrollY > vh * 1.0) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Sektionen Handling
        sections.forEach((sec, index) => {
            const myStart = startPoint + (index * (displayDuration + fadeGap));
            const myFullStart = myStart + fadeGap;
            const myFullEnd = myFullStart + displayDuration;
            const myEnd = myFullEnd + fadeGap;

            let opacity = 0;

            if (scrollY > myStart && scrollY <= myFullStart) {
                opacity = (scrollY - myStart) / fadeGap;
            } else if (scrollY > myFullStart && scrollY <= myFullEnd) {
                opacity = 1;
            } else if (scrollY > myFullEnd && scrollY <= myEnd) {
                opacity = 1 - ((scrollY - myFullEnd) / fadeGap);
            }

            sec.style.opacity = opacity;
            
            if (opacity > 0.1) {
                sec.classList.add('visible');
            } else {
                sec.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', updateScroll);
    updateScroll();

    // Back-to-Top Funktionalität
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const active = navOverlay.classList.toggle('active');
            toggleIcon.src = active ? "icons/exit.png" : "icons/menu.png";
        });
    }

    // Schließen des Menüs bei Klick auf das Overlay (Hintergrund)
    if (navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            // Nur schließen, wenn man das Overlay selbst anklickt und nicht die Nav-Links darin
            if (e.target === navOverlay) {
                navOverlay.classList.remove('active');
                toggleIcon.src = "icons/menu.png";
            }
        });
    }

    // Navigation
    const navLinks = document.querySelectorAll('.mobile-nav a');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const { startPoint, displayDuration, fadeGap } = getScrollParams();
                    const sectionIndex = Array.from(sections).indexOf(targetSection);
                    
                    if (sectionIndex !== -1) {
                        const scrollToPos = startPoint + 
                                          (sectionIndex * (displayDuration + fadeGap)) + 
                                          fadeGap + 
                                          (displayDuration / 2);
                        
                        window.scrollTo({
                            top: scrollToPos,
                            behavior: 'smooth'
                        });
                    }
                }
                navOverlay.classList.remove('active');
                toggleIcon.src = "icons/menu.png";
            }
        });
    });

    // Floating Background Lights
    const lightCont = document.querySelector(".floating-lights");
    if (lightCont) {
        const particles = [];
        for (let i = 0; i < 50; i++) {
            const s = document.createElement("span");
            const size = Math.random() * 5 + 3;
            s.style.width = size + "px"; 
            s.style.height = size + "px";
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            const ang = Math.random() * 2 * Math.PI;
            const spd = 0.2 + Math.random() * 0.3;
            lightCont.appendChild(s);
            particles.push({ el: s, x, y, sx: Math.cos(ang) * spd, sy: Math.sin(ang) * spd });
        }

        function animate() {
            particles.forEach(p => {
                p.x += p.sx; 
                p.y += p.sy;
                if (p.x < 0 || p.x > window.innerWidth) p.sx *= -1;
                if (p.y < 0 || p.y > window.innerHeight) p.sy *= -1;
                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});

(function() {
    const birth = new Date(2009, 6, 22, 12, 30);

    function calculateAgeYearsDecimal(birthDate) {
        const now = new Date();
        const diffMs = now - birthDate;
        const msPerYear = 365.2425 * 24 * 60 * 60 * 1000;
        return diffMs / msPerYear;
    }

    function updateAgeDisplay() {
        const yearsDecimal = calculateAgeYearsDecimal(birth);
        const formatted = yearsDecimal.toFixed(2);
        const ageP = document.getElementById('age');
        if (ageP) {
            ageP.textContent = `${formatted}`;
        }
    }

    setInterval(updateAgeDisplay, 1000);
    updateAgeDisplay();
})();
