import type { RuleCheckFunction, RuleMeta } from '../../types.js';

const self: RuleMeta = {
    name: 'sotd.candidate-review-end',
    section: 'document-status',
    rule: 'reviewEndDate',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const isEditorial =
        (context.config!.editorial &&
            /^true$/i.test(context.config!.editorial)) ||
        false;
    if (isEditorial) {
        context.warning(self, 'editorial');
    } else {
        const dates = context.getFeedbackDueDate();
        if (dates.list.length === 0) context.error(self, 'not-found');
        else {
            let res;

            if (dates.valid.length === 1) {
                [res] = dates.valid;
                context.info(self, 'date-found', { date: res.toDateString() });
            } else if (dates.valid.length > 1) {
                context.warning(self, 'multiple-found');
                res = dates.valid.map(item => new Date(item).toDateString());
                context.info(self, 'date-found', { date: res.join(', ') });
            } else {
                // dates found but not valid
                res = dates.list.map(item => new Date(item).toDateString());
                context.error(self, 'found-not-valid', {
                    date: res.join(', '),
                });
            }
        }
    }
};
