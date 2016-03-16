/**
 * Pseudo-rule for metadata extraction: profile.
 */

// Settings:
const SELECTOR_SUBTITLE = 'body div.head h2';

// Internal packages:
const profiles = require('../../../public/data/profiles');

exports.name = 'metadata.profile';

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
        done({detectedProfile: id});
    }
    else {
        done();
    }

};
