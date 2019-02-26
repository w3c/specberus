// XXX link to linkchecker but should use another service (see https://github.com/w3c/spartacus/issues/27)

const self = {
    name: 'links.linkchecker'
,   section: 'document-body'
,   rule: 'brokenLink'
};

exports.name = self.name;

exports.check = function (sr, done) {
    sr.warning(self, "display", { link : sr.url });
    done();
};
