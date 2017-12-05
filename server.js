/********************/
/***** REQUIRES *****/
/********************/

// NPM 
var express = require('express');
var session = require('express-session');
var assert = require('assert');
var util = require('util');
var bodyParser = require('body-parser');
var http = require("http");
//var ssl = require('ssl-root-cas').addFile('my-cert.crt');
var app = express();
var jade = require('jade');
var request = require('request');
var passwordHash = require('password-hash');
/*var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
*/
// Local
var functions = require('./server/functions');
var notifications = require('./server/notifications');
//var User = functions.User;
var Users = functions.Users;
var Notifications = notifications.Notifications;
//var Preferences = functions.Preferences;
var pw = functions.password(passwordHash);


//======== FOR TESTING ONLY ========

var allBlogs = [];
var dummyBlogCounter = 1;

function getBlogByID(blogID){
	for(var i = 0; i < allBlogs.length; i++){
		var thisBlog = allBlogs[i];

		if(thisBlog.id == blogID){
			return thisBlog;
		}
	}
}
function isUserAllowedToViewBlog(currentUserID, blogID){
	var theBlog = getBlogByID(blogID);
	var isUserAllowed = false;

	for(var i = 0; i < theBlog.followersAllowed.length; i++){
		var thisFollower = theBlog.followersAllowed[i];

		if(thisFollower == currentUserID){
			isUserAllowed = true;
		}
	}

	return isUserAllowed;

}

//======== END TESTING ========


/*********************************/
/***** SERVER INITIALIZATION *****/
/*********************************/

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/static"));
//app.set('trust proxy', 1) // Secure site only.
app.use(session({
	/*genid: function(req) {
		return genuuid(); // use UUIDs for session IDs
	},*/
	secret: "sshh, it's a secret",
	resave: false,
	saveUninitialized: true,
	name: "JSESSIONID",
	cookie: {
		secure: false
	}
}));

//set view engine
app.set("view engine","jade");

app.listen(app.get("port"), function() {
	console.log("Node app is running on port", app.get("port"));

	var dummyUser = functions.User();

	dummyUser.userName = "drakaric";
	dummyUser.email = "drakaric@gmail.com";
	dummyUser.firstName = "Daniel";
	dummyUser.lastName = "Rakaric";
	dummyUser.preferences = {colorScheme:"theme-blue"};
	dummyUser.followers = [2];
	dummyUser.password = pw.generateDefault();

	Users.addUser(dummyUser);

	var dummyUser1 = functions.User();

	dummyUser1.userName = "oruiz";
	dummyUser1.email = "oruiz@gmail.com";
	dummyUser1.firstName = "Oscar";
	dummyUser1.lastName = "Ruiz";
	dummyUser1.preferences = {colorScheme:"theme-blue"};
	dummyUser1.followers = [1];
	dummyUser1.password = pw.generateDefault();

	Users.addUser(dummyUser1);

	var dummyUser2 = functions.User();

	dummyUser2.userName = "sbalarajan";
	dummyUser2.email = "surya@gmail.com";
	dummyUser2.firstName = "Suryadevi";
	dummyUser2.lastName = "Balarajan";
	dummyUser2.preferences = {colorScheme:"theme-blue"};
	dummyUser2.followers = [2];
	dummyUser2.password = pw.generateDefault();

	Users.addUser(dummyUser2);

	var dummyUser3 = functions.User();

	dummyUser3.userName = "jdoe";
	dummyUser3.email = "jdoe@gmail.com";
	dummyUser3.firstName = "John";
	dummyUser3.lastName = "Doe";
	dummyUser3.preferences = {colorScheme:"theme-blue"};
	dummyUser3.followers = [3,4];
	dummyUser3.password = pw.generateDefault();

	Users.addUser(dummyUser3);


//======== FOR TESTING ONLY ========

//Simulated blog entries to test blog privacy settings

	var dummyBlog = {
		id: dummyBlogCounter++,
		ownerId: 2,
		userName: "oruiz",
		blogTitle: "Test1",
		followersAllowed: [1],
		privacy: "public"
	};

	allBlogs.push(dummyBlog);

	var dummyBlog1 = {
		id: dummyBlogCounter++,
		ownerId: 2,
		userName: "oruiz",
		blogTitle: "Test2",
		followersAllowed: [1],
		privacy: "private"
	};

	allBlogs.push(dummyBlog1);
	
	var dummyBlog2 = {
		id: dummyBlogCounter++,
		ownerId: 4,
		userName: "jdoe",
		blogTitle: "Test3",
		followersAllowed: [3,4],
		privacy: "private"
	};

	allBlogs.push(dummyBlog2);
	
	var dummyBlog3 = {
		id: dummyBlogCounter++,
		ownerId: 4,
		userName: "jdoe",
		blogTitle: "Test4",
		followersAllowed: [3,4],
		privacy: "public"
	};

	allBlogs.push(dummyBlog3);
	
	var dummyBlog4 = {
		id: dummyBlogCounter++,
		ownerId: 3,
		userName: "sbalarajan",
		blogTitle: "Test4",
		followersAllowed: [2],
		privacy: "private"
	};

	allBlogs.push(dummyBlog4);
	
//======== FOR TESTING ONLY ========

});


