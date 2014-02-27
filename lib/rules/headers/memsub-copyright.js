
exports.name = "headers.memsub-copyright";
exports.check = function (sr, done) {
    var $c = sr.$("body div.head p.copyright")
    ;
    if ($c.length) {
        // ,   "http://www.w3.org/Consortium/Legal/copyright-documents":           "document use"
        var seen = false;
        $c.find("a[href]").each(function () {
            var $a = sr.$(this);
            if ($a.attr("href").indexOf("http://www.w3.org/Consortium/Legal/copyright-documents") === 0) {
                seen = true;
                return false;
            }
        });
    }
    else sr.error(exports.name, "not-found");
    done();
};
