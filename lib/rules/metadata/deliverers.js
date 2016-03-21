/**
 * Pseudo-rule for metadata extraction: deliverers (ID, name and home page).
 */

// Settings:
const REGEX_GROUP = /^.*[^\s]+\s+(interest|community|working)\s+group\s*$/i
,   REGEX_DELIVERER_URL = /^((https?:)?\/\/)?(www\.)?w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/i
,   REGEX_DELIVERER_TEXT = /^public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?$/i
,   REGEX_DELIVERER_ID = /pp-impl\/(\d+)\/status/i
;

// Internal packages:
const util = require('../../util');

exports.name = 'metadata.deliverers';

exports.check = function(sr, done) {

    var groups = []
    ,   ids = []
    ;

    if (sr && sr.getSotDSection()) {

        var item
        ,   found = {}
        ;

        sr.getSotDSection().filter('p').find('a[href]').each(function() {
            item = sr.$(this);
            if (REGEX_GROUP.test(item.text())) {
                const name = item.text().trim()
                ,   url = item.attr('href')
                ;
                if (!found[util.normaliseURI(url)]) {
                    found[util.normaliseURI(url)] = true;
                    groups.push({name: name, homepage: url});
                }
            }
        });

        found = {};

        sr.getSotDSection().find('a[href]').each(function() {
            item = sr.$(this);
            var href = item.attr('href')
            ,   text = sr.norm(item.text())
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

    done({detectedDeliverers: groups, detectedDelivererIDs: ids});

};
