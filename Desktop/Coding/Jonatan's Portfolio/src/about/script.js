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

});