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
$("#create-acct-btn").on("click", function() {

    event.preventDefault();

    //store the email and password
    var emailInput = $("#email-field").val().trim();
    var passInput = $("#password-field").val().trim();
    
    console.log("test");
    console.log(emailInput);

    //use firebase to create and store the new user 
    firebase.auth().createUserWithEmailAndPassword(emailInput, passInput).catch(function(error) {
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
$("#login-btn").on("click", function() {

    //$("#user-choices").empty();

    event.preventDefault();

    //store the users email and pass to submit
    var emailInput = $("#email-field").val().trim();
    var passInput = $("#password-field").val().trim();

    console.log("test");
    console.log(emailInput);

    //use firebase to find the user and log them in
    firebase.auth().signInWithEmailAndPassword(emailInput, passInput).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        //alert the user if the pass/email is wrong
        alert(errorMessage);
        // ...

    });
})


//============================= Logging Out Users ==============================================

//when you click the log out button
$("#log-out-btn").on("click", function() {

    event.preventDefault();

    //hide the login text
    $("#login-screen").css("display", "none");
    $("#login").css("display", "block");
    
    //use firebase to sign out the user
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("logged out");
        }).catch(function(error) {
        // An error happened.
    });
})


//============================ Whenever Anyone Logs In Or Out ==================================

//whenever the login state changes
firebase.auth().onAuthStateChanged(function(user) {
    $("#user-choices").empty();

    //if there is a user logged in...
    if (user) {

        $("#main-button").on("click", function() {
            $("#main-button").attr("href", "search.html");
        })

        //show the login screen
        $("#login-screen").css("display", "block");
        $("#login").css("display", "none");
        console.log("success");

        //store the logged in user in a var
        var user = firebase.auth().currentUser;

        //update the uid with the current users ID
        uid = user.uid;
        console.log(uid)

        $("#user-name").text(", " + user.email);

        var userObject = firebase.database().ref().child('users');
        var userList = userObject.child(uid);

        userList.on('value', function(user) {

            var userData = Object.values(user.val());
            //for loop through the users choices in firebase
            for (var i=0; i < userData.length; i++) {
                //var usersData = JSON.stringify(user.val(), null,);
                
                //usersData = JSON.parse(usersData);
                //userData = Object.values(userData);
                console.log(Object.values(userData));
                
                var userChoice = $("<div>");
                var userChoiceContent = $("<h3>").appendTo(userChoice)
                userChoiceContent.text(userData[i].choice);
                userChoice.appendTo($("#user-choices"));
                
            }


            
            //$("#user-choices").text(JSON.stringify(user.val(), null, 3));
            //$("#user-choices").text(user.val().choice6);
            console.log(user.val().choice6);
        });

        //userList.on('child_added', snap => console.log(snap.val()));
        
        
        
    //or else...
    } else {
        console.log("no User");
        $("#main-button").on("click", function() {
            $("#main-button").attr("href", "createAcct.html");
        })
    }
})


//============================= When The User Makes A Choice =====================================

//when the logged in user clicks a checkbox
$(document).on("click", ".testbox", function() {

    console.log("testbox");

    $("#user-choices").empty();

    //store the specific value of that checkbox
    var userChoice = $(this).val();

    
    var user = firebase.auth().currentUser;

    //save that value in the users object in firebase
    var rootRef = firebase.database().ref();

    //var choiceKey = "choice" + i;

    var storesRef = rootRef.child('users').child(uid).push({
        choice: userChoice
    });

    //i++

    //console.log(i);
       
});