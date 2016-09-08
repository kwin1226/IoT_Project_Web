$(function(){
	buttonInit();
});

function getJSON(url, data, dataArray){
	var sub_path ="";
	$.each(dataArray, function(i, field){
		if(field.name == "sub_path"){
			sub_path = field.value;
		}
    });

	$.ajax({
	          url: url,
	          type: 'GET',
	          dataType: 'json',
	          data: data,
	          success: function(json) { 
	          	console.log(json);
              $(".cards-contain").remove();
	          	callback_handler(sub_path, json);
	          	console.log(JSON.stringify(json)) },
            beforeSend: function(){
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $(loadingMask).insertAfter("section.bg-3");
            },
            complete: function(){
                 $(".cssload-thecube").remove();

             },
	          error: function() { console.log("Error occur in requesting to " + url); }
	        });
}

function callback_handler(sub_path, json){
	if(sub_path == 'register'){

		var DOM_cards =``;
		var DOM_card_head =`
		<div class="container full-screen cards-contain">
   		<section class="row">
        	<h1 class="title">Info Cards</h1>
    	</section>
    	<div class="row">`;
    	console.log("長度:"+ json.length);
    	DOM_cards = DOM_card_head;
    	if((json.length) > 0){

	    	$.each(json, function(index, data){
	    		DOM_cards += `
	    		<article class="col-xs-4">
            	<div class="cards"><span class="cus-icon icon-rasp medium"></span>
                <h2 class="title">Device-` + index + 
                `</h2><div class="info"><hr class="divider" /><p class="lead">Locate:` + data.equipName +`<br>`+ 
                `Status:normal<br></p><a class="btn btn-lg center-block" data-eid="`+ data.eid +`" onClick="getDetailpage(this)">Detail</a>`+
                `</div><div class="smalldate"><p class="lead" style="font-size:0.3em;">act `+ data.activitedTime  +
                `</p></div></div></article>`;
                		
	    	});
    	}
			// var DOM_card_body = `
                			// <article class="col-xs-4">
                   //          <div class="cards"><span class="glyphicon glyphicon-flash icon"></span>
                   //              <hr class="divider" />
                   //              <h2 class="title">First</h2>
                   //              <div class="info">
                   //                  <hr class="divider" />
                   //                  <p class="lead">Are you ready see the next page and be amazed of what you can find?</p>
                   //                  <a class="btn btn-lg center-block">Go get it!</a>
                   //              </div>
                   //          </div>
                   //      	</article>`;
        var DOM_card_foot =`</div></div>`;
        DOM_cards += DOM_card_foot;
		$("section.bg-3").fadeOut();
		$(DOM_cards).insertAfter("section.bg-3");
	}
}

function getDetailpage(identifier){
  var eid = $(identifier).data('eid'); 
  console.log('eid:' + eid);
  var url = "http://140.138.77.152:5050/detail?eid=" + eid;
  window.location.href = url;

}

function buttonInit(){
  $("#bt_login").click(function(e){
      e.preventDefault();
      showLoginModal();
  });
}

function showLoginModal(){
  // $("#LoginModal .modal-body strong").remove();
  // $("#LoginModal .modal-body").prepend('<strong>Upload location: <p>"' + "HI" + '"</p></strong>');
  $('#LoginModal').modal('show');
}