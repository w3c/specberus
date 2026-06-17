import type { RuleCheckFunction, RuleMeta } from '../../types.js';
import { dateRegexStrCapturing } from '../../validator.js';

const self: RuleMeta = {
    name: 'sotd.rec-comment-end',
    section: 'document-status',
    rule: 'commentEnd',
};

export const { name } = self;

export const check: RuleCheckFunction = context => {
    const $sotd = context.getSotDSection();
    if ($sotd) {
        const recType = context.getRecMetadata();
        if (recType.pSubChanges || recType.pNewFeatures) {
            const txt = context.norm($sotd.text());
            const rex = new RegExp(dateRegexStrCapturing, 'g');
            const docDate = context.getDocumentDate()!;

            // 60 days later than docDate;
            const minimumEndDate = new Date(
                +docDate - 0 + 60 * 24 * 60 * 60 * 1000
            );
            // "Mon Nov 02 2020 16:26:28 GMT+0800 (@@ Standard Time)" -> "Nov 02 2020"
            const readableDate = minimumEndDate
                .toDateString()
                .split(' ')
                .slice(1)
                .join(' ');
            if (!rex.test(txt))
                context.error(self, 'not-found', {
                    minimumEndDate: readableDate,
                });
            else {
                const matches = txt.match(rex);
                const dateFound = [];
                if (matches) {
                    for (const match of matches) {
                        const date = context.stringToDate(match);
                        if (date && date > minimumEndDate) {
                            dateFound.push(context.stringToDate(match));
                        }
                    }
                }
                if (dateFound.length > 1) {
                    context.warning(self, 'multi-found', {
                        date: dateFound.join(', '),
                        minimumEndDate: readableDate,
                    });
                } else if (!dateFound.length) {
                    context.error(self, 'not-found', {
                        minimumEndDate: readableDate,
                    });
                }
            }
        }
    }
};
