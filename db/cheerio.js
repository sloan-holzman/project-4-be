var request = require('request');
var cheerio = require('cheerio');
var url = 'https://www.raise.com/gift-card-balance';
request(url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a:contains("Gift Card Balance")');; //jquery get all hyperlinks
  $(links).each(function(i, link){
    console.log(i)
    console.log($(link).text().replace(' Gift Card Balance','').toLowerCase())
    console.log($(link).attr('href'));
  });
});
