const baseUrl = "https://api.weatherapi.com/v1";
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
const details = document.querySelector(".tag-list");

const forecast = document.querySelectorAll(".forecast");
const city = document.querySelectorAll(".city");

let cityInput = "Göteborg";

city.forEach((cityName) => {
  cityName.addEventListener("click", (e) => {
    e.preventDefault();
    cityInput = cityName.innerHTML;
    details.innerHTML = "";
    getCurrentWeather();
  });
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cityInput = search.value;
  details.innerHTML = "";
  getCurrentWeather();
});

const getCurrentWeather = async () => {
  const response = await fetch(
    `${baseUrl}/current.json?key=${apiKey}&q=${cityInput}`
  );
  const data = await response.json();
  name.innerHTML = data.location.name;
  temp.innerHTML = Math.ceil(data.current.temp_c) + "&#176";
  time.innerHTML = data.location.localtime.split(" ")[1];
  date.innerHTML = data.location.localtime.split(" ")[0];

  icon.src = data.current.condition.icon;
  condition.innerHTML = data.current.condition.text;
  feel.innerHTML =
    "feels like " + Math.ceil(data.current.feelslike_c) + "&#176";

  let cityName = data.location.name;
  let weatherCondition = data.current.condition.text;
  let cold = "snow";
  let warm = "sun";

  if (data.current.temp_c < 5) {
    getUnsplash(cityName, weatherCondition, cold);
  } else {
    getUnsplash(cityName, weatherCondition, warm);
  }

  createDetails(data);
  getWeatherForecast();

  const scrollers = document.querySelectorAll(".scroller");
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }
  function addAnimation() {
    scrollers.forEach((scroller) => {
      // add data-animated="true" to every `.scroller` on the page
      scroller.setAttribute("data-animated", true);

      // Make an array from the elements within `.scroller-inner`
      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // For each item in the array, clone it
      // add aria-hidden to it
      // add it into the `.scroller-inner`
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }
};

const getWeatherForecast = async () => {
  const response = await fetch(
    `${baseUrl}/forecast.json?key=${apiKey}&q=${cityInput}&days=5`
  );
  const data = await response.json();

  forecast.forEach((forecast, index) => {
    const forecastDate = document.querySelectorAll(".forecast-date");
    const condition = document.querySelectorAll(".forecast-condition");
    const icon = document.querySelectorAll(".forecast-icon");
    const tempMin = document.querySelectorAll(".forecast-temp-min");
    const tempMax = document.querySelectorAll(".forecast-temp-max");

    forecastDate[index].innerHTML = data.forecast.forecastday[index + 1].date;
    condition[index].innerHTML =
      data.forecast.forecastday[index + 1].day.condition.text;
    icon[index].src = data.forecast.forecastday[index + 1].day.condition.icon;

    tempMin[index].innerHTML =
      "min " +
      Math.ceil(data.forecast.forecastday[index + 1].day.mintemp_c) +
      "&#176";
    tempMax[index].innerHTML =
      "max " +
      Math.ceil(data.forecast.forecastday[index + 1].day.maxtemp_c) +
      "&#176";
  });
};

function createDetails(data) {
  const cloudDetail = document.createElement("li");
  const humidityDetail = document.createElement("li");
  const windDetail = document.createElement("li");

  cloudDetail.innerHTML = "Cloudy " + data.current.cloud + "%";
  humidityDetail.innerHTML = "Humidity " + data.current.humidity + "%";
  windDetail.innerHTML = "Wind " + data.current.wind_kph + "km/h";

  cloudDetail.classList.add("cloud");
  humidityDetail.classList.add("humidity");
  windDetail.classList.add("wind");

  details.appendChild(cloudDetail);
  details.appendChild(humidityDetail);
  details.appendChild(windDetail);
}

const getUnsplash = async (city, condition, temp) => {
  let clientId = "td96ta6cJ6G0wARWCSsmQn8oK5IWIFg3zIjML19eNIY";
  let unsplashUrl = `https://api.unsplash.com/photos/random/?client_id=${clientId}&query=${city}+${condition}+${temp}`;

  const response = await fetch(unsplashUrl);
  const imgData = await response.json();
  const body = document.querySelector("body");
  body.style.backgroundImage = `url(${imgData.urls.regular})`;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";

  console.log(imgData);
};

getCurrentWeather();
