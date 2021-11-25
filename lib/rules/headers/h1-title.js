// must have h1, with same content as title

const self = {
    name: 'headers.h1-title',
    section: 'front-matter',
    rule: 'title',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const title = sr.jsDocument.querySelector('head > title');
    console.log('found title: ', title);
    const h1 = sr.jsDocument.querySelector('body div.head h1');
    console.log('found h1: ', h1);
    if (!title || !h1) {
        console.log('no h1 or title, error');
        sr.error(self, 'not-found');
    } else {
        const titleText = sr.norm(title.textContent);
        h1.innerHTML = h1.innerHTML
            .replace(/:<br>/g, ': ')
            .replace(/<br>/g, ' - ');
        const h1Text = sr.norm(h1.textContent);
        console.log('found titleText: ', titleText);
        console.log('found h1Text: ', h1Text);
        if (titleText !== h1Text)
            sr.error(self, 'not-match', { titleText, h1Text });
    }
    done();
};
