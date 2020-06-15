const sua = require("../../throttled-ua");

const self = {
    name: 'sotd.group-homepage'
,   section: 'document-status'
,   rule: 'WGLink'
};

exports.name = self.name;

exports.check = function (sr, done) {

    var deliverers = sr.getDelivererIDs()
    ,   ua         = "W3C-Pubrules/" + sr.version
    ,   sotd      = sr.getSotDSection()
    ,   count      = 0
    ,   apikey     = process.env.W3C_API_KEY
    ;

    if (deliverers.length === 0) {
        sr.error(self, "no-group");
        return done();
    }
    if (!apikey) {
        // Omitting 'section' & 'rule' on purpose: the error is not about the rule, but about local config.
        sr.error({name: self.name}, "no-key");
        return done();
    }
    for (var i = 0; i < deliverers.length; i++) {
        var req,
            url = 'https://api.w3.org/groups/'+deliverers[i]
        ;
        req = sua.get(url)
                 .set("User-Agent", ua);
        req.query({apikey: apikey});
        req.end(function(err, res) {
            if (err || !res.ok) {
                sr.error(self, "no-response", {status: (res ? res.status : (err ? err : 'error'))});
            } else {
                var homepage = res.body._links.homepage.href
                    , found = false;
                if (sotd) {
                    Array.protptype.every.call(sotd.element.querySelectorAll("a[href]"), function (element) {
                        var href = element.getAttribute("href");
                        if (href === homepage.replace(/^http(s)?:/, 'http:') ||
                            href === homepage.replace(/^http(s)?:/, 'https:')) {
                            found = true;
                            return false;
                        }
                        return true;
                    });
                }
                
                if (!found) {
                    sr.error(self, "no-homepage", { homepage: homepage });
                }
            }
            count++;
            if (count === deliverers.length) {
                done();
            }
        });
    }
};
