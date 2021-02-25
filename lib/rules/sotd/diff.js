const self = {
    name: 'sotd.diff',
    section: 'document-status',
    rule: 'changesList',
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.info(self, 'note');
    return done();
};
