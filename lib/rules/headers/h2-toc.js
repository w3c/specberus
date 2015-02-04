
'use strict';

exports.name  = 'headers.h2-toc';

exports.check = function (sr, done) {

    var EXPECTED_HEADING = /Table\ of\ Contents/;

    var toc = sr.$('h2')
    ,   found = false;

    toc.each(function() {
        found = found || EXPECTED_HEADING.test(sr.$(this).text());
    });

    if (!found) sr.warning(exports.name, 'missing');

    return done();

};

