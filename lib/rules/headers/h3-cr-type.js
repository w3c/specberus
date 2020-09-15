// must have h3, with content as "Draft" or "Snapshot"

const self = {
    name: 'headers.h3-cr-type'
,   section: 'front-matter'
,   rule: 'h3CrType'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var crType = sr.config.crType;
    var h3 = sr.jsDocument.querySelector("body div.head h3");
    if (!h3) {
        sr.error(self, "not-found");
    } else if (sr.norm(h3.textContent) !== crType) {
        sr.error(self, "not-match", {txt: crType});
    }
    done();
};
