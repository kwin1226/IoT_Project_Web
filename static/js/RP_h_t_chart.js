    $(document).ready(function() {
        setInterval(renderTime, 1000);
        var eid = $.url.param("eid");
        var uid = $.url.param("uid");
        handlGetRequest();
        // console.log("eid:" + eid);
        var url = "/g";
        var His_para = "sub_path=history&eid=" + eid;
        var Equip_para = "sub_path=equips&eid=" + eid;
        getHistoryJSON(url, His_para);
        getEquipJSON(url, Equip_para);

        });

    function chart_rander(json){

        var array = [];
        var array2 = [];
        var array3 = [];//創造一陣列
        var array4 = {};
        var array5 = [];//創造一陣列
        var array6 = {};
        var array7 = [];
        var array8 = {};
        var array9 = [];
        var array10 = [];
        var array11 = [];
        for(var i=0; i<json.length; i++){
            var data = json[i].historyTem;//取出資料裡面的第一物件(第一個人)的hid
            var data2 = json[i].historyTime;
            var data3 = json[i].historyHum;
            var object ={"data":data,"time":data2};//創造物件

            array.push(data);
            array2.push(data3);
            array3.push(data2);

            var timecut = []; 
            var timecut2 = []; 
            timecut = data2.split(" ");
            timecut2 = timecut[1].split(":");
            array9.push(timecut2[0]);

            // console.log("Key is " + k + ", value is" + array9[i]);
        }
        // console.log( "value is" + array9);


        array.forEach(function(x) { array4[x] = (array4[x] || 0)+1; });
        array2.forEach(function(x) { array6[x] = (array6[x] || 0)+1; });
        array9.forEach(function(x) { array8[x] = (array8[x] || 0)+1; });

        var i =0;
        for (var k in array4){

            if (array4.hasOwnProperty(k)) {
                 array5[i] = [];
                 array5[i].push(k);
                 array5[i].push(array4[k]);
                 //console.log("Key is " + k + ", value is" + array4[k]);
            }
            i++;
        }

        var j =0;
        for (var k in array6){

            if (array6.hasOwnProperty(k)) {
                 array7[j] = [];
                 array7[j].push(k);
                 array7[j].push(array6[k]);
                 //console.log("Key is " + k + ", value is" + array4[k]);
            }
            j++;
        }

        var u =0;
        for (var k in array8){

            if (array8.hasOwnProperty(k)) {
                array10[u] = [];
                array11[u] = [];
                array10[u].push(k);
                array11[u].push(k);
                array10[u].push(array8[k]); 

                
                     
                // console.log("Key is " + k + ", value is" + array10[k]);
            }
        u++;
        }
        console.log(array10);

        h_t_main(array, array2, array3);
        t_pie(array5);
        h_pie(array7);
        usetime();
        timehistory(array10);
        $(".highcharts-xaxis-labels").remove();
    }

      
    

 function timehistory(array10){
        $('#time-History').highcharts({
        chart: {
            backgroundColor: 'rgba(0,0,0,0.1)',
            zoomType: 'xy'
        },
        title: {
            text: '時段資料輸出次數統計圖'
        },
        
        xAxis: [{
           
            tickInterval: 1,
              labels: {
            enabled: true,
            formatter: function(){return array10[this.value][0]+"時";}  
            //crosshair: true
    }
}],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: '輸出次數',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} 次',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
            

                },
        series: [{
            name: '輸出次數',
            type: 'column',

            yAxis: 1,
            data: array10,
            tooltip: {
                valueSuffix: ' 次'
            }

         }]
    });
}

    function h_t_main(array, array2, array3){
        $('#h_t_chart').highcharts({
            chart: {
                backgroundColor: 'rgba(0,0,0,0.1)',
                zoomType: 'x'
            },
            title: {
                text: '溫溼度歷史趨勢'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'HUM&TEM' :
                        'Pinch the chart to zoom in'
            },
            xAxis: {
                //series:[{
                //type: "datetime",
                  
                //dateTimeLabelFormats: {
               // day: '%Y-%m-%d'
            //},
            categories:array3
                //data:array3
             // time = Date.getTime(historyTime)
                // minRange: 24 * 3600000 // fourteen days

            },
            yAxis: {
                title: {
                    text: '溫度(C)/濕度(%)'
                }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'line',
                name: 'Tem',
                //pointInterval:  3600 * 1000,
                //pointStart: Date.UTC(2006, 0, 1),
                data: array 
            },{//這一段該如何做輸入?
                type: 'line',
                name: 'Hum',
                //pointInterval:  3600 * 1000,
                //pointStart: Date.UTC(2006, 0, 1),
                data: array2
                //color: '#f7a35c'
            }]
        });
    }

    function t_pie(data){
        $('#t_pie').highcharts({
            chart: {
                backgroundColor: 'rgba(0,0,0,0.1)',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '溫度比例表'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '溫度比例',
                 data:data
            }]
        });
    }


    function h_pie(data){

        $('#h_pie').highcharts({
            chart: {
                backgroundColor: '#E6E6E6',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '濕度比例表'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '濕度比例',
                 data:data
            }]
        });
    }

    function usetime() {
    $('#usetime').highcharts({
        chart: {
            backgroundColor: '#E6E6E6',
            type: 'area',
            spacingBottom: 30
        },
        title: {
            text: '裝置使用情形'
        },
        subtitle: {
            text: '',
            floating: true,
            align: 'right',
            verticalAlign: 'bottom',
            y: 15
        },
        xAxis: {
            categories: ['23:33:31', '23:45:31', '23:55:31', '24:00:31', '24:05:31', '24:10:31', '24:15:31', '24:20:31']
        },
        yAxis: {
            title: {
                text: '是否使用(是=1/否=0)'
            },
           tickInterval:1 //X轴刻度间隔为10
            // labels: {
            //     formatter: function () {
            //         return this.value;
            //     }
            // }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.x + ': ' + this.y;
            }
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'useing',
            data: [0, 1, 1, 1, 0, 0, 0, 1]
        }]
    });
}


    function getHistoryJSON(url, data){  //(url, data, dataArray)

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
              $(".cards-contain").remove();
                chart_rander(json);
                // console.log(JSON.stringify(json));
                 },
              beforeSend: function(){
                var loadingMask = `
                  <div class="cssload-thecube">
                  <div class="cssload-cube cssload-c1"></div>
                  <div class="cssload-cube cssload-c2"></div>
                  <div class="cssload-cube cssload-c4"></div>
                  <div class="cssload-cube cssload-c3"></div>
                  </div>`;

                $(loadingMask).insertAfter("#section1");
              },
              complete: function(){
                   $(".cssload-thecube").fadeOut();
                   $(".cssload-thecube").remove();
               },
              error: function() { console.log("Error occur in requesting to " + url); }
            });
}

    function getEquipJSON(url, data){

        $.ajax({
                  url: url,
                  type: 'GET',
                  dataType: 'json',
                  data: data,
                  success: function(json) { 
                    console.log(json);
                    Equip_rander(json);
                    console.log("裝置:"+JSON.stringify(json)) 
                },
                // beforeSend: function(){
                //   var loadingMask = `
                //     <div class="cssload-thecube">
                //     <div class="cssload-cube cssload-c1"></div>
                //     <div class="cssload-cube cssload-c2"></div>
                //     <div class="cssload-cube cssload-c4"></div>
                //     <div class="cssload-cube cssload-c3"></div>
                //     </div>`;

                //   $(loadingMask).insertAfter("section.bg-3");
                // },
                // complete: function(){
                //      $(".cssload-thecube").remove();

                 // },
                  error: function() { console.log("Error occur in requesting to " + url+ data); }
                });
    }


