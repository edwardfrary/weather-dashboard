var cityNameAPI = "";
var country = "";

//obtains and formats the current date
var currentDate = new Date();
var d = String(currentDate.getDate()).padStart(2, '0');
var m = String(currentDate.getMonth() + 1).padStart(2, '0');
var y = currentDate.getFullYear();
currentDate = m + '/' + d + '/' + y;

//Event handler for clicking the search button
$("#searchbtn").on("click", function () {
    apiSearch();
});

//function to handle using the search function to fetch an api
function apiSearch() {
    var searchBox = $("#citysearch").val();
    //fetch the API with the city name taken from the text input box
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + searchBox + "&appid=2fd9f6120b1e5e49f6b0893e50ef57f6")
        .then(function (response) {
            //check if there is a response then json the data and send it to be processed
            if (response.ok) {
                //save the city name entered into the text input box and then fetch the co-ordinates of the city
                saveCity(searchBox);

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
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + savedCity + "&units=imperial&appid=2fd9f6120b1e5e49f6b0893e50ef57f6")
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

//function to save the city name as a clickable button and display it on index.html
function saveCity(cityName) {
    var savedBtnFunction = "apiBtn('" + cityName + "');";
    var savedCityEl = $("<button>")
        .addClass("btn-secondary bg-darkblue text-light shadow w-100")
        .text(cityName)
        .attr("onClick", savedBtnFunction);
    $("#previous-searches").append(savedCityEl);
};

//function to render the relevent weather data to index.html
function renderData(data) {
    console.log(data);
    //first clear the previous elements from any other searches
    $("#cityname-header").empty();
    $("span").empty();

    //now insert the city name and country
    var cityName = $("<h2>")
        .text("City of: " + cityNameAPI + ", " + country + " (" + currentDate + ")");
    $("#cityname-header").append(cityName);

    //TEMPERATURE
    var temperature = $("<span>")
        .text("Current temp: " + data.current.temp + "°F");
    $("#temperature").append(temperature);

    //WINDSPEED
    var windSpeed = $("<span>")
        .text("Wind Speed: " + data.current.wind_speed + " MPH");
    $("#wind-speed").append(windSpeed);

    //HUMIDITY
    var humidity = $("<span>")
        .text("Humidity: " + data.current.humidity + "%");
    $("#humidity").append(humidity);

    //UV INDEX
    var uvIndex = $("<span>")
        .text("UV Index: " + data.current.uvi);
    $("#uvindex").append(uvIndex);

};