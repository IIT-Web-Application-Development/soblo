$(document).on("submit", "#blog-entry-post", function(event){ 
		//Stop form from submitting normally
        event.preventDefault();
        var blogText = $(this).find("textarea[name='text']").val();

        var blogTitle = $(this).find("textarea[name='title']").val();
        console.log(blogText);


        var url = "/";
        var postData =  {
                "title" : blogTitle,
                "blogEntry" : blogText
        };
        if(blogTitle.length < 0 || blogText.length < 0 ){
                errorSpan.html(" values can not be null ");
        } else {
                $.ajax({
                        method: "POST",
                        url: url,
                        data: postData,
                        success: function(data) {
                                console.log('success');
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

                        }, error: function() {
                                //if error do something here
                                console.log('error');
                                showAlert(
                                        data.title,
                                        data.message,
                                        DangerAlertType
                                );
                        }
                });
        }
		
});
