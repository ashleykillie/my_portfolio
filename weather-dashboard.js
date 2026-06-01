/* Weather Dashboard JavaScript */

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const geolocationBtn = document.getElementById('geolocationBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
const dailyForecastContainer = document.getElementById('dailyForecastContainer');
const infoSection = document.getElementById('infoSection');
const welcomeSection = document.getElementById('welcomeSection');

// State
let refreshTimer;
let currentLocation = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setCurrentYear();
});

function setupEventListeners() {
  searchBtn.addEventListener('click', handleSearch);
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  geolocationBtn.addEventListener('click', handleGeolocation);
}

function setCurrentYear() {
  document.getElementById('year').textContent = new Date().getFullYear();
}

function handleSearch() {
  const query = locationInput.value.trim();
  if (query) {
    searchLocation(query);
  }
}

async function searchLocation(query) {
  try {
    showLoading(true);
    hideError();

    const response = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
    );

    if (!response.ok) throw new Error('Failed to search location');

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      showError('Location not found. Please try another search.');
      showLoading(false);
      return;
    }

    const location = data.results[0];
    fetchWeatherData(location.latitude, location.longitude, location);
  } catch (error) {
    console.error('Search error:', error);
    showError('Failed to search location. Please try again.');
    showLoading(false);
  }
}

function handleGeolocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  showLoading(true);
  hideError();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get location name
      reverseGeocode(latitude, longitude);
    },
    (error) => {
      showLoading(false);
      showError(
        'Unable to access your location. Please enable location permission or search manually.'
      );
      console.error('Geolocation error:', error);
    }
  );
}

