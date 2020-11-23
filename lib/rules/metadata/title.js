/**
 * Pseudo-rule for metadata extraction: title.
 */

// 'self.name' would be 'metadata.title'

exports.name = "metadata.title";

exports.check = function(sr, done) {
    var title = sr.jsDocument.querySelector("body div.head h1");
    ;
    if (!title) {
        return done();
    } else {
        return done({title: sr.norm(title.innerHTML.replace(/:<br>/g, ": ").replace(/<br>/g, " - "))});
    }
};
