const APIkey = "e4c7d413beed7d8cc6521ae67ca4d8f0";

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocations = ['Berlin', 'Washington', 'Pekin', 'Kiev'];
    const locationSelect = document.getElementById('location-select');
    const addLocationButton = document.getElementById('add-location');
    const weatherBlocksContainer = document.getElementById('weather-blocks');
    
    defaultLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });

    addLocationButton.addEventListener('click', () => {
        const selectedLocation = locationSelect.value;
        if (selectedLocation) {
            fetchWeather(selectedLocation);
        }
    });

    async function fetchWeather(location) {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/find?q=${location}&appid=${APIkey}&units=metric`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const firstResult = data.list[0];
        const weatherData = {
            location: `${firstResult.name}, ${firstResult.sys.country}`,
            temperature: `${firstResult.main.temp}°C`,
            condition: firstResult.weather[0].description,
            lat: firstResult.coord.lat,
            lon: firstResult.coord.lon
        };

        createWeatherBlock(weatherData);
    }

    async function fetchWeatherDetails(lat, lon) {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const nextDayWeather = data.list.find(item => item.dt_txt.includes('12:00:00')); // Assuming midday forecast for next day

        return {
            temperature: `${nextDayWeather.main.temp}°C`,
            wind: `${nextDayWeather.wind.speed} m/s`,
            condition: nextDayWeather.weather[0].description
        };
    }

    function createWeatherBlock(weatherData) {
        const weatherBlock = document.createElement('div');
        weatherBlock.className = 'weather-block';
        weatherBlock.innerHTML = `
            <p>Location: ${weatherData.location}</p>
            <p>Temperature: ${weatherData.temperature}</p>
            <p>Condition: ${weatherData.condition}</p>
            <button class="make-current">Make as Current</button>
            <button class="more-info">More Info</button>
            <button class="remove">Remove</button>
            <div class="more-info-details" style="display: none;">
                <p>Loading more info...</p>
            </div>
        `;

        weatherBlocksContainer.appendChild(weatherBlock);

        weatherBlock.querySelector('.make-current').addEventListener('click', () => {
            localStorage.setItem('currentWeather', JSON.stringify(weatherData));
            alert('Location set as current.');
        });

        weatherBlock.querySelector('.more-info').addEventListener('click', async () => {
            const detailsDiv = weatherBlock.querySelector('.more-info-details');
            if (detailsDiv.style.display === 'none') {
                const details = await fetchWeatherDetails(weatherData.lat, weatherData.lon);
                detailsDiv.innerHTML = `
                    <table>
                        <tr>
                            <th>Temperature</th>
                            <th>Wind</th>
                            <th>Condition</th>
                        </tr>
                        <tr>
                            <td>${details.temperature}</td>
                            <td>${details.wind}</td>
                            <td>${details.condition}</td>
                        </tr>
                    </table>
                `;
                detailsDiv.style.display = 'block';
            } else {
                detailsDiv.style.display = 'none';
            }
        });

        weatherBlock.querySelector('.remove').addEventListener('click', () => {
            weatherBlock.remove();
        });
    }
});
