
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var schedule = require('node-schedule');

server.listen(port);


app.get('/', function (req, response) {
	response.send("OK");
});



function sendText(text, color) {
	
	if (color == undefined)
		color = 'red';
	
	var msg = {};
	
	msg.type = 'text';
	msg.message = text;
	msg.textcolor = color;
	io.sockets.emit('message', msg);
}


io.on('connection', function (socket) {

	var now = new Date();
	sendText(sprintf("Klockan är %02d:%02d", now.getHours(), now.getMinutes()));
});


function scheduleStockQuotes() {
	var schedule = require('node-schedule');
	var rule = new schedule.RecurrenceRule();
	
	
	rule.minute = [];
	
	for (var i = 0; i < 60; i++) {
		rule.minute.push(i);	
	}
	rule.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	
	schedule.scheduleJob(rule, function() {
		var now = new Date();
		sendText(sprintf("Klockan är %02d:%02d", now.getHours(), now.getMinutes()), 'blue');
	});	
	
}

scheduleStockQuotes();
console.log('OK');



var config = require('./config.js');
var http = require("http");
var sprintf = require('./sprintf');

var socketIO, server;

socketIO = io;

function main() {

	
	// Set my time zone
	process.env.TZ = config.timezone;

	
	function sendMessage(event, data) {

		try {
			console.log('Sending event "%s"', event, data);
			socketIO.sockets.emit(event, data);
		}
		catch (error) {
			console.log('Sending event "%s" failed.', event, data);			
		}
	}
	
	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function choose(items) {
		return items[Math.floor((Math.random() * items.length))];
	}
	


	function addCmd(cmd) {
		var args = cmd.split(' ');
		var name = args[0];
		
		args.shift();
		
		sendMessage('command', {name:name, args:args});	
	}


	function runCmd(text) {
		var match = null;
		
		match = text.match(/\s*@perlin\s*(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-perlin %s', match[1]));
			return;
		}

		match = text.match(/\s*@circle\s*(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-circle %s', match[1]));
			return;
		}
		
		match = text.match(/\s*@life\s*(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-life %s', match[1]));
			return;
		}

		match = text.match(/\s*@wipe\s*(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-wipe %s', match[1]));
			return;
		}

		match = text.match(/\s*@clock\s*(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-clock %s', match[1]));
			return;
		}
		
		match = text.match(/\s*@animation\s+([^-]\S+)(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-animation animations/%s.gif %s', match[1], match[2]));
			return;
		}
		
		match = text.match(/\s*@image\s+([^-]\S+)(.*)/);
		
		if (match != null) {
			addCmd(sprintf('./run-image images/%s.png %s', match[1], match[2]));
			return;
		}

		match = text.match(/\s*@reboot/);
		
		if (match != null) {
			addCmd('reboot');
			return;
		}

		match = text.match('^[ ]*\./run-.+');

		if (match != null) {
			addCmd(text);			
			return;		
		}
		
		sendMessage('text', {message:text, textcolor:'red'});	
		
	}	

	function enableTwitter() {
		var twitterOptions = {};	
		twitterOptions.consumer_key = 'RMvVK1wDXgftuFqVwMZA1OmEG';
		twitterOptions.consumer_secret = 'OlS3UoAMA48ZEWT8Ia2cYYTpZZRWNexBVzfhK84i93BXM1wDpK';
		twitterOptions.access_token = '1241291215-fKIUjhl3LVRO9KHukvb23Srcc4rsD9y4J22ErsL';
		twitterOptions.access_token_secret = 'lECypLbF3bTOd9r09uydHKUffuSS1zF8DgtTMfaGAHtWP';
	
		// The Twitter API
		var twit    = require('twit');
		var twitter = new twit(twitterOptions);
		var stream  = twitter.stream('user', { include_entities : true });

	
		stream.on('tweet', function (tweet) {
	
	
			var text = tweet.text;		
			var strip = text.indexOf('http://');
			
			console.log("tweet:", tweet.text);
	
			var retweet = text.match(/^RT\s+@.*?:\s*(.+)/);
	
			if (retweet == null) {
				// Strip off the trailing #http://...
				text = text.substr(0, strip < 0 ? undefined : strip).trim();
					
					
				if (tweet.user != undefined && tweet.user != null) {
					var profileImageUrl = tweet.user.profile_image_url;
					var profileName = tweet.user.name;
					var profileScreenName = tweet.user.screen_name;
					var now = new Date();
					
					var messages = []; 

					messages.push({
						message: sprintf('%02d:%02d - Twitter - %s - %s', now.getHours(), now.getMinutes(), profileName, text),
						textcolor: "blue"
					});

					sendMessage('text', messages);	
				}
				
			}		
			
		});
		
	};
	/*
	function XXX(count) {
		
		count = Math.max(0, Math.min(60, count));
		
		var step    = Math.round(60 / count);
		var offset  = rand(0, 59);
		var minutes = [];
		var minute  = 0;
		
		
		for (var i = 0, minute = 0; i < count i++, minute += step) {
			minutes.push((minute + offset) % 60);	
		}
		
	}
*/
	
	
	
	function enableRSS(url, feedName) {
		var feedsub = require('feedsub');
		var schedule = require('node-schedule');
	
		var news = [];
		
		var reader = new feedsub(url, {
		  interval: 7, // check feed every 10 minutes,
		  lastDate: new Date()
		});
		
		reader.on('item', function(item) {
			
			console.log("RSS: ", url, item);
			
			if (item.title && item.category && item.pubdate) {
		
				news.push({
					category: item.category, 
					text: item.title,
					date: new Date(item.pubdate)
				});
				
				news.sort(function(a, b) {
					return a.date.valueOf() - b.date.valueOf();
				});
			
				news.splice(0, news.length - 5);		
			}
		
		});
		
		reader.start();
	
		var displayTime = rand(0, 59);
		
		var rule = new schedule.RecurrenceRule();		
		rule.minute = [displayTime, (displayTime + 30) % 60];
		//rule.hour = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

		schedule.scheduleJob(rule, function() {
	
			if (news.length > 0) {
				console.log("Bringing on the news...");
				
				var messages = [];
				var message = {};
				var now = new Date();
				var color = "red";
				
				messages.push({
					message: sprintf("%02d:%02d - RSS - %s ", now.getHours(), now.getMinutes(), feedName),
					textcolor: color
				});
				
				for (var i = 0; i < news.length; i++) {
					messages.push({
						message: sprintf("%s - %s", news[i].category, news[i].text),
						textcolor: color
					});
				}
				
				sendMessage('text', messages);	
				
			}
		});
		
	}

	function scheduleAnimations() {
		var rule, schedule = require('node-schedule');

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		
		schedule.scheduleJob(rule, function() {
			sendMessage('message', {
				type: 'command',
				name: './run-perlin',
				args: ['-d', 60]
			});
		});	

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('message', {
				type: 'command',
				name: './run-circle',
				args: ['-d', 60]
			});
		});		

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('message', {
				type: 'command',
				name: './run-life',
				args: ['-d', 60]
			});
		});		

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('animation', {
				name: 'pacman.gif',
				duration: 60
			});
		});		

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('animation', {
				name: 'fireplace.gif',
				duration: 60
			});
		});		

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('animation', {
				name: 'bubbles.gif',
				duration: 60
			});
		});		

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('animation', {
				name: 'tree.gif',
				iterations: 1
			});
		});		


		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			sendMessage('command', {
				name: './run-twinkle',
				args: ['-d', 60]
			});
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = [15, 30, 45];
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		
		schedule.scheduleJob(rule, function() {
			var now = new Date();		

			sendMessage('text', {
				message: sprintf('%02d:%02d', now.getHours(), now.getMinutes()),
				textcolor: 'red',
				iterations: 2
			});

		});		


	}
	
	function showNightMode() {
		sendMessage('message', {
			type: 'settings',
			animation: {
				command:'./run-clock',
				args: ['-d', -1]
				
			}
		});

		
	}

	function scheduleNightMode() {
		var schedule = require('node-schedule');
		var rule = new schedule.RecurrenceRule();
		
		rule.hour = 23;
		rule.minute = 30;

		schedule.scheduleJob(rule, function() {
			showNightMode();

		});		

		
	}
	
	function showDayMode() {
			
		sendMessage('message', {
			type: 'settings',
			animation: {
				command:'./run-rain',
				args: ['-d', -1]
				
			}
		});
		
	}

	function scheduleDayMode() {
		var schedule = require('node-schedule');
		var rule = new schedule.RecurrenceRule();

		rule.hour = 7;
		rule.hour = 30;

		schedule.scheduleJob(rule, function() {
			showDayMode();
		});		

		
	}

	function schedulePing() {
		var schedule = require('node-schedule');

		function ping() {
		
			console.log("Pinging...");
			
			var options = {};
			options.host = "akuru.herokuapp.com";
			options.path = "/hello";
			
			var request = http.request(options, function(response) {
				
			});
			
			request.end();
		}
		
		var rule = new schedule.RecurrenceRule();
		rule.minute = [0,15,30,45];
		
		schedule.scheduleJob(rule, function() {
			ping();	
		});
	}
	
	
	function showStockQuotes() {
		var getStockQuotes = require('./stocks');

		getStockQuotes(config.stocks.tickers, function(quotes) {
			var messages = [];
						
			for (var index in quotes) {
				var quote = quotes[index];
				var text = sprintf('%s %s', quote.symbol, quote.change);
				
				var message = {};
				message.message = text;
				message.textcolor = parseFloat(quote.change) < 0 ? 'red' : 'blue';

				messages.push(message);
				console.log(text);
			}
			
			sendMessage('text', messages);
			//console.log(messages);
			
		});
		
	}

	function scheduleStockQuotes() {
		var schedule = require('node-schedule');
		var rule = new schedule.RecurrenceRule();
		
		rule.minute = [10, 20, 30, 40, 50];
		rule.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
		
		schedule.scheduleJob(rule, function() {
			showStockQuotes();
		});	
		
	}

	function showWeatherForecast() {
		var getWeatherForecast = require('./weather');

		getWeatherForecast(function(results) {
		
			var messages = [];
		
			for (var index in results) {
				var weather = results[index];
				var text = sprintf('%s - %s, %dº (%dº)', weather.day, weather.condition, weather.high, weather.low);
				
				var message = {};
				message.message = text;
				message.textcolor = 'blue';

				messages.push(message);
			}
			
			console.log(messages);
			sendMessage('text', messages);
		});
		
	}
	

	function scheduleWeatherForecast() {
		var schedule = require('node-schedule');
		var getWeatherForecast = require('./weather');

		var rule = new schedule.RecurrenceRule();
		rule.minute = [15, 25, 35, 45, 55];
		rule.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
		
		schedule.scheduleJob(rule, function() {
			showWeatherForecast();
		});	
		
		
	}
	
