
// This script updates our local database of groups
//  Usage: node fetch-groups-db.js your-w3c-user your-w3c-password

var fs = require("fs")
,   pth = require("path")
,   ua = require("superagent")
,   w = require("whacko")
,   user = process.argv[2]
,   pass = process.argv[3]
,   results = {}
;

if (!user || !pass) {
    console.error("Please pass in your W3C username and password to fetch from the groups page.");
    process.exit(1);
}

function norm (str) {
    return str.replace(/^\s+/, "")
              .replace(/\s+$/, "")
              .replace(/\s+/g, " ");
}

function munge (res) {
    var $ = w.load(res.text);
    $("tr.WG, tr.IG, tr.CG").each(function () {
        // console.log("### tr", $(this).attr("class"));
        var $tr = $(this)
        ,   $td1 = $tr.find("td").first()
        ,   name = norm($td1.text())
        ,   href = $td1.find("a").first().attr("href")
        ;
        $($tr.find("td")[3]).find("a").each(function () {
            var list = $(this).text();
            if (!/@w3\.org$/.test(list)) list += "@w3.org";
            if (href.indexOf("http") === 0) true; // noop
            else if (href.indexOf("/") === 0) href = "http://www.w3.org" + href;
            else if (/^(\.\.\/){2}\w/.test(href)) href = "http://www.w3.org/" + href.replace(/^(\.\.\/){2}/, "");
            else console.error("--------------- UNKNOWN URL FORM -------------------");
            results[list] = { name: name, href: href };
            // console.log("\t", list, "//", name, "//", href);
        });
    });
    fs.writeFileSync(pth.join(__dirname, "../lib/groups-db.json"), JSON.stringify(results, null, 4));
}

ua
    .get("https://www.w3.org/Member/Mail/Overview.html")
    .auth(user, pass)
    .buffer(true)
    .end(munge);

// munge({ text: fs.readFileSync(pth.join(__dirname, "groups.html"), "utf8") });
