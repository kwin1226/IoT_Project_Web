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
      res.sendFile(path.join(__dirname+'/templates/qrcode.html'));
    });

    app.get('/detail', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/RP_detail.html'));
    });

    app.get('/dashboard', function(req, res) { //detail page of the equipment
      res.sendFile(path.join(__dirname+'/templates/RP_dashboard.html'));
    });

    app.get('/g', function(req, res) { //make a HTTP GET request to API 
      console.log("req:" + req.url);
    	rest.getJSON(req,res);
    });
    app.post('/g', function(req, res) { //make a HTTP POST request to API 
      console.log("req:" + req.body);
      rest.postJSON(req,res);
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