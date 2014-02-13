
exports.name = "headers.logo";
exports.check = function (sr, done) {
    var $logo = sr.$("body > div.head a[href] > img[src][height=48][width=72][alt=W3C]")
                  .first()
    ;
    if (!$logo.length ||
        !/^(https?:)?\/\/www\.w3\.org\/Icons\/w3c_home(\.png|\.gif)?$/.test($logo.attr("src")) ||
        !/^(https?:)?\/\/www\.w3\.org\/?$/.test($logo.parent().attr("href"))) {
        sr.error(exports.name, "not-found");
    }
    done();
};
