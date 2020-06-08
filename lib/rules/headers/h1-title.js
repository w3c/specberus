// must have h1, with same content as title

const self = {
    name: 'headers.h1-title'
,   section: 'front-matter'
,   rule: 'title'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var title = sr.jsDocument.querySelector("head > title")
    ,   h1 = sr.jsDocument.querySelector("body div.head h1")
    ;
    if (!title || !h1 || sr.norm(title.textContent) !== sr.norm(h1.textContent)) {
        sr.error(self, "title");
    }
    done();
};
