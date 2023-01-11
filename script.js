const api = {
  key: config.MY_KEY,
  base: config.MY_URL
};

const searchBox = document.querySelector('.search-box')
let clearBtn = document.getElementById("clear-btn")

searchBox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchBox.value);

    if(result == err) {
      console.log(err);
    } else {
      getResults()
    }
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json()
    }).then(displayResults);
}

function displayResults(weather) {
  console.log(weather)

  let city = document.querySelector('.location .city');

  city.innerText = `${weather.name}, ${weather.sys.country}`

  let now = new Date();
  let date = document.querySelector('.location .date')
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp')
  temp.innerHTML = `${(weather.main.temp).toFixed(1)} <span>°c</span>`;

  let weather_el = document.querySelector('.current .weather')
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low')
  hilow.innerText = `${weather.main.temp_min}°c / ${weather.main.temp_max}°c`;

  let feelsLike = document.querySelector('.feels-like')
  feelsLike.innerText = `Feels like : ${weather.main.feels_like}`;
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

clearBtn.addEventListener("click", function () {
  console.log("clear button pressed")
  // searchBox.value = "";
  window.location.reload();
})