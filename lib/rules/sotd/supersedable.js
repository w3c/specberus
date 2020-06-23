// SotD
//  must start with
//      <p><em>This section describes the status of this document at the time of its publication.
//      Other documents may supersede this document. A list of current W3C publications and the
//      latest revision of this technical report can be found in the
//      <a href="http://www.w3.org/TR/">W3C technical reports index</a> at http://www.w3.org/TR/.</em></p>

const util = require('../../util');
const self = {
    name: 'sotd.supersedable'
,   section: 'document-status'
,   rule: 'boilerplateTRDoc'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {
        var em;
        Array.prototype.some.call(util.filter(sotd, "p"), paragraph => {
            if (paragraph.querySelector("em")) {
                em = paragraph.querySelector("em");
                return true;
            }
        });
        if (!em) em = sotd.querySelectorAll("p em") && sotd.querySelector("p em");
        var txt = sr.norm(em.textContent)
        ,   wanted = "This section describes the status of this document at the time of its " +
                     "publication. Other documents may supersede this document. A list of current " +
                     "W3C publications " +
                     ((sr.config.status === "SUBM") ? "" : "and the latest revision of this technical report ") +
                     "can be found in the W3C technical reports index at https://www.w3.org/TR/."
        ,   a = em.querySelectorAll("a[href='https://www.w3.org/TR/']")
        ;
        if (txt !== wanted) sr.error(self, "no-sotd-intro");
        if (!a.length) sr.error(self, "no-sotd-tr");
    }
    done();
};
