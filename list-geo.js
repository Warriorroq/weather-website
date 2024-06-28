const APIkey = "e4c7d413beed7d8cc6521ae67ca4d8f0";

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
        const response = await fetch(`http://api.openweathermap.org/data/2.5/find?q=${location}&appid=${APIkey}&units=metric`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
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
