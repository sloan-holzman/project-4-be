const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.raise.com/gift-card-balance';
const Retailer = require("./schema").Retailer;
const User = require("./schema").User;
const Card = require("./schema").Card;


// let retailers = [];

// note: this function scrapes all the links to check retailer gift card balances

var scrape = function(url, cb) {

  if (url == "https://www.raise.com/gift-card-balance") {

    // use request to take in the body of the page's html
    request(url, function(err, res, body) {

      // load the body into cheerio's shorthand
      var $ = cheerio.load(body);

      // and make an empty object to save our retailers' info
      var retailers = [];
      links = $('a:contains("Gift Card Balance")');; //jquery get all hyperlinks to gift card balance checks

      // now, save the URL for each retailer as an object in the retailers array
      $(links).each(function(i, link){
        let retailerName = $(link).text().replace(' Gift Card Balance','').toLowerCase()
        let retailerSite = $(link).attr('href')
        retailers[i] = {name: retailerName, cardSite: retailerSite}
      });


      // now, pass retailers into our callback function
      cb(retailers);
    });
  }
};

User.remove({})
  .then(() => {
    console.log("Users removed successfully!");
    // process.exit()
  })
  .then(() => {
    Retailer.remove({})
      .then(() => {
        console.log("Retailers removed successfully!")
        // process.exit()
      })
      .then(() => {
        scrape("https://www.raise.com/gift-card-balance", function(retailers) {
          retailers.forEach((retailer, i) => {
            // create a new Retailer model
            let newRetailer = new Retailer(retailer)
            //save it.  console log the error or if not error, the retailer info
            newRetailer.save((err, newRetailer) => {
              err ? console.log(err) : console.log(newRetailer);
            });
          });
        })
      })
  })
  .catch(err => console.log(err))
