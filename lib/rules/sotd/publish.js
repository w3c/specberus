const self = {
    name: 'sotd.publish',
    section: 'document-status',
    rule: 'publish',
};

exports.name = self.name;

exports.check = async function (sr, done) {
    const sotd = sr.getSotDSection();
    const { crType, cryType } = sr.config;
    let docType = sr.config.longStatus;
    if (sr.config.status === 'CR' || sr.config.status === 'CRD') {
        docType = `Candidate Recommendation ${crType}`;
    } else if (sr.config.status === 'CRY' || sr.config.status === 'CRYD') {
        docType = `Candidate Registry ${cryType}`;
    }

    const text = `^This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group|Advisory Board|.+? Interest Group)( and the (.+? Working Group|Technical Architecture Group|Advisory Board|.+? Interest Group))? as a ${docType} using the ${sr.config.track} track.`;

    if (sotd) {
        // Find the paragraph of 'This document was publish by ... , it includes ...'
        const publishReg = new RegExp(text);
        const [paragraph] = Array.prototype.filter.call(
            sotd.querySelectorAll('p'),
            paragraph => sr.norm(paragraph.textContent).match(publishReg)
        );
        if (!paragraph) {
            sr.error(self, 'not-found', { publishReg });
            return done();
        }

        const sotdLinks = sotd.querySelectorAll('a[href]');

        // Check track link
        const urlExpected =
            'https://www.w3.org/2021/Process-20211102/#recs-and-notes';
        const trackEle = Array.prototype.filter.call(sotdLinks, ele =>
            sr.norm(ele.textContent).match(`${sr.config.track} track`)
        )[0];
        if (trackEle && trackEle.href !== urlExpected) {
            sr.error(self, 'url-not-match', {
                url: urlExpected,
                text: `${sr.config.track} track`,
            });
        }

        // Check the Deliverer Group link.
        const delivererGroups = await sr.getDelivererGroups();
        const groupsURLExpected = delivererGroups.map(
            delivererGroup =>
                `https://www.w3.org/groups/${delivererGroup.groupType}/${delivererGroup.groupShortname}`
        );
        const sotdLinksHref = Array.from(sotdLinks).map(l => l.href);
        groupsURLExpected.forEach(groupURLExpected => {
            if (!sotdLinksHref.includes(groupURLExpected)) {
                sr.error(self, 'no-homepage-link', {
                    homepage: groupURLExpected,
                });
            }
        });

        // recType: doc has sentence 'It includes proposed ...' in sotd.
        const recType =
            sr.config.status === 'REC' ? sr.getRecMetadata({}) : null;
        // check if 'candidate amendments' or 'proposed amendments' link in same paragraph is valid.
        if (recType && JSON.stringify(recType) !== '{}') {
            const BASE_URL = 'https://www.w3.org/2021/Process-20211102/';
            let urlExpected;
            let textExpected;
            // for proposed amendments, proposed additions, proposed corrections.
            if (recType.pSubChanges && recType.pNewFeatures) {
                urlExpected = `${BASE_URL}#proposed-amendments`;
                textExpected = /proposed amendment(s)?/;
            } else if (recType.pSubChanges) {
                urlExpected = `${BASE_URL}#proposed-corrections`;
                textExpected = /proposed correction(s)?/;
            } else if (recType.pNewFeatures) {
                urlExpected = `${BASE_URL}#proposed-addition`;
                textExpected = /proposed addition(s)?/;
            }

            // for candidate amendments, candidate additions, candidate corrections.
            if (recType.cSubChanges && recType.cNewFeatures) {
                urlExpected = `${BASE_URL}#candidate-amendments`;
                textExpected = /candidate amendments(s)?/;
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
                    if (sr.norm(ele.textContent).match(textExpected)) {
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
