var fs = require('fs');
var _static = require('node-static');
var https = require('https');

var properties ={       
    "hostname"      : "host",        
    "enviornment"   : "local",        
    "host"          : "localhost",
    "jsdebug"       :  true,          
    "httpsPort"     :  8084
};

var file = new _static.Server("./", {
    cache: 3600,
    gzip: true,
    indexFile: "index.html"
});

var options = {
  key: fs.readFileSync('/etc/apache2/ssl/villageexperts.key'),
  cert: fs.readFileSync('/etc/apache2/ssl/ed0be9191f0a4d2e.crt'),
  ca: fs.readFileSync('/etc/apache2/ssl/gd_bundle-g2-g1.crt'),
  requestCert: true,
  rejectUnauthorized: false
};

/*var options = {
  key: fs.readFileSync('ssl_certs/server.key'),
  cert: fs.readFileSync('ssl_certs/server.crt'),
  ca: fs.readFileSync('ssl_certs/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};*/

var app = https.createServer(options, function(request, response){
        request.addListener('end', function () {
        file.serve(request, response);
    }).resume();     
});
app.listen(properties.httpsPort);

var _realtimecomm=require('./node_modules/webrtcdevelopment/client/build/minScripts/webrtcdevelopmentServer.js').realtimecomm;
var realtimecomm= _realtimecomm(app, properties , function(socket) {
    try {
        var params = socket.handshake.query;

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {}
        });
    } catch (e) {}
});

var _restapi= require('./node_modules/webrtcdevelopment/client/build/minScripts/webrtcdevelopmentServer.js').restapi;
var restapi=_restapi(realtimecomm, options ,app, properties);

console.log("< ------------------------ HTTPS Server -------------------> ");
console.log(" WebRTC server env => "+ properties.enviornment+ " running at\n "+properties.httpsPort+ "/\nCTRL + C to shutdown");
