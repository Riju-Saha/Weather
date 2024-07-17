const apiKey = '2bb390f411b54c481a178e2bb6eaf802';
const weatherInfo = document.getElementById('weatherInfo');
const locationInput = document.getElementById('locationInput');

const fetchWeatherByCoordinates = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Could not fetch weather data. Please try again.');
        });
};

const fetchWeather = () => {
    const location = locationInput.value;
    if (!location) {
        alert('Please enter a location');
        return;
    }
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error('No location found');
            }
            const { lat, lon } = data[0];
            fetchWeatherByCoordinates(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
            alert('Could not fetch geolocation data. Please check the location and try again.');
        });
};

const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        },
        error => {
            console.error('Error getting location:', error);
            alert('Could not get your location. Please try again.');
        }
    );
};

const displayWeather = (data) => {
    const { name, main, weather, wind } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    document.getElementById('location').textContent = locationInput.value;
    document.getElementById('temperature').textContent = `Temperature: ${temp}°C`;
    document.getElementById('description').textContent = `Weather: ${description}`;
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${wind.speed} m/s`;
    document.getElementById('icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">`;

    weatherInfo.style.display = 'block';
};

document.querySelector('button[onclick="fetchWeather()"]').addEventListener('click', fetchWeather);
document.querySelector('button[onclick="fetchCurrentLocation()"]').addEventListener('click', fetchCurrentLocation);
