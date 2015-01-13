
var app = require('express')();
var sprintf = require('./sprintf');
var getStockQuotes = require('./stocks');


app.listen(3000, function() {
	console.log("Node app is running at localhost:" + 3000);
});	


	function showWeatherForecast() {
		var getWeatherForecast = require('./weather');

		getWeatherForecast(function(results) {
		
			var messages = [];
		
			for (var index in results) {
				var weather = results[index];
				var text = sprintf('%s %s %dº (%dº)', weather.day, weather.condition, weather.high, weather.low);
				
				var message = {};
				message.message = text;
				message.textcolor = 'blue';

				messages.push(message);
			}
			
			console.log(messages);
			//sendMessage('text', messages);
		});
		
	}


showWeatherForecast();
