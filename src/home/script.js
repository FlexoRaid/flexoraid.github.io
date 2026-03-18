document.addEventListener("DOMContentLoaded", function() {


    // Age counter


    const birth = new Date(2009, 6, 22, 12, 30);
        function updateAge() {
            const now = new Date();
            const diff = (now - birth) / (365.2425 * 24 * 60 * 60 * 1000);
            const ageEl = document.getElementById('age');
            if (ageEl) ageEl.textContent = diff.toFixed(8);
        }
        setInterval(updateAge, 100);


});