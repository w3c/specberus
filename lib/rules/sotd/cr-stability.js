// This 2 sentences exist in CR draft only, choose one of the 2.
const self = {
    name: 'sotd.cr-stability'
,   section: 'document-status'
,   rule: 'crStability'
};

exports.name = self.name;

exports.check = function (sr, done) {
var sotd = sr.getSotDSection();
    const STABILITY = "This document may be updated, replaced or obsoleted at any time. It is inappropriate to cite this document as other than work in progress.";
    const STABILITY_2 = "This document is maintained and updated at any time. Some parts of this document are work in progress.";

    if (sotd) {
        var s1Exist = false;
        var s2Exist = false;
        Array.prototype.forEach.call(sotd.querySelectorAll("p"), paragraph => {
            var txt = sr.norm(paragraph.textContent);
            s1Exist = s1Exist || (txt === STABILITY);
            s2Exist = s2Exist || (txt === STABILITY_2);
        });
        if (!s1Exist && !s2Exist) sr.error(self, "not-found");
        if (s1Exist && s2Exist) sr.error(self, "two-found");
    }
    done();
};
