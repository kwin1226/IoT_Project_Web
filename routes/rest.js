var rest = require("./method/getJSON");
var url = require('url');

function REST() {
    this.getJSON = function(req,res){
        try{
            var url_parts = url.parse(req.url, true);
            var v = '/v1.0/';
            var query = url_parts.query;
            var sub_path = v + query.sub_path;
            var uid = query.uid;
            var eid = query.eid;
            if(uid != "" && uid !=undefined && uid !="undefined" && uid !=null){
                sub_path += "/" + uid;
            }
            else if(eid != "" && eid !=undefined && eid !="undefined" && eid !=null ){
                sub_path += "/" + eid;
            }  
            
            var uid = query.eid;
            console.log("sub_path: " + sub_path);
            
            var username = "testuser";
            var password = "testpassword";
            var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

            var options = {
                host: '140.138.77.152',
                port: 5000,
                path: sub_path,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
            };
            
            rest.getJSON(options,
                    function(statusCode, result)
                    {
                        // I could work with the result html/json here.  I could also just return it
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            }catch (err){
                console.error("||routes err: " + err.code);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err.code
                });
            }
    }
}
module.exports = new REST();