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
var bodyParser = require('body-parser');

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
app.use('/api', jsonParser, function (req, res){
  console.log('API request ', req.url);
  console.log('request body, ', req.body);

  var options = {
    qs: req.query,
    url: configs.apiUrl + req.url,
    method: req.method,
    body: JSON.stringify(req.body), 
    //followAllRedirects: true, // Does not work as intended with PUT,POST,DELETE (returns a [GET] on final location)
    headers: {
        'X-Cisco-Meraki-API-Key': req.headers['x-cisco-meraki-api-key'] || configs.apiKey, // Use client API key first, then server
        'Content-Type': 'application/json'
    } 
  }

  requestMeraki(options, function(err, response, data){
    //console.log('requestMeraki req.headers ',req.headers);
    console.log('requestMeraki options ',options);
    if(err){
        console.log("requestMeraki err ", err)
        res.send(err);
    }
    if(!response){
      console.log('no response from server')
      return
    }
    console.log('FINAL res.statusCode ',response.statusCode);
    console.log('FINAL res.body ',response.body);

    res.setHeader('content-type', response.headers['content-type']);
    res.status(response.statusCode).send(data);
  });

});


// Home page, default route
/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
*/
app.use(express.static(path.join(__dirname, './dist')));

// Start server
var port = process.env.PORT || 8088;
var server = app.listen(port, () => {
  console.log('Server Running on '+ server.address().address+port+'/');
  console.log('Meraki API Proxy: localhost:'+server.address().address+ ':' +port+'/api');
  console.log('Default API Endpoint: ', configs.apiUrl);
});

