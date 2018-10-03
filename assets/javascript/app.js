//=========================== When you click the search button ==========================================
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

    console.log(queryUrl);

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

            var resultsDiv = $("<div class='card results-card'>");
            $("#search-results").append(resultsDiv);
            var nameDiv = $("<h4 class='location-name'>").text(response[i].name).appendTo(resultsDiv);
            var phoneDiv = $("<h4 class='location-phone'>").text(response[i].phone).appendTo(resultsDiv);
            var typeDiv = $("<h5 class='location-type'>").text("Type of Bar: " + response[i].brewery_type).appendTo(resultsDiv);
            var addressDiv = $("<h5 class='location-url'>").text(response[i].street + ", " + response[i].city + ", " + response[i].state + ", " + response[i].postal_code).appendTo(resultsDiv);
            var websiteDiv = $("<a class='location-website'>").attr("href", response[i].website_url).attr("target", "_blank").text(response[i].website_url).appendTo(resultsDiv);
            var favoritesBtn = $("<input class='favorites-button'>").attr("type", "button").attr("value","Add To Favorites").attr("data-id", "https://api.openbrewerydb.org/breweries/" + response[i].id).addClass("btn btn-default").appendTo(resultsDiv);

            console.log(response[i].name);
        }
    });



})


//===================== Recipe API search ===============================================================
//===================== When you click the submit button for cocktail name ==============================
$("#recipe-name-submit").on("click", function() {

  event.preventDefault();

  //store user inputs
  var recipeName = $("#cocktail-name").val().trim();
  //var alcoholType = $("#alcohol-type").val().trim();

  var recipeQueryUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + recipeName;
  console.log(recipeQueryUrl);

  //hide the recipe search area
  $("#recipe-search-area").css("display", "none");

  //show the recipe results
  $("#recipe-search-results").css("display", "block");
  //send the query URL using AJAX
  $.ajax({
    url: recipeQueryUrl,
    method: "GET"
  }).then(function(response) {
    //for loop through the results to display them
    for (var i = 0; i < 11; i++) {
      //display the search results in the search-results area

      var alcoholId = response.drinks[i].idDrink;

      var recipeResultsDiv = $("<div class='card results-card'>").appendTo($("#recipe-search-results"));
      var recipeName = $("<h4>").text("Recipe: " + response.drinks[i].strDrink).appendTo(recipeResultsDiv);
      var recipeImg= $("<img class='recipe-img'>").attr("src", response.drinks[i].strDrinkThumb).appendTo(recipeResultsDiv);
      var recipeInstructions = $("<h4>").text("Instructions: " + response.drinks[i].strInstructions).appendTo(recipeResultsDiv);
      var recipeFavoritesBtn = $("<input class='recipes-button'>").attr("type", "button").attr("value", "Add To Favorites").attr("data-id", "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + alcoholId).addClass("btn btn-default").appendTo(recipeResultsDiv);

      console.log(response.drinks[i]);
    };
  });
});

//===================== When you click the submit button for alcohol type ==============================
$("#recipe-alcohol-submit").on("click", function() {

  event.preventDefault();

  //store user inputs
  var alcoholType = $("#alcohol-type").val().trim();
  //var alcoholType = $("#alcohol-type").val().trim();

  var alcoholQueryUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + alcoholType;
  console.log(alcoholQueryUrl);

  //hide the recipe search area
  $("#recipe-search-area").css("display", "none");

  //show the recipe results
  $("#recipe-search-results").css("display", "block");
  //send the query URL using AJAX
  $.ajax({
    url: alcoholQueryUrl,
    method: "GET"
  }).then(function(response) {
    //for loop through the results to display them
    for (var i = 0; i < 11; i++) {

      var alcoholId = response.drinks[i].idDrink;
      //display the search results in the search-results area

      var recipeResultsDiv = $("<div class='card results-card'>").appendTo($("#recipe-search-results"));
      var alcoholName = $("<h4>").text("Recipe: " + response.drinks[i].strDrink).appendTo(recipeResultsDiv);
      var recipeAlcoholImg = $("<img class='recipe-img'>").attr("src", response.drinks[i].strDrinkThumb).appendTo(recipeResultsDiv);
      var recipeFavoritesBtn = $("<input class='recipes-button'>").attr("type", "button").attr("value", "Add To Favorites").attr("data-id", "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + alcoholId).addClass("btn btn-default").appendTo(recipeResultsDiv);
      console.log(response.drinks[i].strDrinkThumb);
      console.log(response.drinks[i]);

      
      var alcoholIdQueryUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + alcoholId;

      //ajax request to get the instructions for the beverage id
      $.ajax({
        url: alcoholIdQueryUrl,
        method: "GET"
      }).then(function(responseTwo) {
        console.log(alcoholIdQueryUrl);
        var recipeAlcoholInstructions = $("<h5>").text(responseTwo.drinks[i].strInstructions).appendTo(recipeResultsDiv);
        console.log("response" + responseTwo);
        console.log("drinks" + responseTwo.drinks[i]);
        console.log(responseTwo.drinks[i].strInstructions);
      
      });
    };
  });
});



//======================= SWITCHING BETWEEN BARS AND RECIPES FAVORITES ==================================

//when you click on the favorite recipes
$("#recipe-favs").on("click", function() {

  //show the favorite recipes html
  $("#user-recipe-choices").css("display", "block");

  //hide the favorite bars html
  $("#user-bar-choices").css("display", "none");

  $("#bar-favs").css("border-bottom", "none");
  $("#recipe-favs").css("border-bottom", "solid 1px black");

})

//when you click on the favorite bars
$("#bar-favs").on("click", function() {

  //hide the favorite recipes html
  $("#user-recipe-choices").css("display", "none");

  //show the favorite bars html
  $("#user-bar-choices").css("display", "block");

  $("#recipe-favs").css("border-bottom", "none");
  $("#bar-favs").css("border-bottom", "solid 1px black");

})

//=============================== BACK TO SEARCH RESULTS ================================================

$("#back-to-results").on("click", function() {
  $("#search-results").css("display", "block");
  $("#bar-info").css("display", "none");
  $("#users-bar-info").css("display", "none");
})
//======================= WHEN YOU CLICK ON A BAR IN THE RESULTS ========================================
//var usersBarAddress;

$(document).on("click", ".results-card", function () {


  $("#search-results").css("display", "none");
  $("#bar-info").css("display", "block").empty();
  $("#users-bar-info").css("display", "block");
  //$("#map_canvas").css("visibility", "block");

  //store the users choice address for google maps
  var usersBarAddress = $(this).find(".location-url").text();
  console.log(usersBarAddress);

  var usersBarDiv = $("<div class='card'-head>").appendTo($("#bar-info"));

  var usersBarName = $(this).find(".location-name").text();
  var usersBarNameDiv = $("<h1>").text(usersBarName).appendTo(usersBarDiv);

  var usersBarPhone = $(this).find(".location-phone").text();
  var usersBarNameDiv = $("<h4>").text(usersBarPhone).appendTo(usersBarDiv);

  var usersBarType = $(this).find(".location-type").text();
  var usersBarNameDiv = $("<h4>").text(usersBarType).appendTo(usersBarDiv);

  var usersBarAddressResults = $(this).find(".location-url").text();
  var usersBarNameDiv = $("<h4>").text(usersBarAddressResults).appendTo(usersBarDiv);

  var usersBarWebsite = $(this).find(".location-website").text();
  var usersBarNameDiv = $("<h4>").text(usersBarWebsite).appendTo(usersBarDiv);

  //======================================= GOOGLE MAPS ===================================================

  var geocoder;
  var map;
  var address = usersBarAddress;

  initialize();
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    //   debugger;
    if (geocoder) {
      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow({
              content: '<b>' + address + '</b>',
              size: new google.maps.Size(150, 50)
            });

            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: address
            });
            google.maps.event.addListener(marker, 'click', function () {
              infowindow.open(map, marker);
            });

          } else {
            alert("No results found");
          }
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }
  //google.maps.event.addDomListener(window, 'load', initialize);
});

