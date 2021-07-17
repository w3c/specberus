// SotD
//  stability warning
// <p>Publication as a Working Draft does not imply endorsement by the W3C Membership.</p>
const util = require('../../util');

function findSW(candidates, sr) {
    const { crType } = sr.config;
    const INTRO_S =
        ' A Candidate Recommendation Snapshot has received wide review and is intended to gather implementation experience.';
    const INTRO_D =
        ' A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.';
    const CR_INTRO = crType === 'Draft' ? INTRO_D : INTRO_S;
    let sw = null;
    const article = sr.config.longStatus === 'Interest Group Note' ? 'an' : 'a';
    const represent =
        sr.config.status === 'WD' || sr.config.status === 'FPWD'
            ? '( does not necessarily represent a consensus of the Working Group and)?'
            : '';
    const wanted = `Publication as ${article} ${
        sr.config.longStatus
    }${represent} does not imply endorsement by the W3C Membership.${
        crType ? CR_INTRO : ''
    }`;
    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        if (text.match(wanted)) {
            sw = p;
            return true;
        }
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
            const wanted =
                'A W3C Recommendation is a specification that, after extensive ' +
                'consensus-building, has received the endorsement of the W3C and ' +
                'its Members. W3C recommends the wide deployment of this ' +
                'specification as a standard for the Web.';
            const rex = new RegExp(wanted.replace(/\./g, '\\.'));
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
                    'https://www.w3.org/2020/Process-20200915/#dfn-wide-review'
                )
                    sr.error(self, 'wrong-cr-review-link');
            }
        }
    }
    done();
};
