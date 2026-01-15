/**
 * Pseudo-rule for metadata extraction: process.
 */

/** @import { Specberus } from "../../validator.js" */

// const self = {
//     name: 'metadata.process'
// ,   section: 'document-status'
// ,   rule: 'whichProcess'
// };

export const name = 'metadata.process';

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $processDocument = sr.$('a#w3c_process_revision');
    const processDocumentHref =
        $processDocument.length && $processDocument.attr('href');
    if (!processDocumentHref) {
        return done();
    }
    return done({ process: processDocumentHref });
}
