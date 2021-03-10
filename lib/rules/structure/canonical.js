const self = {
    name: 'structure.canonical',
    section: 'metadata',
    rule: 'canonical',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const checkCanonical = function () {
        const lnk = sr.jsDocument.querySelector('head > link[rel=canonical]');
        if (!lnk || !lnk.getAttribute('href')) sr.error(self, 'not-found');
    };

    // That canonical link is mandatory starting from Oct 1, 2017.
    // See https://lists.w3.org/Archives/Public/spec-prod/2017JulSep/0005.html
    sr.transition({
        to: new Date('2017-09-30'),
        doMeanwhile: () => {},
        doAfter: checkCanonical,
    });

    done();
};
