/* check if the document's headers link are in */

const self = {
    name: 'headers.details-summary',
    section: 'front-matter',
    rule: 'docIDFormat',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const details = sr.jsDocument.querySelector('.head details');
    if (!details) {
        sr.error(self, 'no-details');
        return done();
    }

    if (!details.open) {
        sr.error(self, 'no-details-open');
    }

    const dl = sr.jsDocument.querySelector('.head details dl');
    if (!dl) {
        sr.error(self, 'no-details-dl');
        return done();
    }

    const summary = sr.jsDocument.querySelector('.head details summary');
    if (!summary) {
        sr.error(self, 'no-details-summary');
        return done();
    }

    const summaryText = sr.norm(summary.textContent);
    if (summaryText !== 'More details about this document') {
        sr.error(self, 'wrong-summary-text');
    }

    return done();
};
