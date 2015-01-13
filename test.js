
var app = require('express')();
var sprintf = require('./sprintf');
var getStockQuotes = require('./stocks');

/*

app.listen(3000, function() {
	console.log("Node app is running at localhost:" + 3000);
});	

*/
	function showStockQuotes() {
		var getStockQuotes = require('./stocks');

		getStockQuotes(['PFE', 'PHI.ST', 'HM-B.ST', 'ARCC', 'NCC-B.ST', 'INDU-C.ST', 'SHB-B.ST', 'COS.TO', 'CAST.ST'], function(quotes) {
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
			
			//sendMessage('text', messages);
			console.log(messages);
			
		});
		
	}


showStockQuotes();
