$(function(){
    var submitData = (function(){
        var getData = function(){
            var $emailOrUsername = $("[name='emailOrUsername']");
            var $password = $("[name='password']");
            var $fullname = $("[name='fullname']");
            return {
                emailOrUsername : $emailOrUsername.val(),
                password : $password.val(),
                fullname : $fullname.val()
            }
        };

        var makeAjaxPost = function(data){
            data = JSON.stringify(data);
            const url = window.location.pathname;
            console.log(url)
            $.ajax({
                data,
                method : "POST",
                url,
                beforeSend : function(){
                    $(".message").remove();
                },
                contentType:"application/json",
                success : function(dataReturned){
                    console.log("SUCCESS! ", dataReturned);
                    if(dataReturned.user.emailOrUsername){
                        $("body").append(`<div class = "message">You are authenticated ${dataReturned.user.emailOrUsername}.</div>` )
                    }else{
                        $("body").append(`<div class = "message">You are NOT authenticated</div>` )
                    }

                }
            })
        }

        var submitClicked = function(){
            var $button = $("[type='submit']");
            $button.on("click", function(){
                console.log(getData());
                makeAjaxPost(getData())
            })
        };
        return {
            submitClicked
        }
    })();

    submitData.submitClicked()
});
