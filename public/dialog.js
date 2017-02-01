$(function(){

    var dialogSetUp = (function(){

        function authButtonClicked(){
            $("#signup, #login, #skip").on("click", function(e){
                // var target = $(e.target);
                // var id = target.context.id
                var optionChosen = $(this).attr("id");
                var dataToSend = Object.assign(
                    getDataForAuth(optionChosen),
                    {review : getDataForReview($("#submit"))
                });
                console.log(dataToSend);
                dataToSend = JSON.stringify(dataToSend);
                //send request to server if authentication was successful redirect to /reviewFor
                //If unsuccessful send error message
                //unsuccessful is when authenticatation fails
                function sendDataToServer(){
                    $.ajax({
                        method : "POST",
                        url : "/" + optionChosen,
                        data : dataToSend,
                        contentType : "application/json",
                        success : function(){
                            console.log("SENT");
                        }
                    });
                }

                sendDataToServer()
            })
        }

        function reviewSubmitButtonClicked(){
            $("#submit").on("click", function(){
                getDataForReview($("#submit"));
            });
        }
        function reviewDataValidation(questions){
            var bool;
            questions.each(function(){
                if($(this).val() === ""){
                    bool = false
                }else{
                    bool = true
                }
            })
            return bool;
        }

        function getDataForReview(submitButton){
                var data = [];
                var questions = $(submitButton).closest(".questions").find("input[data-questionText]");
                console.log(reviewDataValidation(questions))
                if(reviewDataValidation(questions)){
                    $(".authenticationArea").toggleClass("hidden");
                }
                questions.each(function(i){
                    data.push({
                        questionText : $(this).data("questiontext"),
                        answer : $(this).val()
                    })
                })
                return data
        }

        function  getDataForAuth(type){
            $parent = $("#" + type).parent()
            return {
                "login" : {
                    emailOrUsername : $parent.find("[name='emailOrUsername']").val(),
                    password : $parent.find("[name='password']").val(),
                    action : "logIn"
                },
                "signup" : {
                    email : $parent.find("[name='email']").val(),
                    username : $parent.find("[name ='username']").val(),
                    password : $parent.find("[name ='password']").val(),
                    action : "signUp"
                },
                "skip" : {
                    action : "skip"
                }
            }[type]
        }
        return {
            reviewSubmitButtonClicked,
            authButtonClicked
        }
    })()

    dialogSetUp.reviewSubmitButtonClicked();
    dialogSetUp.authButtonClicked();
})
