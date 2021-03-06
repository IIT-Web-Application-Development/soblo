/*
	Code used to simulate adding a blog post alert/notification
*/

var mainServerPath = "/or/"; //"/users/";
$(document).on("click", "#notification-link", function(event){
		//Stop form from submitting normally
        event.preventDefault();
        var userName = $(this).attr('data-notification-user-name');
        var blogTitle = $(this).attr('data-notification-title');

		$.ajax({
			method: "POST",
			url: mainServerPath + userName + "/notifications",
			data: {"blogTitle": blogTitle},
			success: function(data) {
				//Show alert based on title
				if(data.title.toLowerCase() == "success"){
					showAlert(
						data.title,
						data.message,
						SuccessAlertType
					);
				}else if(data.title.toLowerCase() == "error"){
					showAlert(
						data.title,
						data.message,
						DangerAlertType
					);
				}else{
					showAlert(
						data.title,
						data.message,
						WarnAlertType
					);					
				}
				//window.top.location = "";
			}, error: function() {
				showAlert(
					data.title,
					data.message,
					DangerAlertType
				);
			}
		});
});

/*
	Code used to simulate marking a notification as "read"
*/

$(document).on("click", "#notification-mark-read-link", function(event){
		//Stop form from submitting normally
        event.preventDefault();
        var userName = $('#my-notifications-list').attr('data-notification-user-name');
        var notificationID = $(this).attr('data-notification-id');

		$.ajax({
			method: "PUT",
			url: mainServerPath + userName + "/notifications/" + notificationID,
			data: {"trigger": true},
			success: function(data) {
				//Show alert based on title
				if(data.title.toLowerCase() == "success"){
					showAlert(
						data.title,
						data.message,
						SuccessAlertType
					);
				}else if(data.title.toLowerCase() == "error"){
					showAlert(
						data.title,
						data.message,
						DangerAlertType
					);
				}else{
					showAlert(
						data.title,
						data.message,
						WarnAlertType
					);					
				}
				//window.top.location = "";
			}, error: function() {
				showAlert(
					data.title,
					data.message,
					DangerAlertType
				);
			}
		});
});

/*
	Code used to simulate retrieving all the notifications
	for the logged in user
*/

function getNotifications(){
	var userName = $('#notification-display-item').attr('data-notification-user-name');
	$.ajax({
		method: "GET",
		url: mainServerPath + userName + "/notifications",
		data: {"trigger": false},
		success: function(data) {
			$("#my-notifications-list").html("");
			var myNotifications = "";

			//Display button if there are notifications for this user
			if(data.notificationList.length > 0){
				$('#notification-display-item').show();
				$('#notification-total-display').html(data.notificationList.length);
				$('#notification-total-display').css('background-color', '#dc3545');
			}else{
				$('#notification-display-item').hide();
			}

			//Loop through the list of notifications and append to table
			$.each(data.notificationList, function(key, value){
				//console.log(value.blogTitle);
				$("#my-notifications-list").append(
						"<tr>"
							+ "<td>" + value.id + "</td>"
							+ "<td>" + value.ownerId + "</td>"
							+ "<td>" + value.userName + "</td>"
							+ "<td>" + value.blogTitle + "</td>"
							+ "<td>" + value.followersAllowed + "</td>"
							+ "<td>" 
								+ "<a class='badge badge-pill badge-primary' id='notification-mark-read-link' name='notification-mark-read-link' role='button' data-notification-user-name='" + userName + "' data-notification-id='" + value.id + "'> Mark As Read</a>" 
							+ "</td>"
						+ "</tr>"
					);
			});
		}, error: function() {
			showAlert(
				data.title,
				data.message,
				DangerAlertType
			);
		}
	});
}
//On Page load
$(document).ready(function(){
	//Retrieve notifications
	$('#notification-display-item').hide();
    getNotifications();
});

