
'use strict';

function buildWanted (sr) {

    var config = sr.config
    ,   wanted
    ,   isPP2002 = (config.patentPolicy === "pp2002");

    if (isPP2002)
        wanted = "This document is governed by the 24 January 2002 CPP as amended by the W3C Patent " +
                 "Policy Transition Procedure. ";
    else {
        wanted = "This document was produced by a group operating under the 5 February 2004 W3C " +
                 "Patent Policy. ";
        if (config.recTrackStatus && config.noRecTrack)
            wanted += "The group does not expect this document to become a W3C Recommendation. ";
        if (config.informativeOnly)
            wanted += "This document is informative only. ";
    }
    wanted += "W3C maintains a public list of any patent disclosures made in connection with " +
              "the deliverables of the group; that page also includes instructions for disclosing " +
              "a patent.";
    if (config.recTrackStatus || config.noteStatus || isPP2002)
        wanted += " An individual who has actual knowledge of a patent which the individual " +
                  "believes contains Essential Claim(s) must disclose the information in " +
                  "accordance with section 6 of the W3C Patent Policy.";
    return wanted;
}

function findPP ($candidates, sr) {
    var $pp = null;
    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted = buildWanted(sr)
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

    // Pseudo-constants:
    var DELIVERER_ID_REGEX = /pp-impl\/(\d+)\/status/;

    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }
    var $pp = findPP($sotd.filter("p"), sr) || findPP($sotd.find("p"), sr);
    if (!$pp || !$pp.length) {
        sr.error(exports.name, "no-pp");
        return done();
    }
    var foundFeb5 = false
    ,   foundPublicList = false
    ,   foundEssentials = false
    ,   foundSection6 = false
    ,   foundJan24 = false
    ,   foundPPTransition = false
    ;
    $sotd.find("a[href]").each(function () {
        var $a = sr.$(this)
        ,   href = $a.attr("href")
        ,   text = sr.norm($a.text())
        ,   ids
        ;
        if (href === "http://www.w3.org/Consortium/Patent-Policy-20040205/" &&
            text === "5 February 2004 W3C Patent Policy") {
            foundFeb5 = true;
            return;
        }
        if (/^http:\/\/www\.w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/.test(href) &&
            text === "public list of any patent disclosures") {
            ids = DELIVERER_ID_REGEX.exec(href);
            if (ids && 2 === ids.length) {
                sr.metadata('delivererIDs', parseInt(ids[1], 10));
            }
            if ($a.attr("rel") === "disclosure") {
                foundPublicList = true;
                return;
            }
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
        if (href === "http://www.w3.org/TR/2002/NOTE-patent-practice-20020124" &&
            text === "24 January 2002 CPP") {
                foundJan24 = true;
                return;
        }
        if (href === "http://www.w3.org/2004/02/05-pp-transition" &&
            text === "W3C Patent Policy Transition Procedure") {
                foundPPTransition = true;
                return;
        }
    });

    var isPP2002 = (sr.config.patentPolicy === "pp2002");
    if (!foundJan24 && isPP2002) sr.error(exports.name, "no-jan24");
    if (!foundPPTransition && isPP2002) sr.error(exports.name, "no-pp-transition");
    if (!foundFeb5 && !isPP2002) sr.error(exports.name, "no-feb5");
    if (!foundPublicList) sr.error(exports.name, "no-disclosures");
    if ((sr.config.recTrackStatus || sr.config.noteStatus) && !foundEssentials)
        sr.error(exports.name, "no-claims");
    if ((sr.config.recTrackStatus || sr.config.noteStatus) && !foundSection6)
        sr.error(exports.name, "no-section6");
    done();
};

