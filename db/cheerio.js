const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.raise.com/gift-card-balance';
const Retailer = require("./schema").Retailer;

let retailers = [];


// request(url, function(err, resp, body){
//   $ = cheerio.load(body);
//   links = $('a:contains("Gift Card Balance")');; //jquery get all hyperlinks
//   $(links).each(function(i, link){
//     console.log(i)
//     let retailerName = $(link).text().replace(' Gift Card Balance','').toLowerCase()
//     let retailerSite = $(link).attr('href')
//     retailers.push({name: retailerName, cardSite: retailerSite})
//   });
//   process.exit()
// });


var scrape = function(url, cb) {

  // if our url is the times home page (and it will be)...
  if (url == "https://www.raise.com/gift-card-balance") {

    // then use request to take in the body of the page's html
    request(url, function(err, res, body) {

      // load the body into cheerio's shorthand
      var $ = cheerio.load(body);

      // and make an empty object to save our article info
      var retailers = [];
      links = $('a:contains("Gift Card Balance")');; //jquery get all hyperlinks

      // now, find each element that has the "theme-summary" class
      // (i.e, the section holding the articles)
      $(links).each(function(i, link){
        // console.log(i)
        let retailerName = $(link).text().replace(' Gift Card Balance','').toLowerCase()
        let retailerSite = $(link).attr('href')
        retailers[i] = {name: retailerName, cardSite: retailerSite}
      });

      // with every article scraped into the articles object (good for testing)
      // console.log(retailers);

      // now, pass articles into our callback function
      cb(retailers);
    });
  }
};

scrape("https://www.raise.com/gift-card-balance", function(retailers) {
  console.log(retailers)
  retailers.forEach((retailer, i) => {
    let newRetailer = new Retailer(retailer)
    newRetailer.save((err, newRetailer) => {
      err ? console.log(err) : console.log(newRetailer);
    });
  });
})

//
// retailers.forEach((retailer, i) => {
//   retailers[i].save((err, retailer) => {
//     err ? console.log(err) : console.log(retailer);
//   });
// });



// Retailer.remove({})
//   .then(() => {
//     console.log("Retailer removed successfully!");
//
//     retailers.forEach((retailer, i) => {
//       retailers[i].save((err, retailer) => {
//         err ? console.log(err) : console.log(retailer);
//       });
//     });
//   })
//   .catch(err => console.log(err));
