document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleIcon = document.getElementById('toggle-icon');
    const cityInput = document.querySelector(".city-input");

    // Nav-Logik
    function closeMenu() {
        navOverlay.classList.remove('active');
        toggleIcon.src = "../icons/menu.png";
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = navOverlay.classList.toggle('active');
        toggleIcon.src = active ? "../icons/exit.png" : "../icons/menu.png";
    });

    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) closeMenu();
    });

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Floating Lights
    const lightCont = document.querySelector(".floating-lights");
    const particles = [];
    for (let i = 0; i < 25; i++) {
        const s = document.createElement("span");
        const size = Math.random() * 3 + 2;
        Object.assign(s.style, {
            width: size + "px", height: size + "px", position: "absolute",
            background: "rgba(255,255,255,0.4)", borderRadius: "50%",
            top: 0, left: 0
        });
        let x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight;
        const ang = Math.random() * 2 * Math.PI, spd = 0.2 + Math.random() * 0.3;
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

    // Weather Logic
    const API_KEY = "c82bd530a6c5357fb3b71ef2c9479a72";
    
    // Mapping für Icons
    const ICONS = {
        "clear": "Clear.svg", 
        "clouds": "Clouds.svg",
        "rain": "Rain.svg", 
        "drizzle": "Rain.svg",
        "thunderstorm": "Thunder.svg",
        "snow": "Snow.svg", 
        "mist": "Fog.svg",
        "smoke": "Fog.svg",
        "haze": "Fog.svg",
        "dust": "Fog.svg",
        "fog": "Fog.svg", 
        "hail": "Hail.svg"
    };

    async function fetchWeather(city) {
        if (!city) return;
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await res.json();
            if (data.cod !== 200) return;


            const currentTime = data.dt;
            const sunrise = data.sys.sunrise;
            const sunset = data.sys.sunset;
            const isNight = currentTime >= sunset || currentTime <= sunrise;


            document.querySelector(".country-txt").textContent = data.name;
            document.getElementById("Temperature").textContent = `${Math.round(data.main.temp)} °C`;
            document.getElementById("weather-type").textContent = data.weather[0].main;
            document.getElementById("Humidity-proc").textContent = `${data.main.humidity}%`;
            document.getElementById("Wind-speed").textContent = `${data.wind.speed} M/s`;

            //Icon 
            const mainIconType = data.weather[0].main.toLowerCase();
            let iconFile = ICONS[mainIconType] || ICONS["clear"];
            
            if (isNight) {
                iconFile = "Night_" + iconFile;
            }


            const mainWeatherImg = document.querySelector(".weather-icon-main");
            if (mainWeatherImg) {
                mainWeatherImg.src = `../icons/${iconFile}`;
                
                // Fallback: Falls das Night-Icon fehlt, lade das normale
                mainWeatherImg.onerror = function() {
                    mainWeatherImg.src = `../icons/${ICONS[mainIconType] || "Clear.svg"}`;
                    mainWeatherImg.onerror = null; 
                };
            }

            // Forecast Logic
            const resF = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            const dataF = await resF.json();
            const wrapper = document.getElementById("forecast-wrapper");
            wrapper.innerHTML = ""; 

            const today = new Date().getDate();
            const uniqueDays = [];
            
            dataF.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const d = date.getDate();
                if (d !== today && !uniqueDays.some(x => new Date(x.dt * 1000).getDate() === d)) {
                    uniqueDays.push(item);
                }
            });

            uniqueDays.slice(0, 5).forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
                const iconType = day.weather[0].main.toLowerCase();
                let forecastIcon = ICONS[iconType] || ICONS["clear"];
                
                wrapper.innerHTML += `
                    <div class="forecast-row">
                        <span class="day">${dayName}</span>
                        <img src="../icons/${forecastIcon}" alt="icon">
                        <span class="temp">${Math.round(day.main.temp)}°C</span>
                    </div>`;
            });
        } catch (err) { console.log(err); }
    }

    document.querySelector(".search-btn").addEventListener("click", () => fetchWeather(cityInput.value.trim()));
    cityInput.addEventListener("keydown", (e) => { if (e.key === "Enter") fetchWeather(cityInput.value.trim()); });
    
    document.getElementById("date").innerText = new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
    fetchWeather("Munich");
});
