var schedule = require('node-schedule');
var util     = require('util');
var events   = require('events');
var random   = require('./random');

module.exports = function(symbols) {

	var self = this;
	
	
	self.fetch = function() {
		
		var request = require('request');
		var util = require('util');
		var tickers = '';
		
		for (var index in symbols) {
			if (tickers != '')
				tickers += ', ';
				
			tickers += '"' + symbols[index] + '"';
		}
	
		var url = '';
	
		url += 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(';
		url += encodeURIComponent(tickers);
		url += ')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
		
		console.log(decodeURIComponent(url));
		
		request(url, function (error, response, body) {
			try {
				if (error)
					throw error;
					
				if (response.statusCode == 200) {
					var json = JSON.parse(body);
					var quotes = json.query.results.quote;
					
					if (!util.isArray(quotes))
						quotes = [quotes];
	
					for (var index in quotes) {
						var quote = quotes[index];
						self.emit('quote', quote.symbol, parseFloat(quote.PercentChange));
					}
				}
				else
					throw new Error('Invalid status code');
			}
			catch(error) {
				console.log(error);
					
			}
			
		});
	}
	
	
	
	self.schedule = function() {
		var rule = new schedule.RecurrenceRule();		
		
		rule.minute = new schedule.Range(0, 59, 13);
		rule.hour   = new schedule.Range(7, 23);
	
		var job = schedule.scheduleJob(rule, function() {
			self.fetch();
		});
		
	}

	
}


	
util.inherits(module.exports, events.EventEmitter);


