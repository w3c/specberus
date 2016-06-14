const self = {
    name: 'validation.wcag'
,   section: 'document-body'
,   rule: 'wcag'
};

exports.check = function (sr, done) {
    sr.info(self, "tools");
    return done();
};
