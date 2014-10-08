var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var schedule = require('node-schedule');




(function() {
	
	sprintf = function() {
	
		function str_repeat(i, m) {
			for (var o = []; m > 0; o[--m] = i);
			return o.join('');
		}
	
		var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
		while (f) {
			if (m = /^[^\x25]+/.exec(f)) {
				o.push(m[0]);
			}
			else if (m = /^\x25{2}/.exec(f)) {
				o.push('%');
			}
			else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
				if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
					throw('Too few arguments.');
				}
				if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
					throw('Expecting number but found ' + typeof(a));
				}
				switch (m[7]) {
					case 'b': a = a.toString(2); break;
					case 'c': a = String.fromCharCode(a); break;
					case 'd': a = parseInt(a); break;
					case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
					case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
					case 'o': a = a.toString(8); break;
					case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
					case 'u': a = Math.abs(a); break;
					case 'x': a = a.toString(16); break;
					case 'X': a = a.toString(16).toUpperCase(); break;
				}
				a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
				c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
				x = m[5] - String(a).length - s.length;
				p = m[5] ? str_repeat(c, x) : '';
				o.push(s + (m[4] ? a + p : p + a));
			}
			else {
				throw('Huh ?!');
			}
			f = f.substring(m[0].length);
		}
		return o.join('');
	}
	
})();
	


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
server.listen(port, function() {
	console.log("Server is listening...");
});

var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(1, 59); //[0,5,10,15,20,25,30,35,40,45,50,55];



function choose(items) {
	return items[Math.floor((Math.random() * items.length))];
}

function displayTime() {
	
	var rule = new schedule.RecurrenceRule();
	rule.minute = new schedule.Range(0, 59, 1 + Math.floor((Math.random() * 5)));
	rule.minute = new schedule.Range(0, 59, 1);

	schedule.scheduleJob(rule, function() {
		
		var message = {};
		message.type = "text";
		message.message = "    {%HH}:{%MM}    {%HH}:{%MM}    {%HH}:{%MM}";
		message.textcolor = choose(["red", "blue", "yellow"]);
		
		pusher.trigger('test_channel', 'message', message);	
	});
}	

	
// Display image
function displayImages() {
	
	var rule = new schedule.RecurrenceRule();
	rule.minute = new schedule.Range(0, 59, 1 + Math.floor((Math.random() * 5))); //[0,5,10,15,20,25,30,35,40,45,50,55];
	rule.minute = new schedule.Range(0, 59, 1);

	schedule.scheduleJob(rule, function() {
		
		var message = {};
		message.type      = "image";
		message.name      = choose(["smiley.png", "smiley-lady.png", "smiley-angry.png", "smiley-grin.png", "smiley-sad.png", "candy.png"]);
		message.scrollin  = choose(["left","top","right","bottom"]);
		message.scrollout = choose(["left","top","right","bottom"]);
		message.duration  = 3;

		pusher.trigger('test_channel', 'message', message);	
	});
}
	
// Display animations
function displayAnimations() {
	
	var rule = new schedule.RecurrenceRule();
	rule.minute = new schedule.Range(0, 59, 1 + Math.floor((Math.random() * 5))); //[0,5,10,15,20,25,30,35,40,45,50,55];
	rule.minute = new schedule.Range(0, 59, 1);

	schedule.scheduleJob(rule, function() {
		
		var message = {};
		message.type     = "animation";
		message.name     = choose(["snow.gif", "bubbles.gif", "dancer.gif", "rain.gif", "boat.gif", "boxer.gif", "pacghosts.gif", "pacghosts.gif", "fireplace.gif", "squares.gif"]);
		message.duration = 10;
		
		pusher.trigger('test_channel', 'message', message);	
	});
}
	
// Display games
function displayGames() {
	
	var rule = new schedule.RecurrenceRule();
	rule.minute = new schedule.Range(0, 59, 1 + Math.floor((Math.random() * 5))); //[0,5,10,15,20,25,30,35,40,45,50,55];
	rule.minute = new schedule.Range(0, 59, 1);

	schedule.scheduleJob(rule, function() {
		
		var message = {};
		message.type      = "game";
		message.name      = choose(["life", "static"]);

		pusher.trigger('test_channel', 'message', message);	
	});
}


function schedulePing() {
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
	
	var rule = new schedule.RecurrenceRule();
	rule.minute = [0,15,30,45];
	
	schedule.scheduleJob(rule, function() {
		ping();	
	});
}


app.post('/message', function(request, response) {
	console.log(request.body);
	pusher.trigger('test_channel', 'message', request.body);	
	response.send("OK");
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
	console.log("Node app is running...");
})

displayTime();
displayImages();
displayAnimations();
displayGames();

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

