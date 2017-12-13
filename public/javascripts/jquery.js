
$(document).ready(function(){
  $("#postComment").click(function(){
      	var myobj = {Name:$("#name").val(),Comment:$("#comment").val(),Avatar:$("#avatar").val()};
      	jobj = JSON.stringify(myobj);
      	$("#json").text(jobj);

	var url = "comment";
  	$.ajax({
  		url:url,
  		type: "POST",
  		data: jobj,
  		contentType: "application/json; charset=utf-8",
  		success: function(data, textStatus) {
  			// $("#done").html(textStatus);
  			// $("#name").val('');
  			// $("#comment").val('');
        	// $("#avatar").val('');
  		}
  	})
  });

  $("#getComments").click(function() {
  	$.getJSON('comment', function(data) {
  		console.log(data);
  		var everything = "<br><span>Current Comments:</span><br> " +  "<ul>";
  		for(var comment in data) {
  			com = data[comment];
        if(com.Avatar == '') {com.Avatar = "https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png";}
  			everything += "<li class=\'container\'> <div class=\'avatarContainer\'> <img src=\'" + com.Avatar + "\'> </div> "
        + "<div class=\'commentContainer\'> <span class=\'user\'>" + com.Name + "</span> <br> <span class='com'> " + com.Comment + "</span> </div> </li>";
  		}
  		everything += "</ul>";
  		$("#comments").html(everything);
  	})
  })

  $("#deleteComments").click(function() {
  	var url = "comment";
  	$.ajax({
  		url:url,
  		type: "DELETE",
  		success: function() {
  			$("#json").empty();
  			$("#comments").empty();
  			$("#done").html("Comments deleted");

  		}
  	})
  });

});
