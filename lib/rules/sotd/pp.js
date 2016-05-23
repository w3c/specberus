function buildWanted (groups, sr) {

    var config = sr.config
    ,   wanted
    ,   isPP2002 = (config.patentPolicy === "pp2002");

    if (isPP2002)
        wanted = "This document is governed by the 24 January 2002 CPP as amended by the W3C Patent " +
                 "Policy Transition Procedure\\. ";
    else {
        wanted = "This document was produced by " +
                 ((groups.length == 2) ? "groups " : "a group ") +
                 "operating under the 5 February 2004 W3C Patent Policy\\. ";
        if (config.recTrackStatus && config.noRecTrack)
            wanted += ((groups.length == 2) ? "The groups do not " : "The group does not ") +
                      "expect this document to become a W3C Recommendation\\. ";
        if (config.informativeOnly)
            wanted += "This document is informative only\\. ";
    }
    wanted += "W3C maintains ";
    if (groups.length < 2) {
        wanted += "a public list of any patent disclosures";
    } else {
        wanted += groups.map(function(wg) {
                    return "a public list of any patent disclosures \\(" + wg + "( Working Group)?\\)";
                  }).join(" and ");
    }
    wanted += " made in connection with the deliverables of " +
              ((groups.length == 2) ? "each group; these pages also include " : "the group; that page also includes ") +
              "instructions for disclosing a patent\\.";
    if (config.recTrackStatus || config.noteStatus || isPP2002)
        wanted += " An individual who has actual knowledge of a patent which the individual " +
                  "believes contains Essential Claim\\(s\\) must disclose the information in " +
                  "accordance with section 6 of the W3C Patent Policy\\.";
    return new RegExp(wanted);
}

function findPP ($candidates, sr) {
    var $pp = null
    ,   groups = []
    ,   expected;
    $candidates.each(function () {
        var $p = sr.$(this)
        ,   text = sr.norm($p.text())
        ,   wanted = buildWanted(groups, sr)
        ,   jointRegex = /This document was published by the (.+) Working Group and the (.+) Working Group./;
        ;
        expected=wanted;
        if (jointRegex.test(text)) {
          var matches = text.match(jointRegex);
          groups.push(matches[1]);
          groups.push(matches[2]);
          sr.warning(self, "joint-publication");
        }
        if (wanted.test(text)) {
            $pp = $p;
            return false;
        }
    });
    if ($candidates.length > 0 && !$pp) {
      sr.info(self, "expected-pp", { "expected": expected });
    }
    return $pp;
}

const self = {
    name: 'sotd.pp'
};

exports.check = function (sr, done) {

    var $sotd = sr.getSotDSection();
    if (!$sotd || !$sotd.length) {
        sr.error(self, "no-sotd");
        return done();
    }
    var $pp = findPP($sotd.filter("p").add($sotd.find("p")), sr);
    if (!$pp || !$pp.length) {
        sr.error(self, "no-pp");
        return done();
    }
    var foundFeb5 = false
    ,   foundPublicList = false
    ,   foundEssentials = false
    ,   foundSection6 = false
    ,   foundJan24 = false
    ,   foundPPTransition = false
    ;
    $pp.find("a[href]").each(function () {
        var $a = sr.$(this)
        ,   href = $a.attr("href")
        ,   text = sr.norm($a.text())
        ;
        if ((href === "http://www.w3.org/Consortium/Patent-Policy-20040205/" ||
            href === "https://www.w3.org/Consortium/Patent-Policy-20040205/") &&
            text === "5 February 2004 W3C Patent Policy") {
            foundFeb5 = true;
            return;
        }
        if (/^https?:\/\/www\.w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/.test(href) &&
            /public list of any patent disclosures( \(.+\))?/.test(text) &&
            $a.attr("rel") === "disclosure") {
            foundPublicList = true;
            return;
        }
        if ((href === "http://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential" ||
            href === "https://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential") &&
            text === "Essential Claim(s)") {
            foundEssentials = true;
            return;
        }
        if ((href === "http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure" ||
            href === "https://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure") &&
            text === "section 6 of the W3C Patent Policy") {
            foundSection6 = true;
            return;
        }
        if ((href === "http://www.w3.org/TR/2002/NOTE-patent-practice-20020124" ||
            href === "https://www.w3.org/TR/2002/NOTE-patent-practice-20020124") &&
            text === "24 January 2002 CPP") {
                foundJan24 = true;
                return;
        }
        if ((href === "http://www.w3.org/2004/02/05-pp-transition" ||
            href === "https://www.w3.org/2004/02/05-pp-transition") &&
            text === "W3C Patent Policy Transition Procedure") {
                foundPPTransition = true;
                return;
        }
    });

    var isPP2002 = (sr.config.patentPolicy === "pp2002");
    if (!foundJan24 && isPP2002) sr.error(self, "no-jan24");
    if (!foundPPTransition && isPP2002) sr.error(self, "no-pp-transition");
    if (!foundFeb5 && !isPP2002) sr.error(self, "no-feb5");
    if (!foundPublicList) sr.error(self, "no-disclosures");
    if ((sr.config.recTrackStatus || sr.config.noteStatus) && !foundEssentials)
        sr.error(self, "no-claims");
    if ((sr.config.recTrackStatus || sr.config.noteStatus) && !foundSection6)
        sr.error(self, "no-section6");
    done();
};
