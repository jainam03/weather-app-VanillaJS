(() => {
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

  if (!ui.searchBox || !ui.clearBtn || !ui.searchBtn) {
    return;
  }

  ui.searchBtn.addEventListener('click', onSearch);
  ui.clearBtn.addEventListener('click', clearWeatherView);
  ui.searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') onSearch();
    if (event.key === 'Escape') clearWeatherView();
  });

  function onSearch() {
    const query = ui.searchBox.value.trim();
    if (!query) {
      setStatus('Please enter a valid city name.', true);
      return;
    }

    setStatus('Fetching weather details...');
    setLoading(true);

    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) throw new Error('City not found');
          throw new Error('Network error');
        }
        return response.json();
      })
      .then((weatherData) => {
        renderWeather(weatherData);
        setStatus(`Weather loaded for ${weatherData.name}.`);
      })
      .catch((error) => {
        if (error.message === 'City not found') {
          setStatus('City not found. Please enter a valid city name.', true);
        } else {
          setStatus('Network error. Please check your internet connection.', true);
        }
      })
      .finally(() => setLoading(false));
  }

  function renderWeather(weather) {
    ui.city.innerText = `${weather.name}, ${weather.sys.country}`;
    ui.coords.innerText = `Coordinates: Lat ${weather.coord.lat}, Lon ${weather.coord.lon}`;
    ui.date.innerText = buildDate(new Date());

    ui.temp.innerText = `${weather.main.temp.toFixed(0)}°C`;
    ui.weather.innerText = weather.weather[0].description;
    ui.feelsLike.innerText = `Feels like: ${weather.main.feels_like.toFixed(0)}°C`;
    ui.tempRange.innerText = `Max: ${weather.main.temp_max.toFixed(0)}°C / Min: ${weather.main.temp_min.toFixed(0)}°C`;
    ui.windSpeed.innerText = `Wind speed: ${weather.wind.speed} m/s`;
    ui.humidity.innerText = `${weather.main.humidity}%`;
    ui.pressure.innerText = `${weather.main.pressure} hPa`;
    ui.visibility.innerText = `${(weather.visibility / 1000).toFixed(1)} km`;
  }

  function setLoading(isLoading) {
    ui.searchBtn.disabled = isLoading;
    ui.clearBtn.disabled = isLoading;
    ui.currentSection.classList.toggle('loading', isLoading);
  }

  function setStatus(message, isError = false) {
    ui.status.textContent = message;
    ui.status.classList.toggle('error', isError);
  }

  function buildDate(dateData) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[dateData.getDay()]} ${dateData.getDate()} ${months[dateData.getMonth()]} ${dateData.getFullYear()}`;
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
    setStatus('');
    ui.searchBox.focus();
  }
})();
