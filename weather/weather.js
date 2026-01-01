// ---------- CONFIG ----------
const API_KEY = "c82bd530a6c5357fb3b71ef2c9479a72";

// SVG-Dateien
const ICONS = {
    "clear": "Clear.svg",
    "clouds": "Clouds.svg",
    "rain": "Rain.svg",
    "thunder": "Thunder.svg",
    "snow": "Snow.svg",
    "fog": "Fog.svg",
    "hail": "Hail.svg",
    //night
    "night + clear": "Night_clear.svg",
    "night + clouds": "Night_clouds.svg",
    "night + rain": "Night_rain.svg",
    "night + thunder": "Night_thunder.svg",
    "night + snow": "Night_snow.svg",
    "night + fog": "Night_fog.svg",
    "night + hail": "Night_hail.svg",
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
        "thunderstorm": "thunder",
        "snow": "snow",
        "fog": "fog",
        "hail": "hail"
    };
    let baseIcon = mapping[weather] || "clear";
    return isNight ? `night + ${baseIcon}` : baseIcon;
}

// Für 5-Tage-Icons: immer Tagesversion
function getDayIcon(weather) {
    const mapping = {
        "clear": "clear",
        "clouds": "clouds",
        "rain": "rain",
        "thunderstorm": "thunder",
        "snow": "snow",
        "fog": "fog",
        "hail": "hail"
    };
    return mapping[weather] || "clear";
}

// ---------- FETCH WEATHER ----------
async function fetchWeather(city) {
    try {
        // Aktuelles Wetter
        const resCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const dataCurrent = await resCurrent.json();

        const temp = Math.round(dataCurrent.main.temp);
        const weatherMain = dataCurrent.weather[0].main.toLowerCase();
        const iconCode = getCurrentIcon(weatherMain, dataCurrent.dt, dataCurrent.sys.sunrise, dataCurrent.sys.sunset);

        countryTxt.textContent = dataCurrent.name;
        temperatureTxt.textContent = `${temp} °C`;
        weatherTypeTxt.textContent = weatherMain;
        weatherIcon.src = ICONS[iconCode] || ICONS["clear"];
        humidityTxt.textContent = `${dataCurrent.main.humidity}%`;
        windTxt.textContent = `${dataCurrent.wind.speed} M/s`;

        // 5-Tage-Forecast
        const resForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const dataForecast = await resForecast.json();

        // Wir nehmen alle 8 Werte (alle 3 Stunden * 8 = 24h) für 5 Tage
        for (let i = 0; i < 5; i++) {
            const dayData = dataForecast.list[i * 8];
            const dayWeather = dayData.weather[0].main.toLowerCase();
            const dayIcon = getDayIcon(dayWeather);

            daysDivs[i].innerHTML = `
                <h5>${new Date(dayData.dt * 1000).toLocaleDateString("en-GB",{ weekday:"short" })}</h5>
                <img src="${ICONS[dayIcon]}" alt="${dayWeather}" class="weather-icon">
                <h5>${Math.round(dayData.main.temp)}°C</h5>
            `;
        }

    } catch (err) {
        console.error(err);
        alert("City not found or API error!");
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

// Horizontal scroll
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

fetchWeather("London"); // Startstadt
