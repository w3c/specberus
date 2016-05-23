const self = {
    name: 'sotd.diff'
,   section: 'document-status'
,   rule: 'changesListTest'
};

exports.check = function (sr, done) {
    sr.info(self, "note");
    return done();
};
