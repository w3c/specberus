'use strict';

/**
 * Check the presence of this <code>meta</code> tag in the head of the page:
 * <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"&gt;</code>
 */

exports.name = "style.meta";

exports.check = function (sr, done) {
    var candidates = sr.$("head > meta[name='viewport'][content='width=device-width, initial-scale=1, shrink-to-fit=no']");
    if (!candidates || 1 !== candidates.length) sr.error(this.name, "not-found");
    done();
};
