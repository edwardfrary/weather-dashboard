var cityNameAPI = "";
var country = "";
var cityNameArr = [];

//Event handler for clicking the search button
$("#searchbtn").on("click", function () {
    apiSearch();
});

//function to handle using the search function to fetch an api
function apiSearch() {
    var searchBox = $("#citysearch").val();
    //fetch the API with the city name taken from the text input box
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchBox + "&units=imperial&appid=2fd9f6120b1e5e49f6b0893e50ef57f6")
        .then(function (response) {
            //check if there is a response then json the data and send it to be processed
            if (response.ok) {
                //save the city name entered into the text input box and then fetch the co-ordinates of the city
                saveData(searchBox);

                response.json().then(function (data) {
                    //extract the city name and country from this first API
                    cityNameAPI = data.name;
                    country = data.sys.country;
                    //push the coords into a new function to get a more complete API
                    coordFetch(data.coord.lon, data.coord.lat);
                });
            }

            //display error message if no response
            else {
                alert("INVALID ENTRY");
            }
        })
};

//function to handle clicking a button of a previous search to fetch an api
function apiBtn(savedCity) {
    //fetch the API with the saved city name
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + savedCity + "&units=imperial&appid=2fd9f6120b1e5e49f6b0893e50ef57f6")
        .then(function (response) {
            //check if there is a response then json the data and send it to be processed
            if (response.ok) {

                response.json().then(function (data) {
                    //extract the city name and country from this first API
                    cityNameAPI = data.name;
                    country = data.sys.country;
                    //push the coords into a new function to get a more complete API
                    coordFetch(data.coord.lon, data.coord.lat);
                });
            }

            //display error message if no response
            else {
                alert("INVALID ENTRY");
            }
        })
};

//function to get a more complete weather API based on corordinates of searched city
function coordFetch(long, lati) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lati + "&lon=" + long + "&units=imperial&appid=2fd9f6120b1e5e49f6b0893e50ef57f6")
        .then(function (response) {
            //check if there is a response then json the data to be sent for processing
            if (response.ok) {

                response.json().then(function (data) {
                    //send the data to be rendered in HTML
                    renderData(data);
                });
            }

            //display error message if no response
            else {
                alert("INVALID ENTRY");
            }
        })
};

//function display the searched city name as a clickable button
function saveCity(cityName) {
    var savedBtnFunction = "apiBtn('" + cityName + "');";
    var savedCityEl = $("<button>")
        .addClass("btn-secondary bg-darkblue text-light shadow w-100")
        .text(cityName)
        .attr("onClick", savedBtnFunction);
    $("#previous-searches").append(savedCityEl);

};

//retrieve, update then save the new data in an array. Sends the held/updated data to the saveCity function to render as buttons
function saveData(cityName) {

    //clear the previously generated buttons
    $("#previous-searches").empty();

    cityNameArr = JSON.parse(localStorage.getItem("city_name"));
    cityNameArr.push(cityName);
    localStorage.setItem("city_name", JSON.stringify(cityNameArr));
    for (i = 0; i < cityNameArr.length; i++) {
        saveCity(cityNameArr[i]);
    }

};

//load data and render previous city buttons on first load of webpage
function loadData() {

    cityNameArr = JSON.parse(localStorage.getItem("city_name"));

    if (!cityNameArr) {
        cityNameArr = [];
    };

    localStorage.setItem("city_name", JSON.stringify(cityNameArr));
    for (i = 0; i < cityNameArr.length; i++) {
        saveCity(cityNameArr[i]);
    }
};

//clear search history
function clearHistory() {
    localStorage.clear();
    location.reload();
};

//gets the current date and add days to the current date if needed before returning the value
function dateHandler(days) {
    var result = new Date();
    result.setDate(result.getDate() + days);

    //date formatting
    var d = String(result.getDate()).padStart(2, '0');
    var m = String(result.getMonth() + 1).padStart(2, '0');
    var y = result.getFullYear();

    result = m + '/' + d + '/' + y;

    return result;
};

