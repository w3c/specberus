const self = {
    name: 'sotd.publish',
    section: 'document-status',
    rule: 'publish',
};

// TODO: doc for all, test. check link
exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const { crType } = sr.config;
    const docType =
        sr.config.status === 'CR' || sr.config.status === 'CRD'
            ? `Candidate Recommendation ${crType}`
            : sr.config.longStatus;

    const text = `^This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group)( and the (.+? Working Group|Technical Architecture Group))? as a ${docType} using the ${sr.config.track} track.`;

    if (sotd) {
        // Find the paragraph of 'This document was publish by ... , it includes ...'
        const publishReg = new RegExp(text);
        const [paragraph] = Array.prototype.filter.call(
            sotd.querySelectorAll('p'),
            paragraph => sr.norm(paragraph.textContent).match(publishReg)
        );
        if (!paragraph) {
            sr.error(self, 'not-found');
            return done();
        }

        // recType: doc has sentence 'It includes proposed ...' in sotd.
        const recType =
            sr.config.status === 'REC' ? sr.getRecMetadata({}) : null;
        // check if 'candidate amendaments' or 'proposed changes' link in same paragraph is valid.
        if (recType) {
            const BASE_URL = 'https://www.w3.org/2021/Process-20210915/';
            let urlExpected;
            let textExpected;
            // for proposed changes, proposed additions, proposed corrections.
            if (recType.pSubChanges && recType.pNewFeatures) {
                urlExpected = `${BASE_URL}#proposed-changes`;
                textExpected = /proposed change(s)?/;
            } else if (recType.pSubChanges) {
                urlExpected = `${BASE_URL}#proposed-corrections`;
                textExpected = /proposed correction(s)?/;
            } else if (recType.pNewFeatures) {
                urlExpected = `${BASE_URL}#proposed-addition`;
                textExpected = /proposed addition(s)?/;
            }

            // for candidate amendaments, candidate additions, candidate corrections.
            if (recType.cSubChanges && recType.cNewFeatures) {
                urlExpected = `${BASE_URL}#candidate-amendments`;
                textExpected = /candidate change(s)?/;
            } else if (recType.cSubChanges) {
                urlExpected = `${BASE_URL}#candidate-correction`;
                textExpected = /candidate correction(s)?/;
            } else if (recType.cNewFeatures) {
                urlExpected = `${BASE_URL}#candidate-addition`;
                textExpected = /candidate addition(s)?/;
            }
            const linkFound = Array.prototype.some.call(
                paragraph.querySelectorAll('a'),
                ele => {
                    if (ele.textContent.match(textExpected)) {
                        if (ele.href !== urlExpected) {
                            sr.error(self, 'url-not-match', {
                                url: urlExpected,
                                text: textExpected,
                            });
                        }
                        return true;
                    }
                    return false;
                }
            );
            if (!linkFound)
                sr.error(self, 'url-text-not-found', {
                    url: urlExpected,
                    text: textExpected,
                });
        }
    }
    done();
};
