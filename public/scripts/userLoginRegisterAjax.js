
$( document ).ready(function() {
    $("#userLoginRegister").submit(function (event) {
        event.preventDefault(); //prevent default action
        var post_url = $(this).attr("action"); //get form action url
        //var request_method = $(this).attr("method"); //get form GET/POST method
        var form_data = {
            'username': $('input[name=username]').val(),
            'password': $('input[name=password]').val()
        };
        $("#userLoginRegister")[0].reset();
        $.ajax({
            url: post_url,
            type: 'post',
            data:  form_data,
            content_type: 'application/json;charset=UTF-8',
            xhrFields: {
                withCredentials: false
            },
            headers: {

            },
            success: function (data, textStatus, jqXHR) {
                if (typeof data.redirect == 'string')
                    window.location.replace(window.location.protocol + "//" + window.location.host + data.redirect);
            },
            error: function (xhr, textStatus, error) {
                 console.log('We are sorry but our servers are having an issue right now');
            }
        }).done(function (data) {console.log("done");})
    });
});

// Set up a global AJAX error handler to handle the 401
// unauthorized responses. If a 401 status code comes back,
// the user is no longer logged-into the system and can not
// use it properly.
$( document ).ajaxError(function( event, jqxhr, settings, exception ) {
    if ( jqxhr.status== 405 ) {
        alert( "Failed to login" );
    }
    if ( jqxhr.status== 406 ) {
        alert( "Sorry, that username is already taken" );
    }
});

