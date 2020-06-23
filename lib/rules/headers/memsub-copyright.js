const self = {
    name: 'headers.memsub-copyright'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var copyright = sr.jsDocument.querySelectorAll("body div.head p.copyright");
    if (copyright.length) {
        // ,   "http://www.w3.org/Consortium/Legal/copyright-documents":           "document use"
        var seen = Array.prototype.some.call(copyright.querySelectorAll("a[href]"), a =>
            a.getAttribute("href").indexOf("https://www.w3.org/Consortium/Legal/copyright-documents") === 0); 
        if (!seen) sr.error(self, "not-found");
    }
    else sr.error(self, "not-found");
    done();
};
