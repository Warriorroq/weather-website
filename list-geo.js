document.addEventListener('DOMContentLoaded', () => {
    const defaultLocations = ['Berlin', 'Washington', 'Pekin', 'Kiev'];
    const locationSelect = document.getElementById('location-select');
    
    defaultLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });

    locationSelect.addEventListener('change', () => {
        const selectedLocation = locationSelect.value;
        fetchWeather(selectedLocation);
    });

    function fetchWeather(location) {
        // Replace with a real API call
        const weatherData = {
            location: location,
            temperature: '20°C',
            condition: 'Cloudy'
        };

        document.getElementById('weather-info').innerHTML = `
            <p>Location: ${weatherData.location}</p>
            <p>Temperature: ${weatherData.temperature}</p>
            <p>Condition: ${weatherData.condition}</p>
        `;
    }
});
