
// SotD
//  must link to mailing list, include its name, link to archive
//  below:

// If you wish to make comments regarding this document, please send them to
// <a href="mailto:public-html@w3.org">public-html@w3.org</a>
// (<a href="mailto:public-html-request@w3.org?subject=subscribe">subscribe</a>,
// <a href="http://lists.w3.org/Archives/Public/public-html/">archives</a>).


exports.name = "sotd.mailing-list";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var foundML = false
    ,   foundSub = false
    ,   foundArch = false
    ;
    $sotd.find("a[href]").each(function () {
        var $a = sr.$(this)
        ,   href = $a.attr("href")
        ,   text = sr.norm($a.text())
        ;
        if (/^mailto:.+@w3\.org(?:\?subject=.*)?$/.test(href) &&
            !/.+-request@/.test(href) &&
            text === href.replace("mailto:", "").replace(/\?subject=.*/i, "")) {
            foundML = true;
            return;
        }
        if (/^mailto:.+?-request@w3\.org\?subject=subscribe$/.test(href) && text === "subscribe") {
            foundSub = true;
            return;
        }
        if (/^http:\/\/lists\.w3\.org\/Archives\//.test(href) && /^(?:comment) archive(?:s|d)?$/.test(text)) {
            foundArch = true;
            return;
        }
    });
    if (!foundML) sr.error(exports.name, "no-list");
    if (!foundSub) sr.warning(exports.name, "no-sub");
    if (!foundArch) sr.error(exports.name, "no-arch");
    done();
};
