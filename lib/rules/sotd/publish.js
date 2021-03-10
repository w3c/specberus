const self = {
    name: 'sotd.publish',
    section: 'document-status',
    rule: 'publish',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const { crType } = sr.config;
    const docType =
        sr.config.status === 'CR' || sr.config.status === 'CRD'
            ? `Candidate Recommendation ${crType}`
            : sr.config.longStatus;
    const text = `This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group)( and the (.+? Working Group|Technical Architecture Group))? as a ${docType}.`;

    const PUBLISH = new RegExp(text);
    if (sotd) {
        let publishFound = false;
        const recType = sr.config.status === 'REC' ? sr.getRecMetadata({}) : {};

        Array.prototype.some.call(sotd.querySelectorAll('p'), (paragraph) => {
            const txt = sr.norm(paragraph.textContent);
            if (txt.match(PUBLISH)) {
                publishFound = true;

                // check if 'proposed changes' link in same paragraph is valid.
                if (recType.substantiveChanges || recType.newFeatures) {
                    const BASE_URL =
                        'https://www.w3.org/2020/Process-20200915/';
                    let PROPOSED_URL;
                    let PROPOSED_TEXT;
                    if (recType.substantiveChanges && recType.newFeatures) {
                        PROPOSED_URL = `${BASE_URL}#proposed-changes`;
                        PROPOSED_TEXT = /proposed change(s)?/;
                    } else if (recType.substantiveChanges) {
                        PROPOSED_URL = `${BASE_URL}#proposed-corrections`;
                        PROPOSED_TEXT = /proposed correction(s)?/;
                    } else {
                        PROPOSED_URL = `${BASE_URL}#proposed-addition`;
                        PROPOSED_TEXT = /proposed addition(s)?/;
                    }
                    const proposedFound = Array.prototype.some.call(
                        paragraph.querySelectorAll('a'),
                        (ele) => {
                            if (ele.textContent.match(PROPOSED_TEXT)) {
                                if (ele.href !== PROPOSED_URL) {
                                    sr.error(self, 'url-not-match', {
                                        url: PROPOSED_URL,
                                        text: PROPOSED_TEXT,
                                    });
                                }
                                return true;
                            }
                            return false;
                        }
                    );
                    if (!proposedFound)
                        sr.error(self, 'url-text-not-found', {
                            url: PROPOSED_URL,
                            text: PROPOSED_TEXT,
                        });
                }
                return true;
            }
        });
        if (!publishFound) sr.error(self, 'not-found');
    }
    done();
};
