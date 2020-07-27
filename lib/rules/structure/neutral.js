/**
 * @file make sure specification use netural words.
 */
const self = {
    name: 'structure.neutral'
};
const blocklist = ['master', 'slave', 'grandfather', 'sanity', 'dummy', 'whitelist', 'blacklist'];

exports.name = self.name;

exports.check = function (sr, done) {
    var blocklistReg = new RegExp('\\b' + blocklist.join('\\b|\\b') + '\\b', 'i');
    Array.prototype.forEach.call(sr.jsDocument.body.children, child => {
        var links = child.querySelectorAll('a');
        Array.prototype.forEach.call(links, link => {
            var href = link.href;
            var linkText = link.textContent;
            // let words in link like: <a href="https://github.com/master/usage">https://github.com/master/usage</a> --> pass the check
            if (href == linkText && blocklistReg.exec(linkText)) {
                link.remove();
            }
        });

        var text = child.textContent;
        var regResult = blocklistReg.exec(text);
        if (regResult) {
            var word = regResult[0];
            // Get context of the unneutral word. max 100 words.
            var contextStart = Math.max(regResult.index - 50, 0);
            var contextEnd = Math.min(regResult.index + 50, text.length);
            var context = (contextStart == 0 ? '' : '...') +
                text.slice(contextStart, contextEnd) +
                (contextEnd == text.length ? '' : '...');

            sr.warning(self, "neutral", { word, context });
        }
    });
    done();
};
