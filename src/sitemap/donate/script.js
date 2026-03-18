document.addEventListener("DOMContentLoaded", function() {

    const setupPopup = document.getElementById('setup-popup');
    const learningPopup = document.getElementById('learning-popup');
    const openSetup = document.getElementById('open-setup');
    const openLearning = document.getElementById('open-learning');
    const closeBtns = document.querySelectorAll('.close-popover');

    if (openSetup) {
        openSetup.addEventListener('click', () => setupPopup.classList.add('active'));
    }
    
    if (openLearning) {
        openLearning.addEventListener('click', () => learningPopup.classList.add('active'));
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setupPopup.classList.remove('active');
            learningPopup.classList.remove('active');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === setupPopup) setupPopup.classList.remove('active');
        if (e.target === learningPopup) learningPopup.classList.remove('active');
    });

});