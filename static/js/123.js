

$(function(){

    setInterval(renderTime, 1000);
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    buttonInit();
    handlGetRequest();
    getAllEquipBt();
    socketInit();
});

function buttonInit(){
    var uid = $.url.param("uid");
    $(".sidebar-brand").attr("data-uid",uid);
    $("#search_bt").on('click', function(e){
        e.preventDefault();
        var keyword = $("#search_keyword").val();
        var url = "/g";
        var uid = $(".sidebar-brand").data("uid");
        var Search_para = "sub_path=register&uid=" + uid + "&keyword=" + keyword;
        if((!isParamNull(keyword)) && (!isParamNull(keyword))){
            getSearchJSON(url, keyword ,Search_para);
        }
    });

    $("form input").keypress(function (e) {  //修正 Enter form 錯誤
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                $('#modal_login').click();
                return false;
            } else {
                return true;
            }
        });

    $("#dashboard_logout").on('click', function(){
    	window.location.href = "/";
    });
}

function getDetailPage(identifier){
	var eid = $(identifier).data('eid'); 
	var uid = $(identifier).data('uid'); 
	var url = "/detail?eid=" + eid +"&uid=" + uid;
	window.location.href= url;
}

function showAddDir(){
  // $("#AddDir .modal-body strong").remove();
  // $("#AddDir .modal-body").prepend('<strong>Upload location: <p>"' + "HI" + '"</p></strong>');
  $('#AddDirModal').modal('show');
}

function handlGetRequest(){
    // var eid = $.url.param("eid");
    var uid = $(".sidebar-brand").data("uid");
    var dirid = $.url.param("dirid");
    // console.log("dirid:" + dirid);
    var url = "/g";
    // var His_para = "sub_path=history&eid=" + eid;
    var Dir_para = "sub_path=directory&uid=" + uid;
    var Equip_para = "sub_path=directory&dirid=" + dirid;
    if(!isParamNull(uid)){
            // getHistoryJSON(url, His_para);
            getDirJSON(url, Dir_para);
    }
    if(!isParamNull(dirid)){
            getEquipJSON(url, Equip_para);
    }
}

function renderTime(){
    var cur_date = moment().format('ll');
    var cur_day = moment().format('dddd');
    var cur_time = moment().format('h:mm:ss a');
    var cur_datetime = cur_date + " " + cur_day + " " + cur_time; 
    $("#dashboard_time").text(cur_datetime);
}

function postNewDir(){
	var dirName =$("#dirName").val();
	if(dirName!= null && dirName!= "" && dirName != undefined){
	    var data = $('#form_newdir').serialize();
	    // data = data.replace(/[^a-z0-9]/gi, '_').toLowerCase(); //過濾字元
	    var uid = $(".sidebar-brand").data("uid");
	    data += "&sub_path=directory" + "&uid=" + uid;
	     $.ajax({
	              url: '/g',
	              type: 'POST',
	              dataType: 'json',
	              data: data,
	              success: function(json) {
	              console.log(JSON.stringify(json)); 
	              handlGetRequest();
	              
	            },
	              error: function() { console.log("Error occur in requesting to " + url+ data); }
	            });
	 }else{
	 	alert("請填入字元");
	 	// $(".alert-empty").slideDown();

	 }
}


//ajax call ----start

function getDirJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                Dir_rander(json);
            },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}

function getSearchJSON(url, keyword, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                // AllEquip_rander(json);
                if( Object.keys(json).length > 0){
                    AllEquip_rander(json);
                }else{
                    Equip_rander(json, true, "noneSearch", keyword);
                }
                // console.log(JSON.stringify(json));
            },
            beforeSend: function(){
              $("#card-container").children().remove();
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $("#card-container").prepend(loadingMask);
            },
            complete: function(){
                var x = Math.floor((Math.random() * 10) + 1);
                sleep(200 * x);
                 $(".cssload-thecube").remove();
                 $("#card-container").hide().fadeIn();

             },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}

function getEquipJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                Equip_rander(json, true);
            },
            beforeSend: function(){
              $("#card-container").children().remove();
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $("#card-container").prepend(loadingMask);
            },
            complete: function(){
                 $(".cssload-thecube").remove();

             },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}

function getAllEquipJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                AllEquip_rander(json); 
            },
            beforeSend: function(){
              $("#card-container").children().remove();
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $("#card-container").prepend(loadingMask);
            },
            complete: function(){
                 $(".cssload-thecube").remove();

             },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}


//ajax call ----end


//UI rander ----start

