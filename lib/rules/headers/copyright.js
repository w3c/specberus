const self = {
    name: 'headers.copyright'
,   section: 'front-matter'
,   rule: 'copyright'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $c = sr.$("body div.head p.copyright")
    ;
    if ($c.length) {
        var year = (sr.getDocumentDate() || new Date()).getFullYear()
        ,   text = sr.norm($c.text())
        ,   startRex = "^Copyright (©|&copy;) (?:(?:199\\d|20[01]\\d)-)?" + year + " *W3C(®|&reg;) \\(MIT, ERCIM, Keio, Beihang\\)"
        ,   isDualLicensed = /CC-BY/.test(text)
        ,   w3cOnlyStatement
        ,   dualLicenseStatement = ", Some Rights Reserved: this document is dual-licensed, CC-BY and W3C Document License"
        ,   endRex = "\\. W3C liability, trademark,? and (document use|permissive document license) rules apply\\.$"
        ,   isPermissiveLicense = /permissive document license/.test(text)
        ;

        // This takes care of old copyright statement forms and their transitions.
        // See https://lists.w3.org/Archives/Public/spec-prod/2015JanMar/0001.html
        sr.transition({
            from:        new Date('2015-02-06')
        ,   to:          new Date('2015-03-08')
        ,   doBefore:    function () { w3cOnlyStatement = ', All Rights Reserved'; }
        ,   doMeanwhile: function () { w3cOnlyStatement = '(, All Rights Reserved)?'; }
        ,   doAfter:     function () { w3cOnlyStatement = ''; }
        });

        var rex = new RegExp(startRex + (isDualLicensed ? dualLicenseStatement : w3cOnlyStatement) + endRex);
        if (!rex.test(text)) sr.error(self, "no-match");
        if (isDualLicensed) sr.warning(self, "kitten-friendly");

        // check the links
        var links = {
            "https://www.w3.org/Consortium/Legal/ipr-notice#Copyright":          "Copyright"
        ,   "https://www.w3.org/":                                               "W3C"
        ,   "https://www.csail.mit.edu/":                                        "MIT"
        ,   "https://www.ercim.eu/":                                             "ERCIM"
        ,   "https://www.keio.ac.jp/":                                           "Keio"
        ,   "https://ev.buaa.edu.cn/":                                           "Beihang"
        ,   "https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer":   "liability"
        ,   "https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks":     "trademark"
        ,   "https://www.w3.org/Consortium/Legal/copyright-documents":           "document use"
        };
        if (isPermissiveLicense) {
          links["https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document"] = "permissive document license";
          delete links["https://www.w3.org/Consortium/Legal/copyright-documents"];
        }
        if (isDualLicensed) {
            links["https://creativecommons.org/licenses/by/3.0/"] = "CC-BY";
            links["https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html"] = "document use";
            delete links["https://www.w3.org/Consortium/Legal/copyright-documents"];
        }
        for (var href in links) {
            var sel = "a[href='" + href + "']";
            var $lnk = $c.find(sel);
            if (!$lnk.length || sr.norm($lnk.text()) !== links[href]) {
                sr.error(self, "link-text", { href: href, text: links[href] });
            }
        }
    }
    else sr.error(self, "not-found");
    done();
};
