var Notifications = {
	notifications: [], // In-memory users.
	addNotification: function(notification) {
		try {
			// Check if the passed object is a User.
			if (notification instanceof Notification && notification.uniqueConstraint != "") {
				// Set the next available ID for the user.
				notification.id = Notifications.nextNotificationId();
				//console.log("Set Notification ID: " + notification.id);

				// Persist the user.
				this.notifications.push(notification);
				//console.log("Added notification: " + JSON.stringify(notification));
			} else
				throw "Not a user object!";
		} catch (err) {
			console.error(err);
		}
	},
	findByNotificationID: function(notificationID, userID) {
		//console.log("Searching by Notification ID for user ID: " + userID);

		for (var i = 0; i < this.notifications.length; i++) {
			var thisNotification = this.notifications[i];

			if (thisNotification.id == notificationID && thisNotification.followersAllowed.indexOf(userID) >= 0) {
				//console.log("Found notification: " + JSON.stringify(thisNotification));
				return thisNotification;
			}
		}
	},
	isFollowerAllowed: function(notificationID, followerID) {
		//console.log("Searching for followerId: " + followerID);
		var isAllowed = false;
		
		for (var i = 0; i < this.notifications.length; i++) {
			var thisNotification = this.notifications[i];

			if(thisNotification.id == notificationID && thisNotification.followersAllowed.indexOf(followerID) >= 0){
				//console.log("Found notification: " + JSON.stringify(thisNotification));
				isAllowed = true;
			}
		}

		return isAllowed;
		
	},
	isFollowerRemovedByID: function(notificationID, followerID) {
		var thisNotification = this.findByNotificationID(notificationID, followerID);
		var isRemoved = false;
		var arrayIndex = -1;

		for(var i = 0; i < thisNotification.followersAllowed.length; i++){
			var thisFollower = thisNotification.followersAllowed[i];

			if(thisFollower == followerID){
				arrayIndex = i; //thisFollower.indexOf(followerID);
				//console.log("Match at index: " + arrayIndex);
			}
		}

		if(arrayIndex >= 0){
			thisNotification.followersAllowed.splice(arrayIndex, 1);
			isRemoved = true;
		}

		return isRemoved;
		
	},
	nextNotificationId: function() {
		var nextNotificationId = 0; // Start at 0; it will always return 1 or greater.

		for (var i = 0; i < this.notifications.length; i++) {
			var thisId = this.notifications[i].id;

			// If a higher ID is found, set as the new value.
			if (thisId > nextNotificationId)
				nextNotificationId = thisId;
		}

		// Return the highest value plus 1.
		return ++nextNotificationId;
	}
}

function Notification() {
	this.id = 0; // Set init to 0. Real values should be at least 1.
	this.ownerId = "";
	this.blogTitle = "";
	this.userName = "";
	this.followersAllowed = [];
	this.uniqueConstraint = function() {
		return this.id;
	}

	return this;
}

module.exports = {
	Notification: function() {
		return new Notification();
	},
	Notifications: Notifications
}