/**
 * Pseudo-rule for metadata extraction: profile.
 */

// Settings:
const SELECTOR_SUBTITLE = 'body div.head h2';

// Internal packages:
const profiles = require('../../../public/data/profiles');

const self = {
    name: 'metadata.profile'
};

exports.check = function(sr, done) {

    var candidate
    ,   track
    ,   profile
    ,   matchedLength = 0
    ,   id
    ,   i
    ,   j
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
    if (id) {
        if (id === "CR" || id === "PR" || id === "PER") {
            var dates = sr.getFeedbackDueDate()
            ,   res   = dates[0]
            ;
            if (dates.length === 0 || !res) return done({profile: id});
            if (dates.length > 1)
                res = new Date(Math.min.apply(null,dates));

            var d = [res.getFullYear(), res.getMonth() + 1, res.getDate()].join('-');
            return done({profile: id, implementationFeedbackDue: d});
        } else {
            done({profile: id});
        }
    }
    else {
        done();
    }

};
