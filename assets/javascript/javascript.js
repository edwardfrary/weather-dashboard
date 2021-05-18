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
                //save the city name entered into the text input box
                saveCity(searchBox);

                response.json().then(function (data) {
                    renderData(data);
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
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + savedCity + "&appid=2fd9f6120b1e5e49f6b0893e50ef57f6")
        .then(function (response) {
            //check if there is a response then json the data and send it to be processed
            if (response.ok) {

                response.json().then(function (data) {
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
    var cityName = $("<h2>")
        .text("City of: " + data.name + ", " + data.sys.country);
    $("#cityname-header").append(cityName);
};