function Dir_rander(json){
	$(".newdata").remove(); //remove orig directory
    var DOM ="";
    $.each(json, function(index, data){
        DOM += `<li class="newdata"><a href="#" class="hvr-border-fade" data-dirid="`+ data.dirid +
                           `" onClick="getEquipBt(this)"><span class="img-normal"></span>`+ data.dirName +`</a></li>`;
    });
    DOM += `<li class="sidebar-none">
    		    <a href="#" onclick="" class="hvr-border-fade">
    		        未分類
    		    </a>
    		</li>
    		<li class="newdata">
    			<a href="#" onClick="showAddDir()"　class="hvr-border-fade">
    				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增標籤
    			</a>
    		</li>`;
    $(".sidebar-nav").append(DOM);
    $(".sidebar-nav").find($(".newdata")).hide();
    $(".sidebar-nav").find($(".newdata")).slideDown(1000);

}

function Equip_rander(json, isRemove, status, keyword){
    // $("#card-container").children().fadeOut( function() { $(this).remove(); });
    if(isRemove){
        $("#card-container").children().remove();
    }
    var DOM ="";
    if(status == null || status == "" || status == undefined){
        if(json.length>0){
             DOM +=`<section class="block-padding">
                        <div class="row section-bg">
                          <div class="col-lg-12 text-center">
                              <h4>`+ json[0].dirName +`</h4>
                          </div>`;
            $.each(json, function(index, data){
            	if(data.equipStatus == 0){ //無人使用
            		DOM += `<div class="col-lg-3">
                        <div class="card card-text-none l-h-200" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`">
                          <div class="card-block">
                            <blockquote class="card-blockquote">
                            <div class="col-xs-12 text-center pretector-text-title">
                              <strong>`+ data.equipName +`</strong>
                            </div>
                            <div class="col-xs-12">&nbsp;</div>
                            <div class="col-xs-12">&nbsp;</div>
                            <div class="col-xs-12 text-center">目前無人使用</div>
                            <div class="col-xs-12">&nbsp;</div>
                            <div class="l-h-300">
                            <div class="col-xs-12">&nbsp;</div>
                            </div>
                            </blockquote>
                          </div>
                        </div>
                    </div>`;

            		// DOM += `<div class="col-lg-3" >
            		//             <div class="card" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`">
            		//               <div class="card-header text-center">
            		//                 <strong>`+ data.equipName +`</strong>
            		//               </div>
            		//               <div class="card-block">
            		//                 <blockquote class="card-blockquote">
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                   </div>
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
            		//                   </div>
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
            		//                   </div>
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
            		//                   </div>
            		//                   <span class="pretector-text-none">目前無人使用</span>
            		//                 </blockquote>
            		//               </div>
            		//             </div>
            		//         </div>`;
            	}else if(data.equipStatus == 1){ //有人使用
            		DOM += `<div class="col-lg-3">
                        <div class="card card-border-normal l-h-200" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
                          <div class="card-block card-header-alert" >
                            <blockquote class="card-blockquote">
                            <div class="col-xs-12 text-center pretector-text-title">
                              <strong>` + data.equipName + `</strong>
                            </div>
                          
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-tmp.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-tem">0°C</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-hum.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-hum">0%</div>
                           <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-time.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-utime1">0mins</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-fall.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right">無</div>
                            <div class="col-xs-4">&nbsp;</div>
                            <div class="text-center l-h-300">
                            <a href="#" class="btn btn-default text-red" >緊急通話</a>
                            </div>
                            </blockquote>
                          </div>
                        </div>
                    </div>`;
            		// DOM += `<div class="col-lg-3">
            		//             <div class="card card-border-normal" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
            		//               <div class="card-header card-header-normal card-border-normal text-center">
            		//                 <strong>` + data.equipName + `</strong>
            		//               </div>
            		//               <div class="card-block">
            		//               <blockquote class="card-blockquote">
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-tem">28°C</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-hum">40%</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-17.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 </div>
            		//                 </blockquote>
            		//               </div>
            		//             </div> 
            		//         </div>`;
            	}else if(data.equipStatus == 2){  //意外狀況
            		DOM += `<div class="col-lg-3">
                        <div class="card card-border-normal l-h-200" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
                          <div class="card-block card-header-alert" >
                            <blockquote class="card-blockquote">
                            <div class="col-xs-12 text-center pretector-text-title">
                              <strong>` + data.equipName + `</strong>
                            </div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-tmp.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-tem">0°C</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-hum.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-hum">0%</div>
                           <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-time.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-utime1">0mins</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-fall.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right">無</div>
                            <div class="col-xs-4">&nbsp;</div>
                            <div class="text-center l-h-300">
                            <a href="#" class="btn btn-default text-red" >緊急通話</a>
                            </div>
                            </blockquote>
                          </div>
                        </div>
                    </div>`;

            		// DOM += `<div class="col-lg-3">
            		//             <div class="card card-border-normal" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
            		//               <div class="card-header card-header-alert card-border-normal text-center">
            		//                 <strong>` + data.equipName + `</strong>
            		//               </div>
            		//               <div class="card-block">
            		//               <blockquote class="card-blockquote">
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-tem">28°C</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-hum">40%</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-17.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 </div>
            		//                 </blockquote>
            		//               </div>
            		//             </div> 
            		//         </div>`;
            	}
            });
            DOM += `</div></section>`;
        }else{
             DOM +=`<section class="block-padding">
                        <div class="row section-bg">
                          <div class="col-lg-12 text-center">
                              <br><br><br><br><br><br><br><br>
                              <h2 style="color:red;">此標籤尚未新增裝置！</h2>
                              <br><br><br><br><br><br><br><br>
                          </div>
                        </div>
                       </section>`;
            }
        }else if(status == "noneSearch"){
            DOM +=`<section class="block-padding">
                       <div class="row section-bg">
                         <div class="col-lg-12 text-center">
                             <br><br><br><br><br><br><br><br>
                             <h2 style="color:red;">未搜尋到任何有關 "`+ keyword +`" 的裝置！</h2>
                             <br><br><br><br><br><br><br><br>
                         </div>
                       </div>
                      </section>`;
        }
        $("#card-container").hide().append(DOM).fadeIn();
}

