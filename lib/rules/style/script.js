/**
 * Check whether the script <code>fixup.js</code> is linked in the page.
 */

const self = {
    name: 'style.script',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const PATTERN_SCRIPT = /^(https?:)?\/\/(www\.)?w3\.org\/scripts\/tr\/2016\/fixup\.js$/i;

    var candidates = sr.jsDocument.querySelectorAll('script[src]');
    var found = 0;

    candidates.forEach(function (ele) {
        if (PATTERN_SCRIPT.test(ele.getAttribute('src'))) {
            found++;
        }
    });

    if (found !== 1) {
        sr.error(self, 'not-found');
    }

    done();
};
