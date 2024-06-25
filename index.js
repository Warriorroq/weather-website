// Time part
const timeDisplay = document.getElementById("time");
function getTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;

    timeDisplay.innerHTML = `Time in Berlin: ${timeString}`;
}

setInterval(getTime, 1000);

// Initialize the map
let map;

function initMap(lat = 52.5200, lon = 13.4050) { // Default to Berlin coordinates
    if (map) {
        map.remove(); // Remove existing map if it exists
    }
    map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('Your city')
        .openPopup();
}

// Working with API
const APIkey = "e4c7d413beed7d8cc6521ae67ca4d8f0";

async function fetchData() {
    const inputElement = document.getElementById("search-input");
    const input = inputElement.value;

    // Clear any existing error message
    inputElement.placeholder = 'Enter city name...';

    if (input.length === 0) {
        inputElement.value = '';
        inputElement.placeholder = "Please enter a city name.";
        return;
    }

    try {
        // Response for weather API
        const response = await fetch(`http://api.openweathermap.org/data/2.5/find?q=${input}&appid=${APIkey}&units=metric`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.list.length === 0) {
            inputElement.value = '';
            inputElement.placeholder = "Please enter a valid city name.";
            inputElement.style.color = "red"; 
            return;
        }

        // City
        const cityName = data.list[0]['name'];
        const countryCode = data.list[0].sys.country;
        document.getElementById("city-name").textContent = `${cityName} ${countryCode}`;

        // Temperature
        const temp = data.list[0].main.temp;
        document.getElementById("temp").textContent = temp;

        // Temperature min
        const tempMin = data.list[0].main.temp_min;
        document.getElementById("temp_min").textContent = tempMin;

        // Temperature max
        const tempMax = data.list[0].main.temp_max;
        document.getElementById("temp_max").textContent = tempMax;

        // Feels like 
        const feelsLike = data.list[0].main.feels_like;
        document.getElementById("feels-like").textContent = `Feels like ${feelsLike}`;

        // Speed wind 
        const speedWind = data.list[0].wind.speed;
        document.getElementById("speed-wind").textContent = speedWind;

        // Pressure
        const pressure = data.list[0].main.pressure;
        document.getElementById("pressure").textContent = pressure;

        // Humidity
        const humidity = data.list[0].main.humidity;
        document.getElementById("humidity").textContent = humidity;

        // Rain
        const rain = data.list[0].rain ? data.list[0].rain["1h"] : "0";
        document.getElementById("rain").textContent = rain;

        // Weather 
        const weather = data.list[0].weather[0].description;
        document.getElementById("weather").textContent = weather;

        // Lat and Lon
        const lat = data.list[0].coord.lat;
        const lon = data.list[0].coord.lon;

        // Initialize map
        initMap(lat, lon);

    } catch (error) {
        console.log("Error", error);
    }
}

// Geolocation
async function geoLocation() {
    // Geo location catching
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            displayMessage("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        displayMessage(`Latitude: ${latitude} <br>Longitude: ${longitude}`);
        fetchWeatherData(latitude, longitude);
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                displayMessage("User denied the request for Geolocation. Please enable location services or enter your location manually.");
                break;
            case error.POSITION_UNAVAILABLE:
                displayMessage("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                displayMessage("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                displayMessage("An unknown error occurred.");
                break;
        }
    }

    function displayMessage(message) {
        const locationDisplay = document.getElementById('locationDisplay');
        locationDisplay.innerHTML = message;
    }

    async function fetchWeatherData(lat, lon) {
        try {
            const geoResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
            const clearData = await geoResponse.json();
            console.log(clearData);

            // City
            const cityName = clearData.city["name"];
            const countryCode = clearData.city["country"];
            document.getElementById("city-name").textContent = `${cityName} ${countryCode}`;

            // Temperature
            const temp = clearData.list[0].main.temp;
            document.getElementById("temp").textContent = temp;

            // Temperature min
            const tempMin = clearData.list[0].main.temp_min;
            document.getElementById("temp_min").textContent = tempMin;

            // Temperature max
            const tempMax = clearData.list[0].main.temp_max;
            document.getElementById("temp_max").textContent = tempMax;

            // Feels like 
            const feelsLike = clearData.list[0].main.feels_like;
            document.getElementById("feels-like").textContent = `Feels like ${feelsLike}`;

            // Speed wind 
            const speedWind = clearData.list[0].wind.speed;
            document.getElementById("speed-wind").textContent = speedWind;

            // Pressure
            const pressure = clearData.list[0].main.pressure;
            document.getElementById("pressure").textContent = pressure;

            // Humidity
            const humidity = clearData.list[0].main.humidity;
            document.getElementById("humidity").textContent = humidity;

            // Rain
            const rain = clearData.list[0].rain ? clearData.list[0].rain["1h"] : "0";
            document.getElementById("rain").textContent = rain;

            // Weather 
            const weather = clearData.list[0].weather[0].description;
            document.getElementById("weather").textContent = weather;

            // Initialize map
            initMap(lat, lon);

        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    getLocation();
}

document.addEventListener("DOMContentLoaded", function() {
    const getLocationButton = document.getElementById('getLocationButton');
    if (getLocationButton) {
        getLocationButton.addEventListener('click', geoLocation);
    }

    const fetchDataButton = document.querySelector('.search-btn');
    if (fetchDataButton) {
        fetchDataButton.addEventListener('click', fetchData);
    }

    // Initialize the map with default location when the page loads
    initMap();
});
