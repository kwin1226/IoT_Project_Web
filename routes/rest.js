var httpRequest = require("./httpRequest");
var url = require('url');
var moment = require('moment');
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
            var post_data = "";
            switch(req.body.sub_path){
                case 'directory' :
                        var uid = req.body.uid;
                        var dirName = req.body.dirName;
                        post_data = querystring.stringify({
                            'cid' : uid,
                            'dirName': dirName
                        });
                break;
                case 'user' : 
                        var username = req.body.user_name;
                        var email = req.body.user_email;
                        var phone  = req.body.user_phone;
                        var pass = req.body.user_pass;
                        post_data = querystring.stringify({
                            'username' : username,
                            'email'    : email,
                            'phone'    : phone,
                            'pass'     : pass
                        });
                        // console.log('post_data:' + post_data);
                break;
                case 'register' :
                        var uid = req.body.user_uid;
                        var eid = req.body.equips_eid;
                        var activeTime = moment().format('YYYY-MM-DD hh:mm:ss');
                        post_data = querystring.stringify({
                            'uid'           : uid,
                            'eid'           : eid,
                            'activitedTime' : activeTime

                        });
                        // console.log('post_data:' + post_data);
                break;
                case 'userlogin' :
                        sub_path = v + 'user/login';
                        var username = req.body.user_name;
                        var pass = req.body.user_pass;
                        post_data = querystring.stringify({
                            'username' : username,
                            'pass'     : pass
                        });
                break;
            }

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

    this.putJSON = function(req,res){
        try{
            var method = 'PUT';
            var v = '/v1.0/';
            var sub_path = v + req.body.sub_path;
            var post_data = "";
            switch(req.body.sub_path){
                case 'equips' :
                        var eid = req.body.equips_eid;
                        // var did = req.body.did;
                        var dirid = req.body.equips_dir;
                        var equipName = req.body.equips_name;
                        post_data = querystring.stringify({
                            'eid'      : eid,
                            'dirid'    : dirid,
                            'equipName': equipName
                        });
                        // console.log('post_data:' + post_data);
                break;
            }

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

    this.deleteJSON = function(req,res){
        try{
            var method = 'DELETE';
            var v = '/v1.0/';
            var sub_path = v + req.body.sub_path;

            switch(req.body.sub_path){
                case 'directory' :
                        var dirid = req.body.dirid;
                        if(!isParamNull(dirid)){
                            sub_path += "/" + dirid;
                        }
                break;
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



};

function isParamNull(id){
    if(id != "" && id != undefined && id != "undefined" && id != null && id!="null"){
        return false;
    }else{
        return true;
    }
}
module.exports = new REST();