// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by W3C and its Members.</p>
const util = require('../../util');

/**
 * @param candidates
 * @param sr
 */
function findSW(candidates, sr) {
    let wanted = '';
    let sw = '';
    if (
        sr.config.longStatus === 'Group Note' ||
        sr.config.longStatus === 'Group Draft Note'
    ) {
        // Find the sentence of 'Group Notes are not endorsed by W3C nor its Members.'
        wanted = `${sr.config.longStatus}s are not endorsed by W3C nor its Members.`;
    } else if (sr.config.longStatus === 'Statement') {
        wanted =
            'A W3C Statement is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.';
    } else if (sr.config.longStatus === 'Discontinued Draft') {
        wanted =
            'Publication as a Discontinued Draft implies that this document is no longer intended to advance or to be maintained. It is inappropriate to cite this document as other than abandoned work.';
    } else if (sr.config.longStatus === 'Registry') {
        wanted =
            'A W3C Registry is a specification that, after extensive consensus-building, is endorsed by W3C and its Members.';
    } else {
        const { crType } = sr.config;
        const INTRO_S =
            ' A Candidate Recommendation Snapshot has received wide review, is intended to gather implementation experience, and has commitments from Working Group members to royalty-free licensing for implementations.';
        const INTRO_D =
            ' A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.';
        const CR_INTRO = crType === 'Draft' ? INTRO_D : INTRO_S;

        const { cryType } = sr.config;
        const INTRO_CRY =
            ' A Candidate Registry Snapshot has received wide review.';
        const INTRO_CRYD =
            ' A Candidate Registry Draft integrates changes from the previous Candidate Registry that the Working Group intends to include in a subsequent Candidate Registry Snapshot.';
        const CRY_INTRO = cryType === 'Draft' ? INTRO_CRYD : INTRO_CRY;
        sw = null;
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

    // TODO: better some
    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        if (text.match(wanted)) {
            sw = p;
            return true;
        }
        return false;
    });
    return { sw, expected: wanted };
}

const self = {
    name: 'sotd.stability',
    section: 'document-status',
    rule: 'stability',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        if (sr.config.status === 'REC') {
            const txt = sr.norm(sotd && sotd.textContent);
            const wanted = `A W3C Recommendation is a specification that, after extensive consensus-building, is endorsed by W3C and its Members, and has commitments from Working Group members to royalty-free licensing for implementations.`;
            const rex = new RegExp(wanted);
            if (!rex.test(txt)) sr.error(self, 'no-rec-review');
        } else {
            const paragraph = util.filter(sotd, 'p');
            const { sw, expected } = findSW(
                paragraph.length ? paragraph : sotd.querySelectorAll('p'),
                sr
            );
            if (!sw) sr.error(self, 'no-stability', { expected });
            else if (
                sr.config.crType === 'Snapshot' ||
                sr.config.cryType === 'Snapshot'
            ) {
                const review = Array.prototype.find.call(
                    sw.querySelectorAll('a'),
                    ele => ele.textContent === 'wide review'
                );
                if (!review) sr.error(self, 'no-cr-review');
                else if (
                    review.href !==
                    'https://www.w3.org/2021/Process-20211102/#dfn-wide-review'
                )
                    sr.error(self, 'wrong-cr-review-link');
            }
        }

        // check 'royalty-free licensing' link
        if (sr.config.status === 'REC' || sr.config.status === 'CR') {
            const links = sotd.querySelectorAll('a');
            const licensingText = 'royalty-free licensing';
            const licensingLink =
                'https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements';
            const licensingFound = Array.prototype.some.call(
                links,
                link =>
                    sr.norm(link.textContent) === licensingText &&
                    link.href === licensingLink
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
