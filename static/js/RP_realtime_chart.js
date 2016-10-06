
$(function () {

var socket = io('/');
var temIntime = null;

socket.emit('detail' ,{'connection':true});

socket.on('dataInit', function (json) {
	console.log("receive completeData:" + json.length);
	// console.log(json);
	// document.getElementById('complete-data').innerHTML = JSON.stringify(json);
	var intime_HUM = [];
    var intime_TEM = [];
	var intime_gmt = [];

	$.each(json, function(index, data){

     	intime_TEM.push(data.historyTem);
        intime_HUM.push(data.historyHum);
 		intime_gmt.push(data.historyGMT);
 });
	
	    Highcharts.setOptions({
	        global : {
	            useUTC : false
	        }
	    });

// 	    // Create the chart

$('#temIntime').highcharts({
    chart: {
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        type: 'line',
        events : {
	                load : function () {
	                	temIntime = this;
	                }
	            }
    },
    title: {
        text: '溫度即時圖'
    },
    
    xAxis: {
        categories:intime_gmt,
        labels: {enabled:false}
    },
    yAxis: {
        title: {
            text: '攝氏溫標（°C）'
        },
        // min: 0,
        // minorGridLineWidth: 0,
        // gridLineWidth: 0,
        // alternateGridColor: null,
        plotBands: [{ // Light air
            from: 22,
            to: 25,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'SAFE',
                style: {
                    color: '#606060'
                }
            }
        }, { // Light breeze
            from: 25,
            to: 30,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: '',
                style: {
                    color: '#606060'
                }
            }
        }, { // Gentle breeze
            from: 30,
            to: 50,
            color: 'rgba(200, 54, 54, 0.1)',
            label: {
                text: 'WARN',
                style: {
                    color: '#606060'
                }
            }
        }],
        plotLines: [{
            color: '#FF0000',
            width: 2,
            value: 30
        }]
    }
    ,
    tooltip: {
        valueSuffix: '°C'
    },
    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            },
            // marker: {
            //     enabled: true
            // },
            //pointInterval: 3600000, // one hour
            //pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
        }
    },
    series: [{
        name: '溫度',
         data: intime_TEM}],
    // navigation: {
    //     menuItemStyle: {
    //         fontSize: '10px'
    //     }
    // }
});

$('#humIntime').highcharts({
    chart: {
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        type: 'line',
        events : {
                  load : function () {
                    humIntime = this;
                  }
              }
    },
    title: {
        text: '濕度即時圖'
    },
    
    xAxis: {
        categories:intime_gmt,
        labels: {enabled:false}
    },
    yAxis: {
        title: {
            text: '百分比（%）'
        },
        // min: 0,
        // minorGridLineWidth: 0,
        // gridLineWidth: 0,
        // alternateGridColor: null,
        plotBands: [{ // Light air
            from: 50,
            to: 65,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'SAFE',
                style: {
                    // color: '#606060'
                }
            }
        }, { // Light breeze
            from: 65,
            to: 76,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: '',
                style: {
                    color: '#606060'
                }
            }
        }, { // Gentle breeze
            from: 76,
            to: 80,
            color: 'rgba(200, 54, 54, 0.1)',
            label: {
                text: 'WARN',
                style: {
                    color: '#606060'
                }
            }
        }],
        plotLines: [{
            color: '#FF0000',
            width: 2,
            value: 76
        }]
    }
    ,
    tooltip: {
        valueSuffix: ' %'
    },
    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            }
            // marker: {
            //     enabled: true
            // },
            //pointInterval: 3600000, // one hour
            //pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
        }
    },
    series: [{
        name: '濕度',
         data: intime_HUM}]
    // navigation: {
    //     menuItemStyle: {
    //         fontSize: '10px'
    //     }
    // }
});
 
$(".highcharts-legend-item").hide();
 });
// $(".highcharts-xaxis-labels").hide();


	socket.on('dataUpdate', function (json) { //每次只推一筆
	    // document.getElementById('updated-data').innerHTML += JSON.stringify(json) + "\n";
	    console.log('new point');

	    $.each(json, function(index, data){
	    temIntime.series[0].addPoint([data.historyTem], true, true);
        temIntime.xAxis[0].categories.push(moment(data.historyGMT).format('YYYY-MM-DD h:mm:ss'))

        humIntime.series[0].addPoint([data.historyHum], true, true);
        humIntime.xAxis[0].categories.push(moment(data.historyGMT).format('YYYY-MM-DD h:mm:ss'))


    	if(data.historyHum > 76){
    		$("#rel_hum").text(data.historyHum);
    		$("#rel_hum").css('color', 'red');
    	}else{
    		$("#rel_hum").text(data.historyHum);
    		$("#rel_hum").css('color', '');
    	}
    	if(data.historyTem > 30){
    		$("#rel_tem").text(data.historyTem);
    		$("#rel_tem").css('color', 'red');
    	}else{
    		$("#rel_tem").text(data.historyTem);
    		$("#rel_tem").css('color', '');
    	}
        var d = (data.historyUTime).split(" ");
        var tmpUTime = d[1];
        $("#rel_ustime").text(tmpUTime);

	    });
	});
});