/****************************/
/***** APPLICATION URIS *****/
/****************************/


/*** GET METHODS START ***/

app.get("/", function(request, response) {
	var sess = request.session;
	var user = sess.user;

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	response.render("main", {user, "colorSchemes": functions.ColorSchemes, notificationList : Notifications.notifications,});
});

app.get("/sign-up", function(request, response) {
	response.render("sign-up");
});

app.get("/logout", function(request, response) {
	var sess = request.session;
	sess.destroy();

	response.redirect("/");
});

app.get("/users/:userName", function(request, response) {
	response.set('Content-Type', 'application/json');
	var userName = request.params.userName;

	var searchedUser = Users.findByUserName(userName);
	if (searchedUser !== undefined) response.status(200).send({"user":searchedUser});
	else response.status(200).send({"error":"User not found"});
	
});

//Placeholder route to retrieve simulated blog posts
app.get("/or/:userName/blog", function(request, response) {
	var dummyBlog = {
		id: dummyBlogCounter++,
		ownerId: 2,
		userName: "oruiz",
		blogTitle: "Test1",
		followersAllowed: [1],
		privacy: "public"
	};

	allBlogs.push(dummyBlog);
	
});

/*
	Placeholder route used to test simulated features:
		1) Subscribe/unsubscribe
		2) Notifications
		3) Blog post privacy settings
*/
app.get("/or", function(request, response) {
	var sess = request.session;
	var user = sess.user;
	var myBlogs = [];

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	for(var i = 0; i < allBlogs.length; i++){
		var thisBlog = allBlogs[i];
		if(thisBlog.privacy.toLowerCase() == "public") myBlogs.push(thisBlog);

		if(thisBlog.privacy.toLowerCase() == "private" && isUserAllowedToViewBlog(user.id, thisBlog.id)){
			myBlogs.push(thisBlog);
		}
	}

	response.render("or-all-users", {user, userList: Users.users, "colorSchemes": functions.ColorSchemes, notificationList : Notifications.notifications, blogsList : allBlogs, myBlogsList: myBlogs});
	
});

//Placeholder route used to retrieve all notifications
app.get("/notifications", function(request, response) {
	var sess = request.session;
	var user = sess.user;
	var myBlogs = [];

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	response.render("or-all-notifications", {user, userList: Users.users, "colorSchemes": functions.ColorSchemes, notificationList : Notifications.notifications});
	
});

//Placeholder route used to retrieve notification based on the username
app.get("/or/:userName/notifications", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	var sess = request.session;
	var user = sess.user;

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	var currentUserId = user.id;
	var userName = request.params.userName;
	var storedUser = Users.findByUserName(userName);
	var myNotifications = [];

	//Check for valid user to follow
	if(storedUser != undefined){
		var allNotifications = Notifications.notifications;
		for(var i = 0; i < allNotifications.length; i++){
			var thisNotification = allNotifications[i];

			if(Notifications.isFollowerAllowed(thisNotification.id, storedUser.id)){
				myNotifications.push(Notifications.findByNotificationID(thisNotification.id, storedUser.id));
			}
		}
		response.status(200).send({ notificationList : myNotifications });
	}
	else{
		response.status(404).send({"error" : 404, "title" : "Error", "message" : "No user found" });
	}
});

//Placeholder route used to retrieve a specific notification based on the notification ID
//for a particular username
app.get("/or/:userName/notifications/:notificationId", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	var sess = request.session;
	var user = sess.user;

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	var currentUserId = user.id;
	var userName = request.params.userName;
	var notificationID = request.params.notificationId;
	var storedUser = Users.findByUserName(userName);
	var myNotification = {};

	//Check for valid user to follow
	if(storedUser != undefined){
		if(Notifications.isFollowerAllowed(notificationID, storedUser.id)){
			myNotification = Notifications.findByNotificationID(notificationID, storedUser.id);
			//Notifications.isFollowerRemovedByID(notificationID, storedUser.id);
			response.status(200).send({ notificationList : myNotification });
		}
		else{
			response.status(400).send({"error" : 400, "title" : "Error", "message" : "User not allowed to view this notification." });
		}
	}
	else{
		response.status(404).send({"error" : 404, "title" : "Error", "message" : "No user found" });
	}
});

/*** GET METHODS END ***/


/*** POST METHODS START ***/

app.post("/login", function(request, response) {
	console.log(request.body);
	var userName = request.body.userName;
	var password = request.body.password;

	console.log("Submitted Credentials: " + userName + "::" + password);

	var user = Users.findByUserName(userName);
	user.isAuth = pw.verify(password, user.password);
	console.log("Authenticated? " + user.isAuth);

	if (user.isAuth) {
		var sess = request.session;
		sess.user = user;
		response.status(200).send(true);
	} else
		response.status(401).send(false);

	//response.redirect("/");
});

