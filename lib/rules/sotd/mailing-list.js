// SotD
//  must link to mailing list, include its name, link to archive
//  below:

// If you wish to make comments regarding this document, please send them to
// <a href="mailto:public-html@w3.org">public-html@w3.org</a>
// (<a href="mailto:public-html-request@w3.org?subject=subscribe">subscribe</a>,
// <a href="http://lists.w3.org/Archives/Public/public-html/">archives</a>).

const self = {
    name: 'sotd.mailing-list'
};

exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(self, "no-sotd");
        return done();
    }
    var foundML = false
    ,   foundSub = false
    ,   foundArch = false
    ,   foundRepo = false
    ;
    $sotd.find("a[href]").each(function () {
        var $a = sr.$(this)
        ,   href = $a.attr("href")
        ,   text = sr.norm($a.text())
        ;
        if (/^mailto:.+@w3\.org(?:\?subject=.*)?$/i.test(href) &&
            !/.+-request@/.test(href)) {
            foundML = true;
            return;
        }
        if (/^mailto:.+?-request@w3\.org\?subject=subscribe$/i.test(href) && text === "subscribe") {
            foundSub = true;
            return;
        }
        if (/^https?:\/\/lists\.w3\.org\/Archives\//.test(href) && /archive/i.test(text)) {
            foundArch = true;
            return;
        }
        if (/^https:\/\/github.com\/[\w-]+\/[\w-]+\/issues/.test(href)) {
            foundRepo = true;
            return;
        }
    });
    if (!foundRepo) {
        if (!foundML) sr.error(self, "no-list");
        if (!foundSub) sr.warning(self, "no-sub");
    }
    if (!foundArch) sr.error(self, "no-arch");
    done();
};
