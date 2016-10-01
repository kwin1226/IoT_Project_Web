var http = require("http");
var https = require("https");
var rest = require("./method/getJSON");

exports.init = function(sub_path, method, onResult, post_data)
{
var username = "testuser";
var password = "testpassword";
var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
var options ;
switch(method){
    case 'GET':{
        options = {
            host: '140.138.77.152',
            port: 5000,
            path: sub_path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
        };
    break;
    }
    case 'POST':
    {
        options = {
            host: '140.138.77.152',
            port: 5000,
            path: sub_path,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data),
                'Authorization': auth
            }
        };
    break;
    }
    case 'PUT':
    {
        options = {
            host: '140.138.77.152',
            port: 5000,
            path: sub_path,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data),
                'Authorization': auth
            }
        };
    break;
    }
}
console.log("options > " + JSON.stringify(options));
try {
rest.getJSON(options,
        function(statusCode, result)
        {
            // I could work with the result html/json here.  I could also just return it
            // console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
            onResult(statusCode, result);

        }, post_data);
}catch(err){
                console.error("||routes err: " + err.code);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err.code
                });
            }
};