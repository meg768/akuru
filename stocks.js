

function getStockQuotes(symbols, callback) {
	
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

				var stocks = [];
				
				for (var index in quotes) {
					var quote = quotes[index];
					stocks.push({symbol:quote.symbol, change:quote.PercentChange});	
				}
			
					
				callback(stocks);				
			}
			else
				throw new Error('Invalid status code');
		}
		catch(error) {
			console.log(error);
				
		}
		
	});
}


module.exports = getStockQuotes;


