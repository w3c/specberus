/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

// 'self.name' would be 'metadata.rectrack'

exports.name = 'metadata.rectrack';

exports.check = function (sr, done) {
    // TODO: sync with backend
    return done({
        track: sr.config.track,
    });
};