function AllEquip_rander(json){

    if( Object.keys(json).length > 0){  //物件長度

        var n = 0;
        $.each(json, function(index, data){
            if(n == 0){  //第一次
                Equip_rander(data, true);
            }else{
                Equip_rander(data, false);
            }
            ++n;
        });
    }
}

//UI rander ----start

function getEquipBt(identifier){
  var dirid = $(identifier).data('dirid'); 
  var url = "/g";
  var Equip_para = "sub_path=directory&dirid=" + dirid;
  getEquipJSON(url, Equip_para);
  // window.location.href = url;
}

function getAllEquipBt(){ //identifier
  var uid = $(".sidebar-brand").data("uid");
  var url = "/g";
  var AllEquip_para = "sub_path=register&uid=" + uid;
  getAllEquipJSON(url, AllEquip_para);
  // window.location.href = url;
}


//real time call ----- start
function socketInit(){
	var socket = io('/');
	var temIntime = null;
	socket.emit('dashboard' ,{'connection':true});

	socket.on('dataUpdate', function (json) {
		console.log(JSON.stringify(json));
		dashboard_Status_Rander(json);

	});
	socket.on('disconnect', function(){
		console.log("disconnect!");
		socket.removeAllListeners("dataUpdate");
		socket.removeAllListeners("PIR");
	});

	socket.on('PIR', function(json){
		console.log(JSON.stringify(json));
		var eid = json.eid;
		var IsUsing = json.IsUsing;
		var IsFalldown = json.Accident;
		if(IsUsing && !IsFalldown){  //一般使用
			// console.log("randering");
			// var DOM =  `<div class="col-xs-6">
		 //                <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
		 //                <p><span class="pretector-text-tem">28°C</span></p>
		 //                </div>
		 //                <div class="col-xs-6">
		 //                <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Humidity">
		 //                <p><span class="pretector-text-hum">40%</span></p>
		 //                </div>
		 //                <div class="col-xs-6">
		 //                <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Usetime">
		 //                <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
		 //                </div>
		 //                <div class="col-xs-6">
		 //                <img src="/static/img/icondash-17.png" class="img-fluid bg-sensors" alt="Usetime">
		 //                </div>`;

			// $(".card").filter("[data-eid='"+ eid +"']").find('.card-header').addClass("card-header-normal");
			// $(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			// $(".card").filter("[data-eid='"+ eid +"']").on("click", function(){getDetailPage(this);});
			// $(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();
			$(".card").filter("[data-eid='"+ eid +"']").addClass("card-header-normal");
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			$(".card").filter("[data-eid='"+ eid +"']").on("click", function(){getDetailPage(this);});
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();
		}else if(IsUsing && IsFalldown){  //使用中如有跌倒意外

			// console.log("randering");
			var DOM =  `<div class="col-xs-6">
		                <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
		                <p><span class="pretector-text-tem">28°C</span></p>
		                </div>
		                <div class="col-xs-6">
		                <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Humidity">
		                <p><span class="pretector-text-hum">40%</span></p>
		                </div>
		                <div class="col-xs-6">
		                <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Usetime">
		                <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
		                </div>
		                <div class="col-xs-6">
		                <img src="/static/img/icondash-12.png" class="img-fluid bg-sensors" alt="Usetime">
		                </div>`;

			$(".card").filter("[data-eid='"+ eid +"']").find('.card-header').addClass("card-header-normal");
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			$(".card").filter("[data-eid='"+ eid +"']").on("click", function(){getDetailPage(this);});
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();

		}else if(!IsUsing){   //無人使用
			var DOM = `<div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
	                  </div>
	                  <div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
	                  </div>
	                  <div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
	                  </div>
	                  <div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
	                  </div>
	                  <span class="pretector-text-none">目前無人使用</span>`;
			$(".card").filter("[data-eid='"+ eid +"']").find('.card-header').removeClass('card-header-normal');
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			$(".card").filter("[data-eid='"+ eid +"']").unbind('click');
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();
		}
	});
}

