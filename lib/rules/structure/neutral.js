/**
 * @file make sure specification use netural words.
 */
const self = {
    name: 'structure.neutral'
};
const blocklist = [
    'master', 'masters', 'mastered',
    'slave', 'slaves',
    'grandfather', 'sanity', 'dummy',
    'whitelist', 'whitelists', 'blacklist', 'blacklists',
    'he', 'him', 'his',
    'she', 'her', 'hers'
];

exports.name = self.name;

exports.check = function (sr, done) {
    const blocklistReg = new RegExp('\\b' + blocklist.join('\\b|\\b') + '\\b', 'ig');
    let unneutralList = [];
    var links = sr.jsDocument.body.querySelectorAll('a');
    Array.prototype.forEach.call(links, link => {
        var href = link.href;
        var linkText = link.textContent;
        // let words in link like: <a href="https://github.com/master/usage">https://github.com/master/usage</a> --> pass the check
        if (href == linkText && blocklistReg.exec(linkText)) {
            link.remove();
        }
    });

    var text = sr.jsDocument.body.textContent;
    var regResult = text.match(blocklistReg);
    if (regResult) {
        regResult.forEach(word => {
            if (unneutralList.indexOf(word.toLowerCase()) < 0) {
                unneutralList.push(word.toLowerCase());
            }
        });
    }
    if (unneutralList.length) {
        sr.warning(self, "neutral", { words: unneutralList.join('", "') });
    }
    done();
};
