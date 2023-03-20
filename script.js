var apiKey = "3ab9a65c27933a9cb02a3842a6a429c6";
var savedSearches = [];
var searchHistoryList = function (cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    searchEntryContainer.append(searchHistoryEntry);

    var searchEntryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (savedSearches.length > 0) {
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);

    }
};

var loadSearchHistory = function() {
    var savedSearchHistory = localStorage.getItem("savedSearches");

    if(!savedSearchHistory) {
        return false;
    }

    savedSearchHistory = JSON.parse(savedSearchHistory);

    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};

var currentWeatherSection = function(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}')
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var cityLon = response.coord.lon;
        var cityLat = response.coord.lat;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                
    })
            .then(function(response) {
                searchHistoryList(cityName);

                var currentWeatherContainer = $("#current-weather-container");
                currentWeatherContainer.addClass("current-weather-container");

                var currentTitle = $("#current-title");
                var currentDay = day.js().format("mmmm dd yyyy");
                currentTitle.text(`${cityName} (${currentDay})`);
                var currentIcon = $("#current-weather-icon");
                currentIcon.addClass("current-weather-icon");
                var currentIconCode = response.current.weather[0].icon;
                currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

                var currentTemperature = $("#current-temperature");
                currentTemperature.text("temperature: " + response.current.temp + "\u00B0F");

                var currentWindSpeed = $("#current-wind-speed");
                currentHWindSpeed.text("Wind Speed: " + response.current.wind_speed + "MPH");
                
                var currentHumidity = $("#current-temperature");
                currentHumidity.text("temperature: " + response.current.humidity + "%");

                var currentUvIndex = $("#current-uv-index");
                currentUvIndex.text("UV Index: ");
                var currentNumber = $("#current-number");
                currentNumber.text(response.current.uvi);

            })
        })

            .catch(function(err) {
                $("#search-input").val("");

                alert("We couldn't find the location you searched for. Please try again with a valid city.")
            }
            );
        
};

var fiveDayForecastSection = function(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(response) {
        return response.json();
    })

    .then(function(response) {
        var cityLon = response.coord.lon;
        var cityLat = response.coord.lat;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
        .then(function(response) {
            return response.JSON();
    })

    .then(function(response) {
        console.log(response);

        var futureForecastTitle = $("#future-forecast-title");
        futureForecastTitle.text("Five-Day-Forecast:")

        for (var i=1; i <= 5; i++) {
            var futureCard = $(".future-card");
            futureCard.addClass("future-card-details");
        

        var futureIcon = $("#future-icon-" + i);
        futureIcon.addClass("future-icon");
        var futureIconCode = response.daily[i].weather[0].icon;
        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

        var futureTemp = $("#future-temp-" + i);
        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

        var futureHumidity = $("#future-humidity-" + i);
        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
            }
     })
    })
};

$("#search-form").on("submit", function () {
    var cityName = $("#search-input").val();
    if (cityName === "" || cityName === null) {
        alert("Please enter city name!");
    } else {
        currentWeatherSection(cityName);
        fiveDayForecastSection(cityName);
    }
});

$("#search-history-container").on("click", "p", function () {
    var previousCityName = $(this).text();
    currentWeatherSection(previousCityName);
    fiveDayForecastSection(previousCityName);

    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

loadSearchHistory();