function dashboard_Status_Rander(json){
	var randomTem = getRandomInt(26,28);
	var randomHum = getRandomInt(50,55);
	var randomUtime = getRandomInt(10,10);
	$.each(json, function(index, data){
		var tmpTem = data.historyTem + "°C";
		var tmpHum = data.historyHum + "%";
		var d = (data.historyUTime).split(" ");
		var d2 = d[1].split(":");
		var m = parseInt(d2[1],10);
		var s = Math.round((parseInt(d2[2],10)/60)*10)/10; //轉換mins小數
		var tmpUTime = m+s;
		if(data.historyTem > 27 || randomHum > 90 ){
			// $(".card").filter("[data-eid='Rasp01'][data-status!=0]").find('.card-header').removeClass('card-header-normal').addClass("card-header-alert");
			$(".card").filter("[data-eid='Rasp01'][data-status!=0]").removeClass('card-header-normal').addClass("card-header-alert");
			$(".card").filter("[data-eid='Rasp01'][data-status!=0]").find('div.pretector-text-tem').css("color", "red");
		}else{
			// $(".card").filter("[data-ei!='Rasp01'][data-status!=0]").find('.card-header').removeClass('card-header-alert').addClass("card-header-normal");
		}
		// var Rasp01dom = $(".card").find("[data-eid='Rasp01'] span.pretector-text-tem");
		// console.log(JSON.stringify(Rasp01dom));
		$(".card").filter("[data-eid='Rasp01']").find("div.pretector-text-tem").hide().text(tmpTem).slideDown();
		$(".card").filter("[data-eid='Rasp01']").find("div.pretector-text-hum").hide().text(tmpHum).slideDown();
		$(".card").filter("[data-eid='Rasp01']").find("div.pretector-text-utime1").hide().text(tmpUTime).slideDown();
	});	
	if(randomTem > 27 || randomHum > 90){
		$(".card").filter("[data-eid!='Rasp01'][data-status!=0]").removeClass('card-header-normal').addClass("card-header-alert");
		// $(".card").filter("[data-eid!='Rasp01'][data-status!=0]").find('div.pretector-text-hum').css("color", "red");
	}else{
		// $(".card").filter("[data-eid!='Rasp01'][data-status!=0]").find('.card-header').removeClass('card-header-alert').addClass("card-header-normal");
	}
	 randomTem = randomTem.toString() + "°C";
	 randomHum = randomHum.toString() + "%";
	 randomUtime = randomUtime.toString() + "mins";
	$(".card").filter("[data-eid!='Rasp01']").find("div.pretector-text-tem").hide().text(randomTem).slideDown();
	$(".card").filter("[data-eid!='Rasp01']").find("div.pretector-text-hum").hide().text(randomHum).slideDown();
	$(".card").filter("[data-eid!='Rasp01']").find("div.pretector-text-utime1").hide().text(randomUtime).slideDown();
}

//real time call ----- end

//utility function

function isParamNull(id){
    if(id != "" && id != undefined && id != "undefined" && id != null && id!="null"){
        return false;
    }else{
        return true;
    }
}

function hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
$(function(){

    setInterval(renderTime, 1000);
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    buttonInit();
    handlGetRequest();
    getAllEquipBt();
    socketInit();
});

function buttonInit(){
    var uid = $.url.param("uid");
    $(".sidebar-brand").attr("data-uid",uid);
    $("#search_bt").on('click', function(e){
        e.preventDefault();
        var keyword = $("#search_keyword").val();
        var url = "/g";
        var uid = $(".sidebar-brand").data("uid");
        var Search_para = "sub_path=register&uid=" + uid + "&keyword=" + keyword;
        if((!isParamNull(keyword)) && (!isParamNull(keyword))){
            getSearchJSON(url, keyword ,Search_para);
        }
    });

    $("form input").keypress(function (e) {  //ÐÞÕý Enter form åeÕ`
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                $('#modal_login').click();
                return false;
            } else {
                return true;
            }
        });

    $("#dashboard_logout").on('click', function(){
    	window.location.href = "/";
    });
}

function getDetailPage(identifier){
	var eid = $(identifier).data('eid'); 
	var uid = $(identifier).data('uid'); 
	var url = "/detail?eid=" + eid +"&uid=" + uid;
	window.location.href= url;
}

