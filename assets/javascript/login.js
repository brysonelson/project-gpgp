var config = {
    apiKey: "AIzaSyDBSpt1DyczRMA3LETkRcmcxSEILNQfXTM",
    authDomain: "gpgp-bar-search.firebaseapp.com",
    databaseURL: "https://gpgp-bar-search.firebaseio.com",
    projectId: "gpgp-bar-search",
    storageBucket: "gpgp-bar-search.appspot.com",
    messagingSenderId: "344681136284"
};
firebase.initializeApp(config);

//create var for the database
var database = firebase.database();

//create a var to store the users ID from firebase
var uid;

//======================== Creating New Accounts ==============================================

//when you click Create Account
$("#create-acct-btn").on("click", function () {

    event.preventDefault();

    //store the email and password
    var emailInput = $("#email-field").val().trim();
    var passInput = $("#password-field").val().trim();

    console.log("test");
    console.log(emailInput);

    //use firebase to create and store the new user 
    firebase.auth().createUserWithEmailAndPassword(emailInput, passInput).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

    //store the new users ID in the firebase database
    //database.ref().push({
    //    uid: uid
    //})
})


//============================ Logging In Current Users ========================================

//when you click the login button
$("#login-btn").on("click", function () {

    //$("#user-choices").empty();

    event.preventDefault();
    // alert("You are logged in.");
    // $('#login-flash').show();
    // $('#login-flash').delay(500).fadeIn('normal', function () {
    //     $(this).delay(2500).fadeOut();
    // });


    //store the users email and pass to submit
    var emailInput = $("#email-field").val().trim();
    var passInput = $("#password-field").val().trim();

    console.log("test");
    console.log(emailInput);

    //use firebase to find the user and log them in
    firebase.auth().signInWithEmailAndPassword(emailInput, passInput).then(function(response) {
        var searchDelay = setTimeout(goToSearch, 1000);
    }

    ).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        //alert the user if the pass/email is wrong
        // alert(errorMessage);
        $('#error-flash').delay(500).fadeIn('normal', function () {
            $(this).delay(2500).fadeOut();
        });
    });

    //this needs to be fixed to if there are any error messages, window does not load.
    function goToSearch() {
        window.location = "search.html";
    }
    // var searchDelay = setTimeout(goToSearch, 1000);
})


//============================= Logging Out Users ==============================================

//when you click the log out button
$(".log-out-btn").on("click", function () {

    event.preventDefault();

    window.location = "login.html";
    //hide the login text
    $("#login-screen").css("display", "none");
    $("#login").css("display", "block");

    //use firebase to sign out the user
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("logged out");
    }).catch(function (error) {
        // An error happened.
    });
})

//when you click the log out button
$(document).on("click", "#logout-head-button", function () {

    event.preventDefault();
    // alert("Logged you out!");
    // $('#logout-flash').show();

    //hide the login text
    $("#login-screen").css("display", "none");
    $("#login").css("display", "block");

    //use firebase to sign out the user
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("logged out");
    }).catch(function (error) {
        // An error happened.
    });
})


//============================ Whenever Anyone Logs In Or Out ==================================

