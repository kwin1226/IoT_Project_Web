var httpRequest = require("./routes/httpRequest");

exports.configure = function configure(io){
    let data = {};
    let isConnect = true;
    var lastUpdate = 0;
    var lastUpdate_F = "";

    function pushInit(new_data){
        io.sockets.emit('dataInit', new_data);
    }

    function pushUsing(new_data){
        // console.log('pushing PIR to Client');
        io.sockets.emit('PIR', new_data); 
    }

    function pushUpdate(new_data) {
        io.sockets.emit('dataUpdate', new_data);
    }

    function dataInit(callback){
        var startDay = '2016-08-30 00:00:00'; //以2016-08-31 當範例，之後時間需動態
        var endDay = '2016-09-20 23:59:59'; 
        var sub_path = '/v1.0/history/Rasp01/date/' + encodeURIComponent(startDay) + '/' + encodeURIComponent(endDay);
        var method = 'GET';

        httpRequest.init(sub_path, method,
                    function(statusCode, rows){
                        // console.log("JSON:" + JSON.stringify(result));
                    if (rows && rows.length >= 0) {
                        var new_data = [];
                        for(var i in rows){
                            var row = {};
                            for(var field in rows[i]){
                                var value = rows[i][field];
                                if (field === 'historyGMT' &&  Date.parse(rows[i][field]) > lastUpdate) {
                                        value = Date.parse(value);
                                        lastUpdate = value;
                                        lastUpdate_F = rows[i]['historyTime'];
                                }
                                row[field] = value;
                            }
                            new_data.push(row);
                        }
                        console.log("||Init > :" + lastUpdate + " > " + lastUpdate_F);
                        pushInit(new_data);
                    }
                    callback(lastUpdate, lastUpdate_F);
            });
    }

    // this is the query loop.
    function dataSync(orig_data, lastUpdate, lastUpdate_F, socket, isConnect) {
        var sub_path = '/v1.0/history/Rasp01/date/' + encodeURIComponent(lastUpdate_F) ;
        var method = 'GET';

        socket.on('disconnect', function(){
            console.log("-----------a user disconnect!");
            isConnect = false;
        });

        httpRequest.init(sub_path, method,
                    function(statusCode, rows){
                        // console.log("JSON:" + JSON.stringify(result));
                    if (rows && rows.length >= 0) {
                        var new_data = [];
                        for(var i in rows){
                            var row = {};
                            for(var field in rows[i]){
                                var value = rows[i][field];
                                if (field === 'historyGMT' &&  Date.parse(rows[i][field]) > lastUpdate) {
                                        value = Date.parse(value);
                                        lastUpdate = value;
                                        lastUpdate_F = rows[i]['historyTime'];
                                }
                                row[field] = value;
                            }
                            new_data.push(row);
                        }
                        console.log("Update > :" + lastUpdate + " > " + lastUpdate_F);
                        console.log("isConnect:" + isConnect);
                        pushUpdate(new_data);
                    }
                    if(isConnect == true){
                    setTimeout(function() {dataSync(orig_data, lastUpdate, lastUpdate_F, socket, isConnect);}, 1000);
                }
            });
    }


//socket routes 
    io.on('connection', function(socket) {
        socket.on('detail', function(data){
            console.log(JSON.stringify(data));
            if(data.connection){
                let isConnect = true;
                dataInit(function(result1,result2){
                    dataSync(data,result1, result2, socket, isConnect); 
                });
            }
        });
        socket.on('dashboard', function(data){
            console.log(JSON.stringify(data));
            if(data.connection){
                let isConnect = true;
                dataInit(function(result1,result2){
                    dataSync(data,result1, result2, socket, isConnect); 
                });
            }
        });
        socket.on('PIR', function(data){
            console.log(JSON.stringify(data));
            pushUsing(data);
        });
    });
}