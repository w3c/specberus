const self = {
    name: 'sotd.process-document',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection(),
        docDate = sr.getDocumentDate(),
        BOILERPLATE_PREFIX = 'This document is governed by the ',
        BOILERPLATE_SUFFIX = ' W3C Process Document.';
    let proc = '15 September 2020',
        procUri = 'https://www.w3.org/2020/Process-20200915/';
    if (docDate < new Date('2020-09-14')) {
        proc = '1 March 2019';
        procUri = 'https://www.w3.org/2019/Process-20190301/';
    }

    const boilerplate = BOILERPLATE_PREFIX + proc + BOILERPLATE_SUFFIX;

    if (sotd) {
        let found = false,
            regex = new RegExp(BOILERPLATE_PREFIX + '.+' + BOILERPLATE_SUFFIX);
        sotd.querySelectorAll('p').forEach(function (p) {
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
