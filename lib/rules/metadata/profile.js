/**
 * Pseudo-rule for metadata extraction: profile.
 */
// Settings:
const SELECTOR_SUBTITLE = 'body div.head h2';

const PowerPromise = require('promise');

// Internal packages:
const rules = require('../../rules');
const sua = require("../../throttled-ua");

// 'self.name' would be 'metadata.profile'
exports.name = "metadata.profile";
exports.check = function (sr, done) {

    var matchedLength = 0
    ,   id
    ,   reviewStatus = new Map()
    ,   amended = false
    ;

    sr.$(SELECTOR_SUBTITLE).each(function() {
        const candidate = sr.norm(sr.$(this).text()).toLowerCase();
        for (var t in rules) {
            if ('*' !== t)
                for (var p in rules[t].profiles) {
                    var name = rules[t].profiles[p].name.toLowerCase();
                    if (-1 !== candidate.indexOf(name) && matchedLength < name.length) {
                        id = p;
                        amended = candidate.endsWith("(amended by w3c)");
                        matchedLength = name.length;
                    }
                }
        }

    });

    reviewStatus.set("CR", "implementationFeedbackDue");
    reviewStatus.set("PR", "prReviewsDue");
    
    function assembleMeta(id) {
        var meta = {profile: id};
        if (reviewStatus.has(id)) {
            var dates = sr.getFeedbackDueDate()
            ,   res   = dates[0]
            ;
            if (dates.length === 0 || !res) return done({profile: id});
            if (dates.length > 1)
                res = new Date(Math.min.apply(null,dates));

            var d = [res.getFullYear(), res.getMonth() + 1, res.getDate()].join('-');
            meta[reviewStatus.get(id)] = d;
        }
        if (amended) meta.amended = amended;

        // implementation report
        if (['CR', 'PR', 'REC'].indexOf(id) > -1) {
            var LINK_PATTERN = /(implementation|interoperability)\s+report$/i;
            var $sotd = sr.getSotDSection();
            if ($sotd && $sotd.length) {
                var item;
                $sotd.find('a').each(function (foo, element) {
                    item = sr.$(element);

                    if (LINK_PATTERN.exec(item.text())) {
                        meta.implementationReport = item.attr('href');
                        return false;
                    }
                });
            }
        }
        return done(meta);
    }

    var checkPreviousVersion = function (sr) {
        return new PowerPromise(function (resolve) {
            var $dl = sr.$("body div.head dl").first()
            ,   dts = sr.extractHeaders($dl)
            ,   $linkPrev = (dts.Previous) ? dts.Previous.dd.find("a").first() : ''
            ,   shortname
            ,   specExists
            ;

            var $linkLatest = (dts.Latest) ? dts.Latest.dd.find("a").first().attr('href') : '';
            shortname = $linkLatest.match(/^https:\/\/www.w3.org\/TR\/(.+)\/$/)[1];
            var req = sua.get('https://api.w3.org/specifications/' + shortname)
            // var req = sua.get('https://api.w3.org/specifications/' + 'jiaying')
                        .set("User-Agent", "W3C-Pubrules/" + sr.version);
            req.query({ apikey: process.env.W3C_API_KEY });
            req.end(function (err, res) {
                if (err || !res.ok) {
                    if (res && res.status == 404) {
                        specExists = false;
                    } else {
                        sr.error(self, "no-response", { status: (res ? res.status : (err ? err : 'error')) });
                    }
                } else {
                    specExists = true;
                }
                resolve(specExists || $linkPrev);
            });
        });
    }

    if (id) {
        if (/-NOTE/.test(id)) {
            checkPreviousVersion(sr).then(function (hasPreviousVersion) {
                // for First Public notes: WG-NOTE -> FPWG-NOTE
                id = hasPreviousVersion ? id : 'FP' + id; 
                assembleMeta(id);
            });
        } else {
            assembleMeta(id);
        }
    } else
        done();

};
