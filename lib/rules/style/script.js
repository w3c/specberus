'use strict';

/**
 * Check whether the script <code>fixup.js</code> is linked in the page.
 */

exports.name = 'style.script';

exports.check = function (sr, done) {

    var candidates = sr.$("script[src='//www.w3.org/scripts/TR/2016/fixup.js']");

    if (1 !== candidates.length) {
        sr.error(this.name, 'not-found');
    }

    done();

};