async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(
      `${GEOCODING_URL}?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
    );

    if (!response.ok) throw new Error('Failed to get location name');

    const data = await response.json();
    const location = data.results?.[0] || {
      latitude,
      longitude,
      name: 'Your Location',
      admin1: '',
      country: ''
    };

    fetchWeatherData(latitude, longitude, location);
  } catch (error) {
    console.error('Reverse geocode error:', error);
    fetchWeatherData(latitude, longitude, {
      latitude,
      longitude,
      name: 'Your Location',
      admin1: '',
      country: ''
    });
  }
}

async function fetchWeatherData(latitude, longitude, location) {
  try {
    const response = await fetch(
      `${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,humidity,wind_speed_10m,pressure_msl,visibility&hourly=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto&temperature_unit=celsius`
    );

    if (!response.ok) throw new Error('Failed to fetch weather data');

    const data = await response.json();
    currentLocation = { ...location, ...data };

    displayWeather(location, data);
    showLoading(false);
    showContent();

    // Set refresh timer
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      fetchWeatherData(latitude, longitude, location);
    }, REFRESH_INTERVAL);
  } catch (error) {
    console.error('Weather fetch error:', error);
    showError('Failed to fetch weather data. Please try again.');
    showLoading(false);
  }
}

function displayWeather(location, data) {
  displayCurrentWeather(location, data.current);
  displayHourlyForecast(data.hourly);
  displayDailyForecast(data.daily);
}

function displayCurrentWeather(location, current) {
  const locationName = `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}${location.country ? ', ' + location.country : ''}`;
  const coords = `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`;

  document.getElementById('locationName').textContent = locationName;
  document.getElementById('locationCoords').textContent = coords;
  document.getElementById('currentTemp').textContent = `${Math.round(current.temperature_2m)}°C`;
  document.getElementById('humidity').textContent = `${current.humidity}%`;
  document.getElementById('windSpeed').textContent = `${current.wind_speed_10m} km/h`;
  document.getElementById('pressure').textContent = `${current.pressure_msl} hPa`;
  document.getElementById('visibility').textContent = `${current.visibility / 1000} km`;

  const weatherDesc = getWeatherDescription(current.weather_code);
  document.getElementById('weatherDescription').textContent = weatherDesc.description;

  const weatherIcon = getWeatherIcon(current.weather_code);
  document.getElementById('weatherIcon').innerHTML = `<i class="fa-solid ${weatherIcon}"></i>`;
}

function displayHourlyForecast(hourly) {
  const hourlyContainer = document.getElementById('hourlyForecast');
  hourlyContainer.innerHTML = '';

  const now = new Date();
  const currentHour = now.getHours();
  const times = hourly.time;
  const temps = hourly.temperature_2m;
  const codes = hourly.weather_code;
  const winds = hourly.wind_speed_10m;

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const timeIndex = i;

    if (timeIndex >= times.length) break;

    const card = document.createElement('div');
    card.className = 'hourly-card';

    const time = new Date(times[timeIndex]);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const temp = Math.round(temps[timeIndex]);
    const code = codes[timeIndex];
    const wind = Math.round(winds[timeIndex]);

    const weatherInfo = getWeatherDescription(code);
    const icon = getWeatherIcon(code);

    card.innerHTML = `
      <div class="hourly-time">${timeStr}</div>
      <div class="hourly-icon"><i class="fa-solid ${icon}"></i></div>
      <div class="hourly-temp">${temp}°C</div>
      <div class="hourly-description">${weatherInfo.description}</div>
      <div class="hourly-wind" style="font-size: 0.75rem; color: #666; margin-top: 0.5rem;">
        <i class="fa-solid fa-wind"></i> ${wind} km/h
      </div>
    `;

    hourlyContainer.appendChild(card);
  }
}

function displayDailyForecast(daily) {
  const dailyContainer = document.getElementById('dailyForecast');
  dailyContainer.innerHTML = '';

  const dates = daily.time;
  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;
  const codes = daily.weather_code;
  const precipitation = daily.precipitation_sum;

  for (let i = 0; i < Math.min(7, dates.length); i++) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 col-xl-3';

    const date = new Date(dates[i]);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const maxTemp = Math.round(maxTemps[i]);
    const minTemp = Math.round(minTemps[i]);
    const code = codes[i];
    const rain = precipitation[i];

    const weatherInfo = getWeatherDescription(code);
    const icon = getWeatherIcon(code);

    card.innerHTML = `
      <article class="daily-card">
        <div class="daily-date">${dateStr}</div>
        <div class="daily-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="daily-temps">
          <span class="temp-max">${maxTemp}°</span>
          <span class="temp-min">${minTemp}°</span>
        </div>
        <div class="daily-description">${weatherInfo.description}</div>
        ${rain > 0 ? `
          <div class="daily-rain">
            <i class="fa-solid fa-droplet"></i>
            ${rain}mm
          </div>
        ` : ''}
      </article>
    `;

    dailyContainer.appendChild(card);
  }
}

function getWeatherDescription(code) {
  const codes = {
    0: { description: 'Clear sky', category: 'clear-day' },
    1: { description: 'Mainly clear', category: 'clear-day' },
    2: { description: 'Partly cloudy', category: 'cloudy' },
    3: { description: 'Overcast', category: 'cloudy' },
    45: { description: 'Foggy', category: 'cloudy' },
    48: { description: 'Foggy with rime', category: 'cloudy' },
    51: { description: 'Light drizzle', category: 'rainy' },
    53: { description: 'Moderate drizzle', category: 'rainy' },
    55: { description: 'Dense drizzle', category: 'rainy' },
    61: { description: 'Slight rain', category: 'rainy' },
    63: { description: 'Moderate rain', category: 'rainy' },
    65: { description: 'Heavy rain', category: 'rainy' },
    71: { description: 'Slight snow', category: 'snowy' },
    73: { description: 'Moderate snow', category: 'snowy' },
    75: { description: 'Heavy snow', category: 'snowy' },
    77: { description: 'Snow grains', category: 'snowy' },
    80: { description: 'Slight rain showers', category: 'rainy' },
    81: { description: 'Moderate rain showers', category: 'rainy' },
    82: { description: 'Violent rain showers', category: 'rainy' },
    85: { description: 'Slight snow showers', category: 'snowy' },
    86: { description: 'Heavy snow showers', category: 'snowy' },
    95: { description: 'Thunderstorm', category: 'thunderstorm' },
    96: { description: 'Thunderstorm with hail', category: 'thunderstorm' },
    99: { description: 'Thunderstorm with hail', category: 'thunderstorm' }
  };

  return codes[code] || { description: 'Unknown', category: 'cloudy' };
}

function getWeatherIcon(code) {
  const iconMap = {
    0: 'fa-sun',
    1: 'fa-sun',
    2: 'fa-cloud-sun',
    3: 'fa-cloud',
    45: 'fa-cloud-fog',
    48: 'fa-cloud-fog',
    51: 'fa-cloud-rain',
    53: 'fa-cloud-rain',
    55: 'fa-cloud-rain',
    61: 'fa-cloud-rain',
    63: 'fa-cloud-rain',
    65: 'fa-cloud-rain',
    71: 'fa-snowflake',
    73: 'fa-snowflake',
    75: 'fa-snowflake',
    77: 'fa-snowflake',
    80: 'fa-cloud-rain',
    81: 'fa-cloud-rain',
    82: 'fa-cloud-rain',
    85: 'fa-snowflake',
    86: 'fa-snowflake',
    95: 'fa-bolt',
    96: 'fa-bolt',
    99: 'fa-bolt'
  };

  return iconMap[code] || 'fa-cloud';
}

function showLoading(show) {
  if (show) {
    loadingSpinner.classList.remove('d-none');
  } else {
    loadingSpinner.classList.add('d-none');
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorAlert.classList.remove('d-none');
  errorAlert.style.display = 'flex';
}

function hideError() {
  errorAlert.classList.add('d-none');
}

function showContent() {
  welcomeSection.classList.add('d-none');
  currentWeatherContainer.classList.remove('d-none');
  hourlyForecastContainer.classList.remove('d-none');
  dailyForecastContainer.classList.remove('d-none');
  infoSection.classList.remove('d-none');
}

// Auto-load with geolocation on page load (optional)
window.addEventListener('load', () => {
  // Uncomment the next line to auto-load geolocation
  // handleGeolocation();
});
