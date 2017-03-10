var rules = require('../../rules');

const self = {
    name: 'headers.h2-status'
,   section: 'front-matter'
,   rule: 'dateTitleH2'
};

exports.check = function (sr, done) {

    var profileFound = false;

    if (!sr.config.longStatus) return done();
    var $h2 = sr.getDocumentDateElement();
    if (!$h2 || !$h2.length) {
        sr.error(self, 'no-h2');
        return done();
    }
    var txt = sr.norm($h2.text());
    if (txt.indexOf("W3C " + sr.config.longStatus) !== 0)
        sr.error(self, 'bad-h2');

    for (var t in rules)
        if ('*' !== t && !profileFound)
            for (var p in rules[t].profiles) {
                var rx = new RegExp(`^w3c\\ ${rules[t].profiles[p].name}(\\ |,)`, 'i');
                if (rx.test(txt)) {
                    profileFound = true;
                    break;
                }
            }

    if (!profileFound)
        sr.error(self, 'bad-h2');

    done();

};
