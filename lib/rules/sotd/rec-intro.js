const self = {
    name: 'sotd.rec-intro'
,   section: 'document-status'
,   rule: 'intro'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    const INTRO = "A W3C Recommendation is a specification that, after extensive consensus-building, has received the endorsement of the W3C and its Members. W3C recommends the wide deployment of this specification as a standard for the Web.";

    if (sotd) {
        var introExist = Array.prototype.some.call(sotd.querySelectorAll("p"), paragraph => {
            var txt = sr.norm(paragraph.textContent);
            if (txt === INTRO)
                return true;
        });
        if (!introExist) sr.error(self, "not-found");
    }
    done();
};
