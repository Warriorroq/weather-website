const apiKey = 'e4c7d413beed7d8cc6521ae67ca4d8f0';

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, () => {
            alert('Unable to retrieve your location. Please enter a city name.');
        });
    } else {
        alert('Geolocation is not supported by this browser. Please enter a city name.');
    }
}

function getSelectedUnit() {
    const unitSelect = document.getElementById('unitSelect');
    return unitSelect.value;
}

async function getWeatherByCoords(lat, lon) {
    const unit = getSelectedUnit();
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('Unable to retrieve weather data');
        }
        const weatherData = await weatherResponse.json();

        document.getElementById('weatherResult').style.display = 'block';
        document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        document.getElementById('temperature').innerText = `${weatherData.main.temp}°${unit === 'metric' ? 'C' : 'F'}`;
        document.getElementById('weatherDescription').innerText = weatherData.weather[0].description;
        document.getElementById('humidity').innerText = `Humidity: ${weatherData.main.humidity}%`;
        document.getElementById('windSpeed').innerText = `Wind Speed: ${weatherData.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`;
        document.getElementById('pressure').innerText = `Pressure: ${weatherData.main.pressure} hPa`;
        document.getElementById('visibility').innerText = `Visibility: ${weatherData.visibility / 1000} km`;
        document.getElementById('feelsLike').innerText = `Feels Like: ${weatherData.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}`;

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        document.getElementById('forecast').style.display = 'block';
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';
        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecastItem = forecastData.list[i];
            const date = new Date(forecastItem.dt_txt).toDateString();
            const icon = forecastItem.weather[0].icon;
            const temp = forecastItem.main.temp;

            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <span>${date}</span>
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                    <span>${temp}°${unit === 'metric' ? 'C' : 'F'}</span>
                    <span>Feels Like: ${forecastItem.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}</span>
                    <span>Humidity: ${forecastItem.main.humidity}%</span>
                    <span>Wind: ${forecastItem.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</span>
                    <span>Pressure: ${forecastItem.main.pressure} hPa</span>
                    <span>Visibility: ${forecastItem.visibility / 1000} km</span>
                </div>
            `;
        }

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayString = nextDay.toISOString().split('T')[0];

        const hourlyForecast = forecastData.list.filter(item => item.dt_txt.startsWith(nextDayString));
        if (hourlyForecast.length > 0) {
            document.getElementById('hourlyForecast').style.display = 'block';
            const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
            hourlyForecastContainer.innerHTML = '';
            hourlyForecast.forEach(forecastItem => {
                const time = new Date(forecastItem.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const icon = forecastItem.weather[0].icon;
                const temp = forecastItem.main.temp;

                hourlyForecastContainer.innerHTML += `
                    <div class="forecast-hour">
                        <span>${time}</span>
                        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                        <span>${temp}°${unit === 'metric' ? 'C' : 'F'}</span>
                        <span>Feels Like: ${forecastItem.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}</span>
                        <span>Humidity: ${forecastItem.main.humidity}%</span>
                        <span>Wind: ${forecastItem.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</span>
                        <span>Pressure: ${forecastItem.main.pressure} hPa</span>
                        <span>Visibility: ${forecastItem.visibility / 1000} km</span>
                    </div>
                `;
            });
        }

    } catch (error) {
        alert(error.message);
    }
}

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city)
        return;
    
    const unit = getSelectedUnit();
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }
        const weatherData = await weatherResponse.json();

        document.getElementById('weatherResult').style.display = 'block';
        document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        document.getElementById('temperature').innerText = `${weatherData.main.temp}°${unit === 'metric' ? 'C' : 'F'}`;
        document.getElementById('weatherDescription').innerText = weatherData.weather[0].description;
        document.getElementById('humidity').innerText = `Humidity: ${weatherData.main.humidity}%`;
        document.getElementById('windSpeed').innerText = `Wind Speed: ${weatherData.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`;
        document.getElementById('pressure').innerText = `Pressure: ${weatherData.main.pressure} hPa`;
        document.getElementById('visibility').innerText = `Visibility: ${weatherData.visibility / 1000} km`;
        document.getElementById('feelsLike').innerText = `Feels Like: ${weatherData.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}`;

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        document.getElementById('forecast').style.display = 'block';
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';
        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecastItem = forecastData.list[i];
            const date = new Date(forecastItem.dt_txt).toDateString();
            const icon = forecastItem.weather[0].icon;
            const temp = forecastItem.main.temp;

            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <span>${date}</span>
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                    <span>${temp}°${unit === 'metric' ? 'C' : 'F'}</span>
                    <span>Feels Like: ${forecastItem.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}</span>
                    <span>Humidity: ${forecastItem.main.humidity}%</span>
                    <span>Wind: ${forecastItem.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</span>
                    <span>Pressure: ${forecastItem.main.pressure} hPa</span>
                    <span>Visibility: ${forecastItem.visibility / 1000} km</span>
                </div>
            `;
        }

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayString = nextDay.toISOString().split('T')[0];

        const hourlyForecast = forecastData.list.filter(item => item.dt_txt.startsWith(nextDayString));

        if (hourlyForecast.length > 0) {
            document.getElementById('hourlyForecast').style.display = 'block';
            const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
            hourlyForecastContainer.innerHTML = '';
            hourlyForecast.forEach(forecastItem => {
                const time = new Date(forecastItem.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const icon = forecastItem.weather[0].icon;
                const temp = forecastItem.main.temp;

                hourlyForecastContainer.innerHTML += `
                    <div class="forecast-hour">
                        <span>${time}</span>
                        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                        <span>${temp}°${unit === 'metric' ? 'C' : 'F'}</span>
                        <span>Feels Like: ${forecastItem.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}</span>
                        <span>Humidity: ${forecastItem.main.humidity}%</span>
                        <span>Wind: ${forecastItem.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</span>
                        <span>Pressure: ${forecastItem.main.pressure} hPa</span>
                        <span>Visibility: ${forecastItem.visibility / 1000} km</span>
                    </div>
                `;
            });
        }

    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', getLocation);
