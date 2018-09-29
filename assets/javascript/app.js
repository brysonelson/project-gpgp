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
            var resultsDiv = $("<div class='card container'>").attr("data-id", "https://api.openbrewerydb.org/breweries/" + response[i].id);
            $("#search-results").append(resultsDiv);
            var nameDiv = $("<h4>").text(response[i].name).appendTo(resultsDiv);
            var phoneDiv = $("<h4>").text(response[i].phone).appendTo(resultsDiv);
            var typeDiv = $("<h5>").text(response[i].brewery_type).appendTo(resultsDiv);
            var addressDiv = $("<h5>").text(response[i].street + ", " + response[i].city + ", " + response[i].state + ", " + response[i].postal_code).appendTo(resultsDiv);
            var websiteDiv = $("<h5>").text(response[i].website_url).appendTo(resultsDiv);
            var favoritesBtn = $("<input>").attr("type", "button").attr("value","Add To Favorites").appendTo(resultsDiv);

            console.log(response[i].name);
        }
        
    });



})
// Initialize and add the map to element ID map
function initMap() {
      // The location of Uluru
    //   var uluru = {lat: -25.344, lng: 131.036};
    //   // The map, centered at Uluru
    //   var map = new google.maps.Map(
    //       document.getElementById('map'), {zoom: 4, center: uluru});
    //   // The marker, positioned at Uluru
    //   var marker = new google.maps.Marker({position: uluru, map: map});
      initialize();
    }
    
    var geocoder;
    var map;
    var address = "Los Angeles, CA";
    
    function initialize() {
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(-34.397, 150.644);
      var myOptions = {
        zoom: 8,
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
        }, function(results, status) {
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
              google.maps.event.addListener(marker, 'click', function() {
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
