import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.process-document',
    section: 'document-status',
    rule: 'whichProcess',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $sotd = context.getSotDSection();
    const BOILERPLATE_PREFIX = 'This document is governed by the ';
    const BOILERPLATE_SUFFIX = ' W3C Process Document.';
    const newProc = '18 August 2025';
    const newProcUri = 'https://www.w3.org/policies/process/20250818/';
    const previousProc = '03 November 2023';
    const previousProcUri = 'https://www.w3.org/policies/process/20231103/';
    let previousAllowed = false;

    const boilerplate = BOILERPLATE_PREFIX + newProc + BOILERPLATE_SUFFIX;
    const previousBoilerplate =
        BOILERPLATE_PREFIX + previousProc + BOILERPLATE_SUFFIX;

    // 1 month transition period
    context.transition({
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

    if ($sotd) {
        let found = false;
        $sotd.find('p').each((_, p) => {
            const $p = context.$(p);
            const pText = $p.text();
            const $a = $p.find('a').first();
            if (
                context.norm(pText) === boilerplate &&
                $a.length &&
                $a.attr('href') === newProcUri
            ) {
                if (found)
                    context.error(self, 'multiple-times', { process: newProc });
                else {
                    found = true;
                }
            } else if (
                context.norm(pText) === previousBoilerplate &&
                $a.length &&
                $a.attr('href') === previousProcUri
            ) {
                if (previousAllowed) {
                    context.warning(self, 'previous-allowed', {
                        process: previousProc,
                    });
                    found = true;
                } else {
                    context.error(self, 'previous-not-allowed', {
                        process: previousProc,
                    });
                }
            }
        });
        if (!found) context.error(self, 'not-found', { process: newProc });
    }
};
