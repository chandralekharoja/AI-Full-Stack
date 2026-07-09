import { fetchgcs, fetchWeather } from "./api.js";

const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const result = document.querySelector("#result");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const closeBtn = document.getElementById("closeBtn");

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "flex";
}

searchBtn.addEventListener("click", loadWeather);

async function loadWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
         showPopup("Please enter a city name.");
        return;
    }

    try {
        
        const location = await fetchgcs(city);
console.log("Location:", location);

if (location.length === 0) {
    console.log("City not found");
    showPopup("City not found.");
    return;
}

console.log("Fetching weather...");

const latitude = location[0].lat;
const longitude = location[0].lon;

const weather = await fetchWeather(latitude, longitude);
console.log("Weather:", weather);

result.textContent = "";

const card = document.createElement("article");
card.className = "weather-card";

const title = document.createElement("h2");
title.textContent = city;
card.appendChild(title);

const temperature = document.createElement("p");
temperature.textContent =
    `Temperature: ${weather.current_weather.temperature} °C`;
card.appendChild(temperature);

const windSpeed = document.createElement("p");
windSpeed.textContent =
    `Wind Speed: ${weather.current_weather.windspeed} km/h`;
card.appendChild(windSpeed);

result.appendChild(card);
    } catch (err) {
        console.error(err);
        showPopup("Something went wrong.");
    }
}