// errata, right after dl

const self = {
    name: 'headers.errata'
    // @TODO: find out rule?
};

exports.check = function (sr, done) {
    var errataRegex = /errata/i
    ,   $errata = sr.$("body div.head dl + p > a").filter(function() { return errataRegex.test(sr.$(this).text()); })
    ;

    if (!$errata.length || !$errata.attr("href").length)
        sr.error(self, "not-found");

    done();
};
