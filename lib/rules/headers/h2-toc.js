
'use strict';

exports.name  = 'headers.h2-toc';

exports.check = function (sr, done) {

    var EXPECTED_HEADING = /table\s+of\s+contents/i;
    var toc = sr.$('nav#toc > h2');

    if (1 === toc.length) {
        if (!EXPECTED_HEADING.test(sr.$(toc[0]).text())) {
            sr.error(exports.name, 'not-found');
        }
    }
    else {
        toc = sr.$('div#toc > h2');

        if (1 === toc.length) {
            if (EXPECTED_HEADING.test(sr.$(toc[0]).text())) {
                sr.warning(exports.name, 'not-html5');
            }
            else {
                sr.error(exports.name, 'not-found');
            }
        }
        else if (0 === toc.length) {
            sr.error(exports.name, 'not-found');
        }
        else if (toc.length > 1) {
            sr.error(exports.name, 'too-many');
        }

    };

    done();

};

