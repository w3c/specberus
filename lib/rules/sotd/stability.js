// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership. This is a
// draft document and may be updated, replaced or obsoleted by other documents at any time. It is
// inappropriate to cite this document as other than work in progress.</p>
const util = require('../../util');
function findSW(candidates, sr) {
    var crType = sr.config.crType
    ,   INTRO_S = "A Candidate Recommendation Snapshot has received wide review and is intended to gather implementation experience."
    ,   INTRO_D = "A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot."
    ,   CR_INTRO = crType === "Draft" ? INTRO_D : INTRO_S
    ,   DRAFT_STATEMENT = "This is a draft document and may be updated, replaced or obsoleted by other documents at any time."
    ,   sw = null
    ,   article = (sr.config.longStatus == "Interest Group Note") ? "an" : "a"
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
,   section: 'document-status'
,   rule: 'stability'
};

exports.name = self.name;

exports.check = function (sr, done) {
    if (!sr.config.stabilityWarning) return done();
    var sotd = sr.getSotDSection();
    if (sotd) {
        if (sr.config.stabilityWarning === "REC") {
            var txt = sr.norm(sotd && sotd.textContent)
            ,   wanted = "A W3C Recommendation is a specification that, after extensive " +
                         "consensus-building, has received the endorsement of the W3C and " +
                         "its Members. W3C recommends the wide deployment of this " +
                         "specification as a standard for the Web."
            ,   rex = new RegExp(wanted.replace(/\./g, "\\."))
            ;
            if (!rex.test(txt)) sr.error(self, "no-rec-review");
        }
        else {
            var paragraph = util.filter(sotd, "p");
            var sw = findSW(paragraph.length ? paragraph : sotd.querySelectorAll("p"), sr);
            if (!sw)
                sr.error(self, "no-stability");
            else if (sr.config.crType === "Snapshot") {
                var review = Array.prototype.find.call(sw.querySelectorAll('a'), ele => ele.textContent === "wide review");
                if (!review)
                    sr.error(self, "no-cr-review");
                else if (review.href !== "https://www.w3.org/2020/Process-20200915/#dfn-wide-review")
                    sr.error(self, "wrong-cr-review-link");
            }
        }
    }
    done();
};
