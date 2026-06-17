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

export const check: RuleCheckFunction<ProcessMetadata | void> = context => {
    const $processDocument = context.$('a#w3c_process_revision').first();
    const processDocumentHref =
        $processDocument.length && $processDocument.attr('href');

    if (processDocumentHref) return { process: processDocumentHref };
};
