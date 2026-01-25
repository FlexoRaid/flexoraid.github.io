document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById('track');
    const progressLine = document.getElementById('progress-line');
    const triggerSection = document.querySelector('.horizontal-trigger');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const offsetTop = triggerSection.offsetTop;
        const totalHeight = triggerSection.offsetHeight - window.innerHeight;
        let scrollY = window.scrollY - offsetTop;

        if (scrollY >= 0 && scrollY <= totalHeight) {
            const percentage = scrollY / totalHeight;
            const maxTranslate = track.offsetWidth - window.innerWidth;
            track.style.transform = `translateX(-${percentage * maxTranslate}px)`;
            progressLine.style.width = `${percentage * 100}%`;
        }

        if (window.scrollY < offsetTop) {
            track.style.transform = `translateX(0)`;
            progressLine.style.width = `0%`;
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Menü Logik
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleIcon = document.getElementById('toggle-icon');

    function closeMenu() {
        navOverlay.classList.remove('active');
        toggleIcon.src = "../icons/menu.png";
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = navOverlay.classList.toggle('active');
        toggleIcon.src = active ? "../icons/exit.png" : "../icons/menu.png";
    });

    // Schließen beim Klick auf das Overlay (überall außerhalb der Links)
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            closeMenu();
        }
    });

    // Schließen beim Klick auf einen Nav-Link
    const navLinks = document.querySelectorAll('.mobile-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Floating Lights
    const lightCont = document.querySelector(".floating-lights");
    const particles = [];
    for (let i = 0; i < 20; i++) {
        const s = document.createElement("span");
        const size = Math.random() * 3 + 2;
        Object.assign(s.style, {
            width: size + "px", height: size + "px", position: "absolute",
            top: 0, left: 0, background: "rgba(255,255,255,0.2)", borderRadius: "50%"
        });
        let x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight;
        const ang = Math.random() * 2 * Math.PI, spd = 0.1 + Math.random() * 0.2;
        lightCont.appendChild(s);
        particles.push({ el: s, x, y, sx: Math.cos(ang) * spd, sy: Math.sin(ang) * spd });
    }
    function animate() {
        particles.forEach(p => {
            p.x += p.sx; p.y += p.sy;
            if (p.x < 0 || p.x > window.innerWidth) p.sx *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.sy *= -1;
            p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        });
        requestAnimationFrame(animate);
    }
    animate();
});