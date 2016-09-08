var path  = require("path");
var rest = require("./routes/rest");

module.exports = {
  configure: function(app) {
  	try {
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname+'/templates/index.html'));
    });

    app.get('/detail', function(req, res) {
      res.sendFile(path.join(__dirname+'/templates/detail.html'));
    });

    app.get('/g', function(req, res) {
    	rest.getJSON(req,res);
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