app.post("/sign-up", function(request, response) {
	var newUser = functions.User();

	newUser.userName = request.body.userName;
	newUser.email = request.body.email;
	newUser.firstName = request.body.firstName;
	newUser.lastName = request.body.lastName;
	newUser.password = pw.generate(request.body.password);

	Users.addUser(newUser);

	response.redirect("/");
});

app.post("/update-theme", function(request, response) {
	var colorScheme = request.body.colorScheme;
	var sess = request.session;

	var storedUser = Users.findByUserName(sess.user.userName);
	storedUser.preferences.colorScheme = colorScheme;
	sess.user = storedUser;

	response.redirect("/");
});

//Placeholder route used to simulate adding a follower/subscriber to a user
app.post("/or/:userName/follow", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	var sess = request.session;
	var user = sess.user;

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	var currentUserId = user.id;
	var userName = request.params.userName;
	var storedUser = Users.findByUserName(userName);

	//Check for valid user to follow
	if(storedUser == undefined){
		response.status(404).send({"error" : 404, "title" : "Error", "message" : "No user found"});
	}
	//Check if follower doesn't exist and that the logged in user can't follow themselves
	else if(userName != user.userName && !Users.verifyFollower(storedUser, currentUserId)){
		storedUser.followers.push(currentUserId);

		response.status(200).send({ "error" : 0, "title" : "Success", "message" : "Successfully subscribed to user." });
	}
	else{
		response.status(200).send({"error" : 0, "title" : "Warning", "message" : "Already following user." });
	}
});

//Placeholder route used to simulate adding a new notification to a particular user
app.post("/or/:userName/notifications", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	//var sess = request.session;
	//var currentUserId = sess.user.id;
	var userName = request.params.userName;
	var blogTitle = request.body.blogTitle;
	var storedUser = Users.findByUserName(userName);
	var allowedFollowers = [];

	//Check for valid user to follow
	if(storedUser != undefined){

		for(var i = 0; i < storedUser.followers.length; i++){
			allowedFollowers.push(storedUser.followers[i]);
		}

		var newNotification = notifications.Notification();

		newNotification.ownerId = storedUser.id;
		newNotification.blogTitle = blogTitle;
		newNotification.userName = userName;
		newNotification.followersAllowed = allowedFollowers;

		Notifications.addNotification(newNotification);

		response.status(200).send({ "error" : 0, "title" : "Success", "message" : "Successfully added notification.", notificationList : Notifications.notifications  });
	}
	else{
		response.status(404).send({"error" : 404, "title" : "Error", "message" : "No user found" });
	}
});
/*** POST METHODS END ***/


/*** DELETE METHODS START ***/

app.delete("/users/:userId", function(request, response) {
});

/*** DELETE METHODS END ***/


/*** PUT METHODS START ***/

//Placeholder route used to simulate updating the list of followers
//for a particular user
app.put("/or/:userName/follow", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	var sess = request.session;
	var user = sess.user;

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	var currentUserId = user.id;
	var userName = request.params.userName;
	var storedUser = Users.findByUserName(userName);

	//Check for valid user to follow
	if(storedUser == undefined){
		response.status(404).send({"error" : 404, "title" : "Error", "message" : "No user found"});
	}
	//Check if follower exists
	else if(Users.verifyFollower(storedUser, currentUserId)){
		//Loop through the list of followers to
		//remove the proper element based on the index
		for(var i = 0; i < storedUser.followers.length; i++){
			//Index value
			var followerId = storedUser.followers[i];
			if(followerId == currentUserId){
				//Remove Reminder object from the list based on the index provided
				storedUser.followers.splice(i, 1);
			}
		}

		response.status(200).send({ "error" : 0, "title" : "Success", "message" : "Successfully unsubscribed to user." });
	}
	else{
		response.status(200).send({ "error" : 0, "title" : "Warning", "message" : "Already unsubscribed to user." });
	}
});

//Placeholder route used to simulate updating marking a 
//notification as "read" by a user
app.put("/or/:userName/notifications/:notificationId", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	var sess = request.session;
	var user = sess.user;

	if (sess.user === undefined) user = functions.User();
	else user = sess.user;

	var currentUserId = user.id;
	var userName = request.params.userName;
	var notificationID = request.params.notificationId;
	var storedUser = Users.findByUserName(userName);
	var myNotification = {};

	//Check for valid user to follow
	if(storedUser != undefined){
		if(Notifications.isFollowerAllowed(notificationID, storedUser.id)){
			myNotification = Notifications.findByNotificationID(notificationID, storedUser.id);
			Notifications.isFollowerRemovedByID(notificationID, storedUser.id);
			response.status(200).send({ "error" : 0, "title" : "Success", "message" : "Successfully read the notification." });
			//response.status(200).send({ notificationList : myNotification });
		}
		else{
			response.status(400).send({"error" : 400, "title" : "Error", "message" : "User not allowed to view this notification." });
		}
	}
	else{
		response.status(404).send({"error" : 404, "title" : "Error", "message" : "No user found" });
	}
});
/*** PUT METHODS END ***/

module.exports = app; // for testing
