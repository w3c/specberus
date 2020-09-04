const self = {
    name: 'sotd.publish'
,   section: 'document-status'
,   rule: 'publish'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    var crType = sr.config.crType;
    var docType = (sr.config.status === "CR" || sr.config.status === "CRD") ? "Candidate Recommendation " + crType : sr.config.longStatus;
    var text = 'This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group)( and the (.+? Working Group|Technical Architecture Group))? as a ' + docType + '.';
    var PUBLISH = new RegExp(text);

    if (sotd) {
        var publishFound = false;
        var recType = sr.config.status === "REC" ? sr.getRecMetadata({}) : {};

        Array.prototype.some.call(sotd.querySelectorAll("p"), paragraph => {
            var txt = sr.norm(paragraph.textContent);
            if (txt.match(PUBLISH)) {
                publishFound = true;
                if (recType.substantiveChanges || recType.newFeatures) {
                    const BASE_URL = "https://www.w3.org/2020/Process-20200915/";
                    var PROPOSED_URL, PROPOSED_TEXT;
                    if (recType.substantiveChanges && recType.newFeatures) {
                        PROPOSED_URL = BASE_URL + "#proposed-changes";
                        PROPOSED_TEXT = "proposed changes";
                    } else if (recType.substantiveChanges) {
                        PROPOSED_URL = BASE_URL + "#proposed-correction";
                        PROPOSED_TEXT = "proposed correction";
                    } else {
                        PROPOSED_URL = BASE_URL + "#proposed-addition";
                        PROPOSED_TEXT = "proposed addition";
                    }

                    var proposedFound = Array.prototype.some.call(paragraph.querySelectorAll('a'), function (ele) {
                        if (ele.textContent === PROPOSED_TEXT) {
                            if (ele.href !== PROPOSED_URL) {
                                sr.error(self, "url-not-match", {url: PROPOSED_URL, text: PROPOSED_TEXT});
                            }
                            return true;
                        }
                        return false;
                    });
                    if (!proposedFound)
                        sr.error(self, "url-not-found", { url: PROPOSED_URL, text: PROPOSED_TEXT });

                }
                return true;
            }
        });
        if (!publishFound) sr.error(self, "not-found");
    }
    done();
};
