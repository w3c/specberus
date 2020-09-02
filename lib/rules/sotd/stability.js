// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership. This is a
// draft document and may be updated, replaced or obsoleted by other documents at any time. It is
// inappropriate to cite this document as other than work in progress.</p>
const util = require('../../util');
function findSW(candidates, sr) {
    var crType = sr.config.crType;
    var INTRO_S = "A Candidate Recommendation Snapshot has received wide review and is intended to gather implementation experience.";
    var INTRO_D = "A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.";
    var CR_INTRO = crType == "Draft" ? INTRO_D : INTRO_S;
    var DRAFT_STATEMENT = "This is a draft document and may be updated, replaced or obsoleted by other documents at any time.";
    var sw = null;
    var article = (sr.config.longStatus == "Interest Group Note") ? "an" : "a"
    ,   represent = (sr.config.status == 'WD' || sr.config.status == 'FPWD') ? "( does not necessarily represent a consensus of the Working Group and)?" : ""
    ,   wanted = "^Publication as " + article + " " + sr.config.longStatus +
        represent + " does not imply endorsement by the W3C Membership. " + (crType ? CR_INTRO : DRAFT_STATEMENT)
    ;
    if (!sr.config.longStatus.match('Note$') && sr.config.longStatus !== 'Candidate Recommendation') {
        wanted += " It is inappropriate to cite this document as other than work in progress.$";
    }
    Array.prototype.some.call(candidates, p => {
        var text = sr.norm(p.textContent);
        if (text.match(wanted)) {
            sw = p;
            return true;
        }
    });
    return sw;
}

const self = {
    name: 'sotd.stability'
};

exports.name = self.name;

exports.check = function (sr, done) {
    if (!sr.config.stabilityWarning) return done();
    var sotd = sr.getSotDSection();
    if (sotd) {
        if (sr.config.stabilityWarning === "REC") {
            var txt = sr.norm(sotd && sotd.textContent)
            ,   wanted = "This document has been reviewed by W3C Members, by software developers, " +
                         "and by other W3C groups and interested parties, and is endorsed by the " +
                         "Director as a W3C Recommendation. It is a stable document and may be used " +
                         "as reference material or cited from another document. W3C's role in making " +
                         "the Recommendation is to draw attention to the specification and to " +
                         "promote its widespread deployment. This enhances the functionality and " +
                         "interoperability of the Web."
            ,   rex = new RegExp(wanted.replace(/\./g, "\\."))
            ;
            if (!rex.test(txt)) sr.error(self, "no-rec-review");
        }
        else {
            var sw = findSW(util.filter(sotd, "p"), sr) || findSW(sotd.querySelectorAll("p"), sr);
            if (!sw)
                sr.error(self, "no-stability");
        }
    }
    done();
};