function showAddDir(){
  // $("#AddDir .modal-body strong").remove();
  // $("#AddDir .modal-body").prepend('<strong>Upload location: <p>"' + "HI" + '"</p></strong>');
  $('#AddDirModal').modal('show');
}

function handlGetRequest(){
    // var eid = $.url.param("eid");
    var uid = $(".sidebar-brand").data("uid");
    var dirid = $.url.param("dirid");
    // console.log("dirid:" + dirid);
    var url = "/g";
    // var His_para = "sub_path=history&eid=" + eid;
    var Dir_para = "sub_path=directory&uid=" + uid;
    var Equip_para = "sub_path=directory&dirid=" + dirid;
    if(!isParamNull(uid)){
            // getHistoryJSON(url, His_para);
            getDirJSON(url, Dir_para);
    }
    if(!isParamNull(dirid)){
            getEquipJSON(url, Equip_para);
    }
}

function renderTime(){
    var cur_date = moment().format('ll');
    var cur_day = moment().format('dddd');
    var cur_time = moment().format('h:mm:ss a');
    var cur_datetime = cur_date + " " + cur_day + " " + cur_time; 
    $("#dashboard_time").text(cur_datetime);
}

function postNewDir(){
	var dirName =$("#dirName").val();
	if(dirName!= null && dirName!= "" && dirName != undefined){
	    var data = $('#form_newdir').serialize();
	    // data = data.replace(/[^a-z0-9]/gi, '_').toLowerCase(); //ß^žV×ÖÔª
	    var uid = $(".sidebar-brand").data("uid");
	    data += "&sub_path=directory" + "&uid=" + uid;
	     $.ajax({
	              url: '/g',
	              type: 'POST',
	              dataType: 'json',
	              data: data,
	              success: function(json) {
	              console.log(JSON.stringify(json)); 
	              handlGetRequest();
	              
	            },
	              error: function() { console.log("Error occur in requesting to " + url+ data); }
	            });
	 }else{
	 	alert("ÕˆÌîÈë×ÖÔª");
	 	// $(".alert-empty").slideDown();

	 }
}


//ajax call ----start

function getDirJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                Dir_rander(json);
            },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}

function getSearchJSON(url, keyword, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                // AllEquip_rander(json);
                if( Object.keys(json).length > 0){
                    AllEquip_rander(json);
                }else{
                    Equip_rander(json, true, "noneSearch", keyword);
                }
                // console.log(JSON.stringify(json));
            },
            beforeSend: function(){
              $("#card-container").children().remove();
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $("#card-container").prepend(loadingMask);
            },
            complete: function(){
                var x = Math.floor((Math.random() * 10) + 1);
                sleep(200 * x);
                 $(".cssload-thecube").remove();
                 $("#card-container").hide().fadeIn();

             },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}

function getEquipJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                Equip_rander(json, true);
            },
            beforeSend: function(){
              $("#card-container").children().remove();
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $("#card-container").prepend(loadingMask);
            },
            complete: function(){
                 $(".cssload-thecube").remove();

             },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}

function getAllEquipJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                AllEquip_rander(json); 
            },
            beforeSend: function(){
              $("#card-container").children().remove();
              var loadingMask = `
                <div class="cssload-thecube">
                <div class="cssload-cube cssload-c1"></div>
                <div class="cssload-cube cssload-c2"></div>
                <div class="cssload-cube cssload-c4"></div>
                <div class="cssload-cube cssload-c3"></div>
                </div>`;

              $("#card-container").prepend(loadingMask);
            },
            complete: function(){
                 $(".cssload-thecube").remove();

             },
              error: function() { console.log("Error occur in requesting to " + url+ data); }
            });
}


//ajax call ----end


//UI rander ----start

