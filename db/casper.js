var casper = require('casper').create();
var links;

// function getLinks() {
// // Scrape the links from top-right nav of the website
//     var links = document.querySelectorAll('ul.navigation li a');
//     return Array.prototype.map.call(links, function (e) {
//         return e.getAttribute('href')
//     });
// }
//
// // Opens casperjs homepage
// casper.start('http://casperjs.org/');
//
// casper.then(function () {
//     links = this.evaluate(getLinks);
// });
//
// casper.run(function () {
//     for(var i in links) {
//         console.log(links[i]);
//     }
//     casper.done();
// });

function getLinks() {
// Scrape the links from top-right nav of the website
    var links = document.getElementsByTagName('div');
    return Array.prototype.map.call(links, function (e) {
        return e.getAttribute('class')
    });
}

// Opens casperjs homepage
casper.start('https://www.giftcardgranny.com/gift-card-balance-check/o-charleys/');

casper.then(function () {
    links = this.evaluate(getLinks);
});

casper.run(function () {
    for(var i in links) {
        console.log(links[i]);
    }
    casper.done();
});





// casper.test.begin('a twitter bootstrap dropdown can be opened', 2, function(test) {
//     casper.start('http://getbootstrap.com/2.3.2/javascript.html#dropdowns', function() {
//         test.assertExists('#navbar-example');
//         this.click('#dropdowns .nav-pills .dropdown:last-of-type a.dropdown-toggle');
//         this.waitUntilVisible('#dropdowns .nav-pills .open', function() {
//             test.pass('Dropdown is open');
//         });
//     }).run(function() {
//         test.done();
//     });
// });
