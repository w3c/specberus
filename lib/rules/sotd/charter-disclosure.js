var sua = require("../../throttled-ua");

const self = {
    name: 'sotd.charter-disclosure'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {

        // check text exists
        var txt = sr.norm($sotd.text());
        if (!/The disclosure obligations of the Participants of this group are described in the charter\./.test(txt)) {
            sr.error(self, "text-not-found");
            done();
        }

        // check "charter" link is found and correct
        var charterLinkFound = false;
        $sotd.find("a[href]").each(function () {
            var $a = sr.$(this)
                , charterHref = $a.attr("href")
                , text = sr.norm($a.text())
                ;
            if (text == "charter") {
                charterLinkFound = true;
                
                var expectedHref
                    , deliverId = sr.getDelivererIDs()
                    , url = 'https://api.w3.org/groups/' + deliverId[0] + '/charters'
                    , req
                    , apikey = process.env.W3C_API_KEY
                    , ua = "W3C-Pubrules/" + sr.version
                    , expectedHref = ''
                    ;
                if (deliverId.length === 0) {
                    sr.error(self, "no-group");
                    return done();
                }
                req = sua.get(url)
                    .set("User-Agent", ua);
                req.query({ apikey: apikey });
                req.end(function (err, res) {
                    if (err || !res.ok) {
                        sr.error(self, "no-response", { status: (res ? res.status : (err ? err : 'error')) });
                    } else {
                        // request for url (to request for expected charter)
                        var charters = res.body["_links"]["charters"];
                        var requestURL = '';
                        charters.forEach(element => {
                            if (!requestURL || requestURL < element.href)
                                requestURL = element.href;
                        });

                        // request for expected charter
                        req = sua.get(requestURL)
                            .set("User-Agent", ua);
                        req.query({ apikey: apikey });
                        req.end(function (err, res) {
                            if (err || !res.ok) {
                                sr.error(self, "no-response", { status: (res ? res.status : (err ? err : 'error')) });
                            } else {    
                                expectedHref = res.body.uri + '#patentpolicy';
                                if (expectedHref !== charterHref) {
                                    sr.error(self, "wrong-link", { "expectedHref": expectedHref })
                                }
                            }
                            done();
                        });
                    }
                });
            }
        });
        if (!charterLinkFound) sr.error(self, "link-not-found");
    }
};
