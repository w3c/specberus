const util = require('../../util');

const self = {
    name: 'sotd.submission',
    section: 'document-status',
    rule: 'boilerplateSUBM',
};

exports.name = self.name;

/**
 * @param candidates
 * @param sr
 */
function findSubmText(candidates, sr) {
    let st = null;
    Array.prototype.some.call(candidates, p => {
        const text = sr.norm(p.textContent);
        const wanted =
            'By publishing this document, W3C acknowledges that the Submitting Members ' +
            'have made a formal Submission request to W3C for discussion. Publication of ' +
            'this document by W3C indicates no endorsement of its content by W3C, nor ' +
            'that W3C has, is, or will be allocating any resources to the issues ' +
            'addressed by it. This document is not the product of a chartered W3C group, ' +
            'but is published as potential input to the W3C Process. A W3C Team Comment ' +
            'has been published in conjunction with this Member Submission. Publication ' +
            'of acknowledged Member Submissions at the W3C site is one of the benefits ' +
            'of W3C Membership. Please consult the requirements associated with Member ' +
            'Submissions of section 3.3 of the W3C Patent Policy. Please consult the ' +
            'complete list of acknowledged W3C Member Submissions.';
        if (text === wanted) {
            st = p;
            return true;
        }
    });
    return st;
}

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    if (sotd) {
        const st =
            findSubmText(util.filter(sotd, 'p'), sr) ||
            findSubmText(sotd.querySelectorAll('p'), sr);
        if (!st) {
            sr.error(self, 'no-submission-text');
            return done();
        }

        // check the links
        const w3cProcess = 'https://www.w3.org/Consortium/Process';
        const w3cMembership =
            'https://www.w3.org/Consortium/Prospectus/Joining';
        const w3cPP =
            'https://www.w3.org/Consortium/Patent-Policy/#sec-submissions';
        const w3cSubm = 'https://www.w3.org/Submission';
        let foundW3CProcess = false;
        let foundW3CMembership = false;
        let foundPP = false;
        let foundSubm = false;
        let foundSubmMembers = false;
        let foundComment = false;
        st.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href');
            const text = sr.norm(a.textContent);
            if (href === w3cProcess && text === 'W3C Process') {
                foundW3CProcess = true;
                return;
            }
            if (href === w3cMembership && text === 'W3C Membership') {
                foundW3CMembership = true;
                return;
            }
            if (
                href === w3cPP &&
                text === 'section 3.3 of the W3C Patent Policy'
            ) {
                foundPP = true;
                return;
            }
            if (
                href === w3cSubm &&
                text === 'list of acknowledged W3C Member Submissions'
            ) {
                foundSubm = true;
                return;
            }
            if (
                href.indexOf(`${w3cSubm}/`) === 0 &&
                text === 'Submitting Members'
            ) {
                foundSubmMembers = true;
                return;
            }
            if (
                href.indexOf(`${w3cSubm}/`) === 0 &&
                text === 'W3C Team Comment'
            ) {
                foundComment = true;
            }
        });
        if (!foundW3CProcess)
            sr.error(self, 'link-text', {
                href: w3cProcess,
                text: 'W3C Process',
            });
        if (!foundW3CMembership)
            sr.error(self, 'link-text', {
                href: w3cMembership,
                text: 'W3C Membership',
            });
        if (!foundPP)
            sr.error(self, 'link-text', {
                href: w3cPP,
                text: 'section 3.3 of the W3C Patent Policy',
            });
        if (!foundSubm)
            sr.error(self, 'link-text', {
                href: w3cSubm,
                text: 'list of acknowledged W3C Member Submissions',
            });
        if (!foundSubmMembers) sr.error(self, 'no-sm-link');
        if (!foundComment) sr.error(self, 'no-tc-link');
    }
    done();
};
