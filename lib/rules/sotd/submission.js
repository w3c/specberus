
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

exports.name = "sotd.submission";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var $st = findSubmText($sotd.filter("p"), sr) || findSubmText($sotd.find("p"), sr);
    if (!$st || !$st.length) {
        sr.error(exports.name, "no-submission-text");
        return done();
    }

    // check the links
    var links = {
        "http://www.w3.org/Consortium/Process":             "W3C Process"
    ,   "http://www.w3.org/Consortium/Prospectus/Joining":  "W3C Membership"
    ,   "http://www.w3.org/Consortium/Patent-Policy-20030520.html#sec-submissions":  "section 3.3 of the W3C Patent Policy"
    ,   "http://www.w3.org/Submission":  "list of acknowledged W3C Member Submissions"
    };
    for (var href in links) {
        if (!$st.find("a[href='" + href + "']:contains('" + links[href] + "')").length)
            sr.error(exports.name, "link-text", { href: href, text: links[href] });
    }
    var $sm = $st.find("a:contains('Submitting Members')")
    ,   $tc = $st.find("a:contains('W3C Team Comment')")
    ;
    if (!$sm.length || !$sm.attr("href") ||
        $sm.attr("href").indexOf("http://www.w3.org/Submission/") !== 0)
            sr.error(exports.name, "no-sm-link");
    if (!$tc.length || !$tc.attr("href") ||
        $tc.attr("href").indexOf("http://www.w3.org/Submission/") !== 0)
            sr.error(exports.name, "no-tc-link");

    done();
};


