const self = {
    name: 'headers.hr'
,   section: 'front-matter'
,   rule: 'hrAfterCopyrightTest'
};

exports.check = function (sr, done) {
    var hasHrLastChild = (sr.$("body div.head > hr:last-child").length === 1)
    ,   hasHrNextSibling = (sr.$("body div.head + hr").length === 1);
    if (hasHrLastChild && hasHrNextSibling) {
        sr.error(self, 'duplicate');
    }
    else if (!hasHrLastChild && !hasHrNextSibling) {
        sr.error(self, 'not-found');
    }
    done();
};
