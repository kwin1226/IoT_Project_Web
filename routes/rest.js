var httpRequest = require("./httpRequest");
var url = require('url');
var querystring = require('querystring');


function REST() {
    this.getJSON = function(req,res){
        try{
            var method = 'GET';
            var url_parts = url.parse(req.url, true);
            var v = '/v1.0/';
            var query = url_parts.query;
            var sub_path = v + query.sub_path;
            var uid = query.uid;
            var eid = query.eid;
            var dirid = query.dirid;
            var keyword = query.keyword;
            var startdate = query.sdate;
            var enddate = query.edate;
            var type = query.type;
            console.log('startdate:' + startdate);
            console.log('enddate:' + enddate);
            //id parse
            if(uid != "" && uid !=undefined && uid !="undefined" && uid !=null){
                if(!isParamNull(type) && type == "using"){
                    sub_path += "/using/" + uid;
                }else if(!isParamNull(type) && type == "alert"){
                    sub_path += "/alert/" + uid;
                }else if(!isParamNull(type) && type == "unusing"){
                    sub_path += "/unusing/" + uid;
                }else{
                    sub_path += "/" + uid;
                }
                if((!isParamNull(keyword))){
                    sub_path += "/" + encodeURIComponent(keyword);
                }
            }
            else if(eid != "" && eid !=undefined && eid !="undefined" && eid !=null ){
                sub_path += "/" + eid;
            }
            if(dirid != "" && dirid !=undefined && dirid !="undefined" && dirid !=null){
                sub_path += "/child/" + dirid;
            }
            else if(dirid != "" && dirid !=undefined && dirid !="undefined" && dirid !=null ){
                sub_path += "/child/" + dirid;
            }

            //date parse
            if(startdate != "" && startdate !=undefined && startdate !="undefined" && startdate !=null){
                sub_path += "/date/" + startdate;
                if(enddate != "" && enddate !=undefined && enddate !="undefined" && enddate !=null ){
                    sub_path += "/" + enddate;
                }
            }
            
            console.log("sub_path: " + sub_path);
            httpRequest.init(sub_path, method,
                function(statusCode, result){
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
    };

    this.postJSON = function(req,res){
        try{
            var method = 'POST';
            // var url_parts = url.parse(req.url, true);
            var v = '/v1.0/';
            // var query = url_parts.query;
            // var sub_path = v + query.sub_path;
            var sub_path = v + req.body.sub_path;
            var uid = req.body.uid;
            var dirName = req.body.dirName;
            var post_data = querystring.stringify({
                'cid' : uid,
                'dirName': dirName
            });
            console.log("sub_path: " + sub_path);
            httpRequest.init(sub_path, method,
                function(statusCode, result){
                    res.statusCode = statusCode;
                    console.log("callback > " + JSON.stringify(result));
                    res.send(result);
            }, post_data);
          
            }catch (err){
                console.error("||routes err: " + err.code);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err.code
                });
            }
    }
};

function isParamNull(id){
    if(id != "" && id != undefined && id != "undefined" && id != null && id!="null"){
        return false;
    }else{
        return true;
    }
}
module.exports = new REST();