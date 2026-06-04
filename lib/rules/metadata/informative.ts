/**
 * Pseudo-rule for metadata extraction: informative.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.informative'
export const name = 'metadata.informative';

interface InformativeMetadata {
    informative: boolean;
}

export const check: RuleCheckFunction<InformativeMetadata | void> = sr => {
    const $sotd = sr.getSotDSection();
    const expected = /This\s+document\s+is\s+informative\s+only\./;
    if (!$sotd) return;

    const $stateEl = sr.getDocumentStateElement();
    const candidate = $stateEl && sr.norm($stateEl.text()).toLowerCase();
    const isInformative = !!candidate && candidate.indexOf('group note') !== -1;

    return {
        informative: expected.test($sotd && $sotd.text()) || isInformative,
    };
};
