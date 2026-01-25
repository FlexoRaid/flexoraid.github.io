// ---------- CONFIG ----------
const API_KEY = "c82bd530a6c5357fb3b71ef2c9479a72";

// Pfade zu den SVG-Dateien im globalen icons-Ordner
// Exakt angepasst an deine Dateinamen (Groß-/Kleinschreibung & Unterstriche)
const ICONS = {
    "clear": "../icons/Clear.svg",
    "clouds": "../icons/Clouds.svg",
    "rain": "../icons/Rain.svg",
    "thunder": "../icons/Thunder.svg",
    "snow": "../icons/Snow.svg",
    "fog": "../icons/Fog.svg",
    "hail": "../icons/Hail.svg",
    // Night Icons (Nutzen Unterstriche laut deinem Explorer-Bild)
    "night + clear": "../icons/Night_clear.svg",
    "night + clouds": "../icons/Night_clouds.svg",
    "night + rain": "../icons/Night_rain.svg",
    "night + thunder": "../icons/Night_thunder.svg",
    "night + snow": "../icons/Night_snow.svg",
    "night + fog": "../icons/Night_fog.svg",
    "night + hail": "../icons/Night_hail.svg",
};

// ---------- DOM Elements ----------
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const countryTxt = document.querySelector(".country-txt");
const temperatureTxt = document.getElementById("Temperature");
const weatherTypeTxt = document.getElementById("weather-type");
const humidityTxt = document.getElementById("Humidity-proc");
const windTxt = document.getElementById("Wind-speed");
const weatherIcon = document.querySelector(".weather-icon");
const daysDivs = document.querySelectorAll(".Days");
const forecastContainer = document.querySelector(".Weather-5-Days");

// ---------- HELPERS ----------
function getCurrentIcon(weather, timestamp, sunrise, sunset) {
    const isNight = timestamp < sunrise || timestamp > sunset;
    const mapping = {
        "clear": "clear",
        "clouds": "clouds",
        "rain": "rain",
        "drizzle": "rain",
        "thunderstorm": "thunder",
        "snow": "snow",
        "fog": "fog",
        "mist": "fog",
        "haze": "fog",
        "hail": "hail"
    };
    let baseIcon = mapping[weather] || "clear";
    return isNight ? `night + ${baseIcon}` : baseIcon;
}

function getDayIcon(weather) {
    const mapping = {
        "clear": "clear",
        "clouds": "clouds",
        "rain": "rain",
        "drizzle": "rain",
        "thunderstorm": "thunder",
        "snow": "snow",
        "fog": "fog",
        "mist": "fog",
        "haze": "fog",
        "hail": "hail"
    };
    return mapping[weather] || "clear";
}

// ---------- FETCH WEATHER ----------
async function fetchWeather(city) {
    try {
        const resCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!resCurrent.ok) throw new Error("City not found");
        
        const dataCurrent = await resCurrent.json();

        const temp = Math.round(dataCurrent.main.temp);
        const weatherMain = dataCurrent.weather[0].main.toLowerCase();
        
        // Logik zur Bestimmung des richtigen Icons (Tag/Nacht)
        const iconKey = getCurrentIcon(weatherMain, dataCurrent.dt, dataCurrent.sys.sunrise, dataCurrent.sys.sunset);

        countryTxt.textContent = dataCurrent.name;
        temperatureTxt.textContent = `${temp} °C`;
        weatherTypeTxt.textContent = weatherMain.charAt(0).toUpperCase() + weatherMain.slice(1);
        
        // Icon-Pfad aus dem ICONS-Objekt setzen
        weatherIcon.src = ICONS[iconKey] || ICONS["clear"];
        
        humidityTxt.textContent = `${dataCurrent.main.humidity}%`;
        windTxt.textContent = `${dataCurrent.wind.speed} M/s`;

        // 5-Tage Vorhersage
        const resForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const dataForecast = await resForecast.json();

        let dayIndex = 0;
        const usedDays = new Set();
        const today = new Date().getDate();

        // Vorhersage-Container leeren, bevor neu befüllt wird (optional, falls nötig)
        daysDivs.forEach(div => div.innerHTML = "");

        for (let i = 0; i < dataForecast.list.length && dayIndex < daysDivs.length; i++) {
            const dayData = dataForecast.list[i];
            const date = new Date(dayData.dt * 1000);
            const dayNumber = date.getDate();

            if (dayNumber === today) continue;
            if (usedDays.has(dayNumber)) continue;
            usedDays.add(dayNumber);

            const dayWeather = dayData.weather[0].main.toLowerCase();
            const dayIconKey = getDayIcon(dayWeather);

            daysDivs[dayIndex].innerHTML = `
                <h5>${date.toLocaleDateString("en-GB", { weekday: "short" })}</h5>
                <img src="${ICONS[dayIconKey]}" class="weather-icon" alt="${dayWeather}">
                <h5>${Math.round(dayData.main.temp)}°C</h5>
            `;

            dayIndex++;
        }

    } catch (err) {
        console.error("Weather Fetch Error:", err);
    }
}

// ---------- EVENT LISTENERS ----------
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") searchBtn.click();
});

forecastContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    forecastContainer.scrollLeft += e.deltaY;
}, { passive: false });

// ---------- INITIAL ----------
document.getElementById("date").innerText = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
});

fetchWeather("Munich");