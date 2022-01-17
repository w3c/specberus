/**
 * @file make sure specification use neutral words.
 */
const badterms = require('../../../public/badterms.json');

const self = {
    name: 'structure.neutral',
};

// get blocklist from json file
let blocklist = [];
badterms.forEach(item => {
    blocklist = blocklist.concat(item.term);
    if (item.variation) {
        blocklist = blocklist.concat(item.variation);
    }
});

exports.name = self.name;

exports.check = function (sr, done) {
    const blocklistReg = new RegExp(`\\b${blocklist.join('\\b|\\b')}\\b`, 'ig');
    const unneutralList = [];
    // Use a cloned body instead of the original one, prevent '.remove()' side effects.
    const body2 = sr.jsDocument.body.cloneNode(true);
    const links = body2.querySelectorAll('a');
    Array.prototype.forEach.call(links, link => {
        const { href } = link;
        const linkText = link.textContent;
        // let words in link like: <a href="https://github.com/master/usage">https://github.com/master/usage</a> --> pass the check
        if (href === linkText && blocklistReg.exec(linkText)) {
            link.remove();
        }
    });

    const text = body2.textContent;
    const regResult = text.match(blocklistReg);
    if (regResult) {
        regResult.forEach(word => {
            if (unneutralList.indexOf(word.toLowerCase()) < 0) {
                unneutralList.push(word.toLowerCase());
            }
        });
    }
    if (unneutralList.length) {
        sr.warning(self, 'neutral', { words: unneutralList.join('", "') });
    }
    done();
};
