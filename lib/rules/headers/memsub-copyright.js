const self = {
    name: 'headers.memsub-copyright'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var copyright = sr.jsDocument.querySelectorAll("body div.head p.copyright")
    ;
    if (copyright.length) {
        // ,   "http://www.w3.org/Consortium/Legal/copyright-documents":           "document use"
        var seen = false;
        Array.prototype.every.call(copyright.querySelectorAll("a[href]"), function (a) {
            if (a.getAttribute("href").indexOf("https://www.w3.org/Consortium/Legal/copyright-documents") === 0) {
                seen = true;
                return false;
            }
            return true;
        });
        if (!seen) sr.error(self, "not-found");
    }
    else sr.error(self, "not-found");
    done();
};
