
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
        sr.sink.emit("err", exports.name, { message: "No SotD section" });
        return done();
    }
    var foundML = false
    ,   foundSub = false
    ,   foundArch = false
    ;
    $sotd.find("a[href]").each(function () {
        var $a = sr.$(this)
        ,   href = $a.attr("href")
        ,   text = $a.text()
        ;
        if (/^mailto:.+@w3\.org$/.test(href) &&
            !/.+-request@/.test(href) &&
            text === href.replace("mailto:", "")) {
            foundML = true;
            return;
        }
        if (/^mailto:.+?-request@w3\.org\?subject=subscribe$/.test(href) && text === "subscribe") {
            foundSub = true;
            return;
        }
        if (/^http:\/\/lists\.w3\.org\/Archives\//.test(href) && text === "archives") {
            foundArch = true;
            return;
        }
    });
    if (!foundML)
        sr.sink.emit("err", exports.name, { message: "No mailing list link." });
    if (!foundSub)
        sr.sink.emit("err", exports.name, { message: "No mailing list subscription link." });
    if (!foundArch)
        sr.sink.emit("err", exports.name, { message: "No mailing list archives link." });
    done();
};
