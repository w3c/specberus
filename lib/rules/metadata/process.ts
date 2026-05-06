/**
 * Pseudo-rule for metadata extraction: process.
 */

import type { RuleCheckFunction } from '../../types.js';

// const self = {
//     name: 'metadata.process'
// ,   section: 'document-status'
// ,   rule: 'whichProcess'
// };

export const name = 'metadata.process';

interface ProcessMetadata {
    process: string;
}

export const check: RuleCheckFunction<ProcessMetadata | void> = (sr, done) => {
    const $processDocument = sr.$('a#w3c_process_revision').first();
    const processDocumentHref =
        $processDocument.length && $processDocument.attr('href');

    if (!processDocumentHref) return done();
    return done({ process: processDocumentHref });
};
