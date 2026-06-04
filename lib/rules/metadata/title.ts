/**
 * Pseudo-rule for metadata extraction: title.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.title'

export const name = 'metadata.title';

export const check: RuleCheckFunction<{ title: string } | void> = sr => {
    const $title = sr.$('body div.head h1').first();
    if (!$title.length) return;

    $title.html($title.html()!.replace(/:<br>/g, ': ').replace(/<br>/g, ' - '));
    return {
        title: sr.norm($title.text()),
    };
};
