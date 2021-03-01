// must have h1, with same content as title

const self = {
    name: 'headers.h1-title',
    section: 'front-matter',
    rule: 'title',
};

exports.name = self.name;

exports.check = function (sr, done) {
    var title = sr.jsDocument.querySelector('head > title');
    var h1 = sr.jsDocument.querySelector('body div.head h1');
    if (!title || !h1) {
        sr.error(self, 'not-found');
    } else {
        var titleText = sr.norm(title.textContent);
        h1.innerHTML = h1.innerHTML
            .replace(/:<br>/g, ': ')
            .replace(/<br>/g, ' - ');
        var h1Text = sr.norm(h1.textContent);
        if (titleText !== h1Text)
            sr.error(self, 'not-match', { titleText, h1Text });
    }
    done();
};
