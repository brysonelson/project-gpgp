//When you click the search button
$("#submit").on("click", function() {

    event.preventDefault();

    //store user inputs
    var city = $("#city").val().trim();
    var state = $("#state").val().trim();
    var barName = $("#name").val().trim();
    var barType = $("#type").val().trim();

    //create query url
    var url = {
        by_city: city,
        by_state: state,
        by_name: barName,
        by_type: barType
    };

    var queryUrl = "https://api.openbrewerydb.org/breweries?" + $.param(url) + "&page=1&per_page=10";

    console.log(url);

    //hide the search area
    $("#search-area").css("display", "none");
    $("#search-results").css("display", "block");

    //send the query URL using AJAX
    $.ajax({
        url: queryUrl,
        method: "GET"
      }).then(function(response) {

        //for loop through the results to display them
        for (var i = 0; i < response.length; i++) {
            //display the search results in the search-results area
            var resultsDiv = $("<div class='card'>").attr("data-id", "https://api.openbrewerydb.org/breweries/" + response[i].id);
            $("#search-results").append(resultsDiv);
            var nameDiv = $("<h4>").text(response[i].name).appendTo(resultsDiv);
            var phoneDiv = $("<h4>").text(response[i].phone).appendTo(resultsDiv);
            var typeDiv = $("<h5>").text(response[i].brewery_type).appendTo(resultsDiv);
            var addressDiv = $("<h5>").text(response[i].street + ", " + response[i].city + ", " + response[i].state + ", " + response[i].postal_code).appendTo(resultsDiv);
            var addressDiv = $("<h3>").text(response[i].website_url).appendTo(resultsDiv);
            var favoritesBtn = $("<input>").attr("type", "button").attr("value","Add To Favorites").appendTo(resultsDiv);

            console.log(response[i].name);
        }
        
    });



})