function Dir_rander(json){
	$(".newdata").remove(); //remove orig directory
    var DOM ="";
    $.each(json, function(index, data){
        DOM += `<li class="newdata"><a href="#" class="hvr-border-fade" data-dirid="`+ data.dirid +
                           `" onClick="getEquipBt(this)"><span class="img-normal"></span>`+ data.dirName +`</a></li>`;
    });
    DOM += `<li class="sidebar-none">
    		    <a href="#" onclick="" class="hvr-border-fade">
    		        Î´·Öî
    		    </a>
    		</li>
    		<li class="newdata">
    			<a href="#" onClick="showAddDir()"¡¡class="hvr-border-fade">
    				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>ÐÂÔö˜Ë»`
    			</a>
    		</li>`;
    $(".sidebar-nav").append(DOM);
    $(".sidebar-nav").find($(".newdata")).hide();
    $(".sidebar-nav").find($(".newdata")).slideDown(1000);

}

function Equip_rander(json, isRemove, status, keyword){
    // $("#card-container").children().fadeOut( function() { $(this).remove(); });
    if(isRemove){
        $("#card-container").children().remove();
    }
    var DOM ="";
    if(status == null || status == "" || status == undefined){
        if(json.length>0){
             DOM +=`<section class="block-padding">
                        <div class="row section-bg">
                          <div class="col-lg-12 text-center">
                              <h4>`+ json[0].dirName +`</h4>
                          </div>`;
            $.each(json, function(index, data){
            	if(data.equipStatus == 0){ //ŸoÈËÊ¹ÓÃ
            		DOM += `<div class="col-lg-3">
                        <div class="card card-text-none l-h-200" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`">
                          <div class="card-block">
                            <blockquote class="card-blockquote">
                            <div class="col-xs-12 text-center pretector-text-title">
                              <strong>`+ data.equipName +`</strong>
                            </div>
                            <div class="col-xs-12">&nbsp;</div>
                            <div class="col-xs-12">&nbsp;</div>
                            <div class="col-xs-12 text-center">Ä¿Ç°ŸoÈËÊ¹ÓÃ</div>
                            <div class="col-xs-12">&nbsp;</div>
                            <div class="l-h-300">
                            <div class="col-xs-12">&nbsp;</div>
                            </div>
                            </blockquote>
                          </div>
                        </div>
                    </div>`;

            		// DOM += `<div class="col-lg-3" >
            		//             <div class="card" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`">
            		//               <div class="card-header text-center">
            		//                 <strong>`+ data.equipName +`</strong>
            		//               </div>
            		//               <div class="card-block">
            		//                 <blockquote class="card-blockquote">
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                   </div>
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
            		//                   </div>
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
            		//                   </div>
            		//                   <div class="col-xs-6">
            		//                   <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
            		//                   </div>
            		//                   <span class="pretector-text-none">Ä¿Ç°ŸoÈËÊ¹ÓÃ</span>
            		//                 </blockquote>
            		//               </div>
            		//             </div>
            		//         </div>`;
            	}else if(data.equipStatus == 1){ //ÓÐÈËÊ¹ÓÃ
            		DOM += `<div class="col-lg-3">
                        <div class="card card-border-normal l-h-200" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
                          <div class="card-block card-header-alert" >
                            <blockquote class="card-blockquote">
                            <div class="col-xs-12 text-center pretector-text-title">
                              <strong>` + data.equipName + `</strong>
                            </div>
                          
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-tmp.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-tem">0¡ãC</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-hum.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-hum">0%</div>
                           <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-time.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-utime1">0mins</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-fall.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right">Ÿo</div>
                            <div class="col-xs-4">&nbsp;</div>
                            <div class="text-center l-h-300">
                            <a href="#" class="btn btn-default text-red" >¾o¼±Í¨Ô’</a>
                            </div>
                            </blockquote>
                          </div>
                        </div>
                    </div>`;
            		// DOM += `<div class="col-lg-3">
            		//             <div class="card card-border-normal" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
            		//               <div class="card-header card-header-normal card-border-normal text-center">
            		//                 <strong>` + data.equipName + `</strong>
            		//               </div>
            		//               <div class="card-block">
            		//               <blockquote class="card-blockquote">
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-tem">28¡ãC</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-hum">40%</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-17.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 </div>
            		//                 </blockquote>
            		//               </div>
            		//             </div> 
            		//         </div>`;
            	}else if(data.equipStatus == 2){  //ÒâÍâ î›r
            		DOM += `<div class="col-lg-3">
                        <div class="card card-border-normal l-h-200" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
                          <div class="card-block card-header-alert" >
                            <blockquote class="card-blockquote">
                            <div class="col-xs-12 text-center pretector-text-title">
                              <strong>` + data.equipName + `</strong>
                            </div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-tmp.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-tem">0¡ãC</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-hum.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-hum">0%</div>
                           <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-time.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right pretector-text-utime1">0mins</div>
                            <div class="col-xs-4 no-padding text-right">&nbsp;</div>
                            <div class="col-xs-2 no-padding"><img src="/static/img/icon-fall.png" class="icon-sensors"></div>
                            <div class="col-xs-6 text-right">Ÿo</div>
                            <div class="col-xs-4">&nbsp;</div>
                            <div class="text-center l-h-300">
                            <a href="#" class="btn btn-default text-red" >¾o¼±Í¨Ô’</a>
                            </div>
                            </blockquote>
                          </div>
                        </div>
                    </div>`;

            		// DOM += `<div class="col-lg-3">
            		//             <div class="card card-border-normal" data-eid="`+ data.eid +`" data-uid="`+ data.uid +`" data-status="`+ data.equipStatus +`" onClick="getDetailPage(this);">
            		//               <div class="card-header card-header-alert card-border-normal text-center">
            		//                 <strong>` + data.equipName + `</strong>
            		//               </div>
            		//               <div class="card-block">
            		//               <blockquote class="card-blockquote">
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-tem">28¡ãC</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-hum">40%</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
            		//                 </div>
            		//                 <div class="col-xs-6">
            		//                 <img src="/static/img/icondash-17.png" class="img-fluid bg-sensors" alt="Responsive image">
            		//                 </div>
            		//                 </blockquote>
            		//               </div>
            		//             </div> 
            		//         </div>`;
            	}
            });
            DOM += `</div></section>`;
        }else{
             DOM +=`<section class="block-padding">
                        <div class="row section-bg">
                          <div class="col-lg-12 text-center">
                              <br><br><br><br><br><br><br><br>
                              <h2 style="color:red;">´Ë˜Ë»`ÉÐÎ´ÐÂÔöÑbÖÃ£¡</h2>
                              <br><br><br><br><br><br><br><br>
                          </div>
                        </div>
                       </section>`;
            }
        }else if(status == "noneSearch"){
            DOM +=`<section class="block-padding">
                       <div class="row section-bg">
                         <div class="col-lg-12 text-center">
                             <br><br><br><br><br><br><br><br>
                             <h2 style="color:red;">Î´ËÑŒ¤µ½ÈÎºÎÓÐêP "`+ keyword +`" µÄÑbÖÃ£¡</h2>
                             <br><br><br><br><br><br><br><br>
                         </div>
                       </div>
                      </section>`;
        }
        $("#card-container").hide().append(DOM).fadeIn();
}

function AllEquip_rander(json){

    if( Object.keys(json).length > 0){  //Îï¼þéL¶È

        var n = 0;
        $.each(json, function(index, data){
            if(n == 0){  //µÚÒ»´Î
                Equip_rander(data, true);
            }else{
                Equip_rander(data, false);
            }
            ++n;
        });
    }
}

//UI rander ----start

function getEquipBt(identifier){
  var dirid = $(identifier).data('dirid'); 
  var url = "/g";
  var Equip_para = "sub_path=directory&dirid=" + dirid;
  getEquipJSON(url, Equip_para);
  // window.location.href = url;
}

function getAllEquipBt(){ //identifier
  var uid = $(".sidebar-brand").data("uid");
  var url = "/g";
  var AllEquip_para = "sub_path=register&uid=" + uid;
  getAllEquipJSON(url, AllEquip_para);
  // window.location.href = url;
}


//real time call ----- start
function socketInit(){
	var socket = io('/');
	var temIntime = null;
	socket.emit('dashboard' ,{'connection':true});

	socket.on('dataUpdate', function (json) {
		console.log(JSON.stringify(json));
		dashboard_Status_Rander(json);

	});
	socket.on('disconnect', function(){
		console.log("disconnect!");
		socket.removeAllListeners("dataUpdate");
		socket.removeAllListeners("PIR");
	});

	socket.on('PIR', function(json){
		console.log(JSON.stringify(json));
		var eid = json.eid;
		var IsUsing = json.IsUsing;
		var IsFalldown = json.Accident;
		if(IsUsing && !IsFalldown){  //Ò»°ãÊ¹ÓÃ
			// console.log("randering");
			// var DOM =  `<div class="col-xs-6">
		 //                <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
		 //                <p><span class="pretector-text-tem">28¡ãC</span></p>
		 //                </div>
		 //                <div class="col-xs-6">
		 //                <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Humidity">
		 //                <p><span class="pretector-text-hum">40%</span></p>
		 //                </div>
		 //                <div class="col-xs-6">
		 //                <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Usetime">
		 //                <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
		 //                </div>
		 //                <div class="col-xs-6">
		 //                <img src="/static/img/icondash-17.png" class="img-fluid bg-sensors" alt="Usetime">
		 //                </div>`;

			// $(".card").filter("[data-eid='"+ eid +"']").find('.card-header').addClass("card-header-normal");
			// $(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			// $(".card").filter("[data-eid='"+ eid +"']").on("click", function(){getDetailPage(this);});
			// $(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();
			$(".card").filter("[data-eid='"+ eid +"']").addClass("card-header-normal");
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			$(".card").filter("[data-eid='"+ eid +"']").on("click", function(){getDetailPage(this);});
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();
		}else if(IsUsing && IsFalldown){  //Ê¹ÓÃÖÐÈçÓÐµøµ¹ÒâÍâ

			// console.log("randering");
			var DOM =  `<div class="col-xs-6">
		                <img src="/static/img/icondash-10.png" class="img-fluid bg-sensors" alt="Responsive image">
		                <p><span class="pretector-text-tem">28¡ãC</span></p>
		                </div>
		                <div class="col-xs-6">
		                <img src="/static/img/icondash-09.png" class="img-fluid bg-sensors" alt="Humidity">
		                <p><span class="pretector-text-hum">40%</span></p>
		                </div>
		                <div class="col-xs-6">
		                <img src="/static/img/icondash-11.png" class="img-fluid bg-sensors" alt="Usetime">
		                <p><span class="pretector-text-utime1">10</span><span class="pretector-text-utime2">mins</span></p>
		                </div>
		                <div class="col-xs-6">
		                <img src="/static/img/icondash-12.png" class="img-fluid bg-sensors" alt="Usetime">
		                </div>`;

			$(".card").filter("[data-eid='"+ eid +"']").find('.card-header').addClass("card-header-normal");
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			$(".card").filter("[data-eid='"+ eid +"']").on("click", function(){getDetailPage(this);});
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();

		}else if(!IsUsing){   //ŸoÈËÊ¹ÓÃ
			var DOM = `<div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
	                  </div>
	                  <div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors " alt="Responsive image">
	                  </div>
	                  <div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
	                  </div>
	                  <div class="col-xs-6">
	                  <img src="/static/img/icondash-18.png" class="img-fluid bg-sensors" alt="Responsive image">
	                  </div>
	                  <span class="pretector-text-none">Ä¿Ç°ŸoÈËÊ¹ÓÃ</span>`;
			$(".card").filter("[data-eid='"+ eid +"']").find('.card-header').removeClass('card-header-normal');
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').children().remove();
			$(".card").filter("[data-eid='"+ eid +"']").unbind('click');
			$(".card").filter("[data-eid='"+ eid +"']").find('blockquote').append(DOM).hide().fadeIn();
		}
	});
}

