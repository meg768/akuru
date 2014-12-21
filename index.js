var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var schedule = require('node-schedule');



process.env.TZ = 'Europe/Stockholm';
	
	
	
	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function choose() {
		return arguments[rand(0, arguments.length - 1)];
	}



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


function choose(items) {
	return items[Math.floor((Math.random() * items.length))];
}


function addCmd(cmd) {
	pusher.trigger('test_channel', 'command', cmd);	
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
	


	
	stream.on('direct_message', function (message) {
		
		console.log("Direct message:", message.direct_message.text);
		
		var texts = message.direct_message.text.split('\n');
		
		for (var index in texts) {
			var text = texts[index];
			var match = null;
			
			match = text.match(/\s*@perlin\s*(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-perlin %s', match[1]));
				continue;
			}

			match = text.match(/\s*@circle\s*(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-circle %s', match[1]));
				continue;
			}
			
			match = text.match(/\s*@life\s*(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-life %s', match[1]));
				continue;
			}

			match = text.match(/\s*@wipe\s*(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-wipe %s', match[1]));
				continue;
			}

			match = text.match(/\s*@clock\s*(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-clock %s', match[1]));
				continue;
			}
			
			match = text.match(/\s*@animation\s+([^-]\S+)(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-animation images/%s.gif %s', match[1], match[2]));
				continue;
			}
			
			match = text.match(/\s*@image\s+([^-]\S+)(.*)/);
			
			if (match != null) {
				addCmd(sprintf('./run-image images/%s.png %s', match[1], match[2]));
				continue;
			}

			match = text.match(/\s*@reboot/);
			
			if (match != null) {
				addCmd('reboot');
				continue;
			}

			match = text.match('^[ ]*\./run-.+');

			if (match != null) {
				addCmd(text);			
				continue;		
			}
			
			addCmd(sprintf('./run-text "%s" -c blue', text));
		} 

	});


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
	
				addCmd(sprintf('./run-text "%s" -c blue', profileName));	
				addCmd(sprintf('./run-text "%s" -c red', text));
			}
			
		}		
		
	});
	
};


function showNewsFeed() {
	var feedsub = require('feedsub');
	var schedule = require('node-schedule');

	var news = [];
	
	var reader = new feedsub('http://www.svd.se/?service=rss&type=latest', {
	  interval: 7, // check feed every 10 minutes,
	  lastDate: new Date()
	});
	
	reader.on('item', function(item) {
		
		if (item.title && item.category && item.pubdate) {
	
			news.push({
				category: item.category, 
				text: item.title,
				date: new Date(item.pubdate)
			});
			
			news.sort(function(a, b) {
				return a.date.valueOf() - b.date.valueOf();
			});
		
			news.splice(0, news.length - 3);		
		}
	
	});
	
	reader.start();

	var rule = new schedule.RecurrenceRule();
	rule.minute = [5, 15, 25, 35, 45, 55];
	
	schedule.scheduleJob(rule, function() {

		console.log("Bringing on the news...");
		
		var message = {};
		message.message = "{%HH}:{%MM}";
		message.textcolor = choose(["red", "blue", "yellow"]);
		
		pusher.trigger('test_channel', 'text', message);	

		for (var i = 0; i < news.length; i++) {

			message.message = news[i].category + " - " + news[i].text;			
			pusher.trigger('test_channel', 'text', message);	
		}
	});
	
}


	function scheduleAnimations() {
		var rule, schedule = require('node-schedule');

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		rule.hour = [8, 9, 10, 17, 18, 19, 20, 21, 22, 23];
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-perlin -d 60'));
		});	

		rule = new schedule.RecurrenceRule();
		rule.hour = [8, 9, 10, 17, 18, 19, 20, 21, 22, 23];
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-circle -d 30'));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-life -d 30'));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-animation images/pacman.gif'));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-animation images/fireplace.gif -d 30'));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-animation images/bubbles.gif -d 30'));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-animation images/tree.gif'));
		});		


		rule = new schedule.RecurrenceRule();
		rule.minute = rand(0, 59);
		
		schedule.scheduleJob(rule, function() {
			addCmd(sprintf('./run-twinkle -d 30'));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = [15, 30, 45];
		rule.hour = [0, 1, 2, 3, 4, 5, 6, 7, 23];
		
		schedule.scheduleJob(rule, function() {
			var now = new Date();		
			addCmd(sprintf('./run-text "%02d:%02d" -i 2 -c red', now.getHours(), now.getMinutes()));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = [15, 30, 45];
		rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		
		schedule.scheduleJob(rule, function() {
			var now = new Date();		
			addCmd(sprintf('./run-text "%02d:%02d" -i 2 -c blue', now.getHours(), now.getMinutes()));
		});		

		rule = new schedule.RecurrenceRule();
		rule.minute = 10;
		
		schedule.scheduleJob(rule, function() {
			var now = new Date();		
			addCmd(sprintf('./run-image images/smiley.png -s '));
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

showNewsFeed();
schedulePing();
enableTwitter();
scheduleAnimations();

console.log(new Date());

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


