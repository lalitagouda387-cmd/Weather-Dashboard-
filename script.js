// ===============================
// WEATHER DASHBOARD
// Thiranex Task 4
// ===============================


// API URLs

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// Get HTML elements

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const weatherDashboard =
    document.getElementById("weatherDashboard");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const weatherIcon =
    document.getElementById("weatherIcon");

const weatherDescription =
    document.getElementById("weatherDescription");

const temperature =
    document.getElementById("temperature");

const temperature2 =
    document.getElementById("temperature2");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const windSpeed2 =
    document.getElementById("windSpeed2");

const windDirection =
    document.getElementById("windDirection");

const updatedTime =
    document.getElementById("updatedTime");


// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener("click", searchWeather);


// Allow Enter key

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchWeather();

    }

});


// ===============================
// MAIN FUNCTION
// ===============================

async function searchWeather() {

    const city = cityInput.value.trim();


    // Check empty input

    if (city === "") {

        showError("Please enter a city name.");

        return;

    }


    // Show loading

    showLoading();


    try {

        // ---------------------------------
        // STEP 1: Find city coordinates
        // ---------------------------------

        const locationData =
            await getCityCoordinates(city);


        // Check whether city exists

        if (
            !locationData ||
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please enter a valid city name."
            );

        }


        // Get first matching location

        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // ---------------------------------
        // STEP 2: Get weather information
        // ---------------------------------

        const weatherData =
            await getWeatherData(
                latitude,
                longitude
            );


        // ---------------------------------
        // STEP 3: Display weather
        // ---------------------------------

        displayWeather(
            location,
            weatherData
        );


    }

    catch (error) {

        console.error(
            "Weather API Error:",
            error
        );

        showError(
            error.message ||
            "Unable to fetch weather data. Please try again."
        );

    }

    finally {

        hideLoading();

    }

}


// ===============================
// GET CITY COORDINATES
// ===============================

async function getCityCoordinates(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    // Check HTTP response

    if (!response.ok) {

        throw new Error(
            "Unable to find the city."
        );

    }


    // Convert JSON response

    const data =
        await response.json();


    return data;

}


// ===============================
// GET WEATHER DATA
// ===============================

async function getWeatherData(
    latitude,
    longitude
) {

    const url =
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`;


    const response =
        await fetch(url);


    // Check HTTP response

    if (!response.ok) {

        throw new Error(
            "Unable to fetch weather information."
        );

    }


    // Convert response to JSON

    const data =
        await response.json();


    return data;

}


// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(
    location,
    weatherData
) {

    // --------------------------------
    // Location information
    // --------------------------------

    cityName.textContent =
        location.name;

    countryName.textContent =
        `${location.country || ""} ${location.admin1 ? "• " + location.admin1 : ""}`;


    // --------------------------------
    // Current weather object
    // --------------------------------

    const current =
        weatherData.current;


    // --------------------------------
    // Temperature
    // --------------------------------

    temperature.textContent =
        Math.round(current.temperature_2m);

    temperature2.textContent =
        Math.round(current.temperature_2m);


    // --------------------------------
    // Humidity
    // --------------------------------

    humidity.textContent =
        current.relative_humidity_2m;


    // --------------------------------
    // Wind speed
    // --------------------------------

    windSpeed.textContent =
        current.wind_speed_10m;

    windSpeed2.textContent =
        current.wind_speed_10m;


    // --------------------------------
    // Wind direction
    // --------------------------------

    windDirection.textContent =
        current.wind_direction_10m;


    // --------------------------------
    // Weather description
    // --------------------------------

    const weatherInfo =
        getWeatherDescription(
            current.weather_code
        );


    weatherDescription.textContent =
        weatherInfo.description;


    weatherIcon.textContent =
        weatherInfo.icon;


    // --------------------------------
    // Updated time
    // --------------------------------

    const date =
        new Date();


    updatedTime.textContent =
        date.toLocaleString();


    // Show dashboard

    weatherDashboard.classList.remove(
        "hidden"
    );


    // Remove error

    errorMessage.classList.add(
        "hidden"
    );

}


// ===============================
// WEATHER CODE
// ===============================

function getWeatherDescription(code) {

    const weatherCodes = {

        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Depositing Rime Fog",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Slight Rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Slight Snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Slight Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Violent Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy Thunderstorm with Hail",
            icon: "⛈️"
        }

    };


    return (
        weatherCodes[code] || {
            description: "Unknown Weather",
            icon: "🌍"
        }
    );

}


// ===============================
// SHOW LOADING
// ===============================

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    weatherDashboard.classList.add(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

}


// ===============================
// HIDE LOADING
// ===============================

function hideLoading() {

    loading.classList.add(
        "hidden"
    );

}


// ===============================
// SHOW ERROR
// ===============================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );

    weatherDashboard.classList.add(
        "hidden"
    );

    loading.classList.add(
        "hidden"
    );

}