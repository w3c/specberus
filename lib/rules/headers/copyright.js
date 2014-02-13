
exports.name = "headers.copyright";
exports.check = function (sr, done) {
    var $c = sr.$("body > div.head p.copyright")
    ,   err = function (str, extra) {
            sr.error(exports.name, str, extra);
        }
    ;
    if ($c.length) {
        var year = (sr.getDocumentDate() || new Date).getFullYear()
        ,   text = sr.norm($c.text())
        ,   startRex = "^Copyright © (?:(?:199\\d|20[01]\\d)-)?" + year + " .*?W3C® \\(MIT, ERCIM, Keio, Beihang\\), "
        ,   hatesFreedom = /All Rights Reserved/.test(text)
        ,   evil = "All Rights Reserved\\."
        ,   good = "Some Rights Reserved: this document is dual-licensed, CC-BY and W3C Document License\\."
        ,   endRex = " W3C liability, trademark and document use rules apply\\.$"
        ,   rex = new RegExp(startRex + (hatesFreedom ? evil : good) + endRex)
        ;
        console.log(text);
        if (!rex.test(text)) err("no-match");
        if (!hatesFreedom) sr.warning(exports.name, "kitten-friendly");

        // check the links
        var links = {
            "http://www.w3.org/Consortium/Legal/ipr-notice#Copyright":          "Copyright"
        ,   "http://www.w3.org/":                                               "W3C"
        ,   "http://www.csail.mit.edu/":                                        "MIT"
        ,   "http://www.ercim.eu/":                                             "ERCIM"
        ,   "http://www.keio.ac.jp/":                                           "Keio"
        ,   "http://ev.buaa.edu.cn/":                                           "Beihang"
        ,   "http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer":   "liability"
        ,   "http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks":     "trademark"
        ,   "http://www.w3.org/Consortium/Legal/copyright-documents":           "document use"
        };
        if (!hatesFreedom) {
            links["https://creativecommons.org/licenses/by/3.0/"] = "CC-BY";
            links["http://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html"] = "document use";
            delete links["http://www.w3.org/Consortium/Legal/copyright-documents"];
        }
        for (var href in links) {
            var $lnk = $c.find("a[href='" + href + "']");
            if (!$lnk.length || sr.norm($lnk.text()) !== links[href])
                err("link-text", { href: href, text: links[href] });
        }
    }
    else err("not-found");
    done();
};