function dashboard_Status_Rander(json){
	var randomTem = getRandomInt(26,28);
	var randomHum = getRandomInt(50,55);
	var randomUtime = getRandomInt(10,10);
	$.each(json, function(index, data){
		var tmpTem = data.historyTem + "¡ãC";
		var tmpHum = data.historyHum + "%";
		var d = (data.historyUTime).split(" ");
		var d2 = d[1].split(":");
		var m = parseInt(d2[1],10);
		var s = Math.round((parseInt(d2[2],10)/60)*10)/10; //ÞD“QminsÐ¡”µ
		var tmpUTime = m+s;
		if(data.historyTem > 27 || randomHum > 90 ){
			// $(".card").filter("[data-eid='Rasp01'][data-status!=0]").find('.card-header').removeClass('card-header-normal').addClass("card-header-alert");
			$(".card").filter("[data-eid='Rasp01'][data-status!=0]").removeClass('card-header-normal').addClass("card-header-alert");
			$(".card").filter("[data-eid='Rasp01'][data-status!=0]").find('div.pretector-text-tem').css("color", "red");
		}else{
			// $(".card").filter("[data-ei!='Rasp01'][data-status!=0]").find('.card-header').removeClass('card-header-alert').addClass("card-header-normal");
		}
		// var Rasp01dom = $(".card").find("[data-eid='Rasp01'] span.pretector-text-tem");
		// console.log(JSON.stringify(Rasp01dom));
		$(".card").filter("[data-eid='Rasp01']").find("div.pretector-text-tem").hide().text(tmpTem).slideDown();
		$(".card").filter("[data-eid='Rasp01']").find("div.pretector-text-hum").hide().text(tmpHum).slideDown();
		$(".card").filter("[data-eid='Rasp01']").find("div.pretector-text-utime1").hide().text(tmpUTime).slideDown();
	});	
	if(randomTem > 27 || randomHum > 90){
		$(".card").filter("[data-eid!='Rasp01'][data-status!=0]").removeClass('card-header-normal').addClass("card-header-alert");
		// $(".card").filter("[data-eid!='Rasp01'][data-status!=0]").find('div.pretector-text-hum').css("color", "red");
	}else{
		// $(".card").filter("[data-eid!='Rasp01'][data-status!=0]").find('.card-header').removeClass('card-header-alert').addClass("card-header-normal");
	}
	 randomTem = randomTem.toString() + "¡ãC";
	 randomHum = randomHum.toString() + "%";
	 randomUtime = randomUtime.toString() + "mins";
	$(".card").filter("[data-eid!='Rasp01']").find("div.pretector-text-tem").hide().text(randomTem).slideDown();
	$(".card").filter("[data-eid!='Rasp01']").find("div.pretector-text-hum").hide().text(randomHum).slideDown();
	$(".card").filter("[data-eid!='Rasp01']").find("div.pretector-text-utime1").hide().text(randomUtime).slideDown();
}

//real time call ----- end

//utility function

function isParamNull(id){
    if(id != "" && id != undefined && id != "undefined" && id != null && id!="null"){
        return false;
    }else{
        return true;
    }
}

function hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}