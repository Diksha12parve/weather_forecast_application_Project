const apiKey = '74fc792c02d94242e3231014ab209211'; 
const weatherInfo = document.getElementById('weather-info');
const forecastContainer = document.getElementById('forecast');

async function fetchWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    try {
    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        displayCurrentWeather(data);
        fetchForecast(city);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = `<p class="text-red-500">An error occurred: ${error.message}</p>`;
    }
}
function displayCurrentWeather(data) {
    weatherInfo.innerHTML = `
        <h3 class="text-xl font-semibold">${data.name}</h3>
        <p class="text-lg">Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Conditions: ${data.weather[0].description}</p>
    `;
}
function fetchWeatherByLocation() {
    // Check if Geolocation is supported by the browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Fetch current weather using the coordinates
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const weatherData = await weatherResponse.json();

            // Fetch 5-day forecast using the coordinates
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();

            // Display current weather and forecast
            displayCurrentWeather(weatherData);
            displayForecast(forecastData);
        }, (error) => {
            // Handle geolocation errors
            alert('Unable to retrieve your location. Please allow location access or try again later.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}


async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        displayForecast(data.list);

    } catch (error) {
        console.error('Error fetching forecast data:', error);
        forecastContainer.innerHTML = `<p class="text-red-500">An error occurred: ${error.message}</p>`;
    }
}


function displayForecast(forecastList) {
    forecastContainer.innerHTML = ''; 
    forecastList.forEach((item, index) => {
        if (index % 8 === 0) {
            const forecastDate = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            forecastContainer.innerHTML += `
                <div class="p-4 m-2 bg-white rounded shadow text-center w-36">
                    <p class="font-semibold">${forecastDate}</p>
                    <p>${item.weather[0].description}</p>
                    <p>Temp: ${item.main.temp}°C</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind: ${item.wind.speed} m/s</p>
                </div>
            `;
        }
    });
}

 

