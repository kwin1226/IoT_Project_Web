var path  = require("path");
var rest = require("./routes/rest");

module.exports = {
  configure: function(app) {
  	try {
    app.get('/', function(req, res) { //index page
      res.sendFile(path.join(__dirname+'/templates/index.html'));
    });

    app.get('/register', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/register.html'));
    });

    app.get('/new', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/qrcode_login.html'));
    });

    app.get('/qrcode_form', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/qrcode_form.html'));
    });

    app.get('/detail', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/RP_detail.html'));
    });

    app.get('/dashboard', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/RP_dashboard.html'));
    });

    app.get('/g', function(req, res) { //make a HTTP GET request to API 
      console.log("req.body:" + req.url);
    	rest.getJSON(req,res);
    });
    app.post('/g', function(req, res) { //make a HTTP POST request to API 
      console.log("req.body:" + req.body);
      rest.postJSON(req,res);
    });
    app.put('/g', function(req, res) { //make a HTTP PUT request to API 
      console.log("req.body:" + req.body);
      rest.putJSON(req,res);
    });
    app.delete('/g', function(req, res) { //make a HTTP DELETE request to API 
      console.log("req.body:" + req.url);
      rest.deleteJSON(req,res);
    });

  } catch (err) {
      console.error("||err: " + err.code);
      res.statusCode = 500;
      res.send({
          result: 'error',
          err:    err.code
      });
  	}
  }
};