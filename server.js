/* ***************** /
Meraki Dashoard API Express Server

Supports redirects with custom recursive request function.

/ ****************** */


// Environment 

// External Configuration File
var configs = require('./config/merakiConfigs.js');


/* Local Configuration alternative
var configs = {
    apiKey: 'YourAPIKey',
    apiUrl: 'https://api.meraki.com/api/v0'
};
*/

/* ****************** */

var express = require('express');
//var request = require('request'); // Does not properly handle Meraki redirects
var requestMeraki = require('./request-meraki');
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
var app = module.exports = express();

// Development Tools
/*
var morgan = require('morgan');
app.use(morgan('dev'))

var globalLog = require('global-request-logger');
globalLog.initialize();

globalLog.on('success', function(request, response) {
  console.log('SUCCESS');
  console.log('Request', request);
  console.log('Response', response);
});
 
globalLog.on('error', function(request, response) {
  console.log('ERROR');
  console.log('Request', request);
  console.log('Response', response);
});
*/


var jsonParser = bodyParser.json();

// API Route - Will be proxied through Meraki Dashboard API

// ********
// Meraki API
// ********
//const Meraki = require('./meraki-service');
const Meraki = require('meraki-service');
const meraki = new Meraki(configs.apiKey,'http://localhost:' +port+'/api');

// API Proxy Route - Will be proxied through Meraki Dashboard API
app.use('/api', jsonParser, function (req, res){
  console.log('API request ', req.method, req.url, req.method != 'GET' ? req.body:'');
  var options = {
    qs: req.query,
    url: configs.apiUrl + req.url,
    method: req.method,
    body: req.body,
    headers: {}
  };
  //console.log('/api req.headers', req.headers);
  if(req.headers['x-cisco-meraki-api-key']){
    options.headers['X-Cisco-Meraki-API-Key'] = req.headers['x-cisco-meraki-api-key'];
    //console.log("New headers sent", options.headers );
  }
  

  meraki.proxy(options).then((response) => {
    console.log("server: proxy response.data", response);
    res.send(response);
    res.end();
  });

});


// Home page, default route

/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '.dist/index.html'));
});
*/
//app.use(express.static(path.join(__dirname, './dist')));
app.use(history());
app.use(serveStatic(__dirname + "/dist"));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start server
var port = process.env.PORT || 8088;
var server = app.listen(port, () => {
  console.log('Server Running on '+ server.address().address+port+'/');
  console.log('Meraki API Proxy: localhost:'+server.address().address+ ':' +port+'/api');
  console.log('Default API Endpoint: ', configs.apiUrl);
});

