/**
 * Pseudo-rule for metadata extraction: profile.
 */

// Settings:
const SELECTOR_SUBTITLE = 'body div.head h2';

// Internal packages:
const profiles = require('../../../public/data/profiles');

// 'self.name' would be 'metadata.profile'

exports.check = function(sr, done) {

    var candidate
    ,   track
    ,   profile
    ,   matchedLength = 0
    ,   id
    ,   i
    ,   j
    ,   reviewStatus = new Map()
    ;

    sr.$(SELECTOR_SUBTITLE).each(function() {
        candidate = sr.norm(sr.$(this).text()).toLowerCase();
        i = 0;
        while (i < profiles.tracks.length) {
            track = profiles.tracks[i].profiles;
            j = 0;
            while (j < track.length) {
                profile = track[j];
                if (-1 !== candidate.indexOf(profile.name.toLowerCase()) && matchedLength < profile.name.length) {
                    id = profile.id;
                    matchedLength = profile.name.length;
                }
                j++;
            }
            i++;
        }
    });
    reviewStatus.set("CR", "implementationFeedbackDue");
    reviewStatus.set("PR", "prReviewsDue");
    reviewStatus.set("PER", "perReviewsDue");
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
    }
    else {
        done();
    }

};
