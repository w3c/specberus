const util = require('../../util');
function buildWanted (groups, sr) {

    var config = sr.config
    ,   wanted
    ,   result = {}
    ,   isPP2002 = (config.patentPolicy === "pp2002")
    ,   isWGNote = (config.longStatus === "Working Group Note")
    ,   isAmended = config.amended
    ;

    if (isPP2002)
        wanted = "This document is governed by the 24 January 2002 CPP as amended by the W3C Patent " +
                    "Policy Transition Procedure\\. ";
    else {
        var start = (!isAmended) ? "This document " : "The Recommendation from which this document is derived ";
        wanted = start + "was produced by " +
                    ((groups.length == 2) ? "groups " : "a group ") +
            "operating under the( 5 February 2004)? W3C Patent Policy\\. ?";

        var noRec = ((groups.length == 2) ? "The groups do not " : "The group does not ") +
            "expect this document to become a W3C Recommendation\\. ?";
        if (config.recTrackStatus && config.noRecTrack)
            wanted += noRec;
        else if (isWGNote)
            wanted += "(" + noRec + ')?';
        
        if (config.informativeOnly && !config.noteStatus)
            wanted += "This document is informative only\\. ";
    }
    if (!isWGNote) {
        wanted += "W3C maintains ";
        if (groups.length < 2) {
            wanted += "a public list of any patent disclosures";
        } else {
            wanted += groups.map(function(wg) {
                        return "a public list of any patent disclosures \\(" + wg.replace(' Working Group', '') + "( Working Group)?\\)";
                        }).join(" and ");
        }
        wanted += " made in connection with the deliverables of " +
                    ((groups.length == 2) ? "each group; these pages also include " : "the group; that page also includes ") +
                    "instructions for disclosing a patent\\.";
        if (config.recTrackStatus || config.noteStatus || isPP2002)
            wanted += " An individual who has actual knowledge of a patent which the individual " +
                        "believes contains Essential Claim\\(s\\) must disclose the information in " +
                        "accordance with section 6 of the W3C Patent Policy\\.";
        if (isAmended)
            wanted += " This Amended Recommendation was produced by incorporating errata after that group closed\\.";
    }
    wanted = '^' + wanted + '$';
    result.regex = new RegExp(wanted);
    result.text  = wanted.replace(/\\/g, '');
    return result;
}

function findPP (candidates, sr) {
    var pp = null
    ,   groups = []
    ,   expected;
    Array.prototype.some.call(candidates, p => {
        var text = sr.norm(p.textContent)
        ,   wanted = buildWanted(groups, sr)
        ,   jointRegex = new RegExp('This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group)' +
            ' and the (.+? Working Group|Technical Architecture Group)');
        expected = wanted.text;
        if (jointRegex.test(text)) {
          var matches = text.match(jointRegex);
          groups.push(matches[1]);
          groups.push(matches[2]);
          sr.warning(self, "joint-publication");
        }
        if (wanted.regex.test(text)) {
            pp = p;
            return true;
        }
    });
    if (candidates.length > 0 && !pp) {
      sr.info(self, "expected-pp", { "expected": expected });
    }
    return pp;
}

const self = {
    name: 'sotd.pp'
};

exports.name = self.name;

const selfDisclosures = {
    name: 'sotd.pp'
,   section: 'document-status'
,   rule: 'patPolReq'
};

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    if (sotd) {
        var pp = findPP(util.filter(sotd, "p").concat(...sotd.querySelectorAll("p")), sr);
        if (!pp) {
            sr.error(self, "no-pp");
            return done();
        }

        var ppLink = "https://www.w3.org/Consortium/Patent-Policy/"
        ,   deprecatedPp = "https://www.w3.org/Consortium/Patent-Policy-20040205/"
        ,   deprecatedAllowed = false;

        sr.transition({
            to:           new Date('2017-11-30')
        ,   doMeanwhile:  function() { deprecatedAllowed = true; }
        ,   doAfter:      () => {}
        });

        var found2017Aug1 = false
        ,   foundFeb5 = false
        ,   foundPublicList = false
        ,   foundEssentials = false
        ,   foundSection6 = false
        ,   foundJan24 = false
        ,   foundPPTransition = false
        ,   foundErrata = false
        ,   isPP2002 = (sr.config.patentPolicy === "pp2002")
        ,   isWGNote = (sr.config.longStatus === "Working Group Note")
        ,   isAmended = sr.config.amended
        ;
        pp.querySelectorAll("a[href]").forEach(function (a) {
            var href = a.getAttribute("href")
            ,   text = sr.norm(a.textContent)
            ;
            if (href === ppLink && text === "W3C Patent Policy") {
                found2017Aug1 = true;
                return;
            }
            if (href === deprecatedPp &&
                text === "5 February 2004 W3C Patent Policy") {
                foundFeb5 = true;
                return;
            }
            if (/^https:\/\/www\.w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/.test(href) &&
                /public list of any patent disclosures( \(.+\))?/.test(text) &&
                a.getAttribute("rel") === "disclosure") {
                foundPublicList = true;
                return;
            }
            if ((href === deprecatedPp + "#def-essential" || href === ppLink + "#def-essential") &&
                text === "Essential Claim(s)") {
                foundEssentials = true;
                return;
            }
            if ((href === deprecatedPp + "#sec-Disclosure" || href === ppLink + "#sec-Disclosure") &&
                text === "section 6 of the W3C Patent Policy") {
                foundSection6 = true;
                return;
            }
            if (href === "https://www.w3.org/TR/2002/NOTE-patent-practice-20020124" &&
                text === "24 January 2002 CPP") {
                    foundJan24 = true;
                    return;
            }
            if (href === "https://www.w3.org/2004/02/05-pp-transition" &&
                text === "W3C Patent Policy Transition Procedure") {
                    foundPPTransition = true;
                    return;
            }
            if (isAmended && text === "errata") {
                    foundErrata = true;
                    return;
            }
        });

        if (!foundJan24 && isPP2002) sr.error(self, "no-jan24");
        if (!foundPPTransition && isPP2002) sr.error(self, "no-pp-transition");
        if (!isPP2002) {
            if (!found2017Aug1 && foundFeb5 && deprecatedAllowed)
                sr.warning(self, 'deprecatedAllowed', {policy: deprecatedPp});
            else if (!found2017Aug1 && foundFeb5 && !deprecatedAllowed)
                sr.error(self, 'deprecated', {policy: deprecatedPp});
            else if (!found2017Aug1 && !foundFeb5) sr.error(self, "no-aug1");
        }
        if (!foundPublicList && !isWGNote) sr.error(selfDisclosures, "no-disclosures");
        if ((sr.config.recTrackStatus || sr.config.noteStatus) && !isWGNote && !foundEssentials)
            sr.error(self, "no-claims");
        if ((sr.config.recTrackStatus || sr.config.noteStatus) && !isWGNote && !foundSection6)
            sr.error(self, "no-section6");
        if (isAmended && !foundErrata)
            sr.error(self, "no-errata");
    }
    done();
};
