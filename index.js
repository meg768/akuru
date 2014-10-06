var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var schedule = require('node-schedule');





// ??
app.use(express.static(__dirname + "/"))



console.log("Initiating pusher...");

var pusher = new Pusher({ 
	appId: '90574',
	key: '062bc67be8d42e4ded9b',
	secret: '4f7560f8aa5001483c7f'
});


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));


var server = http.createServer(app);
server.listen(port);


var rule = new schedule.RecurrenceRule();
rule.minute = [0,5,10,15,20,25,30,35,40,45,50,55];

var job = schedule.scheduleJob(rule, function() {
	var text = {};
	var now = Date();

	console.log("Scheduling!");	
	text.text = "HEJHEJHEJHEJ";
	displayText(text);
});


function displayText(params) {

	var cmd = "text ";
	
	if (params.text != undefined)
		cmd += " -t " + params.text + " ";

	if (params.color != undefined)
		cmd += " -c " + params.color + " ";
		
	if (params.ptsize != undefined)
		cmd += " -p " + params.ptsize + " ";
		
	cmd += "\n";
			
	console.log("Triggering '%s'...", cmd);
	pusher.trigger('test_channel', 'my_event', cmd + "\n");	

}


app.post('/text', function(request, response) {

	console.log("Got POST!");
	
	displayText(request.body);

	response.send("OK");
});

app.post('/display', function(request, response) {

	console.log("Processing POST /display...");
	
	var body = request.body;
	var cmd = "display ";
	
	if (body.image != undefined)
		cmd += " -f " + body.image + " ";

	console.log("Triggering %s", cmd);
	pusher.trigger('test_channel', 'my_event', cmd + "\n");	

	response.send(cmd);
	
	console.log("Processing POST /display finished.");

});

app.post('/game-of-life', function(request, response) {

	var body = request.body;
	var cmd = "life ";
	
	pusher.trigger('test_channel', 'my_event', cmd + "\n");	

	response.send(cmd);
});

app.post('/hue-square', function(request, response) {

	var body = request.body;
	var cmd = "hue-block ";
	
	pusher.trigger('test_channel', 'my_event', cmd + "\n");	

	response.send(cmd);
});




/*
function db(ws) {
	console.log("getting ps");
	pg = require("pg");
	console.log("connecting to %s", process.env.DATABASE_URL);

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		console.log("quering...");
		client.query('SELECT * FROM test_table', function(err, result) {
			console.log("YES!");

			done();
			if (err)
				{ console.error(err); ws.send(err); }
			else
				{ ws.send("OK!!!!"); }
		});
	});

};

*/

app.get('/', function(request, response) {
  response.json({message:'Hello World!' , postgres:process.env.DATABASE_URL, port:process.env.PORT});

})

app.get('/hello', function(request, response) {
	var foo = {};
	foo.message = "Hej";
	foo.kalle = "olle";
	foo.MEG = "HEJ!!";
	foo.requestbody =  request.body;

	response.json(foo);
//  response.json({message:'Hello World!' , postgres:process.env.DATABASE_URL, port:process.env.PORT});

})

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + port);
})




/*

url: postgres://zmqeszuvhwmooa:ov0vcsWLVsLQczUE4JdiwymI9N@ec2-54-225-156-230.compute-1.amazonaws.com:5432/ddidqfrm0e850n
host: ec2-54-225-156-230.compute-1.amazonaws.com
database: ddidqfrm0e850n
user: zmqeszuvhwmooa
port: 5432
password: ov0vcsWLVsLQczUE4JdiwymI9N
*/

/*

var WebSocketServer = require("ws").Server
var http = require("http")
var express = require('express')
var app = express();






app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.json({message:'Hello World!' , postgres:process.env.DATABASE_URL, port:process.env.PORT});

})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})




var server = http.createServer(app);
server.listen(8080);

console.log("http server listening on %d", 8080)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})



var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '90574',
  key: '062bc67be8d42e4ded9b',
  secret: '4f7560f8aa5001483c7f'

  encrypted: ENCRYPTED, // optional, defaults to false
  host: 'HOST', // optional, defaults to api.pusherapp.com
  port: PORT, // optional, defaults to 80 for unencrypted and 443 for encrypted


});

var pg = require('pg');

app.get('/db', function (request, response) {

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
	pusher.trigger('test_channel', 'my_event', { message: "hello world" });

      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})

*/

