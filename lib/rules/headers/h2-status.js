var rules = require('../../rules');

const self = {
    name: 'headers.h2-status'
,   section: 'front-matter'
,   rule: 'dateTitleH2'
};

exports.name = self.name;

exports.check = function (sr, done) {

    var profileFound = false;

    if (!sr.config.longStatus) return done();
    var h2 = sr.getDocumentDateElement();
    if (!h2 || !h2.length) {
        sr.error(self, 'no-h2');
        return done();
    }
    var txt = sr.norm(h2.textContent)
    ,   amended = (sr.config.amended) ? " (Amended by W3C)" : "";
    if (!txt.startsWith("W3C " + sr.config.longStatus) || !txt.endsWith(amended))
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
