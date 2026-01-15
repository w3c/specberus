// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by W3C and its Members.</p>

/** @import { Specberus } from "../../validator.js" */

/**
 * @param $candidates
 * @param {Specberus} sr
 */
async function findSW($candidates, sr) {
    let wanted = '';
    let $sw;
    if (
        sr.config.longStatus === 'Group Note' ||
        sr.config.longStatus === 'Group Note Draft'
    ) {
        // Find the sentence of 'Group Notes are not endorsed by W3C nor its Members.' or 'This Group Note is endorsed by the @@ Group, but is not endorsed by W3C itself nor its Members.'
        const groups = sr.getDelivererNames().join(' and the ');
        wanted = `(${sr.config.longStatus}s are not endorsed by W3C nor its Members|This ${sr.config.longStatus} is endorsed by the ${groups}, but is not endorsed by W3C itself nor its Members).`;
    } else if (sr.config.longStatus === 'Statement') {
        wanted =
            'A W3C Statement is a (specification|document) that, after extensive consensus-building, is endorsed by W3C and its Members.';
    } else if (sr.config.longStatus === 'Discontinued Draft') {
        wanted =
            'Publication as a Discontinued Draft implies that this document is no longer intended to advance or to be maintained. It is inappropriate to cite this document as other than abandoned work.';
    } else if (sr.config.longStatus === 'Registry') {
        wanted =
            'A W3C Registry is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.';
    } else {
        const { crType } = sr.config;
        const groupIds = await sr.getDelivererIDs();
        const INTRO_S = ` A Candidate Recommendation Snapshot has received wide review, is intended to gather implementation experience, and has commitments from Working Group${
            groupIds.length > 1 ? 's' : ''
        } members to royalty-free licensing for implementations.`;
        const INTRO_D = ` A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group${
            groupIds.length > 1 ? 's intend' : ' intends'
        } to include in a subsequent Candidate Recommendation Snapshot.`;
        const CR_INTRO = crType === 'Draft' ? INTRO_D : INTRO_S;

        const { cryType } = sr.config;
        const INTRO_CRY =
            ' A Candidate Registry Snapshot has received wide review.';
        const INTRO_CRYD = ` A Candidate Registry Draft integrates changes from the previous Candidate Registry that the Working Group${
            groupIds.length > 1 ? 's intend' : ' intends'
        } to include in a subsequent Candidate Registry Snapshot.`;
        const CRY_INTRO = cryType === 'Draft' ? INTRO_CRYD : INTRO_CRY;
        const article =
            sr.config.longStatus === 'Interest Group Note' ? 'an' : 'a';
        const represent =
            sr.config.status === 'WD' || sr.config.status === 'FPWD'
                ? '( does not necessarily represent a consensus of the Working Group and)?'
                : '';
        wanted = `Publication as ${article} ${sr.config.longStatus}${
            sr.config.cryType ? ` ${sr.config.cryType}` : ''
        }${represent} does not imply endorsement by W3C and its Members.${
            crType ? CR_INTRO : ''
        }${cryType ? CRY_INTRO : ''}`;
    }

    const wantedRE = new RegExp(wanted);

    // TODO: better some
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

const self = {
    name: 'sotd.stability',
    section: 'document-status',
    rule: 'stability',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export async function check(sr, done) {
    const $sotd = sr.getSotDSection();
    if ($sotd) {
        if (sr.config.status === 'REC') {
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
            else if (
                sr.config.crType === 'Snapshot' ||
                sr.config.cryType === 'Snapshot'
            ) {
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
        if (sr.config.status === 'REC' || sr.config.status === 'CR') {
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
}
