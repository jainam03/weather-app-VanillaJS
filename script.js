const api = {
  key: config.MY_KEY,
  base: config.MY_URL
};

const searchBox = document.querySelector('.search-box');
const clearBtn = document.getElementById('clear-btn');
const searchBtn = document.getElementById('search-btn');
const errorMessageContent = document.getElementById('error-message');
const currentSection = document.querySelector('.current');

searchBtn.addEventListener('click', setQuery);
searchBox.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    setQuery();
  }

  if (evt.key === 'Escape') {
    clearWeatherView();
  }
});

clearBtn.addEventListener('click', clearWeatherView);

function setQuery() {
  const query = searchBox.value.trim();

  if (query === '') {
    displayStatusMessage('Please enter a valid city name.', true);
    return;
  }

  getResults(query);
}

function getResults(query) {
  displayStatusMessage('Fetching weather details...');
  searchBtn.disabled = true;
  clearBtn.disabled = true;
  currentSection.classList.add('loading');

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
    .then((weather) => {
      displayResults(weather);
      displayStatusMessage(`Weather loaded for ${weather.name}.`);
    })
    .catch((error) => {
      if (error.message === 'City not found') {
        displayStatusMessage('City not found. Please enter a valid city name.', true);
      } else {
        displayStatusMessage('Network error. Please check your internet connection.', true);
      }
    })
    .finally(() => {
      searchBtn.disabled = false;
      clearBtn.disabled = false;
      currentSection.classList.remove('loading');
    });
}

function displayStatusMessage(message, isError = false) {
  errorMessageContent.textContent = message;
  errorMessageContent.classList.toggle('error', isError);
}

function displayResults(weather) {
  document.querySelector('.location .city').innerText = `${weather.name}, ${weather.sys.country}`;
  document.querySelector('.location .coords').innerText = `Coordinates: Lat ${weather.coord.lat}, Lon ${weather.coord.lon}`;
  document.querySelector('.location .date').innerText = dateBuilder(new Date());

  document.querySelector('.current .temp').innerText = `${weather.main.temp.toFixed(0)}°C`;
  document.querySelector('.current .weather').innerText = weather.weather[0].description;
  document.querySelector('.current .feels-like').innerText = `Feels like: ${weather.main.feels_like.toFixed(0)}°C`;
  document.getElementById('temp-range').innerText = `Max: ${weather.main.temp_max.toFixed(0)}°C / Min: ${weather.main.temp_min.toFixed(0)}°C`;
  document.getElementById('wind-speed').innerText = `Wind speed: ${weather.wind.speed} m/s`;

  document.getElementById('humidity').innerText = `${weather.main.humidity}%`;
  document.getElementById('pressure').innerText = `${weather.main.pressure} hPa`;
  document.getElementById('visibility').innerText = `${(weather.visibility / 1000).toFixed(1)} km`;
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
  searchBox.value = '';

  document.querySelector('.location .city').innerText = 'Start by searching for a city';
  document.querySelector('.location .coords').innerText = '';
  document.querySelector('.location .date').innerText = '';

  document.querySelector('.current .temp').innerText = '--°C';
  document.querySelector('.current .weather').innerText = '';
  document.querySelector('.current .feels-like').innerText = '';
  document.getElementById('temp-range').innerText = '';
  document.getElementById('wind-speed').innerText = '';

  document.getElementById('humidity').innerText = '--%';
  document.getElementById('pressure').innerText = '-- hPa';
  document.getElementById('visibility').innerText = '-- km';

  displayStatusMessage('');
  searchBox.focus();
}
