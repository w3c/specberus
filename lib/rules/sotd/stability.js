// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership.</p>
const util = require('../../util');

function findSW(candidates, sr) {
    let wanted = '';
    let sw = '';
    if (
        sr.config.longStatus === 'Group Note' ||
        sr.config.longStatus === 'Group Draft Note'
    ) {
        // Find the sentence of 'Group Notes are not endorsed by the W3C nor its Membership.'
        wanted = `${sr.config.longStatus}s are not endorsed by the W3C nor its Membership.`;
    } else if (sr.config.longStatus === 'Statement') {
        wanted =
            'A W3C Statement is a specification that, after extensive consensus-building, has received the endorsement of the W3C and its Members.';
    } else {
        const { crType } = sr.config;
        const INTRO_S =
            ' A Candidate Recommendation Snapshot has received wide review, is intended to gather implementation experience, and participants granted Royalty-Free IPR licenses for implementations.';
        const INTRO_D =
            ' A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.';
        const CR_INTRO = crType === 'Draft' ? INTRO_D : INTRO_S;
        sw = null;
        const article =
            sr.config.longStatus === 'Interest Group Note' ? 'an' : 'a';
        const represent =
            sr.config.status === 'WD' || sr.config.status === 'FPWD'
                ? '( does not necessarily represent a consensus of the Working Group and)?'
                : '';
        wanted = `Publication as ${article} ${
            sr.config.longStatus
        }${represent} does not imply endorsement by the W3C Membership.${
            crType ? CR_INTRO : ''
        }`;
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
    return sw;
}

const self = {
    name: 'sotd.stability',
    section: 'document-status',
    rule: 'stability',
};

exports.name = self.name;

exports.check = function (sr, done) {
    if (!sr.config.stabilityWarning) return done();
    const sotd = sr.getSotDSection();
    if (sotd) {
        if (sr.config.stabilityWarning === 'REC') {
            const txt = sr.norm(sotd && sotd.textContent);
            const wanted = `A W3C Recommendation is a specification that, after extensive consensus-building, has received the endorsement of the W3C and its Members, and participants granted Royalty-Free IPR licenses for implementations.`;
            const rex = new RegExp(wanted);
            if (!rex.test(txt)) sr.error(self, 'no-rec-review');
        } else {
            const paragraph = util.filter(sotd, 'p');
            const sw = findSW(
                paragraph.length ? paragraph : sotd.querySelectorAll('p'),
                sr
            );
            if (!sw) sr.error(self, 'no-stability');
            else if (sr.config.crType === 'Snapshot') {
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
    }
    return done();
};
