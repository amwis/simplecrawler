var request = require('request');
var cheerio = require('cheerio');

var startURL = "https://amido.com/";
var domain = "amido.com";
var urlList = [];
var visitedUrls = [];


/*
Need a mechanism that will store already visited url's to make sure I do not populate the urlList with them and don't
re-visit them. It's nearly done tho!
 */

urlList.push(startURL);

crawl();

function crawl() {

    if (urlList.length == 0) {
        console.log("Ran out of URLs to crawl under " + domain);
        return;
    }

    let nextUrl = urlList.pop();
    // Keeping some console logs for debugging in the future if needed
    // console.log("All available links: " + urlList);
    // console.log("Total count: " + urlList.length);

    if (visitedUrls.includes(nextUrl)) {
        // Keeping some console logs for debugging in the future if needed
        // console.log("Already been to: " + nextUrl);
        crawl()
    }
    else {
        visitedUrls.push(nextUrl);
        // Keeping some console logs for debugging in the future if needed
        // console.log("Entering: " + nextUrl);
        // console.log("Visitied")
        goToURL(nextUrl, crawl)
    }
}

function goToURL(url, callback) {
    request.get(url, {rejectUnauthorized: false}, function (error, response, body) {
        if (error) {
            // let doc = cheerio.load(body);
            // console.log("Status: " + response.statusCode + "    for: " + url);
            console.log("Page " + url +  " threw: " + error);
            // getAllRelativeLinks(doc);
            callback();
        }
        else {
            let doc = cheerio.load(body);
            console.log("Status: " + response.statusCode + "    for: " + url);
            getAllRelativeLinks(doc);
            callback();
        }
    });
}

function getAllRelativeLinks(links) {
    let allRelativeLinks = [];
    let allAbsoluteLinks = [];
    let allHashLinks = [];

    let relativeLinks = links("a[href^='/']");
    relativeLinks.each(function () {

        if (!visitedUrls.includes(links)) {
            allRelativeLinks.push(links(this).attr('href'));
            urlList.push("http://" + links(this).attr('href'));
        }
    });

    let hashLinks = links("a[href^='#']");
    hashLinks.each(function (i, item) {
        if (item.attribs.href !== "#") {
            if (!visitedUrls.includes(links)) {
                allHashLinks.push(links(this).attr('href'));
                urlList.push("http://" + links(this).attr('href'));
            }
        }
    });

    let absoluteLinks = links("a[href^='http']");
    for (let i = 0; i < absoluteLinks.length; i++) {
        let link = absoluteLinks[i];

        if (link.attribs.href.indexOf(domain) !== -1) {

            if (!visitedUrls.includes(link)) {
                allAbsoluteLinks.push(link.attribs.href);
                urlList.push(link.attribs.href);
            }
        }
    }

    // Keeping some console logs for debugging in the future if needed
    // console.log("Got: " + allRelativeLinks.length + " relative links");
    // console.log("Got: " + allAbsoluteLinks.length + " absolute links");
    // console.log("Got: " + allHashLinks.length + " hash links");
}

function remove(array, element) {
    return array.filter(e => e !== element);
}
