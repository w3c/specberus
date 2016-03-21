/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

// Settings:
const REGEX_DELIVERER_URL = /^((https?:)?\/\/)?(www\.)?w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/i
,   REGEX_DELIVERER_TEXT = /^public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?$/i
,   REGEX_DELIVERER_ID = /pp-impl\/(\d+)\/status/i
;

exports.name = 'metadata.deliverers';

exports.check = function(sr, done) {

    var ids = [];

    if (sr && sr.getSotDSection() && sr.getSotDSection().find('a[href]')) {

        sr.getSotDSection().find('a[href]').each(function() {

            var item = sr.$(this)
            ,   href = item.attr('href')
            ,   text = sr.norm(item.text())
            ,   found = {}
            ;

            if (REGEX_DELIVERER_URL.test(href) && REGEX_DELIVERER_TEXT.test(text)) {
                var id = REGEX_DELIVERER_ID.exec(href);
                if (id && id.length > 1 && !found[id[1]]) {
                    found[id] = true;
                    ids.push(parseInt(id[1], 10));
                }
            }
        });

    }

    done({detectedDelivererIDs: ids});

};
