/**
 * Pseudo-rule for metadata extraction: deliverers.
 */

// Settings:
const REGEX_GROUP = /^.*[^\s]+\s+(interest|community|working)\s+group\s*$/i;

// Internal packages:
const util = require('../../util');

exports.name = 'metadata.deliverers';

exports.check = function(sr, done) {

    var result = []
    ,   found = {}
    ;

    if (sr && sr.getSotDSection() && sr.getSotDSection().filter('p')) {
        sr.getSotDSection().filter('p').find('a[href]').each(function() {
            const item = sr.$(this);
            if (REGEX_GROUP.test(item.text())) {
                const name = item.text().trim()
                ,   url = item.attr('href')
                ;
                if (!found[util.normaliseURI(url)]) {
                    found[util.normaliseURI(url)] = true;
                    result.push({name: name, homepage: url});
                }
            }
        });
        done({detectedDeliverers: result});
    }
    else {
        done();
    }

};
