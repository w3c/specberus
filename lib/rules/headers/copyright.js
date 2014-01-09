
exports.name = "headers.copyright";
exports.check = function (sr, done) {
    var $c = sr.$("body > div.head:first-child p.copyright")
    ,   err = function (str) {
            sr.sink.emit("err", exports.name, { message: str });
        }
    ;
    if ($c.length) {
        var year = (sr.getDocumentDate() || new Date).getFullYear()
        ,   text = sr.norm($c.text())
        ,   startRex = "^Copyright © (\\d{4}-)?" + year + " .*?W3C® \\(MIT, ERCIM, Keio, Beihang\\), "
        ,   hatesFreedom = /All Rights Reserved/.test(text)
        ,   evil = "All Rights Reserved\\."
        ,   good = "Some Rights Reserved: this document is dual-licensed, CC-BY and W3C Document License\\."
        ,   endRex = " W3C liability, trademark and document use rules apply\\.$"
        ,   rex = new RegExp(startRex + (hatesFreedom ? evil : good) + endRex)
        ;
        if (!rex.test(text)) err("Copyright string not found.");
        if (!hatesFreedom) sr.sink.emit("warning", exports.name, "Using CC-BY kitten-friendly license.");
        
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
        if (!hatesFreedom) links["https://creativecommons.org/licenses/by/3.0/"] = "CC-BY";
        for (var href in links) {
            if (!$c.find("a[href='" + href + "']:contains('" + links[href] + "')").length)
                err("Missing link " + href + " with text " + links[href] + ".");
        }
    }
    else err("Missing copyright paragraph.");
    done();
};
