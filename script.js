const apiKey = '3ab9a65c27933a9cb02a3842a6a429c6';
const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const weatherDisplay = document.querySelector('#weather-display');
const searchHistory = document.querySelector('#search-history');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const cityName = searchInput.value;
  getWeather(cityName);
});

searchHistory.addEventListener('click', function(event) {
  const cityName = event.target.textContent;
  getWeather(cityName);
});

function getWeather(cityName) {
  // Make API call to retrieve weather data for the next 5 days
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      // Group weather data by day
      const groupedData = groupByDay(data);
      // Display weather data for the next 5 days
      displayWeather(groupedData);
      // Add city to search history
      addToSearchHistory(cityName);
    })
    .catch(error => console.error(error));
}

function groupByDay(data) {
  const groupedData = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', {weekday: 'long'});
    if (groupedData[day]) {
      // Add item to existing day
      groupedData[day].push(item);
    } else {
      // Create new day with item
      groupedData[day] = [item];
    }
  });
  return groupedData;
}

function displayWeather(data) {
  // Create HTML elements to display weather data for the next 5 days
  let weatherHTML = '';

  Object.keys(data).forEach(day => {
    const items = data[day];
    const iconUrl = `https://openweathermap.org/img/w/${items[0].weather[0].icon}.png`;
    const avgTemp = items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
    const avgHumidity = items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;
    const avgWindSpeed = items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
    weatherHTML += `
      <div class="card">
        <h2>${day}</h2>
        <img src="${iconUrl}" alt="${items[0].weather[0].description}">
        <p>Average Temperature: ${avgTemp.toFixed(1)}&deg;F</p>
        <p>Average Humidity: ${avgHumidity.toFixed(0)}%</p>
        <p>Average Wind Speed: ${avgWindSpeed.toFixed(1)} MPH</p>
      </div>
    `;
  });

  // Display weather data on the page
  weatherDisplay.innerHTML = weatherHTML;
}

function addToSearchHistory(cityName) {
  // Create HTML element to add to search history
  const searchItem = document.createElement('li');
  searchItem.textContent = cityName;
  searchHistory.appendChild(searchItem);
}
