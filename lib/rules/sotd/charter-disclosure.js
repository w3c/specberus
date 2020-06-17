const sua = require("../../throttled-ua");

const self = {
    name: 'sotd.charter-disclosure'
};

exports.name = self.name;

var charterText = /The disclosure obligations of the Participants of this group are described in the charter\./;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {

        // check text exists
        var txt = sr.norm(sotd && sotd.textContent);
        if (!charterText.test(txt)) {
            sr.error(self, "text-not-found");
            return done();
        }

        // check deliverId exists
        var deliverId = sr.getDelivererIDs();
        if (!deliverId.length) {
            sr.error(self, "no-group");
            return done();
        }

        // check "charter" link is found and correct
        var charterLinkFound = false;
        sotd.querySelectorAll("a[href]").forEach(function (a) {
            var charterHref = a.getAttribute("href")
                , text = sr.norm(a.textContent)
                , pText = sr.norm(a.parentElement.textContent)
                ;

            // Find the right paragraph and right link.
            if (charterText.test(pText) && text == "charter") {
                charterLinkFound = true;
                
                var expectedHref
                    , url = 'https://api.w3.org/groups/' + deliverId[0] + '/charters'
                    , req
                    , apikey = process.env.W3C_API_KEY
                    , ua = "W3C-Pubrules/" + sr.version
                    ;

                req = sua.get(url)
                    .set("User-Agent", ua);
                req.query({ apikey: apikey, embed: true});
                req.end(function (err, res) {
                    if (err || !res.ok) {
                        sr.error(self, "no-response", { status: (res ? res.status : (err ? err : 'error')) });
                    } else {
                        // request for charter url (to request for expected charter)
                        var charters = res.body && res.body._embedded.charters
                            , docDate = sr.getDocumentDate();

                        // there can be more than one charter, find the charter that match the document publication date
                        charters.forEach(element => {
                            var endDate = new Date(element.end);
                            var startDate = new Date(element.start);

                            if (docDate < endDate && docDate > startDate) {
                                expectedHref = element.uri + '#patentpolicy';
                            }
                        });

                        if (expectedHref !== charterHref) {
                            sr.error(self, "wrong-link", { "expectedHref": expectedHref });
                        }
                        done();
                    }
                });
                return false; // break $.each after find charter in document
            }
        });
        if (!charterLinkFound) {
            sr.error(self, "link-not-found");
            done();
        }
    }
};
