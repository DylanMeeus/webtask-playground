var request = require('request');
var cheerio = require('cheerio');


// application variables
var slackURL = "ENTER_SLACK_WEBHOOK_URL";
var username = "webtask.io bot";

module.exports = function (context,cb) {


    var keyword = context.data.wiki;
    // get wiki info and post to slack.
    getWikiInfo(keyword);
    cb(null, 'Posted information about ' + keyword + ' to slack');
    
}


function getWikiInfo(keyword)
{
    console.log("getting wikipedia information");
    var wikiURL = 'https://en.wikipedia.org/wiki/' + keyword;

    console.log("fetching information from: " + wikiURL);

    request(wikiURL, function(error,response,body){
	if(!error && response.statusCode == 200){
	    var $ = cheerio.load(body);
	    var wikiInfo = $("#mw-content-text > p").first().text();

	    // we post this to slack, but add a link to the origin as well.
	    wikiInfo += " *... read more:* " + wikiURL.replace(' ','%20');
	    slackPost(wikiInfo);
	}
    });
}

function slackPost(wikiInfo)
{
    var slack_data = {
	'text':wikiInfo,
	'username' : 'wiki bot'
    };

    var opts = {
	method : 'POST',
	url : slackURL,
	headers : {
	    'Content-Type' : 'application/json'
	},
	json : slack_data
    };

    request(opts, function(error,response,body){
	if(!error)
	{
	    console.log("posted successfully");
	}
    });
    
}
