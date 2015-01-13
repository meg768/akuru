
var app = require('express')();
var sprintf = require('./sprintf');
var getWeatherForecast = require('./weather');
var getStockQuotes = require('./stocks');


app.listen(3000, function() {
	console.log("Node app is running at localhost:" + 3000);
});	


getWeatherForecast(function(results) {


	for (var index in results) {
		var weather = results[index];
		var text = sprintf('%s %s %dº (%dº)', weather.day, weather.condition, weather.high, weather.low);
		
		console.log(text);
	}
});

getStockQuotes(['PFE', 'PHI.ST', 'HM-B.ST', 'ARCC', 'NCC-B.ST', 'INDU-C.ST', 'SHB-B.ST', 'COS.TO', 'CAST.ST'], function(results) {


	for (var index in results) {
		var quote = results[index];
		var text = sprintf('%s %s', quote.symbol, quote.change);
		
		console.log(text);
	}
});


