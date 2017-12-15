function findSubmText ($candidates, sr) {
    var $st = null;
    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted = "By publishing this document, W3C acknowledges that the Submitting Members " +
                     "have made a formal Submission request to W3C for discussion. Publication of " +
                     "this document by W3C indicates no endorsement of its content by W3C, nor " +
                     "that W3C has, is, or will be allocating any resources to the issues " +
                     "addressed by it. This document is not the product of a chartered W3C group, " +
                     "but is published as potential input to the W3C Process. A W3C Team Comment " +
                     "has been published in conjunction with this Member Submission. Publication " +
                     "of acknowledged Member Submissions at the W3C site is one of the benefits " +
                     "of W3C Membership. Please consult the requirements associated with Member " +
                     "Submissions of section 3.3 of the W3C Patent Policy. Please consult the " +
                     "complete list of acknowledged W3C Member Submissions."
        ;
        if (text === wanted) {
            $st = $p;
            return false;
        }
    });
    return $st;
}

const self = {
    name: 'sotd.submission'
};

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if ($sotd && $sotd.length) {
        var $st = findSubmText($sotd.filter("p"), sr) || findSubmText($sotd.find("p"), sr);
        if (!$st || !$st.length) {
            sr.error(self, "no-submission-text");
            return done();
        }

        // check the links
        var w3cProcess = "https://www.w3.org/Consortium/Process"
        ,   w3cMembership = "https://www.w3.org/Consortium/Prospectus/Joining"
        ,   w3cPP = "https://www.w3.org/Consortium/Patent-Policy-20030520.html#sec-submissions"
        ,   w3cSubm = "https://www.w3.org/Submission"
        ,   foundW3Cprocess = false
        ,   foundW3Cmembership = false
        ,   foundPP = false
        ,   foundSubm = false
        ;
        $st.find("a[href]").each(function () {
            var $a = sr.$(this)
            ,   href = $a.attr("href")
            ,   text = sr.norm($a.text())
            ;
            if (href === w3cProcess && text === "W3C Process") {
                foundW3Cprocess = true;
                return;
            }
            if (href === w3cMembership && text === "W3C Membership") {
                foundW3Cmembership = true;
                return;
            }
            if (href === w3cPP && text === "section 3.3 of the W3C Patent Policy") {
                foundPP = true;
                return;
            }
            if (href === w3cSubm && text === "list of acknowledged W3C Member Submissions") {
                foundSubm = true;
                return;
            }
            if (href.indexOf(w3cSubm + '/') !== 0 && text === "Submitting Members") {
                foundSubmMembers = true;
                return;
            }
            if (href.indexOf(w3cSubm + '/') !== 0 && text === "W3C Team Comment") {
                foundComment = true
                return;
            }
        });
        if (!foundW3Cprocess) sr.error(self, "link-text", { href: w3cProcess, text: "W3C Process" });
        if (!foundW3Cmembership) sr.error(self, "link-text", { href: w3cMembership, text: "W3C Membership" });
        if (!foundPP) sr.error(self, "link-text", { href: w3cPP, text: "section 3.3 of the W3C Patent Policy" });
        if (!foundSubm) sr.error(self, "link-text", { href: w3cSubm, text: "list of acknowledged W3C Member Submissions" });
        if (!foundSubmMembers) sr.error(self, "no-sm-link");
        if (!foundComment) sr.error(self, "no-tc-link");
    }
    done();
};
