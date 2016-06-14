const self = {
    name: 'sotd.diff'
,   section: 'document-status'
,   rule: 'changesList'
};

exports.check = function (sr, done) {
    sr.info(self, "note");
    return done();
};
