/*********************************/
/***** Application Functions *****/
/*********************************/

// Danger alert type
function DangerAlertType() {
	return "alert-danger";
}

// Info alert type
function InfoAlertType() {
	return "alert-info";
}

// Success alert type
function SuccessAlertType() {
	return "alert-success";
}

// Warning alert type
function WarnAlertType() {
	return "alert-warning";
}

// Array of alert types
function AlertTypes() {
	var alertTypes = [];
	alertTypes.push(DangerAlertType);
	alertTypes.push(InfoAlertType);
	alertTypes.push(SuccessAlertType);
	alertTypes.push(WarnAlertType);
	return alertTypes;
}

// Show bootstrap alert
function showAlert(title, msg, alertType, callback) {
	// If an alert type is not specified, treat as info by default.
	if (alertType === undefined) alertType = InfoAlertType;

	// Identify the alert modal.
	var alertModal = $(document).find("#alertModal");
	var modalCloseBtn = alertModal.find(".modal-header button");
	var modalTitle = alertModal.find(".modal-title");
	var modalBody = alertModal.find(".modal-body");

	// Remove all other types first.
	for (var i = 0; i < AlertTypes.length; i++) {
		modalBody.removeClass(AlertTypes[i]);
	}

	// Add classes and information.
	modalBody.addClass(alertType);
	modalTitle.html(title);
	modalBody.html(msg);

	// Hide all other modals and display the modal alert.
	$(".modal").modal("hide");
	alertModal.modal("show");

	// If a callback is defined, set a click event, and a timer.
	if (callback !== undefined) {
		$(document).on("click", modalCloseBtn, function() {
			callback();
		});
		setInterval(function() {callback()}, 4000);
	}
}

// Create a new Reminder
$(document).on("submit", "form[name='login']", function(e) {
	e.preventDefault();
	var userName = $(this).find("input[name='userName']").val();
	var password = $(this).find("input[name='password']").val();

	$.ajax({
		method: "POST",
		url: $(this).attr("action"),
		data: {"userName": userName, "password": password},
		success: function(data) {
			window.top.location = "";
		}, error: function() {
			showAlert(
				"Invalid Login",
				"Invalid username and/or password!",
				DangerAlertType
			);
		}
	});
});

$(document).ready(function() {
	$(".dropdown-submenu a.nestedDropdown").on("click", function(e) {
		$(this).next("ul").toggle();
		e.stopPropagation();
		e.preventDefault();
	});
});

$(document).on("keyup input change paste", "#signupForm input", function() {
	var name = $(this).attr("name"),
		value = $(this).val(),
		form = $(this).parents("#signupForm"),
		submitBtn = $("#signupForm button[type='submit']"),
		errorSpan = $("#signupForm #" + name + "Error");

	var checkSpecial = /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/.test(value),
        checkNumeric = /[0-9]+/.test(value),
        checkLetter = /[A-Za-z]+/.test(value);

	//console.log("Focused input name: " + name);
	//console.log("Focused input value: " + value);

	submitBtn.removeAttr("disabled");

	if (name == "userName") {
		if (value.length < 2 || value.length > 10)
			errorSpan.html("Must be between 2 and 10 characters");
		else if (checkSpecial)
			errorSpan.html("Must NOT contain a special character");
		else {			
			$.ajax({
				method: "GET",
				dataType:"json",
				url: "/users/" + $(this).val(),
				success: function(data) {
					if (data !== undefined && data.user !== undefined)
						errorSpan.html("User name already taken!");
					else
						errorSpan.html("");
				}, error: function(xhr, status, error) {
					errorSpan.html("An error occurred while verifying the user name");
					console.error(xhr.responseText);
				}
			});
		}
	} else if (name == "password") {
		if (value.length < 6 || value.length > 12)
			errorSpan.html("Must be between 6 and 12 characters");
		else if (!checkSpecial)
			errorSpan.html("Must contain at least 1 special character");
		else if (!checkNumeric)
			errorSpan.html("Must contain at least 1 number");
		else if (!checkLetter)
			errorSpan.html("Must contain at least 1 letter");
		else
			errorSpan.html("");
	} else if (name == "confirmPassword") {
		var passwordInput = form.find("input[name='password']");

		if (value != passwordInput.val())
			errorSpan.html("Passwords must match!");
		else
			errorSpan.html("");
	}

	form.find(".input-group").each(function() {
		var errorTag = $(this).find(".error"),
			inputVal = $(this).find("input").val();

		if (errorTag.html().length > 0 || inputVal == "") {
			submitBtn.attr("disabled", true);
		}
	});
});