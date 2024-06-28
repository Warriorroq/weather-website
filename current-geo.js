document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeather(latitude, longitude);
    }, () => {
        alert('Unable to retrieve your location');
    });

    function fetchWeather(lat, lon) {
        // Replace with a real API call
        const weatherData = {
            location: `Latitude: ${lat}, Longitude: ${lon}`,
            temperature: '22°C',
            condition: 'Sunny'
        };

        document.getElementById('weather-info').innerHTML = `
            <p>Location: ${weatherData.location}</p>
            <p>Temperature: ${weatherData.temperature}</p>
            <p>Condition: ${weatherData.condition}</p>
        `;

        // Save the weather data in cookies/localStorage
        document.cookie = `weatherData=${JSON.stringify(weatherData)};path=/`;
    }

    // Check if we have saved weather data
    const savedWeatherData = document.cookie.split('; ').find(row => row.startsWith('weatherData='));
    if (savedWeatherData) {
        const weatherData = JSON.parse(savedWeatherData.split('=')[1]);
        document.getElementById('weather-info').innerHTML = `
            <p>Location: ${weatherData.location}</p>
            <p>Temperature: ${weatherData.temperature}</p>
            <p>Condition: ${weatherData.condition}</p>
        `;
    }
});
