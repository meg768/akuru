

	var app = require('express')();
	var sprintf = require('./sprintf');

	
	app.listen(3000, function() {
		console.log("Node app is running at localhost:" + 3000);
	});	
	





function enableStockQuotes() {
	var rule, schedule = require('node-schedule');


	function display(text) {
		console.log(text);
		
	}
	function getStockQuotes(symbols, callback) {
		
		var request = require('request');
		var util = require('util');
		var tickers = '';
		
		for (var index in symbols) {
			if (tickers != '')
				tickers += ', ';
				
			tickers += '"' + symbols[index] + '"';
		}
	
		var url = sprintf('https://query.yahooapis.com/v1/public/yql?q=%s&format=%s&env=%s&callback=%s', encodeURIComponent(sprintf('select * from yahoo.finance.quote where symbol in (%s)', tickers)), 'json', encodeURIComponent('store://datatables.org/alltableswithkeys'), '');
	
		request(url, function (error, response, body) {
			try {
				if (error)
					throw error;
					
				if (response.statusCode == 200) {
					var json = JSON.parse(body);
					var quotes = json.query.results.quote;
					
					if (!util.isArray(quotes))
						quotes = [quotes];
	
					// Convert to numbers
					for (var index in quotes) {
						var quote = quotes[index];
						console.log(quote);
						
						quote.Change = parseFloat(quote.Change);
						quote.AverageDailyVolume = parseFloat(quote.AverageDailyVolume);
						quote.Volume = parseFloat(quote.Volume);
						quote.LastTradePriceOnly = parseFloat(quote.LastTradePriceOnly);
					}
				
						
					callback(quotes);				
				}
				else
					throw new Error('Invalid status code');
			}
			catch(error) {
				console.log(error);
					
			}
			
		});
	}

	
	function foo() {
		getStockQuotes(['PFE', 'PHI.ST', 'HM-B.ST', 'ARCC', 'NCC-B.ST', 'INDU-C.ST', 'SHB-B.ST', 'COS.TO', 'CAST.ST'], function(quotes) {
		
			
			for (var index in quotes) {
				var quote = quotes[index];
				var percentPris = (1 - ((quote.LastTradePriceOnly - quote.Change) / quote.LastTradePriceOnly)) * 100;
				var percentOmsattning = 100 * ((quote.Volume / quote.AverageDailyVolume) - 1);
				var text = '';
				
				text += quote.symbol + ' ';;
				text += percentPris > 0 ? sprintf('+%.2f%% ', percentPris) : sprintf('%.2f%% ', percentPris);
				text += percentOmsattning > 0 ? sprintf('+%.0f%%', percentOmsattning) : sprintf('%.0f%%', percentOmsattning);
				
				display(text);
			}
		
			
		});
		
	}

	foo();
	
	rule = new schedule.RecurrenceRule();
	rule.minute = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 3, 34, 35, 36, 37, 38, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
//	rule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
	
	schedule.scheduleJob(rule, function() {
		foo();
	});	
	
}

enableStockQuotes();
