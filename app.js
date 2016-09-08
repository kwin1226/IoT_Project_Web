var express = require('express');
var bodyparser = require('body-parser');
var moment = require('moment');
var colors = require('colors');
var router = require('./router');

var app = express();
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

router.configure(app)

var server = app.listen('5050', function() {
  // console.log('Server listening on port ' + server.address().port);
  console.log('--'.blue+ moment().format('LLLL').blue+'\nWeb_Server pid: %s \nlistening on port: %d in %s',process.pid,server.address().port,process.env.NODE_ENV);
});