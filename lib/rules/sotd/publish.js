const self = {
    name: 'sotd.publish'
,   section: 'document-status'
,   rule: 'publish'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    var crType = sr.config.crType;
    var text = 'This document was published by the (.)+ Working Group as a Candidate Recommendation ' + crType + '.';
    var PUBLISH = new RegExp(text);

    if (sotd) {
        var publishFound = false;
        Array.prototype.some.call(sotd.querySelectorAll("p"), paragraph => {
            var txt = sr.norm(paragraph.textContent);
            if (txt.match(PUBLISH)) {
                publishFound = true;
                return true;
            }
        });
        if (!publishFound) sr.error(self, "not-found", {txt: text});
    }
    done();
};
