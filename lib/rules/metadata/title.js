/**
 * Pseudo-rule for metadata extraction: title.
 */

// 'self.name' would be 'metadata.title'

exports.name = 'metadata.title';

exports.check = function (sr, done) {
    const title = sr.jsDocument.querySelector('body div.head h1');
    if (!title) {
        return done();
    }
    title.innerHTML = title.innerHTML
        .replace(/:<br>/g, ': ')
        .replace(/<br>/g, ' - ');
    return done({
        title: sr.norm(title.textContent),
    });
};
