/*
	Code used to simulate subscribing/following a user
*/

var mainServerPath = "/or/"; //"/users/";
$(document).on("click", "#follow-user-link", function(event){
		//Stop form from submitting normally
        event.preventDefault();
        var userName = $(this).attr('data-follow-user-name');

		$.ajax({
			method: "POST",
			url: mainServerPath + userName + "/follow",
			data: {"userName": userName},
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
	Code used to simulate unsubscribing/unfollowing a user
*/

$(document).on("click", "#unfollow-user-link", function(event){
		//Stop form from submitting normally
        event.preventDefault();
        var userName = $(this).attr('data-unfollow-user-name');

		$.ajax({
			method: "PUT",
			url: mainServerPath + userName + "/follow",
			data: {"userName": userName},
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
			}, error: function(data) {
				showAlert(
					data.title,
					data.message,
					DangerAlertType
				);
			}
		});
});

/*
	Code used to simulate retrieving the privacy setting value from
	the switch togglers
*/

$(document).on("change", "#blog-privacy-setting-btn", function(event){
	//Stop form from submitting normally
	if($(this).prop("checked") == true){
	 	var text = $(this).attr('data-on');
		console.log(text);
	}else{
	 	var text = $(this).attr('data-off');
		console.log(text);
	}
});
