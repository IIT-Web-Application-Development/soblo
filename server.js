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

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
  	host: 'smtp.gmail.com',
    auth: {
        user: "drakaric@gmail.com",
        pass: "SRVaughan1"
    }
}));*/

// Local
var functions = require('./server/functions');
//var User = functions.User;
var Users = functions.Users;
//var Preferences = functions.Preferences;
var pw = functions.password(passwordHash);


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
	dummyUser.password = pw.generateDefault();

	Users.addUser(dummyUser);

	/*var mailOptions = {
		from: "drakaric@banner.iit.edu",
		to: "drakaric@banner.iit.edu",
		subject: "Sending Email using Node.js",
		text: "That was easy!"
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});*/
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

	response.render("main", {user, "colorSchemes": functions.ColorSchemes});
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

/*** POST METHODS END ***/


/*** DELETE METHODS START ***/

app.delete("/users/:userId", function(request, response) {
});

/*** DELETE METHODS END ***/