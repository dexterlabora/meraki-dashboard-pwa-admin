var request = require('request');

// Recursive function to follow Meraki API redirects
var requestMeraki = function (options, callback){  
    //console.log('REQUEST: ', options.url);
    //console.log('OPTIONS: ', options);
    request(options, function(error, res, data) {
        //console.log('RESPONSE:   [ ' + res.statusCode + ' ]');
        if (error) {
            //console.log('ERROR: ',error);
            return callback(error);
        } else {
            if ((res.statusCode == '308' || '307' || '302' || '301') && res.headers.location){ 
                options.url = res.headers.location;
                //console.log('REDIRECT, recursive request to ',options.url);
                return requestMeraki(options, function(err, res, data){return callback(err, res, data)});
            }else{
                console.log("FINISHED: ", data)
                return callback(error, res, data);
            }
        }
    });
}

module.exports = requestMeraki;
