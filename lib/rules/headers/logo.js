const self = {
    name: 'headers.logo'
,   section: 'front-matter'
,   rule: 'logo'
};

exports.check = function (sr, done) {
    var $logo = sr.$("body div.head a[href] > img[src][height=48][width=72][alt=W3C]")
                  .first()
    ;
    if (!$logo.length ||
        !/^(https?:)?\/\/www\.w3\.org\/StyleSheets\/TR\/2016\/logos\/W3C?$/.test($logo.attr("src")) ||
        !/^(https?:)?\/\/www\.w3\.org\/?$/.test($logo.parent().attr("href"))) {
        sr.error(self, "not-found");
    }
    done();
};
