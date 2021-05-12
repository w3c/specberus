const sua = require('../../throttled-ua');

const self = {
    name: 'sotd.charter-disclosure',
};

exports.name = self.name;

const charterText = /The disclosure obligations of the Participants of this group are described in the charter\./;

exports.check = async function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
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
        Array.prototype.some.call(sotd.querySelectorAll('a[href]'), (a) => {
            const charterHref = a.getAttribute('href');
            const text = sr.norm(a.textContent);
            const pText = sr.norm(a.parentElement.textContent);
            // Find the right paragraph and right link.
            if (charterText.test(pText) && text === 'charter') {
                charterLinkFound = true;

                let expectedHref;
                const url = `https://api.w3.org/groups/${deliverId[0]}/charters`;
                const apikey = process.env.W3C_API_KEY;
                const ua = `W3C-Pubrules/${sr.version}`;
                const req = sua.get(url).set('User-Agent', ua);
                req.query({ apikey, embed: true });
                req.end((err, res) => {
                    if (err || !res.ok) {
                        sr.error(self, 'no-response', {
                            status: res ? res.status : err || 'error',
                        });
                    } else {
                        // request for charter url (to request for expected charter)
                        const charters =
                            res.body && res.body._embedded.charters;
                        const docDate = sr.getDocumentDate();

                        // there can be more than one charter, find the charter that match the document publication date
                        charters.forEach((element) => {
                            const endDate = new Date(element.end);
                            const startDate = new Date(element.start);

                            if (docDate < endDate && docDate > startDate) {
                                expectedHref = `${element.uri}#patentpolicy`;
                            }
                        });

                        if (expectedHref !== charterHref) {
                            sr.error(self, 'wrong-link', {
                                expectedHref,
                            });
                        }
                        done();
                    }
                });
                return true; // break [].some after find charter in document
            }
        });
        if (!charterLinkFound) {
            sr.error(self, 'link-not-found');
            done();
        }
    }
};
