// XXX link to linkchecker but should use another service (see https://github.com/w3c/specberus/issues/27)

const self = {
    name: 'links.linkchecker'
,   section: 'document-body'
,   rule: 'brokenLink'
};

exports.check = function (sr, done) {
    sr.info(self, 'broken-links');
    sr.warning(self, "display", { link : sr.url });
    done();
};
