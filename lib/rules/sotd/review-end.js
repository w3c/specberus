const self = {
    name: 'sotd.review-end',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const txt = sr.norm(sotd.textContent);
        const rex = new RegExp(sr.dateRegexStrCapturing, 'g');
        // XXX we want to make this an error, but there is no standard for the text.
        if (!rex.test(txt)) sr.warning(self, 'not-found');
        else {
            const matches = txt.match(rex);
            for (const i in matches) {
                if (sr.stringToDate(matches[i]) > sr.getDocumentDate()) {
                    sr.info(self, 'found', { date: matches[i] });
                    return done();
                }
            }
            sr.warning(self, 'not-found');
        }
    }
    done();
};
