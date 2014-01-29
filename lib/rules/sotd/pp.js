
// SotD
//  patent policy
//  <p> This document was produced by a group operating under the
//  <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/">5 February 2004 W3C Patent Policy</a>.
//  W3C maintains a <a rel="disclosure" href="@@URI to IPP status or other page@@">public list of any
//  patent disclosures</a> made in connection with the deliverables of the group; that page also
//  includes instructions for disclosing a patent. An individual who has actual knowledge of a patent
//  which the individual believes contains
//  <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential">Essential Claim(s)</a>
//  must disclose the information in accordance with
//  <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure">section 6 of the
//  W3C Patent Policy</a>. </p>

function findPP ($candidates, sr) {
    var $pp = null;
    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted = "This document was produced by a group operating under the 5 February 2004 " +
                     "W3C Patent Policy. W3C maintains a public list of any patent disclosures " +
                     "made in connection with the deliverables of the group; that page also " +
                     "includes instructions for disclosing a patent. An individual who has " +
                     "actual knowledge of a patent which the individual believes contains " +
                     "Essential Claim(s) must disclose the information in accordance with " +
                     "section 6 of the W3C Patent Policy."
        ;
        if (text === wanted) {
            $pp = $p;
            return false;
        }
    });
    return $pp;
}

exports.name = "sotd.pp";
exports.check = function (sr, done) {
    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.sink.emit("err", exports.name, { message: "No SotD section" });
        return done();
    }
    var $pp = findPP($sotd.filter("p"), sr) || findPP($sotd.find("p"), sr);
    if (!$pp || !$pp.length) {
        sr.sink.emit("err", exports.name, { message: "No patent policy paragraph" });
        return done();
    }
    var foundFeb5 = false
    ,   foundPublicList = false
    ,   foundEssentials = false
    ,   foundSection6 = false
    ;
    $sotd.find("a[href]").each(function () {
        var $a = sr.$(this)
        ,   href = $a.attr("href")
        ,   text = sr.norm($a.text())
        ;
        if (href === "http://www.w3.org/Consortium/Patent-Policy-20040205/" &&
            text === "5 February 2004 W3C Patent Policy") {
            foundFeb5 = true;
            return;
        }
        if (/^http:\/\/www\.w3\.org\/2004\/01\/pp-impl\/\d+\/status$/.test(href) &&
            text === "public list of any patent disclosures" &&
            $a.attr("rel") === "disclosure") {
            foundPublicList = true;
            return;
        }
        if (href === "http://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential" &&
            text === "Essential Claim(s)") {
            foundEssentials = true;
            return;
        }
        if (href === "http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure" &&
            text === "section 6 of the W3C Patent Policy") {
            foundSection6 = true;
            return;
        }
    });

    if (!foundFeb5)
        sr.sink.emit("err", exports.name, { message: "No link to Feb 5 PP." });
    if (!foundPublicList)
        sr.sink.emit("err", exports.name, { message: "No link to public list of disclosures." });
    if (!foundEssentials)
        sr.sink.emit("err", exports.name, { message: "No link to definition of essential claims." });
    if (!foundSection6)
        sr.sink.emit("err", exports.name, { message: "No link to section 6." });
    done();
};
