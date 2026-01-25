document.addEventListener("DOMContentLoaded", function() {
    const username = 'FlexoRaid';
    const sections = document.querySelectorAll('.section-center');
    const backToTopBtn = document.getElementById('back-to-top');

    // GitHub Stats Fetch
    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const data = await response.json();
            if (data) {
                document.getElementById('current-streak').innerText = data.public_repos;
                document.getElementById('longest-streak').innerText = data.followers;
                document.getElementById('total-contributions').innerText = data.public_repos * 12 + data.followers; 
            }
        } catch (e) { console.error("GitHub Error:", e); }
    }
    fetchGitHubStats();

    // Scroll Observer - Animation triggert jetzt jedes Mal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Entfernt die Klasse wieder, damit die Animation beim nächsten Scrollen erneut startet
                entry.target.classList.remove('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    });

    sections.forEach(sec => observer.observe(sec));

    // Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleIcon = document.getElementById('toggle-icon');

    function closeMenu() {
        navOverlay.classList.remove('active');
        toggleIcon.src = "icons/menu.png";
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = navOverlay.classList.toggle('active');
        toggleIcon.src = active ? "icons/exit.png" : "icons/menu.png";
    });

    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) closeMenu();
    });

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Back to Top
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 600);
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Age Calculation
    const birth = new Date(2009, 6, 22, 12, 30);
    function updateAge() {
        const now = new Date();
        const diff = (now - birth) / (365.2425 * 24 * 60 * 60 * 1000);
        const ageEl = document.getElementById('age');
        if (ageEl) ageEl.textContent = diff.toFixed(8);
    }
    setInterval(updateAge, 100);

    // Floating Background Lights
    const lightCont = document.querySelector(".floating-lights");
    const particles = [];
    const particleCount = 40;

    function createParticles() {
        lightCont.innerHTML = "";
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            const s = document.createElement("span");
            const size = Math.random() * 5 + 2;
            Object.assign(s.style, { 
                width: size + "px", 
                height: size + "px",
                opacity: Math.random() * 0.5 + 0.3
            });
            
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
});
