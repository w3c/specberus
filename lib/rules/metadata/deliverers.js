/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

// Settings:
const REGEX_DELIVERER_URL = /^((https?:)?\/\/)?(www\.)?w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/i
,   REGEX_DELIVERER_TEXT = /^public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?$/i
,   REGEX_DELIVERER_ID = /pp-impl\/(\d+)\/status/i
;

const self = {
    name: 'metadata.deliverers'
};

exports.check = function(sr, done) {

    var ids = sr.getDelivererIDs();

    done({delivererIDs: ids});

};
