const api = {
  key: config.MY_KEY,
  base: config.MY_URL
};

const searchBox = document.querySelector('.search-box');
const clearBtn = document.getElementById('clear-btn');
const searchBtn = document.getElementById('search-btn');
const errorMessageContent = document.getElementById('error-message');

searchBtn.addEventListener('click', setQuery);
searchBox.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    setQuery();
  }
});

function setQuery() {
  const query = searchBox.value.trim();

  if (query === '') {
    displayErrorMessage('Please enter a valid city name.', true);
    return;
  }

  getResults(query);
}

function getResults(query) {
  displayErrorMessage('Fetching weather details...');
  searchBtn.disabled = true;

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
    .then(displayResults)
    .catch((error) => {
      if (error.message === 'City not found') {
        displayErrorMessage('City not found. Please enter a valid city name.', true);
      } else {
        displayErrorMessage('Network error. Please check your internet connection.', true);
      }
    })
    .finally(() => {
      searchBtn.disabled = false;
    });
}

function displayErrorMessage(message, isError = false) {
  errorMessageContent.textContent = message;
  errorMessageContent.classList.toggle('error', isError);
}

function displayResults(weather) {
  displayErrorMessage('Weather loaded successfully.');

  const city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  const coords = document.querySelector('.location .coords');
  coords.innerText = `Coordinates: Lat ${weather.coord.lat}, Lon ${weather.coord.lon}`;

  const now = new Date();
  const date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  const temp = document.querySelector('.current .temp');
  temp.innerHTML = `${weather.main.temp.toFixed(0)}°C`;

  const weatherEl = document.querySelector('.current .weather');
  weatherEl.innerText = weather.weather[0].main;

  const hiLow = document.querySelector('.hi-low');
  hiLow.innerText = `Max: ${weather.main.temp_max.toFixed(0)}°C / Min: ${weather.main.temp_min.toFixed(0)}°C`;

  const feelsLike = document.querySelector('.feels-like');
  feelsLike.innerText = `Feels like: ${weather.main.feels_like.toFixed(0)}°C`;

  const windSpeedData = document.getElementById('wind-speed');
  windSpeedData.innerText = `Wind speed: ${weather.wind.speed} m/s`;
}

function dateBuilder(d) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  document.getElementById('humidity').innerText = '--%';
  document.getElementById('pressure').innerText = '-- hPa';
  document.getElementById('visibility').innerText = '-- km';

clearBtn.addEventListener('click', () => {
  searchBox.value = '';

  document.querySelector('.location .city').innerText = 'Start by searching for a city';
  document.querySelector('.location .coords').innerText = '';
  document.querySelector('.location .date').innerText = '';
  document.querySelector('.current .temp').innerText = '--°C';
  document.querySelector('.current .weather').innerText = '';
  document.querySelector('.current .feels-like').innerText = '';
  document.querySelector('.hi-low').innerText = '';
  document.getElementById('wind-speed').innerText = '';

  displayErrorMessage('');
});
