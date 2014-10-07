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

/*
var server = http.createServer(app);
server.listen(port);
*/

var rule = new schedule.RecurrenceRule();
rule.minute = [0,5,10,15,20,25,30,35,40,45,50,55];

var job = schedule.scheduleJob(rule, function() {
	var text = {};
	var now = Date();

	text.message = "  5 minutes has passed since last time...    ";
	text.color = "blue";
	text.command = "text";
	
	console.log("Scheduling!");	
	pusher.trigger('test_channel', 'go', text);	
});


function ping() {

	console.log("Pinging...");
	
	var options = {};
	options.host = "akuru.herokuapp.com";
	options.path = "/hello";
	
	var request = http.request(options, function(response) {
		
	});
	
	request.end();

	console.log("Done pinging...");
}
/*
rule = new schedule.RecurrenceRule();
rule.minute = [0,15,30,45];

schedule.scheduleJob(rule, function() {
	ping();	
});
*/
app.post('/go', function(request, response) {
	pusher.trigger('test_channel', 'go', request.body);	
	response.send("OK");
});


app.post('/text', function(request, response) {
	pusher.trigger('test_channel', 'text', request.body);	
	response.send("OK");
});

app.post('/display', function(request, response) {
	pusher.trigger('test_channel', 'display', request.body);	
	response.send("OK");
});

app.post('/scroll', function(request, response) {
	pusher.trigger('test_channel', 'scroll', request.body);	
	response.send("OK");
});

app.post('/animate', function(request, response) {
	pusher.trigger('test_channel', 'animate', request.body);	
	response.send("OK");
});


app.post('/game-of-life', function(request, response) {
	response.send("Nope!");
});


app.post('/hue-square', function(request, response) {
	response.send("Nope!");
});



app.get('/', function(request, response) {
  response.json({message:'Hello World!' , postgres:process.env.DATABASE_URL, port:process.env.PORT});

})

app.get('/hello', function(request, response) {

	console.log("Got HELLO request...");
	
	var reply = {};
	reply.message = "Hello";

	response.json(reply);
})



app.listen(app.get('port'), function() {
	//ping();
	console.log("Node app is running...");
})


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

