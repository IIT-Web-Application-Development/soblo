var pwHash;

var Users = {
	users: [], // In-memory users.
	addUser: function(user) {
		try {
			// Check if the passed object is a User.
			if (user instanceof User && user.uniqueConstraint != "") {
				// Set the next available ID for the user.
				user.id = Users.nextUserId();
				console.log("Set user ID: " + user.id);

				// Persist the user.
				this.users.push(user);
				console.log("Added user: " + JSON.stringify(user));
			} else
				throw "Not a user object!";
		} catch (err) {
			console.error(err);
		}
	},
	findByUserName: function(userName) {
		console.log("Searching for user: " + userName);

		for (var i = 0; i < this.users.length; i++) {
			var thisUser = this.users[i];

			if (thisUser.userName == userName) {
				console.log("Found user: " + JSON.stringify(thisUser));
				return thisUser;
			}
		}
	},
	verifyFollower: function(user, followerId) {
		console.log("Searching for follower ID: " + followerId);
		var isFound = false;

		for (var i = 0; i < user.followers.length; i++) {
			var thisFollower = user.followers[i];

			console.log("Compare value: " + thisFollower);
			if (thisFollower == followerId) {
				console.log("Follower with ID: " + thisFollower + " already exists.");
				isFound = true;
			}
		}

		console.log("Is follower found? " + isFound);
		return isFound;
	},
	nextUserId: function() {
		var nextUserId = 0; // Start at 0; it will always return 1 or greater.

		for (var i = 0; i < this.users.length; i++) {
			var thisId = this.users[i].id;

			// If a higher ID is found, set as the new value.
			if (thisId > nextUserId)
				nextUserId = thisId;
		}

		// Return the highest value plus 1.
		return ++nextUserId;
	}
}

var Password = {
	algorithm: "SHA256",
	length: 512,
	iterations: 50000,
	defaultPassword: "welcome123",
	generateDefault: function() {
		return this.generate(this.defaultPassword);
	},
	generate: function(clearPw) {
		var options = [this.algorithm, this.length, this.iterations];
		return pwHash.generate(clearPw, options);
	},
	verify: function(clearPw, hashedPw) {
		return pwHash.verify(clearPw, hashedPw);
	}
}

function User() {
	this.id = 0; // Set init to 0. Real values should be at least 1.
	this.password = "";
	this.userName = "";
	this.email = "";
	this.firstName = "";
	this.lastName = "";
	this.isAuth = false;
	this.preferences = {};
	this.followers = [];
	this.uniqueConstraint = function() {
		return this.userName;
	}

	return this;
}

var ColorSchemes = {
	schemes: ["theme-default","theme-blue","theme-green","theme-red"],
	getName: function(colorScheme) {
		colorScheme = colorScheme.replace("theme-", "");
		var split = colorScheme.split("-");

		colorScheme = "";
		for (var i = 0; i < split.length; i++) {
			if (i != 0) colorScheme += " ";
			colorScheme += split[i].substring(0, 1).toUpperCase();
			colorScheme += split[i].substring(1);
		}
		return colorScheme;
	}
}

function postDummyData(URL, body) {
	console.log("Post Dummy Data: ", URL, " -> ", body);

    var options = {
	  method: "POST",
	  body: body,
	  json: true,
	  url: URL
	}

	request(options, function (err, res, body) {
	  if (err) {
	    console.log("Error: ", err);
	    return;
	  }
	  console.log("Body Result:", body);
	});
}

// Defines a Response.
function Response(status, msg, showErrorMsg) {
	this.status = status;
	this.msg = msg;
	if (showErrorMsg && status == 404 && msg === undefined) this.msg = "No results were found";

	return this;
}

module.exports = {
	User: function() {
		return new User();
	},
	Users: Users,
	ColorSchemes: ColorSchemes,
	password: function(passwordHash) {
		pwHash = passwordHash;
		return Password;
	}
}