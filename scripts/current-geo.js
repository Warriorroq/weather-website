const APIkey = "e4c7d413beed7d8cc6521ae67ca4d8f0";

document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherByCoords(latitude, longitude);
    }, () => {
        alert('Unable to retrieve your location');
    });

    async function fetchWeatherByCoords(lat, lon) {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const weatherData = {
            location: `${data.name}, ${data.sys.country}`,
            temperature: `${data.main.temp}°C`,
            condition: data.weather[0].description
        };

        document.getElementById('weather-info').innerHTML = `
            <p>Location: ${weatherData.location}</p>
            <p>Temperature: ${weatherData.temperature}</p>
            <p>Condition: ${weatherData.condition}</p>
        `;

        // Save the weather data in localStorage
        localStorage.setItem('currentWeather', JSON.stringify(weatherData));
    }

    // Check if we have saved weather data in localStorage
    const savedWeatherData = localStorage.getItem('currentWeather');
    if (savedWeatherData) {
        const weatherData = JSON.parse(savedWeatherData);
        document.getElementById('weather-info').innerHTML = `
            <p>Location: ${weatherData.location}</p>
            <p>Temperature: ${weatherData.temperature}</p>
            <p>Condition: ${weatherData.condition}</p>
        `;
    }
});
