import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.publish',
    section: 'document-status',
    rule: 'publish',
};

export const { name } = self;

export const check: RuleCheckFunction = async context => {
    const $sotd = context.getSotDSection();
    const { crType, cryType, longStatus, status, track } = context.config!;
    let docType = longStatus;
    if (status === 'CR' || status === 'CRD') {
        docType = `Candidate Recommendation ${crType}`;
    } else if (status === 'CRY' || status === 'CRYD') {
        docType = `Candidate Registry ${cryType}`;
    }

    const text = `^This document was (?:produced|published) by the (.+? Working Group|Technical Architecture Group|Advisory Board|.+? Interest Group)( and the (.+? Working Group|Technical Architecture Group|Advisory Board|.+? Interest Group))? as a ${docType} using the ${context.config!.track} track.`;

    if ($sotd) {
        // Find the paragraph of 'This document was published by ... , it includes ...'
        const publishReg = new RegExp(text);
        const paragraph = $sotd
            .find('p')
            .toArray()
            .find(p => context.norm(context.$(p).text()).match(publishReg));
        if (!paragraph) {
            context.error(self, 'not-found', { publishReg });
            return;
        }

        const $sotdLinks = $sotd.find('a[href]');

        let baseURL = /^https:\/\/www.w3.org\/2023\/Process-20230612\//;
        // 1 month transition period
        context.transition({
            from: new Date('2023-11-02'),
            to: new Date('2023-12-03'),
            doBefore() {
                baseURL = /^https:\/\/www.w3.org\/2023\/Process-20230612\//;
            },
            doMeanwhile() {
                baseURL =
                    /^https:\/\/www.w3.org\/2023\/Process-2023(0612|1103)\//;
            },
            doAfter() {
                baseURL =
                    /^https:\/\/www.w3.org\/policies\/process\/20250818\//;
            },
        });

        // Check track link
        const urlExpected = new RegExp(`${baseURL.source}#recs-and-notes$`);
        const trackEl = $sotdLinks
            .toArray()
            .find(el =>
                context.norm(context.$(el).text()).match(`${track} track`)
            );
        if (trackEl && !urlExpected.test(trackEl.attribs.href)) {
            context.error(self, 'url-not-match', {
                url: urlExpected,
                text: `${track} track`,
            });
        }

        // Check the Deliverer Group link.
        const delivererGroups = await context.getDelivererGroups();
        const groupsURLRegExpExpected = delivererGroups.map(
            delivererGroup =>
                new RegExp(
                    `^https://www.w3.org/groups/${delivererGroup.groupType}/${delivererGroup.groupShortname}/?$`
                )
        );
        const sotdLinksHrefs = $sotdLinks.toArray().map(l => l.attribs.href);
        groupsURLRegExpExpected.forEach(groupURLRegExpExpected => {
            if (!sotdLinksHrefs.some(l => groupURLRegExpExpected.test(l))) {
                context.error(self, 'no-homepage-link', {
                    homepage: groupURLRegExpExpected,
                });
            }
        });

        // recType: doc has sentence 'It includes proposed ...' in sotd.
        const recType = status === 'REC' ? context.getRecMetadata() : null;
        // check if 'candidate amendments' or 'proposed amendments' link in same paragraph is valid.
        if (recType && JSON.stringify(recType) !== '{}') {
            let urlExpected: RegExp;
            let textExpected: RegExp;
            // for proposed amendments, proposed additions, proposed corrections.
            if (recType.pSubChanges && recType.pNewFeatures) {
                urlExpected = new RegExp(
                    `${baseURL.source}#proposed-amendments`
                );
                textExpected = /proposed amendment(s)?/;
            } else if (recType.pSubChanges) {
                urlExpected = new RegExp(
                    `${baseURL.source}#proposed-corrections`
                );
                textExpected = /proposed correction(s)?/;
            } else if (recType.pNewFeatures) {
                urlExpected = new RegExp(`${baseURL.source}#proposed-addition`);
                textExpected = /proposed addition(s)?/;
            }

            // for candidate amendments, candidate additions, candidate corrections.
            if (recType.cSubChanges && recType.cNewFeatures) {
                urlExpected = new RegExp(
                    `${baseURL.source}#candidate-amendments`
                );
                textExpected = /candidate amendments(s)?/;
            } else if (recType.cSubChanges) {
                urlExpected = new RegExp(
                    `${baseURL.source}#candidate-correction`
                );
                textExpected = /candidate correction(s)?/;
            } else if (recType.cNewFeatures) {
                urlExpected = new RegExp(
                    `${baseURL.source}#candidate-addition`
                );
                textExpected = /candidate addition(s)?/;
            }
            const linkFound = context
                .$(paragraph)
                .find('a')
                .toArray()
                .some(el => {
                    const $el = context.$(el);
                    if (context.norm($el.text()).match(textExpected)) {
                        if (!urlExpected.test($el.attr('href') || '')) {
                            context.error(self, 'url-not-match', {
                                url: urlExpected,
                                text: textExpected,
                            });
                        }
                        return true;
                    }
                    return false;
                });
            if (!linkFound)
                context.error(self, 'url-text-not-found', {
                    url: urlExpected!,
                    text: textExpected!,
                });
        }
    }
};
