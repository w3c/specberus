/**
 * Pseudo-rule for metadata extraction: profile.
 */

// Settings:
const SELECTOR_SUBTITLE = 'body div.head h2';

// Internal packages:
const rules = require('../../rules');

// 'self.name' would be 'metadata.profile'

exports.check = function(sr, done) {

    var matchedLength = 0
    ,   id
    ,   reviewStatus = new Map()
    ;

    sr.$(SELECTOR_SUBTITLE).each(function() {
        const candidate = sr.norm(sr.$(this).text()).toLowerCase();
        for (var t in rules)
            if ('*' !== t)
                for (var p in rules[t].profiles) {
                    var name = rules[t].profiles[p].name.toLowerCase();
                    if (-1 !== candidate.indexOf(name) && matchedLength < name.length) {
                        id = p;
                        matchedLength = name.length;
                    }
                }

    });

    reviewStatus.set("CR", "implementationFeedbackDue");
    reviewStatus.set("PR", "prReviewsDue");

    if (id) {
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
        return done(meta);
    } else
        done();

};
