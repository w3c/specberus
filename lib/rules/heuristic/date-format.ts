import type { RuleCheckFunction, RuleMeta } from '../../types.js';
import { possibleMonths } from '../../validator.js';

const self: RuleMeta = {
    name: 'heuristic.date-format',
    section: 'document-status',
    rule: 'datesFormat',
};

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    // Pseudo-constants:
    const POSSIBLE_DATE = new RegExp(
        `\\b([0123]?\\d|${possibleMonths})[\\ \\-\\/–—]([0123]?\\d|${possibleMonths})[\\ \\-\\/–—]([\\'‘’]?\\d{2})(\\d\\d)?\\b`,
        'gi'
    );
    const EXPECTED_DATE_FORMAT = new RegExp(
        `[0123]?\\d\\ (${possibleMonths})\\ \\d{4}`,
        'i'
    );

    const boilerplateSections = [sr.$('div.head').first(), sr.getSotDSection()];
    const candidateDates: string[] = [];

    for (const $section of boilerplateSections) {
        const text = $section && $section.text();
        const elem =
            text &&
            text.replace(/(?:https?|ftp):\/\/\S+/gi, '').match(POSSIBLE_DATE);
        if (elem) {
            for (const el of elem) candidateDates.push(el);
        }
    }

    for (const date of candidateDates) {
        if (!date.match(EXPECTED_DATE_FORMAT)) {
            sr.error(self, 'wrong', { text: date });
        }
    }

    return done();
};
