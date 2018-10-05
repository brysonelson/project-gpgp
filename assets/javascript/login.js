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

    function goToSearch() {
        window.location = "search.html";
    }
    //use firebase to create and store the new user 
    firebase.auth().createUserWithEmailAndPassword(emailInput, passInput).then(function(response) {
        var searchDelay = setTimeout(goToSearch, 1000);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        $('#error-flash').delay(500).fadeIn('normal', function () {
            $(this).delay(2500).fadeOut();
        });
    });
   
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
        userObject.on('value', function (user) {

            //store the users data from firebase
            var userData = Object.values(user.val());

            //for loop through the users choices in firebase and send the URL with AJAX to get full results
            for (var i = 0; i < userData.length; i++) {
                var favoriteUrl = userData[i].favoriteBar;
                if (favoriteUrl) {
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
                        var removeFavoritesBtn = $("<input class='remove-favorites-button'>").attr("type", "button").attr("value", "View On Map").attr("data-id", "https://api.openbrewerydb.org/breweries/" + response.id).addClass("btn btn-default btn-standard").appendTo(userFavorite);

                    });
                }
            };

            //for loop through the users choices in firebase and send the URL with AJAX to get full results
            for (var i = 0; i < userData.length; i++) {
                var favoriteUrl = userData[i].favoriteRecipe;
                if (favoriteUrl) {
                    $.ajax({
                        url: favoriteUrl,
                        method: "GET"
                    }).then(function (response) {

                        //var usersData = JSON.stringify(user.val(), null,);

                        //usersData = JSON.parse(usersData);
                        //userData = Object.values(userData);
                        console.log(response);

                        console.log(favoriteUrl);
                        //console.log(response.drinks[0].favoriteRecipe);

                        //create a userFavorite div and append it to the page
                        var userFavorite = $("<div class'w-100 card'><hr>");
                        userFavorite.appendTo($("#user-recipe-choices"));

                        //create the divs to show the users favorites

                        var nameDiv = $("<h4>").text(response.drinks[0].strDrink).addClass("user-fav-drink-name").appendTo(userFavorite);
                        var recipeImgDiv = $("<img class='w-50 fav-drink-img'>").attr("src", response.drinks[0].strDrinkThumb).appendTo(userFavorite);
                        var recipeInstrucrtionsDiv = $("<h5>").text(response.drinks[0].strInstructions).appendTo(userFavorite);
                        var removeFavoritesBtn = $("<a class='remove-recipe-favorites-button'>").attr("href", "https://www.google.com/search?q=" + response.drinks[0].strDrink + "+cocktail+ingredients").text("Find Ingredients").attr("target", "_blank").addClass("btn btn-default btn-standard").appendTo(userFavorite);


                    });
                }
            };
        });
        

        var communityList = userObject.child('community');
        console.log(communityList);
        
        //whenever the users data updates or the page loads
        communityList.on('value', function (comResponse) {

            $("#community-choices").empty();

            var comData = Object.values(comResponse.val());
            console.log(comData);

            //for loop through the users choices in firebase and send the URL with AJAX to get full results
            for (var i = 0; i < comData.length; i++) {
                var favoriteUrl = comData[i].communityBar;
                console.log(favoriteUrl);
                if (favoriteUrl) {
                    $.ajax({
                        url: favoriteUrl,
                        method: "GET"
                    }).then(function (response) {
                        console.log(favoriteUrl);
                        //var usersData = JSON.stringify(user.val(), null,);

                        //usersData = JSON.parse(usersData);
                        //userData = Object.values(userData);
                        console.log(response);

                        //console.log(response.drinks[0].favoriteRecipe);

                        //create a userFavorite div and append it to the page
                        var comFavorite = $("<div class'w-100 card'><hr>");
                        comFavorite.appendTo($("#community-choices"));

                        //create the divs to show the users favorites

                        //create the divs to show the users favorites
                        var nameDiv = $("<h3 class='user-fav-bar-name'>").text(response.name).appendTo(comFavorite);
                        var phoneDiv = $("<h4 class='user-fav-bar-phone'>").text('Phone: ' + response.phone).addClass("user-fav-bar-info").appendTo(comFavorite);
                        var typeDiv = $("<h5 class='user-fav-bar-type'>").text('Bar Type: ' + response.brewery_type).addClass("user-fav-bar-info").appendTo(comFavorite);
                        var addressDiv = $("<h5 class='user-fav-bar-address'>").text(response.street + ", " + response.city + ", " + response.state + ", " + response.postal_code).addClass("user-fav-bar-info").appendTo(comFavorite);
                        var websiteDiv = $("<h5 class='user-fav-bar-url'>").text(response.website_url).addClass("user-fav-bar-info").appendTo(comFavorite);
                        


                    });
                }
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

    event.preventDefault();

    var thisParent = $(this).parent(".fav-btn-div");

    var thumbChild = thisParent.find(".success-icon").css("display", "inline-block");
    
    
    console.log(this);
    function removeSuccessIcon() {
        $(".success-icon").css("display", "none");
    }

    var removeSuccessIconFunc = setTimeout(removeSuccessIcon, 2000);

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

//============================= When The User Makes A Community Choice =====================================

//when the logged in user clicks a checkbox
$(document).on("click", ".com-favorites-button", function () {

    event.preventDefault();

    var thisParent = $(this).parent(".com-fav-btn-div");

    var thumbChild = thisParent.find(".success-icon").css("display", "inline-block");
    
    
    console.log(this);
    function removeSuccessIcon() {
        $(".success-icon").css("display", "none");
    }

    var removeSuccessIconFunc = setTimeout(removeSuccessIcon, 2000);

    //$("#user-choices").empty();

    //store the specific value of that checkbox
    var userComBarChoice = $(this).attr("data-id");

    //store the current user
    var user = firebase.auth().currentUser;

    //save that value in the users object in firebase
    var rootRef = firebase.database().ref();
    var storesRef = rootRef.child('users').child('community').push({
        communityBar: userComBarChoice
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
    //$("#user-choices").empty();

    location.reload(true);

});