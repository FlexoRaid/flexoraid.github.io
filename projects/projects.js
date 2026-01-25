document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleIcon = document.getElementById('toggle-icon');

    // Funktion zum Schließen
    function closeMenu() {
        navOverlay.classList.remove('active');
        toggleIcon.src = "../icons/menu.png";
    }

    // Toggle Button
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = navOverlay.classList.toggle('active');
        toggleIcon.src = active ? "../icons/exit.png" : "../icons/menu.png";
    });

    // Schließen wenn man auf das Overlay klickt (Click-Away)
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            closeMenu();
        }
    });

    // Floating Lights Logik
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
            const spd = 0.2 + Math.random() * 0.4;

            lightCont.appendChild(s);
            particles.push({ 
                el: s, 
                x: x, 
                y: y, 
                sx: Math.cos(ang) * spd, 
                sy: Math.sin(ang) * spd 
            });
        }
    }

    createParticles();
    window.addEventListener('resize', createParticles);

    function animate() {
        particles.forEach(p => {
            p.x += p.sx; 
            p.y += p.sy;
            
            if (p.x < -10) p.x = window.innerWidth + 10;
            if (p.x > window.innerWidth + 10) p.x = -10;
            if (p.y < -10) p.y = window.innerHeight + 10;
            if (p.y > window.innerHeight + 10) p.y = -10;

            p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        });
        requestAnimationFrame(animate);
    }
    
    animate();
});