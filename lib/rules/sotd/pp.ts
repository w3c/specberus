import type { Cheerio } from 'cheerio';
import type { Element } from 'domhandler';

import type { Specberus } from '../../validator.js';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.pp',
    section: 'document-status',
    rule: 'patPolReq',
};

const ppLink = 'https://www.w3.org/policies/patent-policy/';
const ppLink2020 = 'https://www.w3.org/policies/patent-policy/20200915/';
const ppLink2025 = 'https://www.w3.org/policies/patent-policy/20250515/';

function buildWanted(groups: string[], sr: Specberus) {
    const config = sr.config!;
    let wanted;
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

    return {
        regex: new RegExp(wanted),
        text: wanted.replace(/\\/g, ''),
    };
}

function findPP($candidates: Cheerio<Element>, sr: Specberus) {
    const delivererGroups = sr.getDelivererNames();
    if (delivererGroups.length > 1) sr.warning(self, 'joint-publication');

    const wanted = buildWanted(delivererGroups, sr);
    const expected = wanted.text;
    for (const p of $candidates.toArray()) {
        const $p = sr.$(p);
        const text = sr.norm($p.text());
        if (wanted.regex.test(text)) return { $pp: $p, expected };
    }
    return { $pp: null, expected };
}

export const { name } = self;

export const check: RuleCheckFunction = async (sr, done) => {
    const $sotd = sr.getSotDSection();
    const track = sr.config!.track;
    const isRecTrack = track === 'Recommendation';

    if ($sotd) {
        const { $pp, expected } = findPP(
            $sotd.filter('p').add($sotd.find('p')),
            sr
        );
        if (!$pp) {
            sr.error(self, 'no-pp', { expected });
            return done();
        }

        let foundLink = false;
        let foundPublicList = false;
        let foundEssentials = false;
        let foundSection6 = false;
        $pp.find('a[href]').each((_, a) => {
            const $a = sr.$(a);
            const href = $a.attr('href')!;
            const text = sr.norm($a.text());
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
                $a.attr('rel') === 'disclosure'
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
            (track === 'Recommendation' || track === 'Note') &&
            isRecTrack &&
            !foundEssentials
        )
            sr.error(self, 'no-claims', {
                link: `${ppLink}#def-essential`,
            });
        if (
            (track === 'Recommendation' || track === 'Note') &&
            isRecTrack &&
            !foundSection6
        )
            sr.error(self, 'no-section6', {
                link: `${ppLink}#sec-Disclosure`,
            });
        return done();
    }
};
