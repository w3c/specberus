/**
 * Pseudo-rule for metadata extraction: errata.
 */

// 'self.name' would be 'metadata.errata'

exports.name = "metadata.errata";

exports.check = function(sr, done) {
    var errataRegex = /errata/i
    ,   $errata = sr.$("body div.head dl + p > a").filter(function() { return errataRegex.test(sr.$(this).text()); })
    ;

    if (!$errata.length || !$errata.attr("href").length)
        done();
    else 
        done({errata: $errata.attr("href")});
};
