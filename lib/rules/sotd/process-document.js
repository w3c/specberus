const self = {
    name: 'sotd.process-document',
    section: 'document-status',
    rule: 'whichProcess',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const docDate = sr.getDocumentDate();
    const BOILERPLATE_PREFIX = 'This document is governed by the ';
    const BOILERPLATE_SUFFIX = ' W3C Process Document.';
    let proc = '2 November 2021';
    let procUri = 'https://www.w3.org/2021/Process-20211102/';
    if (docDate < new Date('2021-09-14')) {
        proc = '15 September 2020';
        procUri = 'https://www.w3.org/2020/Process-20200915/';
    }

    const boilerplate = BOILERPLATE_PREFIX + proc + BOILERPLATE_SUFFIX;

    if (sotd) {
        let found = false;
        const regex = new RegExp(
            `${BOILERPLATE_PREFIX}.+${BOILERPLATE_SUFFIX}`
        );
        sotd.querySelectorAll('p').forEach(p => {
            if (
                sr.norm(p.textContent) === boilerplate &&
                p.querySelector('a') &&
                p.querySelector('a').getAttribute('href') === procUri
            ) {
                if (found) sr.error(self, 'multiple-times', { process: proc });
                else {
                    found = true;
                }
            } else if (
                sr.norm(p.textContent) !== boilerplate &&
                regex.test(p.textContent)
            ) {
                sr.error(self, 'wrong-process', { process: proc });
            } else if (
                sr.norm(p.textContent) === boilerplate &&
                p.querySelector('a') &&
                p.querySelector('a').getAttribute('href') !== procUri
            ) {
                sr.error(self, 'wrong-link');
            }
        });
        if (!found) sr.error(self, 'not-found', { process: proc });
    }
    done();
};