//function to render the current and predicted weather data to index.html
function renderData(data) {
    console.log(data);
    //first clear the previous elements from any other searches
    $("#cityname-header").empty();
    $("span").empty();

    //insert the city name and country as well as an icon depicting the weather conditions
    var cityName = $("<h2>")
        .text("City of: " + cityNameAPI + ", " + country + " (" + dateHandler(0) + ")");
    var currentWeatherIcon = data.current.weather;
    currentWeatherIconEl = $("<img>")
        .attr("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon[0].icon + "@2x.png");
    $("#cityname-header").append(cityName).append(currentWeatherIconEl);


    //TEMPERATURE
    var temperature = $("<span>")
        .text("Current temp: " + data.current.temp + "??F");
    $("#temperature").append(temperature);

    //WINDSPEED
    var windSpeed = $("<span>")
        .text("Wind Speed: " + data.current.wind_speed + " MPH");
    $("#wind-speed").append(windSpeed);

    //HUMIDITY
    var humidity = $("<span>")
        .text("Humidity: " + data.current.humidity + "%");
    $("#humidity").append(humidity);

    //UV INDEX WITH DIFFERENT TEXT COLORS BASED ON SEVERITY
    if (data.current.uvi <= 2) {
        var uvIndex = $("<span>")
            .addClass("text-success bg-dark")
            .text("UV Index: " + data.current.uvi);
        $("#uvindex").append(uvIndex);
    }

    else if (data.current.uvi <= 5 && data.current.uvi > 2) {
        var uvIndex = $("<span>")
            .addClass("text-warning bg-dark")
            .text("UV Index: " + data.current.uvi);
        $("#uvindex").append(uvIndex);
    }

    else if (data.current.uvi <= 7 && data.current.uvi > 5) {
        var uvIndex = $("<span>")
            .addClass("text-orange bg-dark")
            .text("UV Index: " + data.current.uvi);
        $("#uvindex").append(uvIndex);
    }

    else if (data.current.uvi <= 10 && data.current.uvi > 7) {
        var uvIndex = $("<span>")
            .addClass("text-danger bg-dark")
            .text("UV Index: " + data.current.uvi);
        $("#uvindex").append(uvIndex);
    }

    else {
        var uvIndex = $("<span>")
            .addClass("text-violet bg-dark")
            .text("UV Index: " + data.current.uvi);
        $("#uvindex").append(uvIndex);
    };
    //---------FIVE DAY PREDICTION STARTS HERE--------

    for (var i = 1; i < 6; i++) {

        //clear the previous prediction cards
        $("#day" + [i]).empty();

        //creation of new prediction card elements
        var dayCardHolder = "#day" + [i];
        var cardHeader = $(dayCardHolder);

        var daysAhead = dateHandler(i);
        var cardHeaderEl = $("<div>")
            .addClass("card-header bg-dark text-light text-center w-100")
            .text(daysAhead);

        //body for the prediction cards

        //ICON
        var weatherIconPNG = data.daily[i].weather;
        var weatherIconEl = $("<img>")
            .attr("src", "http://openweathermap.org/img/wn/" + weatherIconPNG[0].icon + "@2x.png");

        //TEMPERATURE
        var tempCardBodyEl = $("<div>")
            .addClass("card-body border-left border-right border-bottom")
            .text("Temp: " + data.daily[i].temp.day);

        //WIND SPEED
        var windCardBodyEl = $("<div>")
            .text("Wind: " + data.daily[i].wind_speed);

        //HUMIDITY
        var humidityCardBodyEl = $("<div>")
            .text("Humidity: " + data.daily[i].humidity);

        //creation of the prediction cards
        cardHeaderEl.append(weatherIconEl);
        cardHeader.append(cardHeaderEl);
        tempCardBodyEl.append(windCardBodyEl).append(humidityCardBodyEl);
        cardHeader.append(tempCardBodyEl);



    }

};

loadData();