function Equip_rander(json){
    // var DOM_detail_data = `<h1 >`+ json[0].equipName +` <font size="5"> [`+ json[0].dirName +`]</font></h1>`;
    $("#active_time").text(json[0].equipPROD);
    $("#dashboard_name").text(json[0].equipName);
    $("#equips_name").val(json[0].equipName);
}

function renderTime(){
    var cur_date = moment().format('ll');
    var cur_day = (moment().format('dddd')).replace("星期","週");
    var cur_time = moment().format('h:mm:ss a');
    // var cur_datetime = cur_date + " " + cur_day + " " + cur_time; 
    $("#dashboard_date").text(cur_date);
    $("#dashboard_day").text(cur_day);
    $("#dashboard_time").text(cur_time);
}

function handlGetRequest(){
    var uid = $.url.param("uid");
    var eid = $.url.param("eid");
    $("#containerdiv").attr("data-uid",uid);
    $("#containerdiv").attr("data-eid",eid);
    var url = "/g";
    var Dir_para = "sub_path=directory&uid=" + uid;
    if(!isParamNull(uid) && !isParamNull(eid)){
            getDirJSON(url, Dir_para);
    }else{
      $("#containerdiv").remove();
        var DOM = `
        <div class="col-lg-6 col-lg-offset-3 p-t-20 fadeInAnimate">
          <div class="form-group row">
            <h2 class="col-xs-12 col-form-label">Oops！此頁面不存在！</h2>
          </div>
        </div>`;
      $("body").append(DOM);
    }
}

