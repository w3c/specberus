const self = {
    name: 'sotd.cr-intro'
,   section: 'document-status'
,   rule: 'crIntro'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    var crType = sr.config.crType;

    var INTRO_S = "Publication as a Candidate Recommendation does not imply endorsement by the W3C Membership. A Candidate Recommendation Snapshot has received wide review and is intended to gather implementation experience.";
    var INTRO_D = "Publication as a Candidate Recommendation does not imply endorsement by the W3C Membership. A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.";
    var INTRO = crType == "Draft" ? INTRO_D : INTRO_S;
    var PUBLISH = new RegExp("This document was published by the (.)+ Working Group as a Candidate Recommendation " + crType + '.');

    if (sotd) {
        var introFound = false;
        var publishFound = false;
        Array.prototype.some.call(sotd.querySelectorAll("p"), paragraph => {
            var txt = sr.norm(paragraph.textContent);
            if (txt.match(PUBLISH)) publishFound = true;
            if (txt === INTRO) introFound = true;
            if (introFound && publishFound) return true;
        });
        if (!introFound) sr.error(self, "not-found", { txt: INTRO });
        if (!publishFound) sr.error(self, "not-found", {txt: PUBLISH});
    }
    done();
};
