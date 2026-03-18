document.addEventListener("DOMContentLoaded", function() {

    // ---------- Wetter ----------
    const API_KEY = "c82bd530a6c5357fb3b71ef2c9479a72";
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

    const cityList = [
        "Aachen", "Abu Dhabi", "Amsterdam", "Athens", "Bangkok", "Barcelona", "Beijing", "Belgrade", "Berlin", "Bonn",
        "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Cairo", "Chicago", "Cologne", "Copenhagen", "Delhi", "Dubai",
        "Dublin", "Düsseldorf", "Essen", "Frankfurt", "Geneva", "Hamburg", "Helsinki", "Hong Kong", "Istanbul", "Jakarta",
        "Johannesburg", "Kyiv", "Lisbon", "London", "Los Angeles", "Luxembourg", "Lyon", "Madrid", "Manchester", "Manila",
        "Marseille", "Melbourne", "Mexico City", "Milan", "Moscow", "Mumbai", "Munich", "Nairobi", "Naples", "New York",
        "Nice", "Oslo", "Paris", "Prague", "Reykjavik", "Rio de Janeiro", "Rome", "San Francisco", "Seoul", "Shanghai",
        "Singapore", "Sofia", "Stockholm", "Stuttgart", "Sydney", "Tallinn", "Tokyo", "Toronto", "Valencia", "Venice",
        "Vienna", "Warsaw", "Washington", "Zurich"
    ];

    // DOM-Elemente
    const cityInput = document.querySelector(".city-input");
    const suggestionsBox = document.getElementById("search-suggestions");
    let currentFocus = -1;

    // ---------- Wetter abrufen ----------
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


            const mainIconType = data.weather[0].main.toLowerCase();
            let iconFile = ICONS[mainIconType] || ICONS["clear"];
            if (isNight) iconFile = "Night_" + iconFile;

            const mainWeatherImg = document.querySelector(".weather-icon-main");
            if (mainWeatherImg) {
                mainWeatherImg.src = `../../img/${iconFile}`;
                mainWeatherImg.onerror = function() {
                    mainWeatherImg.src = `../../img/${ICONS[mainIconType] || "Clear.svg"}`;
                    mainWeatherImg.onerror = null;
                };
            }


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
                        <img src="../../img/${forecastIcon}" alt="icon">
                        <span class="temp">${Math.round(day.main.temp)}°C</span>
                    </div>`;
            });
        } catch (err) {
            console.log("Wetterfehler:", err);
        }
    }

    function updateSuggestions(list) {
        suggestionsBox.innerHTML = "";
        if (list.length > 0) {
            list.forEach(city => {
                const div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = city;
                div.addEventListener("click", () => {
                    cityInput.value = city;
                    suggestionsBox.style.display = "none";
                    fetchWeather(city);
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    }

    // ---------- Keyboard-Navigation ----------
    function addActive(items) {
        if (!items || items.length === 0) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add("selected");
        items[currentFocus].scrollIntoView({ block: "nearest" });
    }

    function removeActive(items) {
        items.forEach(item => item.classList.remove("selected"));
    }

    // ---------- Event-Listener ----------
    cityInput.addEventListener("input", () => {
        const value = cityInput.value.trim();
        currentFocus = -1;

        if (value === "#") {
            updateSuggestions(cityList);
        } else if (value.length > 0) {
            const filtered = cityList.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            updateSuggestions(filtered);
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    cityInput.addEventListener("keydown", (e) => {
        const items = suggestionsBox.querySelectorAll(".suggestion-item");
        if (suggestionsBox.style.display !== "block") return;

        if (e.key === "ArrowDown" || e.key === "Tab") {
            e.preventDefault();
            currentFocus++;
            addActive(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            currentFocus--;
            addActive(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            } else {
                suggestionsBox.style.display = "none";
                fetchWeather(cityInput.value.trim());
            }
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".input-container")) {
            suggestionsBox.style.display = "none";
            currentFocus = -1;
        }
    });

    document.querySelector(".search-btn").addEventListener("click", () => {
        suggestionsBox.style.display = "none";
        fetchWeather(cityInput.value.trim());
    });

    document.getElementById("date").innerText = new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });

    fetchWeather("Berlin");
});