import { filter } from '../../util.js';

const self = {
    name: 'sotd.pp',
    section: 'document-status',
    rule: 'patPolReq',
};

const ppLink = 'https://www.w3.org/policies/patent-policy/';
const ppLink2020 = 'https://www.w3.org/policies/patent-policy/20200915/';
const ppLink2025 = 'https://www.w3.org/policies/patent-policy/20250515/';

/**
 * @param groups
 * @param sr
 * @param ppLink
 */
function buildWanted(groups, sr) {
    const { config } = sr;
    let wanted;
    const result = {};
    const isRecTrack = config.track === 'Recommendation';
    const ppText = '( 15 September 2020| 15 May 2025)?';

    wanted = `This document was produced by ${
        groups.length === 2 ? 'groups ' : 'a group '
    }operating under the${ppText} W3C Patent Policy\\. ?`;

    if (isRecTrack) {
        wanted += ' W3C maintains ';
        if (groups.length < 2) {
            wanted += 'a public list of any patent disclosures';
        } else {
            wanted += groups
                .map(
                    wg =>
                        `a public list of any patent disclosures \\(${wg.replace(
                            ' Working Group',
                            ''
                        )}( Working Group)?\\)`
                )
                .join(' and ');
        }
        wanted += ` made in connection with the deliverables of ${
            groups.length === 2
                ? 'each group; these pages also include '
                : 'the group; that page also includes '
        }instructions for disclosing a patent\\.`;
        if (config.track === 'Recommendation' || config.track === 'Note')
            wanted +=
                ' An individual who has actual knowledge of a patent that the individual ' +
                'believes contains Essential Claim\\(s\\) must disclose the information in ' +
                'accordance with section 6 of the W3C Patent Policy\\.';
    } else {
        // For documents not on REC-track, the sentence is different.
        wanted = `The${ppText} W3C Patent Policy does not carry any licensing requirements or commitments on this document.`;
    }
    result.regex = new RegExp(wanted);
    result.text = wanted.replace(/\\/g, '');
    return result;
}

/**
 * @param candidates
 * @param sr
 * @param isIGDeliverable
 */
function findPP(candidates, sr) {
    let pp = null;
    const delivererGroups = sr.getDelivererNames();
    if (delivererGroups.length > 1) sr.warning(self, 'joint-publication');

    const wanted = buildWanted(delivererGroups, sr);
    const expected = wanted.text;
    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        if (wanted.regex.test(text)) {
            pp = p;
            return true;
        }
    });
    return { pp, expected };
}

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const groups = await sr.getDelivererGroups();
    // Check if the document is published by WGs only. If IG/AB/TAG(s) are involved, the document cannot be on REC-track and should have a sentence meaning 'pp does not apply'.
    const publishedByWgOnly = groups.every(group => group.groupType === 'wg');

    const sotd = sr.getSotDSection();
    const isRecTrack = sr.config.track === 'Recommendation';

    if (sotd) {
        const { pp, expected } = findPP(
            filter(sotd, 'p').concat(...sotd.querySelectorAll('p')),
            sr
        );
        if (!pp) {
            sr.error(self, 'no-pp', { expected });
            return done();
        }

        let foundLink = false;
        let foundPublicList = false;
        let foundEssentials = false;
        let foundSection6 = false;
        pp.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href');
            const text = sr.norm(a.textContent);
            const possiblePPLinks = [ppLink, ppLink2020, ppLink2025];
            if (
                possiblePPLinks.includes(href) &&
                /(15 September 2020|15 May 2025)?W3C Patent Policy/.test(text)
            ) {
                foundLink = true;
                return;
            }

            if (
                /^https:\/\/www\.w3\.org\/(groups\/[^/]+\/[^/]+\/ipr\/?|2004\/01\/pp-impl\/\d+\/status)(#.*)?$/.test(
                    href
                ) &&
                /public list of any patent disclosures( \(.+\))?/.test(text) &&
                a.getAttribute('rel') === 'disclosure'
            ) {
                foundPublicList = true;
                return;
            }

            if (
                possiblePPLinks.map(p => `${p}#def-essential`).includes(href) &&
                text === 'Essential Claim(s)'
            ) {
                foundEssentials = true;
                return;
            }
            if (
                possiblePPLinks
                    .map(p => `${p}#sec-Disclosure`)
                    .includes(href) &&
                text === 'section 6 of the W3C Patent Policy'
            ) {
                foundSection6 = true;
            }
        });

        if (!foundLink) sr.error(self, 'no-link');
        if (!foundPublicList && isRecTrack) sr.error(self, 'no-disclosures');
        if (
            (sr.config.track === 'Recommendation' ||
                sr.config.track === 'Note') &&
            isRecTrack &&
            !foundEssentials
        )
            sr.error(self, 'no-claims', {
                link: `${ppLink}#def-essential`,
            });
        if (
            (sr.config.track === 'Recommendation' ||
                sr.config.track === 'Note') &&
            isRecTrack &&
            !foundSection6
        )
            sr.error(self, 'no-section6', {
                link: `${ppLink}#sec-Disclosure`,
            });
        return done();
    }
}
