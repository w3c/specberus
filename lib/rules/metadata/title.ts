/**
 * Pseudo-rule for metadata extraction: title.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.title'

export const name = 'metadata.title';

export const check: RuleCheckFunction<{ title: string } | void> = (
    sr,
    done
) => {
    const $title = sr.$!('body div.head h1').first();
    if (!$title.length) return done();

    $title.html($title.html()!.replace(/:<br>/g, ': ').replace(/<br>/g, ' - '));
    return done({
        title: sr.norm($title.text()),
    });
};
