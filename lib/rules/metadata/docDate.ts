/**
 * Pseudo-rule for metadata extraction: docDate.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.docDate'
export const name = 'metadata.docDate';

interface DocDateMetadata {
    docDate: `${number}-${number}-${number}`;
}

export const check: RuleCheckFunction<DocDateMetadata | void> = context => {
    const docDate = context.getDocumentDate();
    if (docDate)
        return {
            docDate: `${docDate.getFullYear()}-${docDate.getMonth() + 1}-${docDate.getDate()}`,
        };
};
