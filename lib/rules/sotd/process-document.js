const self = {
    name: 'sotd.process-document',
    section: 'document-status',
    rule: 'whichProcess',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    const BOILERPLATE_PREFIX = 'This document is governed by the ';
    const BOILERPLATE_SUFFIX = ' W3C Process Document.';
    const newProc = '18 August 2025';
    const newProcUri = 'https://www.w3.org/policies/process/20250818/';
    const previousProc = '03 November 2023';
    const previousProcUri = 'https://www.w3.org/policies/process/20231103/';
    let previousAllowed;

    const boilerplate = BOILERPLATE_PREFIX + newProc + BOILERPLATE_SUFFIX;
    const previousBoilerplate =
        BOILERPLATE_PREFIX + previousProc + BOILERPLATE_SUFFIX;

    // 1 month transition period
    sr.transition({
        from: new Date('2023-11-02'),
        to: new Date('2023-12-03'),
        doBefore() {},
        doMeanwhile() {
            previousAllowed = true;
        },
        doAfter() {
            previousAllowed = false;
        },
    });

    if (sotd) {
        let found = false;
        sotd.querySelectorAll('p').forEach(p => {
            const link = p.querySelector('a');
            if (
                sr.norm(p.textContent) === boilerplate &&
                link &&
                newProcUri === link.getAttribute('href')
            ) {
                if (found)
                    sr.error(self, 'multiple-times', { process: newProc });
                else {
                    found = true;
                }
            } else if (
                sr.norm(p.textContent) === previousBoilerplate &&
                link &&
                link.getAttribute('href') === previousProcUri
            ) {
                if (previousAllowed) {
                    sr.warning(self, 'previous-allowed', {
                        process: previousProc,
                    });
                    found = true;
                } else {
                    sr.error(self, 'previous-not-allowed', {
                        process: previousProc,
                    });
                }
            }
        });
        if (!found) sr.error(self, 'not-found', { process: newProc });
    }
    done();
}
