
var app = require('express')();
var sprintf = require('./sprintf');
var getStockQuotes = require('./stocks');
var config = require('./config');
var display = require('./display');

/*

app.listen(3000, function() {
	console.log("Node app is running at localhost:" + 3000);
});	

*/

function enableRSS() {

	var RSS = require('./rss');
	var rss = new RSS();

	rss.subscribe('SvD', 'http://www.svd.se/?service=rss&type=latest');
	rss.subscribe('SDS', 'http://www.sydsvenskan.se/rss.xml');
	rss.subscribe('Di', 'http://www.di.se/rss');
	rss.subscribe('Google', 'http://news.google.com/news?pz=1&cf=all&ned=sv_se&hl=sv&topic=h&num=3&output=rss');
	
	rss.on('feed', function(name, date, category, text) {
		console.log('FEED', name, date, category, text);

		sendText(sprintf('%s - %s - %s', name, category, text));
	});
}


enableRSS();