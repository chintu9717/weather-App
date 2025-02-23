const apikey = "7d5e74e7b112e34001dc87b79a2fc7c3"; // Replace with your OpenWeatherMap API Key

document.getElementById("search").addEventListener("click", function() {
    const city = document.getElementById("input").value;
    if (city) {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === "404") {
                document.querySelector(".error").style.display = "block";
            } else {
                document.querySelector(".error").style.display = "none";
                weatherReport(data);
            }
        })
        .catch(() => {
            document.querySelector(".error").style.display = "block";
        });
}

function weatherReport(data) {
    const city = data.name;
    const temp = Math.floor(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;

    // Update current weather details
    document.getElementById("city").textContent = `${city}`;
    document.getElementById("temperature").textContent = `${temp}°C`;
    document.getElementById("humidity").textContent = `${humidity}%`;
    document.getElementById("wind").textContent = `${windSpeed} km/h`;

    const iconUrl = `https://openweathermap.org/img/w/${weatherIcon}.png`;
    document.getElementById("img").src = iconUrl;

    // Fetch forecast data
    fetchForecastData(city);
}

function fetchForecastData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            hourforecast(data);
            dayforecast(data);
        });
}

function hourforecast(forecast) {
    const templist = document.getElementById("templist");
    templist.innerHTML = ''; // Clear previous data

    for (let i = 0; i < 5; i++) {
        const date = new Date(forecast.list[i].dt * 1000);
        const hour = date.getHours();
        const temp = Math.floor(forecast.list[i].main.temp);
        const description = forecast.list[i].weather[0].description;
        const icon = forecast.list[i].weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;

        const hourDiv = document.createElement("div");
        hourDiv.classList.add("next");
        hourDiv.innerHTML = `
            <p class="time">${hour}:00</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>${temp}°C</p>
            <p>${description}</p>
        `;
        templist.appendChild(hourDiv);
    }
}

function dayforecast(forecast) {
    const weekf = document.getElementById("weekf");
    weekf.innerHTML = ''; // Clear previous data

    for (let i = 0; i < 4; i++) {
        const date = new Date(forecast.list[i * 8].dt * 1000);
        const day = date.toLocaleString('en-us', { weekday: 'short' });
        const tempMin = Math.floor(forecast.list[i * 8].main.temp_min);
        const tempMax = Math.floor(forecast.list[i * 8].main.temp_max);
        const description = forecast.list[i * 8].weather[0].description;
        const icon = forecast.list[i * 8].weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;

        const dayDiv = document.createElement("div");
        dayDiv.classList.add("dayF");
        dayDiv.innerHTML = `
            <p class="date">${day}</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>${tempMin}°C / ${tempMax}°C</p>
            <p class="desc">${description}</p>
        `;
        weekf.appendChild(dayDiv);
    }
}
