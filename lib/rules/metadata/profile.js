/**
 * Pseudo-rule for metadata extraction: profile.
 */

// Settings:
const SELECTOR_SUBTITLE = 'body div.head h2';

// External packages:
const PowerPromise = require('promise');

// Internal packages:
const rules = require('../../rules');
const sua = require("../../throttled-ua");

// 'self.name' would be 'metadata.profile'
exports.name = "metadata.profile";

exports.check = function(sr, done) {

    var matchedLength = 0
    ,   id
    ,   reviewStatus = new Map()
    ,   amended = false
    ;

    sr.jsDocument.querySelectorAll(SELECTOR_SUBTITLE).forEach(function(element) {
        const candidate = sr.norm(element.textContent).toLowerCase();
        for (var t in rules)
            if ('*' !== t)
                for (var p in rules[t].profiles) {
                    var name = rules[t].profiles[p].name.toLowerCase();
                    if (-1 !== candidate.indexOf(name) && matchedLength < name.length) {
                        id = p;
                        amended = candidate.endsWith("(amended by w3c)");
                        matchedLength = name.length;
                    }
                }

    });

    reviewStatus.set("CR", "implementationFeedbackDue");
    reviewStatus.set("PR", "prReviewsDue");

    function assembleMeta(id, sr) {
        var meta = { profile: id };
        if (reviewStatus.has(id)) {
            var dueDate = sr.getFeedbackDueDate()
            ,   dates = dueDate && dueDate.valid
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
        if (["CR", "CRD", "PR", "REC"].indexOf(id) > -1) {
            var dl = sr.jsDocument.querySelector("body div.head dl")
            ,   dts = sr.extractHeaders(dl);
            if (dts.Implementation) {
                meta.implementationReport = dts.Implementation.dd.querySelector("a").href;
            }
        }
        if (id === 'REC') {
            meta = sr.getRecMetadata(meta);
        }
        return done(meta);
    }

    var checkPreviousVersion = function (sr) {
        return new PowerPromise(function (resolve) {
            var dl = sr.jsDocument.querySelector("body div.head dl")
            ,   dts = sr.extractHeaders(dl)
            ,   linkPrev = (dts.Previous) ? dts.Previous.dd.querySelector("a") : ''
            ,   shortname
            ,   specExists
            ;

            var linkLatest = (dts.Latest) ? dts.Latest.dd.querySelector("a").getAttribute('href') : '';
            var shortnameReg = /^https:\/\/www.w3.org\/TR\/(.+)\/$/;
            shortname = linkLatest.match(shortnameReg) && linkLatest.match(shortnameReg)[1];
            var req = sua.get('https://api.w3.org/specifications/' + shortname)
                .set("User-Agent", "W3C-Pubrules/" + sr.version);
            req.query({ apikey: process.env.W3C_API_KEY });
            req.end(function (err, res) {
                if (err || !res.ok) {
                    specExists = false;
                } else {
                    specExists = true;
                }
                resolve(specExists || linkPrev);
            });
        });
    };
    var checkRecType = function (sr) {
        var h2Element = sr.jsDocument.querySelector('body div.head h2');

        return (h2Element && h2Element.textContent.indexOf("Candidate Recommendation Draft") > 0) ? "CRD" : "CR";
        } else {
            return "REC";
        }
    };

    if (id) {
        if (/-NOTE/.test(id)) {
            checkPreviousVersion(sr).then(function (hasPreviousVersion) {
                // for First Public notes: WG-NOTE -> FPWG-NOTE
                id = hasPreviousVersion ? id : 'FP' + id;
                assembleMeta(id, sr);
            });
        } else {
            // W3C Candidate Recommendation (CR before 2020/CR snapshot/CR draft), W3C Recommendation will have "REC"
            if (id === "REC" || id === "CR") {
                // distingush REC CR CRD
                id = checkRecType(sr);
            }
            assembleMeta(id, sr);
        }
    } else {
        throw new Error('[EXCEPTION] The document could not be parsed, it\'s neither a TR document nor a Member Submission.');
    }
};
