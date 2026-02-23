const api = {
  key: config.MY_KEY,
  base: config.MY_URL
};

const ui = {
  searchBox: document.querySelector('.search-box'),
  clearBtn: document.getElementById('clear-btn'),
  searchBtn: document.getElementById('search-btn'),
  status: document.getElementById('error-message'),
  currentSection: document.querySelector('.current'),
  city: document.querySelector('.location .city'),
  coords: document.querySelector('.location .coords'),
  date: document.querySelector('.location .date'),
  temp: document.querySelector('.current .temp'),
  weather: document.querySelector('.current .weather'),
  feelsLike: document.querySelector('.current .feels-like'),
  tempRange: document.getElementById('temp-range'),
  windSpeed: document.getElementById('wind-speed'),
  humidity: document.getElementById('humidity'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility')
};

init();

function init() {
  ui.searchBtn.addEventListener('click', setQuery);
  ui.clearBtn.addEventListener('click', clearWeatherView);

  ui.searchBox.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      setQuery();
    }

    if (evt.key === 'Escape') {
      clearWeatherView();
    }
  });
}

function setQuery() {
  const query = ui.searchBox.value.trim();

  if (!query) {
    displayStatusMessage('Please enter a valid city name.', true);
    return;
  }

  getResults(query);
}

function getResults(query) {
  displayStatusMessage('Fetching weather details...');
  toggleLoadingState(true);

  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }

        throw new Error('Network error');
      }

      return response.json();
    })
    .then((weatherData) => {
      displayResults(weatherData);
      displayStatusMessage(`Weather loaded for ${weatherData.name}.`);
    })
    .catch((error) => {
      if (error.message === 'City not found') {
        displayStatusMessage('City not found. Please enter a valid city name.', true);
      } else {
        displayStatusMessage('Network error. Please check your internet connection.', true);
      }
    })
    .finally(() => {
      toggleLoadingState(false);
    });
}

function toggleLoadingState(isLoading) {
  ui.searchBtn.disabled = isLoading;
  ui.clearBtn.disabled = isLoading;
  ui.currentSection.classList.toggle('loading', isLoading);
}

function displayStatusMessage(message, isError = false) {
  ui.status.textContent = message;
  ui.status.classList.toggle('error', isError);
}

function displayResults(weather) {
  ui.city.innerText = `${weather.name}, ${weather.sys.country}`;
  ui.coords.innerText = `Coordinates: Lat ${weather.coord.lat}, Lon ${weather.coord.lon}`;
  ui.date.innerText = dateBuilder(new Date());

  ui.temp.innerText = `${weather.main.temp.toFixed(0)}°C`;
  ui.weather.innerText = weather.weather[0].description;
  ui.feelsLike.innerText = `Feels like: ${weather.main.feels_like.toFixed(0)}°C`;
  ui.tempRange.innerText = `Max: ${weather.main.temp_max.toFixed(0)}°C / Min: ${weather.main.temp_min.toFixed(0)}°C`;
  ui.windSpeed.innerText = `Wind speed: ${weather.wind.speed} m/s`;

  ui.humidity.innerText = `${weather.main.humidity}%`;
  ui.pressure.innerText = `${weather.main.pressure} hPa`;
  ui.visibility.innerText = `${(weather.visibility / 1000).toFixed(1)} km`;
}

function dateBuilder(dateData) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = days[dateData.getDay()];
  const date = dateData.getDate();
  const month = months[dateData.getMonth()];
  const year = dateData.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function clearWeatherView() {
  ui.searchBox.value = '';
  ui.city.innerText = 'Start by searching for a city';
  ui.coords.innerText = '';
  ui.date.innerText = '';

  ui.temp.innerText = '--°C';
  ui.weather.innerText = '';
  ui.feelsLike.innerText = '';
  ui.tempRange.innerText = '';
  ui.windSpeed.innerText = '';

  ui.humidity.innerText = '--%';
  ui.pressure.innerText = '-- hPa';
  ui.visibility.innerText = '-- km';

  displayStatusMessage('');
  ui.searchBox.focus();
}
