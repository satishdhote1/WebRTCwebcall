var fs = require('fs');
var _static = require('node-static');
var https = require('https');
var file = new _static.Server('./client/build', {
    cache: 3600,
    gzip: true,
    indexFile: "index.html"
});

/*var app = require('http').createServer(function (request, response) {

    //console.log(" app request recived "+ request );

    request.addListener('end', function () {
        file.serve(request, response, function (e, res) {
            if (e && (e.status === 404)) { 
                file.serveFile('/not-found.html', 404, {}, request, response);
            }
        });
    }).resume();

});*/


var sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  ca: fs.readFileSync('ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};

var app = https.createServer(sslOptions, function(request, response){
        request.addListener('end', function () {
        file.serve(request, response);
    }).resume();     
});

/*app.get('/getSession', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
    res.end(" Hello ");
})*/

var io = require('socket.io').listen(app, {
    log: false,
    origins: '*:*'
});

io.set('transports', [
    'websocket'
]);

var channels = {};

io.sockets.on('connection', function (socket) {

    console.log(" ------IO socket connection---------socket");

    var initiatorChannel = '';

    if (!io.isConnected) {
        io.isConnected = true;
    }

    socket.on('new-channel', function (data) {  
        console.log("IO socket connection------------------------ new channel ");    
        if (!channels[data.channel]) {
            initiatorChannel = data.channel;
        }

        channels[data.channel] = data.channel;     
        onNewNamespace(data.channel, data.sender);
    });


    socket.on('presence', function (channel) {
        console.log("IO socket connection------------------------ presence ");        
        var isChannelPresent = !! channels[channel.channel];
        socket.emit('presence', isChannelPresent);

    });

    socket.on('disconnect', function (channel) {
        console.log("IO socket connection------------------------ disconnect ");
    });

});

function onNewNamespace(channel, sender) {
    console.log(" ------On New Namespace--------- channel :",channel, " || sender :", sender);
    
    io.of('/' + channel).on('connection', function (socket) {
        
        var username;
        
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            console.log("On New Namespace------------------------ message ");
            if (data.sender == sender) {
                console.log("broadcasting everywhere : ",data.data , "|| Sender :", data.data.sender )
                if(!username) username = data.data.sender;                
                socket.broadcast.emit('message', data.data);
            }
        });
        
        socket.on('disconnect', function() {
            console.log("On New Namespace------------------------ disconnect userleft");
            if(username) {
                socket.broadcast.emit('user-left', username);
                username = null;
            }
        });
    });
}

app.listen(8084);

//console.log("-------- server started on 8084 -------");

/*var secureServer = https.createServer(sslOptions,app).listen('8084', function(){
  console.log("Secure server listening on port 8084");
});*/


/*var restify = require('restify');

function respond(req, res, callback) {

    res.setHeader('Access-Control-Allow-Origin','*');
    var channelname= req.params.name;
    channels[channelname] = channelname;     
    onNewNamespace(channelname,"SP");
    res.json({ type:true, name:channelname, url:"http://52.8.183.220:8084/#/"+channelname+"?s=1" });
    callback();
}

var server = restify.createServer();

server.get('/newsession/:name',respond);

server.use(restify.jsonp());

server.listen(8086, function() {
  console.log('%s listening at %s', server.name, server.url);
});*/