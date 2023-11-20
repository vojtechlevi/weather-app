const baseUrl = "http://api.weatherapi.com/v1";
const apiKey = "02492167b893437783092000232011";

const search = document.querySelector(".search");
const searchBtn = document.querySelector(".submit");
const name = document.querySelector(".name");
const temp = document.querySelector(".temp");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const icon = document.querySelector(".weather-icon");
const condition = document.querySelector(".condition");
const feel = document.querySelector(".feel");

const cloud = document.querySelector(".cloud");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

let cityInput = "Göteborg";

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cityInput = search.value;
  getCurrentWeather();
});

const getCurrentWeather = async () => {
  const response = await fetch(
    `${baseUrl}/current.json?key=${apiKey}&q=${cityInput}`
  );
  const data = await response.json();
  console.log(data);
  name.innerHTML = data.location.name;
  temp.innerHTML = data.current.temp_c + "&#176";
  time.innerHTML = data.location.localtime.split(" ")[1];
  date.innerHTML = data.location.localtime.split(" ")[0];
  icon.src = data.current.condition.icon;
  condition.innerHTML = data.current.condition.text;
  feel.innerHTML = "feels like " + data.current.feelslike_c + "&#176";

  cloud.innerHTML = data.current.cloud + "%";
  humidity.innerHTML = data.current.humidity + "%";
  wind.innerHTML = data.current.wind_kph + "km/h";
};

const getWeatherForecast = async () => {
  const response = await fetch(
    `${baseUrl}/forecast.json?key=${apiKey}&q=${cityInput}&days=5`
  );
  const data = await response.json();
  console.log(data);
};

getCurrentWeather();
getWeatherForecast();
