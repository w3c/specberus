const rules = require('../../rules.json');

const self = {
    name: 'headers.h2-status',
    section: 'front-matter',
    rule: 'dateTitleH2',
};

exports.name = self.name;

exports.check = function (sr, done) {
    let profileFound = false;

    if (!sr.config.longStatus) return done();
    const h2 = sr.getDocumentStateElement();
    if (!h2) {
        sr.error(self, 'no-h2');
        return done();
    }
    const txt = sr.norm(h2.textContent);
    const amended = sr.config.amended ? ' (Amended by W3C)' : '';
    const docTitle =
        sr.config.longStatus + (sr.config.crType ? ` ${sr.config.crType}` : '');
    if (!txt.startsWith(`W3C ${docTitle}`) || !txt.endsWith(amended))
        sr.error(self, 'bad-h2');

    for (const t in rules)
        if (t !== '*' && !profileFound)
            for (const p in rules[t].profiles) {
                const rx = new RegExp(
                    `^w3c\\ ${rules[t].profiles[p].name}(\\ |,)`,
                    'i'
                );
                if (rx.test(txt)) {
                    profileFound = true;
                    break;
                }
            }

    if (!profileFound) sr.error(self, 'bad-h2');

    done();
};