//whenever the login state changes
firebase.auth().onAuthStateChanged(function (user) {
    $("#user-choices").empty();

    //if there is a user logged in...
    if (user) {

        $("#login-warning").css("display", "none");

        //when you click the start button on the home page button
        $("#main-button").on("click", function () {
            $("#main-button").attr("href", "search.html");
        })

        //change the login button value
        $("#login-head-button").css("display", "none");
        $("#logout-head-button").css("display", "block");
        $("#sign-up-button").css("display", "none");

        //show the login screen
        $("#login-screen").css("display", "block");
        $("#login").css("display", "none");
        $("#favorites").css("display", "block");

        //store the logged in user in a var
        var user = firebase.auth().currentUser;

        //update the uid with the current users ID
        uid = user.uid;
        console.log(uid)

        $("#user-name").text(", " + user.email);

        var userObject = firebase.database().ref().child('users');
        var userList = userObject.child(uid);

        //whenever the users data updates or the page loads
        userList.on('value', function (user) {

            //store the users data from firebase
            var userData = Object.values(user.val());

            //for loop through the users choices in firebase and send the URL with AJAX to get full results
            for (var i = 0; i < userData.length; i++) {
                var favoriteUrl = userData[i].favoriteBar;
                $.ajax({
                    url: favoriteUrl,
                    method: "GET"
                }).then(function (response) {

                    //var usersData = JSON.stringify(user.val(), null,);

                    //usersData = JSON.parse(usersData);
                    //userData = Object.values(userData);
                    console.log(response);

                    console.log(favoriteUrl);

                    //create a userFavorite div and append it to the page
                    var userFavorite = $("<div class='w-100 card bar-fav-card'><hr>");
                    userFavorite.appendTo($("#user-bar-choices"));

                    //create the divs to show the users favorites
                    var nameDiv = $("<h3 class='user-fav-bar-name'>").text(response.name).appendTo(userFavorite);
                    var phoneDiv = $("<h4 class='user-fav-bar-phone'>").text('Phone: ' + response.phone).addClass("user-fav-bar-info").appendTo(userFavorite);
                    var typeDiv = $("<h5 class='user-fav-bar-type'>").text('Bar Type: ' + response.brewery_type).addClass("user-fav-bar-info").appendTo(userFavorite);
                    var addressDiv = $("<h5 class='user-fav-bar-address'>").text(response.street + ", " + response.city + ", " + response.state + ", " + response.postal_code).addClass("user-fav-bar-info").appendTo(userFavorite);
                    var websiteDiv = $("<h5 class='user-fav-bar-url'>").text(response.website_url).addClass("user-fav-bar-info").appendTo(userFavorite);
                    var removeFavoritesBtn = $("<input class='remove-favorites-button'>").attr("type", "button").attr("value", "Remove From Favorites").attr("data-id", "https://api.openbrewerydb.org/breweries/" + response.id).addClass("btn btn-default btn-standard").appendTo(userFavorite);

                });
            };

            //for loop through the users choices in firebase and send the URL with AJAX to get full results
            for (var i = 0; i < userData.length; i++) {
                var favoriteUrl = userData[i].favoriteRecipe;
                $.ajax({
                    url: favoriteUrl,
                    method: "GET"
                }).then(function (response) {

                    //var usersData = JSON.stringify(user.val(), null,);

                    //usersData = JSON.parse(usersData);
                    //userData = Object.values(userData);
                    console.log(response);

                    console.log(favoriteUrl);
                    console.log(response.drinks);

                    //create a userFavorite div and append it to the page
                    var userFavorite = $("<div class'card'><hr>");
                    userFavorite.appendTo($("#user-recipe-choices"));

                    //create the divs to show the users favorites

                    var nameDiv = $("<h4>").text(response.drinks[0].strDrink).addClass("user-fav-drink-name").appendTo(userFavorite);
                    var recipeInstrucrtionsDiv = $("<h5>").text(response.drinks[0].strInstructions).appendTo(userFavorite);
                    var removeFavoritesBtn = $("<input class='remove-favorites-button'>").attr("type", "button").attr("value", "Remove From Favorites").attr("data-id", "https://api.openbrewerydb.org/breweries/" + response.id).addClass("btn btn-default btn-standard").appendTo(userFavorite);


                });
            };

        });

        //or else...
    } else {
        $("#login-warning").css("display", "block");
        $("#login-head-button").css("display", "block");
        $("#logout-head-button").css("display", "none");
        $("#sign-up-button").css("display", "block");
        console.log("no User");
        $("#main-button").on("click", function () {
            $("#main-button").attr("href", "createAcct.html");
        })
    }
})


//============================= When The User Makes A Bar Choice =====================================

//when the logged in user clicks a checkbox
$(document).on("click", ".favorites-button", function () {

    //$("#user-choices").empty();

    //store the specific value of that checkbox
    var userBarChoice = $(this).attr("data-id");

    //store the current user
    var user = firebase.auth().currentUser;

    //save that value in the users object in firebase
    var rootRef = firebase.database().ref();
    var storesRef = rootRef.child('users').child(uid).push({
        favoriteBar: userBarChoice
    });

});

//============================= When The User Makes A Recipe Choice =====================================

//when the logged in user clicks a checkbox
$(document).on("click", ".recipes-button", function () {

    //$("#user-choices").empty();

    //store the specific value of that checkbox
    var userRecipeChoice = $(this).attr("data-id");

    //store the current user
    var user = firebase.auth().currentUser;

    //save that value in the users object in firebase
    var rootRef = firebase.database().ref();
    var storesRef = rootRef.child('users').child(uid).push({
        favoriteRecipe: userRecipeChoice
    });

});

//========================== When a user click to clear favorites ==================
$(document).on("click", "#clear-favs-btn", function () {

    //prevent the page from reloading
    event.preventDefault();

    //remove the item from database
    firebase.database().ref().child('users').child(uid).remove();

    //make sure the screen clears
    $("#user-choices").empty();

});