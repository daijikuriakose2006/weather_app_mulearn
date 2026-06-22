//weather app
const apikey="40dd99db587d8390862e3f55df8150e1"//edukanda njn api disable cheyum

document.addEventListener('DOMContentLoaded', () => {
    const weatherform = document.querySelector(".weatherform");
    const cityinput = document.querySelector(".cityinput");
    const card = document.querySelector(".card");

    if (!weatherform || !cityinput || !card) {
        console.error('Required DOM elements not found');
        return;
    }

    weatherform.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityinput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message || "Failed to fetch weather");
        }
    } else {
        displayError("Please enter a city");
    }
    });

    // expose card for other functions
    window.__weather_card = card;
});


async function getWeatherData(city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apikey}`;

    const res = await fetch(apiurl);
    if (!res.ok) {
        throw new Error(`City not found: ${city}`);
    }
    const data = await res.json();
    return data;
}

function displayWeatherInfo(data) {
    const card = window.__weather_card || document.querySelector('.card');
    if (!card) return console.error('Card element not available');

    const cityDisplay = card.querySelector('.citydisplay');
    const tempDisplay = card.querySelector('.temdisplay');
    const humDisplay = card.querySelector('.humdisplay');
    const descDisplay = card.querySelector('.descdisplay');
    const emojiDisplay = card.querySelector('.weatheremoji');

    if (cityDisplay) cityDisplay.textContent = `${data.name}, ${data.sys?.country || ''}`;
    if (tempDisplay) tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
    if (humDisplay) humDisplay.textContent = `Humidity: ${data.main.humidity}%`;
    if (descDisplay && data.weather && data.weather[0]) descDisplay.textContent = data.weather[0].description;
    if (emojiDisplay && data.weather && data.weather[0]) emojiDisplay.textContent = getWeatherEmoji(data.weather[0].id);

    // show card
    card.style.display = 'flex';
}

function getWeatherEmoji(id) {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 400) return '🌧️';
    if (id >= 500 && id < 600) return '🌦️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800) return '☀️';
    if (id > 800 && id < 900) return '☁️';
    return '🔆';
}

function displayError(message) {
    const card = window.__weather_card || document.querySelector('.card');
    if (!card) return console.error('Card element not available');

    const errordisplay = document.createElement("p");
    errordisplay.textContent = message;
    errordisplay.classList.add("errordisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errordisplay);
}
