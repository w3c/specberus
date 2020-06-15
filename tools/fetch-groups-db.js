// This script updates our local database of groups
//  Usage: node fetch-groups-db.js your-w3c-user your-w3c-password

// XXX also look at https://cvs.w3.org/Team/WWW/2000/04/mem-news/groups.rdf

var fs = require("fs")
,   pth = require("path")
,   ua = require("superagent")
,   {JSDOM} = require('jsdom')
,   user = process.argv[2]
,   pass = process.argv[3]
,   results = {}
;

if (!user || !pass) {
    throw new Error("Please pass in your W3C username and password to fetch from the groups page.");
}

function norm (str) {
    return str.replace(/^\s+/, "")
              .replace(/\s+$/, "")
              .replace(/\s+/g, " ");
}

function munge (err, res) {
    var jsdom = new JSDOM(res.text);
    var jsDocument = jsdom.window.document;

    jsDocument.querySelectorAll("tr.WG, tr.IG, tr.CG").forEach(function (tr) {
        var tds = tr.querySelectorAll("td")
            , td1 = tds && tds[0]
            , td4 = tds && tds[3]
            , name = td1 && norm(td1.textContent)
            , href = td1 && td1.querySelector('a').getAttribute('href')
            ;
        if (td4) {
            td4.querySelectorAll('a').forEach(function (element) {
                var list = element.textContent;
                if (!/@w3\.org$/.test(list)) list += "@w3.org";
                if (href.indexOf("http") === 0) true; // jshint ignore: line
                else if (href.indexOf("/") === 0) href = "http://www.w3.org" + href;
                else if (/^(\.\.\/){2}\w/.test(href)) href = "http://www.w3.org/" + href.replace(/^(\.\.\/){2}/, "");
                else
                console.error("--------------- UNKNOWN URL FORM -------------------");  // eslint-disable-line no-console
                results[list] = { name: name, href: href };
            });
        }
        
    });
    fs.writeFileSync(pth.join(__dirname, "../lib/groups-db.json"), JSON.stringify(results, null, 4));
}

ua
    .get("https://www.w3.org/Member/Mail/Overview.html")
    .auth(user, pass)
    .buffer(true)
    .end(munge);

// munge(err, { text: fs.readFileSync(pth.join(__dirname, "groups.html"), "utf8") });
