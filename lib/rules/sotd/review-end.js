const self = {
    name: 'sotd.review-end',
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {
        var txt = sr.norm(sotd.textContent);
        var rex = new RegExp(sr.dateRegexStrCapturing, 'g');
        // XXX we want to make this an error, but there is no standard for the text.
        if (!rex.test(txt)) sr.warning(self, 'not-found');
        else {
            var matches = txt.match(rex);
            for (var i in matches) {
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
