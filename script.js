const apiKey = "a6d2cbcc2740823b3f9a2f0b1e1c035c";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&q=";

    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const errorBox = document.getElementById("errorBox");
    const errorMsg = document.getElementById("errorMsg");
    const loadingBox = document.getElementById("loadingBox");
    const weatherBox = document.getElementById("weatherBox");

    async function checkWeather(city) {
        // Hide previous states
        errorBox.style.display = "none";
        weatherBox.style.display = "none";
        loadingBox.style.display = "block";

        try {
            const response = await fetch(apiUrl + encodeURIComponent(city) + "&appid=" + apiKey);
            const data = await response.json();

            loadingBox.style.display = "none";

            if (data.cod === "404" || data.cod === 404) {
                errorMsg.textContent = `"${city}" not found. Try another city.`;
                errorBox.style.display = "block";
                return;
            }

            if (data.cod !== 200) {
                errorMsg.textContent = "Something went wrong. Please try again.";
                errorBox.style.display = "block";
                return;
            }

            // Populate data
            document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
            document.getElementById("cityName").textContent = data.name;
            document.getElementById("countryDate").textContent =
                data.sys.country + " · " + new Date().toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long'});
            document.getElementById("desc").textContent = data.weather[0].description;
            document.getElementById("feelsLike").textContent = "Feels like " + Math.round(data.main.feels_like) + "°C";
            document.getElementById("windSpeed").textContent = data.wind.speed + " m/s";
            document.getElementById("humidity").textContent = data.main.humidity + "%";
            document.getElementById("visibility").textContent = (data.visibility / 1000).toFixed(1) + " km";
            document.getElementById("pressure").textContent = data.main.pressure + " hPa";

            // Weather icon from OpenWeatherMap
            const iconCode = data.weather[0].icon;
            document.getElementById("weatherIcon").src =
                `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherBox.style.display = "block";

        } catch (err) {
            loadingBox.style.display = "none";
            errorMsg.textContent = "Network error. Check your connection.";
            errorBox.style.display = "block";
        }
    }

    function quickSearch(city) {
        cityInput.value = city;
        checkWeather(city);
    }

    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) checkWeather(city);
    });

    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const city = cityInput.value.trim();
            if (city) checkWeather(city);
        }
    });

    // Load Jaipur by default on open
    checkWeather("Jaipur");