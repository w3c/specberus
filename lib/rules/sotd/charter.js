/**
 * @file This rule checks if the Group have a current charter. For IG, also check if SOTD has certain text: $charterText.
 */
const self = {
    name: 'sotd.charter',
};

exports.name = self.name;

const charterText =
    /The disclosure obligations of the Participants of this group are described in the charter\./;

exports.check = async function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const deliverId = await sr.getDelivererIDs();
        if (!deliverId.length) {
            sr.error(self, 'no-group');
            return done();
        }

        const charters = await sr.getCharters();
        if (!charters.length) {
            sr.error(self, 'no-charter');
            return done();
        }

        if (sr.config.longStatus === 'Interest Group Note') {
            const expectedHref = charters && `${charters[0]}#patentpolicy`;
            // check text exists
            const txt = sr.norm(sotd && sotd.textContent);
            if (!charterText.test(txt)) {
                sr.error(self, 'text-not-found');
                return done();
            }

            // check deliverId exists
            const deliverId = await sr.getDelivererIDs();
            if (!deliverId.length) {
                sr.error(self, 'no-group');
                return done();
            }
            // check "charter" link is found and correct
            let charterLinkFound = false;
            let charterHrefInDocument;
            Array.prototype.some.call(sotd.querySelectorAll('a[href]'), a => {
                const charterHref = a.getAttribute('href');
                const text = sr.norm(a.textContent);
                const pText = sr.norm(a.parentElement.textContent);
                // Find the right paragraph and right link.
                console.log('\n\ncharter.js:', charterText);
                if (charterText.test(pText) && text === 'charter') {
                    charterLinkFound = true;
                    charterHrefInDocument = charterHref;
                }
            });
            if (!charterLinkFound) {
                sr.error(self, 'link-not-found');
            } else if (expectedHref !== charterHrefInDocument) {
                sr.error(self, 'wrong-link', {
                    expectedHref,
                });
            }
        }

        return done();
    }
};
