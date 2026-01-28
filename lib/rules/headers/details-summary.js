/* check if the document's headers link are in */

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.details-summary',
    section: 'front-matter',
    rule: 'docIDFormat',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $details = sr.$('.head details').first();
    if (!$details.length) {
        sr.error(self, 'no-details');
        return done();
    }

    if (!$details.attr('open')) {
        sr.error(self, 'no-details-open');
    }

    if (!sr.$('.head details dl').length) {
        sr.error(self, 'no-details-dl');
        return done();
    }

    const $summary = sr.$('.head details summary').first();
    if (!$summary.length) {
        sr.error(self, 'no-details-summary');
        return done();
    }

    const summaryText = sr.norm($summary.text());
    if (summaryText !== 'More details about this document') {
        sr.error(self, 'wrong-summary-text');
    }

    return done();
}