//==============================Geocoder for multiple address object==================================
// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDBO4yh7_oD4WVhGQFOgzYm9s9XW7LQqUc
function getCoordFromAddress( addressText){
  var addressURL = addressText.replace(' ', '+');
  var query = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDBO4yh7_oD4WVhGQFOgzYm9s9XW7LQqUc&address=" + addressURL;
  $.ajax({
    url: query,
    method: "GET"
  }).then(function(response){
    var retObj = { 
      position: response.geometry.location,
      title: response.formatted_address
  };
    
    return retObj;
  })
}


//=============================== BACK TO FAVORITES ================================================

$("#back-to-favorites").on("click", function() {
  $("#users-fav-bar-info").css("display", "none");
  $("#user-favorites").css("display", "block");
  //$("#users-bar-info").css("display", "none");
})

//======================= WHEN YOU CLICK ON A BAR IN THE Favorites ========================================
//var usersBarAddress;

$(document).on("click", ".bar-fav-card", function () {

  console.log("boo");
  $("#user-favorites").css("display", "none");
  $("#fav-bar-info").css("display", "block").empty();
  $("#users-fav-bar-info").css("display", "block");
  //$("#map_canvas").css("visibility", "block");

  //store the users choice address for google maps
  var usersFavBarAddress = $(this).find(".user-fav-bar-address").text();
  console.log(usersFavBarAddress);

  var usersFavBarDiv = $("<div class='card'>").appendTo($("#fav-bar-info"));

  var usersFavBarName = $(this).find(".user-fav-bar-name").text();
  console.log(usersFavBarName);
  var usersFavBarNameDiv = $("<h1>").text(usersFavBarName).appendTo(usersFavBarDiv);

  var usersFavBarPhone = $(this).find(".user-fav-bar-phone").text();
  var usersFavBarNameDiv = $("<h4>").text(usersFavBarPhone).appendTo(usersFavBarDiv);

  var usersFavBarType = $(this).find(".user-fav-bar-type").text();
  var usersFavBarNameDiv = $("<h4>").text(usersFavBarType).appendTo(usersFavBarDiv);

  var usersFavBarAddressResults = $(this).find(".user-fav-bar-address").text();
  var usersFavBarNameDiv = $("<h4>").text(usersFavBarAddressResults).appendTo(usersFavBarDiv);

  var usersFavBarWebsite = $(this).find(".user-fav-bar-url").text();
  var usersFavBarNameDiv = $("<h4>").text(usersFavBarWebsite).appendTo(usersFavBarDiv);

  //======================================= GOOGLE MAPS ===================================================

  var geocoder;
  var map;
  var address = usersFavBarAddress;

  initialize();
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    //   debugger;
    if (geocoder) {
      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow({
              content: '<b>' + address + '</b>',
              size: new google.maps.Size(150, 50)
            });

            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: address
            });
            google.maps.event.addListener(marker, 'click', function () {
              infowindow.open(map, marker);
            });

          } else {
            alert("No results found");
          }
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }
  //google.maps.event.addDomListener(window, 'load', initialize);
});

