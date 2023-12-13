const api = {
  key: config.MY_KEY,
  base: config.MY_URL
};

const searchBox = document.querySelector('.search-box')
let clearBtn = document.getElementById("clear-btn")
let searchBtn = document.getElementById("search-btn")

searchBtn.addEventListener('click', setQuery);

function setQuery(_evt) {
  if (searchBox.value === "") {
    alert("Please enter a valid city name.")
    return
  }

  getResults(searchBox.value)
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(response => {
      if (!response.ok) {
        console.log(response)
        if (response.status === 404) {
          throw new Error("City not found")
        } else {
          throw new errorMonitor("Network error")
        }
      }
      return response.json()
      
    })
    .then(displayResults)
    .catch(error => {
      console.log(error);
      if (error.message === "City not found") {
        displayErrorMessage("City not found. Please enter a valid city name.")
      } else {
        displayErrorMessage("Network error. Please check your internet connection")
      }
    })
}

function displayErrorMessage(message) {
  let errorMessageContent = document.getElementById("error-message")
  errorMessageContent.textContent = message
}

function displayResults(weather) {
  let errorMessageContent = document.getElementById("error-message")
  errorMessageContent.textContent = ""

  console.log(weather)

  let city = document.querySelector('.location .city');

  city.innerText = `${weather.name}, ${weather.sys.country}`

  let coords = document.querySelector('.location .coords')

  coords.innerText = `Co-ordinates: Lat:${weather.coord.lat}, Lon:${weather.coord.lon}`

  let now = new Date();
  let date = document.querySelector('.location .date')
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp')
  temp.innerHTML = `${(weather.main.temp).toFixed(0)}°c`;

  let weather_el = document.querySelector('.current .weather')
  weather_el.innerText = `${weather.weather[0].main}`;

  let hilow = document.querySelector('.hi-low')
  hilow.innerText = `Max:- ${(weather.main.temp_max).toFixed(0)}°c / Min:- ${weather.main.temp_min.toFixed(0)}°c`;

  let feelsLike = document.querySelector('.feels-like')
  feelsLike.innerText = `Feels like : ${weather.main.feels_like.toFixed(0)}°c`;

  let windSpeedData = document.getElementById("wind-speed")
  windSpeedData.innerText = `Wind-speed: ${weather.wind.speed} meter/sec`
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

  setTimeout(() => {
    window.location.reload()
  }, 100)
})