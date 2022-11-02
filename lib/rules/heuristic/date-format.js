import { possibleMonths } from '../../validator.js';

const self = {
    name: 'heuristic.date-format',
    section: 'document-status',
    rule: 'datesFormat',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    // Pseudo-constants:
    const POSSIBLE_DATE = new RegExp(
        `\\b([0123]?\\d|${possibleMonths})[\\ \\-\\/–—]([0123]?\\d|${possibleMonths})[\\ \\-\\/–—]([\\'‘’]?\\d{2})(\\d\\d)?\\b`,
        'gi'
    );
    const EXPECTED_DATE_FORMAT = new RegExp(
        `[0123]?\\d\\ (${possibleMonths})\\ \\d{4}`,
        'i'
    );

    const boilerplateSections = [
        sr.jsDocument.querySelector('div.head'),
        sr.getSotDSection(),
    ];
    const candidateDates = [];
    let i;
    let j;
    let elem;

    for (i in boilerplateSections) {
        const text =
            boilerplateSections[i] && boilerplateSections[i].textContent;
        elem =
            text &&
            text.replace(/(?:https?|ftp):\/\/\S+/gi, '').match(POSSIBLE_DATE);
        for (j in elem) {
            candidateDates.push(elem[j]);
        }
    }

    for (i in candidateDates) {
        if (!candidateDates[i].match(EXPECTED_DATE_FORMAT)) {
            sr.error(self, 'wrong', { text: candidateDates[i] });
        }
    }

    return done();
}
