const apiKey = 'e4c7d413beed7d8cc6521ae67ca4d8f0';

export function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            return getWeatherByCoords(lat, lon);
        }, () => {
            console.log('Unable to retrieve your location. Please enter a city name.');
        });
    } 
    else 
        console.log('Geolocation is not supported by this browser. Please enter a city name.');
}

export async function getWeatherByCoords(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok)
            throw new Error('Unable to retrieve weather data');

        const weatherData = await weatherResponse.json();
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayString = nextDay.toISOString().split('T')[0];
        const hourlyForecast = forecastData.list.filter(item => item.dt_txt.startsWith(nextDayString));
        console.log(weatherData, forecastData, hourlyForecast);
    } 
    catch (error) {
        console.error(error.message);
    }
}

export async function getWeatherByCity(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) 
            throw new Error('City not found');

        const weatherData = await weatherResponse.json();
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayString = nextDay.toISOString().split('T')[0];
        const hourlyForecast = forecastData.list.filter(item => item.dt_txt.startsWith(nextDayString));
        console.log(weatherData, forecastData, hourlyForecast);
    } 
    catch (error) {
        console.error(error.message);
    }
}