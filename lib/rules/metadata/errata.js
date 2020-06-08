/**
 * Pseudo-rule for metadata extraction: errata.
 */

// 'self.name' would be 'metadata.errata'

exports.name = "metadata.errata";

exports.check = function(sr, done) {
    var errataRegex = /errata/i
    ,   errata = Array.prototype.filter.call(sr.jsDocument.querySelectorAll("body div.head dl + p > a"), function(element) { return errataRegex.test(element.textContent); })
    ;

    if (!errata.length || !errata.getAttribute("href").length)
        done();
    else 
        done({errata: errata.getAttribute("href")});
};
