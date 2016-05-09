/**
 * Check the presence of a valid ToC.
 */

'use strict';

exports.name  = 'headers.h2-toc';

exports.check = function (sr, done) {

    const EXPECTED_HEADING = /^table\s+of\s+contents$/i
    ,   tocNav = sr.$('nav#toc > h2')
    ,   tocDiv = sr.$('div#toc > h2')
    ;

    var toc;

    if(tocDiv.length > 0) {
        if(tocNav.length > 0)
            sr.error(exports.name, 'mixed');
        else {
            sr.warning(exports.name, 'not-html5');
            toc = tocDiv;
        }
    }
    else {
        if(tocNav.length > 0)
            toc = tocNav;
        else
            sr.error(exports.name, 'not-found');
    }

    if (toc && toc.length > 0) {
        var matches = 0;
        for (var i = 0; i < toc.length; i ++)
            if (EXPECTED_HEADING.test(sr.$(toc[i]).text()))
                matches ++;
        if (matches > 1)
            sr.error(exports.name, 'too-many');
        else if (0 === matches)
            sr.error(exports.name, 'not-found');
    }

    done();

};
