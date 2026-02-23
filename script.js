(function () {
  function bySelector(selector) {
    return document.querySelector(selector);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function whenReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  whenReady(function initWeatherApp() {
    var api = {
      key: config && config.MY_KEY,
      base: config && config.MY_URL
    };

    var ui = {
      searchBox: bySelector('.search-box'),
      clearBtn: byId('clear-btn'),
      searchBtn: byId('search-btn'),
      status: byId('error-message'),
      currentSection: bySelector('.current'),
      city: bySelector('.location .city'),
      coords: bySelector('.location .coords'),
      date: bySelector('.location .date'),
      temp: bySelector('.current .temp'),
      weather: bySelector('.current .weather'),
      feelsLike: bySelector('.current .feels-like'),
      tempRange: byId('temp-range') || bySelector('.hi-low'),
      windSpeed: byId('wind-speed'),
      humidity: byId('humidity'),
      pressure: byId('pressure'),
      visibility: byId('visibility')
    };

    if (!ui.searchBox || !ui.clearBtn || !ui.searchBtn || !api.key || !api.base) {
      return;
    }

    ui.searchBtn.addEventListener('click', onSearch);
    ui.clearBtn.addEventListener('click', clearWeatherView);

    ui.searchBox.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        onSearch();
      }
      if (event.key === 'Escape') {
        clearWeatherView();
      }
    });

    function onSearch() {
      var query = ui.searchBox.value.trim();

      if (!query) {
        setStatus('Please enter a valid city name.', true);
        return;
      }

      setStatus('Fetching weather details...');
      setLoading(true);

      fetch(api.base + 'weather?q=' + encodeURIComponent(query) + '&units=metric&APPID=' + api.key)
        .then(function (response) {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('City not found');
            }
            throw new Error('Network error');
          }
          return response.json();
        })
        .then(function (weatherData) {
          renderWeather(weatherData);
          setStatus('Weather loaded for ' + weatherData.name + '.');
        })
        .catch(function (error) {
          if (error.message === 'City not found') {
            setStatus('City not found. Please enter a valid city name.', true);
          } else {
            setStatus('Network error. Please check your internet connection.', true);
          }
        })
        .finally(function () {
          setLoading(false);
        });
    }

    function setLoading(isLoading) {
      ui.searchBtn.disabled = isLoading;
      ui.clearBtn.disabled = isLoading;
      if (ui.currentSection) {
        ui.currentSection.classList.toggle('loading', isLoading);
      }
    }

    function setStatus(message, isError) {
      if (!ui.status) {
        return;
      }

      ui.status.textContent = message || '';
      ui.status.classList.toggle('error', !!isError);
    }

    function setText(node, text) {
      if (node) {
        node.textContent = text;
      }
    }

    function renderWeather(weather) {
      setText(ui.city, weather.name + ', ' + weather.sys.country);
      setText(ui.coords, 'Coordinates: Lat ' + weather.coord.lat + ', Lon ' + weather.coord.lon);
      setText(ui.date, buildDate(new Date()));

      setText(ui.temp, Math.round(weather.main.temp) + '°C');
      setText(ui.weather, weather.weather[0].description);
      setText(ui.feelsLike, 'Feels like: ' + Math.round(weather.main.feels_like) + '°C');
      setText(ui.tempRange, 'Max: ' + Math.round(weather.main.temp_max) + '°C / Min: ' + Math.round(weather.main.temp_min) + '°C');
      setText(ui.windSpeed, 'Wind speed: ' + weather.wind.speed + ' m/s');

      setText(ui.humidity, weather.main.humidity + '%');
      setText(ui.pressure, weather.main.pressure + ' hPa');
      setText(ui.visibility, (weather.visibility / 1000).toFixed(1) + ' km');
    }

    function buildDate(dateData) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dateData.getDay()] + ' ' + dateData.getDate() + ' ' + months[dateData.getMonth()] + ' ' + dateData.getFullYear();
    }

    function clearWeatherView() {
      ui.searchBox.value = '';
      setText(ui.city, 'Start by searching for a city');
      setText(ui.coords, '');
      setText(ui.date, '');
      setText(ui.temp, '--°C');
      setText(ui.weather, '');
      setText(ui.feelsLike, '');
      setText(ui.tempRange, '');
      setText(ui.windSpeed, '');
      setText(ui.humidity, '--%');
      setText(ui.pressure, '-- hPa');
      setText(ui.visibility, '-- km');
      setStatus('', false);
      ui.searchBox.focus();
    }
  });
})();
