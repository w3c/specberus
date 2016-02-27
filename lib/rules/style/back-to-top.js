'use strict';

/**
 * Check if there's a <em>back-top-top</em> hyperlink.
 */

exports.name = 'style.back-to-top';

exports.check = function (sr, done) {

    var candidates = sr.$("body p#back-to-top[role='navigation'] a[href='#toc']");

    if (1 !== candidates.length) {
        sr.warning(this.name, 'not-found');
    }

    done();

};
