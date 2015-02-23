
exports.name = "headers.copyright";
exports.check = function (sr, done) {
    var $c = sr.$("body div.head p.copyright")
    ,   err = function (str, extra) {
            sr.error(exports.name, str, extra);
        }
    ;
    if ($c.length) {
        var year = (sr.getDocumentDate() || new Date).getFullYear()
        ,   text = sr.norm($c.text())
        ,   startRex = "^Copyright © (?:(?:199\\d|20[01]\\d)-)?" + year + " .*?W3C® \\(MIT, ERCIM, Keio, Beihang\\)"
        ,   dualLicensed = /CC-BY/.test(text);

        // See https://lists.w3.org/Archives/Public/spec-prod/2015JanMar/0001.html
        if (sr.getDocumentDate() < new Date(2015, 01, 07)) // Before 06 Feb 2015
            var w3cOnlyStatement = ", All Rights Reserved";
        else if (sr.getDocumentDate() < new Date(2015, 02, 08)) // Between 06 Feb and 07 Mar 2015
            var w3cOnlyStatement = "(, All Rights Reserved)?";
        else
            var w3cOnlyStatement = ""; // After 08 Mar 2015

        var dualLicenseStatement = ", Some Rights Reserved: this document is dual-licensed, CC-BY and W3C Document License"
        ,   endRex = "\\. W3C liability, trademark,? and document use rules apply\\.$"
        ,   rex = new RegExp(startRex + (dualLicensed ? dualLicenseStatement : w3cOnlyStatement) + endRex)
        ;
        if (!rex.test(text)) err("no-match");
        if (dualLicensed) sr.warning(exports.name, "kitten-friendly");

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
        if (dualLicensed) {
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
