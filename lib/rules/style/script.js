/**
 * Check whether the script <code>fixup.js</code> is linked in the page.
 */

const self = {
    name: 'style.script',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const PATTERN_SCRIPT =
        /^(https?:)?\/\/(www\.)?w3\.org\/scripts\/tr\/2021\/fixup\.js$/i;

    const candidates = sr.jsDocument.querySelectorAll('script[src]');
    let found = 0;

    candidates.forEach(ele => {
        if (PATTERN_SCRIPT.test(ele.getAttribute('src'))) {
            found += 1;
        }
    });

    if (found !== 1) {
        sr.error(self, 'not-found');
    }

    done();
};
