/**
 * @file This rule checks if the Group have a current charter. For IG, also check if SOTD has certain text: $charterText.
 */
const self = {
    name: 'sotd.charter',
};

exports.name = self.name;

const util = require('../../util');

const charterText =
    /The disclosure obligations of the Participants of this group are described in the charter\./;

exports.check = async function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const deliverIds = await sr.getDelivererIDs();

        if (!deliverIds.length) {
            sr.error(self, 'no-group');
            return done();
        }

        // Skip check if the document is only published by TAG and/or AB
        const TagID = util.TAG.id;
        const AbID = util.AB.id;
        // groupIds: a list of ids without TAG or AB
        const groupIds = deliverIds.filter(
            deliverer => ![TagID, AbID].includes(deliverer)
        );
        if (!groupIds.length) return done();

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

            // check "charter" link is found and correct
            let charterLinkFound = false;
            let charterHrefInDocument;
            Array.prototype.some.call(sotd.querySelectorAll('a[href]'), a => {
                const charterHref = a.getAttribute('href');
                const text = sr.norm(a.textContent);
                const pText = sr.norm(a.parentElement.textContent);
                // Find the right paragraph and right link.
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
