var request = require('request');
var cheerio = require('cheerio');
var url = './test.html';
request(url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a'); //jquery get all hyperlinks
  $(links).each(function(i, link){
    console.log(i)
    console.log($(link).text() + ':\n  ' + $(link).attr('href'));
  });
});