/*
	function startServer() {
		var express = require("express");
		var bodyParser = require('body-parser');
		var app = express();
		var port = process.env.PORT || 5000;
	
		app.use(express.static(__dirname + "/"))
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		
		var server = http.createServer(app);
		
		server.listen(port, function() {
			console.log("Server is listening on port %d...", port);
		});
		
		app.post('/text', function(request, response) {
			sendMessage('text', request.body);	
			response.send("OK");
		});

		app.post('/message', function(request, response) {
			sendMessage('message', request.body);	
			response.send("OK");
		});
		
		app.get('/hello', function(request, response) {
		
			console.log("Got HELLO request...");
			
			var reply = {};
			reply.message = "Hello";
		
			response.json(reply);
		})
		
		
		return server;
	}

*/
	function enableGoogleTalk() {
		var hangoutsBot = require("hangouts-bot");
		var bot = new hangoutsBot("golvettippar@gmail.com", "potatismos");
		
		console.log('Starting Google Talk...');
		
		bot.on('online', function() {
		
			// Make sure it doesn't time out
			bot.connection.connection.socket.setTimeout(0);
			bot.connection.connection.socket.setKeepAlive(true, 10000);

			sendMessage('text', {message:'Google Talk online...'});	

		    console.log('Google Talk online...');
		});
		
		bot.on('message', function(from, message) {
			var text = {}; 

			message = message.replace(new RegExp('”', 'g'), '"');
			console.log(from, message);
						
			try {
				var json = JSON.parse(message);
				bot.sendMessage(from, "OK, one moment...");
				sendMessage('message', json);
			}
			catch (error) {
				message = message.replace(new RegExp('"', 'g'), '”');
				runCmd(message);
				bot.sendMessage(from, sprintf("OK, %s", message));
				
			}

		});		
	}
/*	
	function startSocketIO(server, connected) {
		var io = require('socket.io')(server);
		
		io.on('connection', function(socket) {
			console.log("Socket IO Connection!");
			console.log(socket);
			connected();
		});

		return io;
	}
*/

	enableRSS('http://www.svd.se/?service=rss&type=latest', "SvD");
	enableRSS('http://www.sydsvenskan.se/rss.xml', "SDS");
	enableRSS('http://www.di.se/rss', "DI");
	enableRSS('http://news.google.com/news?pz=1&cf=all&ned=sv_se&hl=sv&topic=h&num=3&output=rss', "Google");

	enableTwitter();
	enableGoogleTalk();

	scheduleAnimations();
	schedulePing();
	scheduleStockQuotes();
	scheduleWeatherForecast();
	scheduleDayMode();
	scheduleNightMode();

/*	
	server = startServer();	

	console.log('Starting socket-io...');
	
	socketIO = startSocketIO(server, function() {
	
		
		
		
	});
	
*/
	{
	}


}

//main();


