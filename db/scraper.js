const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(``, {
  url: "https://www.giftcardgranny.com/gift-card-balance-check/",
  contentType: "text/html",
  includeNodeLocations: true
});


const nodeList = dom.window.document.querySelectorAll("div")
console.log(nodeList)
var nodeArray = [];
for (var i = 0; i < nodeList.length; ++i) {
    nodeArray[i] = nodeList[i];
    console.log(nodeArray[i])
}
