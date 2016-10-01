$(function(){
	buttonInit();
	register();
});

function buttonInit(){
	$("#hospitalLogin, #homeLogin").on('click', function(e){
		e.preventDefault();
		let url = "/dashboard?uid=1";
		window.location.href = url;
	});
}

function register(){
  var data = "sub_path=user";
   $.ajax({
            url: '/g',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(json) {
            // console.log(JSON.stringify(json)); 
            getUserList(json);
          },
            error: function() { console.log("Error occur in requesting to /g \ndata:" + data); }
          });
}

function getUserList(json){
	var DOM ="";
	$.each(json, function(index, data){
		DOM += `<li><a href="#" data-uid="`+ data.uid +`" onclick="selectEvent(this,event)">`+ data.username +`</a></li>`;
	});
	$(".dropdown-menu").append(DOM);
}

function selectEvent(identifier,e){
	e.preventDefault();
	$("#user_name").val($(identifier).text());
}

function loginEvent(){
	var data = $('#form_login').serialize();
	// console.log(data);
	if(checkformEmpty())return;
	data += "&sub_path=userlogin";
	 $.ajax({
	          url: '/g',
	          type: 'POST',
	          dataType: 'json',
	          data: data,
	          success: function(json) {
	          console.log(JSON.stringify(json)); 
	          loginCallback(json);
	        },
	          error: function() { console.log("Error occur in requesting to /g" + data); }
	        });
}

function checkformEmpty(){
	var flag = false;
	var pattern = new RegExp("[`=|{}':;',\\[\\]<>/?~！￥……&*（）&;|{}【】‘；：”“'。，、？\"]");
	$("input").each(function() {
	   if($(this).val() === ""){
	    var DOM = "<strong>有人留空白囉!</strong>";
	    $("#alert-panel").find("strong").remove();
	    $("#alert-panel").append(DOM);
	    $('#alert-panel').slideDown();
	    flag = true;
		}
		if(flag != true){
			var s = $(this).val();
			for (var i = 0; i < s.length; i++) { 
					if(pattern.test(s.substr(i,1))){
						var DOM = "<strong>別輸入怪東西!</strong>";
						$("#alert-panel").find("strong").remove();
						$("#alert-panel").append(DOM);
						$('#alert-panel').slideDown();
						flag = true;
						return flag;
					}
			       // rs = rs+s.substr(i, 1).replace(pattern, ''); 
			   } 
		}
	});	
	return flag;
}

function loginCallback(json){
	var len = Object.keys(json).length;
	 if(len > 0){
	 	if(json.status == 0){
	 	var uid = (json.uid).toString();
	 	window.location.href = "/dashboard?uid=" + uid ;
	 	}else{
	 		var DOM = "<strong>帳號或密碼有誤!</strong>";
	 		$("#alert-panel").find("strong").remove();
	 		$("#alert-panel").append(DOM);
	 		$('#alert-panel').slideDown();
	 	}
	 }else{
	 	var DOM = "<strong>伺服器返回訊息時發生錯誤!</strong>";
	 	$("#alert-panel").find("strong").remove();
	 	$("#alert-panel").append(DOM);
	 	$('#alert-panel').slideDown();

	 }
}