function getDirJSON(url, data){

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
                // console.log(JSON.stringify(json));
                Dir_rander(json);
            },
              error: function() { console.log("Error occur in requesting to /g " + data); }
            });
}


function Dir_rander(json){
  $(".newdata").remove(); //remove orig directory
    var DOM ="";
    $.each(json, function(index, data){
        DOM += `<option value="`+ data.dirid +`" class="newdata">`+ data.dirName +`</option>`;
    });
    // DOM += `<option value="new" class="newdata">新增...</option>`;
    $("#equips_dir").prepend(DOM);
}

function putEquiqs(){
  if(checkformEmpty())return;
  var data = $('#form_modifyEquips').serialize();
  var eid = $("#containerdiv").data("eid");
  data += "&sub_path=equips&equips_eid=" + eid;
  console.log(data);
   $.ajax({
            url: '/g',
            type: 'PUT',
            dataType: 'json',
            data: data,
            success: function(json) {
            console.log(JSON.stringify(json)); 
            location.reload();
            // putEquiqsCallback(json);
            // postActiveEquips(json);
          },
            error: function() { console.log("Error occur in requesting to /g" + data); }
          });
}

function showEditEquips(){
    $('#EditEquipsModal').modal('show');
}

function checkformEmpty(){
  var flag = false;
  var pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>/?~！￥……&*（）&;|{}【】‘；：”“'。，、？\"]");
  var filter = /^09+[0-9]{8}$/;
  // $("form input").each(function() {
    $("#equips_name").each(function() {
      var selectBox = document.getElementById("equips_dir");
      var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    if($(this).val() === ""){
      var DOM = "<strong>有人留空白囉!</strong>";
      $("#alert-panel").find("strong").remove();
      $("#alert-panel").append(DOM);
      $('#alert-panel').slideDown();
      flag = true;
    }
    if(flag != true && selectedValue == "new"){
      var DOM = "<strong>請選擇標籤!</strong>";
      $("#alert-panel").find("strong").remove();
      $("#alert-panel").append(DOM);
      $('#alert-panel').slideDown();
      flag = true;
      return flag;
    }
    if(flag != true){
      var s = $(this).val();
      for (var i = 0; i < s.length; i++) { 
          if(pattern.test(s.substr(i,1))){
            var DOM = "<strong>別輸入特殊字元!</strong>";
            $("#alert-panel").find("strong").remove();
            $("#alert-panel").append(DOM);
            $('#alert-panel').slideDown();
            flag = true;
            return flag;
          }
      } 
    }
  }); 
  return flag;
}



function isParamNull(id){
    if(id != "" && id != undefined && id != "undefined" && id != null && id!="null"){
        return false;
    }else{
        return true;
    }
}