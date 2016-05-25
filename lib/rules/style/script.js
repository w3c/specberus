/**
 * Check whether the script <code>fixup.js</code> is linked in the page.
 */

const self = {
    name: 'style.script'
};

exports.check = function (sr, done) {

    const PATTERN_SCRIPT = /^(https?:)?\/\/(www\.)?w3\.org\/scripts\/tr\/2016\/fixup\.js$/i;

    var candidates = sr.$('script[src]')
    ,   found = 0;

    candidates.each(function(foo, ele) {
        if(ele.attribs && PATTERN_SCRIPT.test(ele.attribs.src)) {
            found++;
        }
    });

    if (1 !== found) {
        sr.error(self, 'not-found');
    }

    done();

};
