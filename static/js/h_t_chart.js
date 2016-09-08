    $(document).ready(function() {
        var eid = $.url.param("eid");
        console.log("eid:" + eid);
        var url = "http://140.138.77.152:5050/g"
        var data = "sub_path=history&eid=" + eid;
        getJSON(url, data);

        });


    function chart_rander(json){

        var array = [];
        var array2 = [];
        var array3 = [];//創造一陣列
        var array4 = {};
        var array5 = [];//創造一陣列
        var array6 = {};
        var array7 = [];
        for(var i=0; i<json.length; i++){
            var data = json[i].historyTem;//取出資料裡面的第一物件(第一個人)的hid
            var data2 = json[i].historyTime;
            var data3 = json[i].historyHum;
            var object ={"data":data,"time":data2};//創造物件

            array.push(data);
            array2.push(data3);
            array3.push(data2);
        }
        array.forEach(function(x) { array4[x] = (array4[x] || 0)+1; });
        array2.forEach(function(x) { array6[x] = (array6[x] || 0)+1; });
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
        h_t_main(array, array2, array3);
        t_pie(array5);
        h_pie(array7);
    }

    function h_t_main(array, array2, array3){
        $('#h_t_chart').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: '溫溼度即時呈現'
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
                //minRange: 24 * 3600000 // fourteen days

            },
            yAxis: {
                title: {
                    text: '溫度(C)/濕度(W)'
                }
            },
            legend: {
                enabled: false
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
                type: 'spline',
                name: 'Tem',
                //pointInterval:  3600 * 1000,
                //pointStart: Date.UTC(2006, 0, 1),
                data: array 
            },{//這一段該如何做輸入?
                type: 'area',
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
                name: 'Browser share',
                 data:data
            }]
        });
    }


    function h_pie(data){

        $('#h_pie').highcharts({
            chart: {
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
                name: 'Browser share',
                 data:data
            }]
        });
    }


    function getJSON(url, data){  //(url, data, dataArray)
    // var sub_path ="";
    // $.each(dataArray, function(i, field){
    //     if(field.name == "sub_path"){
    //         sub_path = field.value;
    //     }
    // });

    $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              data: data,
              success: function(json) { 
              $(".cards-contain").remove();
                chart_rander(json);
                console.log(JSON.stringify(json)) },
              beforeSend: function(){
                var loadingMask = `
                  <div class="cssload-thecube">
                  <div class="cssload-cube cssload-c1"></div>
                  <div class="cssload-cube cssload-c2"></div>
                  <div class="cssload-cube cssload-c4"></div>
                  <div class="cssload-cube cssload-c3"></div>
                  </div>`;

                $(loadingMask).insertAfter(".container-fluid");
              },
              complete: function(){
                   $(".cssload-thecube").fadeOut();
                   $(".cssload-thecube").remove();
               },
              error: function() { console.log("Error occur in requesting to " + url); }
            });
}