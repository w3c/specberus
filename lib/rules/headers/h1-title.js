// must have h1, with same content as title

const self = {
    name: 'headers.h1-title'
,   section: 'front-matter'
,   rule: 'title'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var $title = sr.$("head > title").first()
    ,   $h1 = sr.$("body div.head h1").first()
    ;
    if (!$title.length || !$h1.length || sr.norm($title.text()) !== sr.norm($h1.text())) {
        sr.error(self, "title");
    }
    done();
};
