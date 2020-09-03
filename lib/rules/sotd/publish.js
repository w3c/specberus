const self = {
    name: 'sotd.publish'
,   section: 'document-status'
,   rule: 'publish'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    var docType = crType ? "Candidate Recommendation " + crType : sr.config.longStatus;
    var crType = sr.config.crType;
    var text = 'This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group)( and the (.+? Working Group|Technical Architecture Group))? as a ' + docType + '.';
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
