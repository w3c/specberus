// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by W3C and its Members.</p>

import type { Cheerio } from 'cheerio';
import type { Element } from 'domhandler';

import type { Specberus } from '../../validator.js';
import type { RuleCheckFunction, RuleMeta } from '../../types.js';

async function findSW($candidates: Cheerio<Element>, sr: Specberus) {
    let wanted = '';
    let $sw: Cheerio<Element> | undefined;
    const { crType, cryType, longStatus, status } = sr.config!;

    if (longStatus === 'Group Note' || longStatus === 'Group Note Draft') {
        // Find the sentence of 'Group Notes are not endorsed by W3C nor its Members.' or 'This Group Note is endorsed by the @@ Group, but is not endorsed by W3C itself nor its Members.'
        const groups = sr.getDelivererNames().join(' and the ');
        wanted = `(${longStatus}s are not endorsed by W3C nor its Members|This ${longStatus} is endorsed by the ${groups}, but is not endorsed by W3C itself nor its Members).`;
    } else if (longStatus === 'Statement') {
        wanted =
            'A W3C Statement is a (specification|document) that, after extensive consensus-building, is endorsed by W3C and its Members.';
    } else if (longStatus === 'Discontinued Draft') {
        wanted =
            'Publication as a Discontinued Draft implies that this document is no longer intended to advance or to be maintained. It is inappropriate to cite this document as other than abandoned work.';
    } else if (longStatus === 'Registry') {
        wanted =
            'A W3C Registry is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.';
    } else {
        const groupIds = await sr.getDelivererIDs();
        const INTRO_S = ` A Candidate Recommendation Snapshot has received wide review, is intended to gather implementation experience, and has commitments from Working Group members to royalty-free licensing for implementations.`;
        const INTRO_D = ` A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group${
            groupIds.length > 1 ? 's intend' : ' intends'
        } to include in a subsequent Candidate Recommendation Snapshot.`;
        const CR_INTRO = crType === 'Draft' ? INTRO_D : INTRO_S;

        const INTRO_CRY =
            ' A Candidate Registry Snapshot has received wide review.';
        const INTRO_CRYD = ` A Candidate Registry Draft integrates changes from the previous Candidate Registry that the Working Group${
            groupIds.length > 1 ? 's intend' : ' intends'
        } to include in a subsequent Candidate Registry Snapshot.`;
        const CRY_INTRO = cryType === 'Draft' ? INTRO_CRYD : INTRO_CRY;
        const article = longStatus === 'Interest Group Note' ? 'an' : 'a';
        const represent =
            status === 'WD' || status === 'FPWD'
                ? '( does not necessarily represent a consensus of the Working Group and)?'
                : '';
        wanted = `Publication as ${article} ${longStatus}${
            cryType ? ` ${cryType}` : ''
        }${represent} does not imply endorsement by W3C and its Members.${
            crType ? CR_INTRO : ''
        }${cryType ? CRY_INTRO : ''}`;
    }

    const wantedRE = new RegExp(wanted);

    // TODO: better loop
    $candidates.each((_, p) => {
        const $p = sr.$(p);
        const text = sr.norm($p.text());
        if (text.match(wantedRE)) {
            $sw = $p;
            return false;
        }
    });
    return { $sw, expected: wantedRE };
}

const self: RuleMeta = {
    name: 'sotd.stability',
    section: 'document-status',
    rule: 'stability',
};

export const { name } = self;

export const check: RuleCheckFunction = async (sr, done) => {
    const { crType, cryType, status } = sr.config!;
    const $sotd = sr.getSotDSection();
    if ($sotd) {
        if (status === 'REC') {
            const txt = sr.norm($sotd.text());
            const wanted = `A W3C Recommendation is a specification that, after extensive consensus-building, is endorsed by W3C and its Members, and has commitments from Working Group members to royalty-free licensing for implementations.`;
            const rex = new RegExp(wanted);
            if (!rex.test(txt)) sr.error(self, 'no-rec-review');
        } else {
            const $paragraphs = $sotd.filter('p');
            const { $sw, expected } = await findSW(
                $paragraphs.length ? $paragraphs : $sotd.find('p'),
                sr
            );
            if (!$sw) sr.error(self, 'no-stability', { expected });
            else if (crType === 'Snapshot' || cryType === 'Snapshot') {
                const review = $sw
                    .find('a')
                    .toArray()
                    .find(el => sr.norm(sr.$(el).text()) === 'wide review');
                if (!review) sr.error(self, 'no-cr-review');
                else if (
                    review.attribs.href !==
                    'https://www.w3.org/policies/process/20250818/#dfn-wide-review'
                )
                    sr.error(self, 'wrong-cr-review-link');
            }
        }

        // check 'royalty-free licensing' link
        if (status === 'REC' || status === 'CR') {
            const $links = $sotd.find('a');
            const licensingText = 'royalty-free licensing';
            const licensingLink =
                'https://www.w3.org/policies/patent-policy/#sec-Requirements';
            const licensingFound = $links
                .toArray()
                .some(
                    link =>
                        sr.norm(sr.$(link).text()) === licensingText &&
                        link.attribs.href === licensingLink
                );
            if (!licensingFound)
                sr.error(self, 'no-licensing-link', {
                    licensingText,
                    licensingLink,
                });
        }
    }
    return done();
};
