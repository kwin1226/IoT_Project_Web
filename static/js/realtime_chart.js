
$(function () {

var socket = io('http://localhost:5050');
var hchart = null;

socket.on('dataInit', function (json) {
	console.log("receive completeData:" + json.length);
	console.log(json);
	// document.getElementById('complete-data').innerHTML = JSON.stringify(json);

	var series_HUM = {};
	series_HUM.name = '溼度';
	series_HUM.type = 'spline';
	series_HUM.data = [];
	series_HUM.tooltip = {
					    valueSuffix: ' %'
	}

	var series_TEM = {};
	series_TEM.name = '溫度';
	series_TEM.type = 'spline';
	series_TEM.data = [];
	series_TEM.tooltip = {
					    valueDecimals: 2,
					    valueSuffix: ' °C'
	}

	$.each(json, function(index, data){
		var point_HUM = {};
		point_HUM.x = data.historyGMT;
		point_HUM.y = data.historyHum;
		series_HUM.data.push(point_HUM);

		var point_TEM = {};
		point_TEM.x = data.historyGMT;
		point_TEM.y = data.historyTem;
		series_TEM.data.push(point_TEM);
	});
	
	    Highcharts.setOptions({
	        global : {
	            useUTC : false
	        }
	    });

	    // Create the chart
	    $('#hchart').highcharts('StockChart', {
	        chart : {
	            events : {
	                load : function () {
	                	hchart = this;
	                }
	            }
	        },

	        rangeSelector: {
	            buttons: [{
	                count: 1,
	                type: 'minute',
	                text: '1M'
	            }, {
	                count: 5,
	                type: 'minute',
	                text: '5M'
	            }, {
	                type: 'all',
	                text: 'All'
	            }],
	            inputEnabled: false,
	            selected: 0
	        },

	        exporting: {
	            enabled: false
	        },
	        yAxis :[  // 濕度
			        	{labels: {
			        		// format: '{value}%',
			                // style: {
			                //     color: Highcharts.getOptions().colors[0]
				               //  }
			            },
			            title: {
			                text: '濕度',
			                style: {
			                    color: Highcharts.getOptions().colors[0]
			                }
			            },
			            opposite: true},  
			            // 溫度
			        	{labels: { 
			        		// format: '{value}°C',
			                // style: {
			                //     color: Highcharts.getOptions().colors[1]
			                // }
			            },
			            gridLineWidth: 0,
			            title: {
			                text: '溫度',
			                style: {
			                    color: Highcharts.getOptions().colors[1]
			                }
			            },
			           	opposite: true}],

	        tooltip:{
	        			shared: true	        
	        },
	        series : [series_HUM, series_TEM]
	    });
});

// socket.emit('client_data' ,{
//       			'letter':'connect'
//       		});

	socket.on('dataUpdate', function (json) { //每次只推一筆
	    // document.getElementById('updated-data').innerHTML += JSON.stringify(json) + "\n";
	    console.log('new point');

	    $.each(json, function(index, data){
	    	hchart.series[0].addPoint([data.historyGMT, data.historyHum], false, true);
	    	hchart.series[1].addPoint([data.historyGMT, data.historyTem], true, true);
	    	if(data.historyHum > 76){
	    		$("#rel_hum").text(data.historyHum);
	    		$("#rel_hum").css('color', 'red');

	    	}else{
	    		$("#rel_hum").text(data.historyHum);
	    		$("#rel_hum").css('color', '');
	    	}

	    	if(data.historyTem > 25){
	    		$("#rel_tem").text(data.historyTem);
	    		$("#rel_tem").css('color', 'red');
	    	}else{
	    		$("#rel_tem").text(data.historyTem);
	    		$("#rel_tem").css('color', '');
	    	}
	    	
	    
	    });
	});

});