/**
 * @file make sure specification use neutral words.
 */

import badterms from '../../../public/badterms.json' with { type: 'json' };
import type { RuleCheckFunction } from '../../types.js';

const self = {
    name: 'structure.neutral',
};

// get blocklist from json file
let blocklist: string[] = [];
for (const item of badterms) {
    blocklist = blocklist.concat(item.term, item.variation || []);
}

export const { name } = self;

export const check: RuleCheckFunction = (sr, done) => {
    const blocklistReg = new RegExp(`\\b${blocklist.join('\\b|\\b')}\\b`, 'ig');
    const unneutralList: string[] = [];
    // Use a cloned body instead of the original one, prevent '.remove()' side effects.
    const $body = sr.$('body').first().clone();
    const $links = $body.find('a');
    $links.each((_, link) => {
        const $link = sr.$(link);
        const href = $link.attr('href');
        const linkText = $link.text();
        // let words in link like: <a href="https://github.com/master/usage">https://github.com/master/usage</a> --> pass the check
        if (href === linkText && blocklistReg.exec(linkText)) {
            $link.remove();
        }
    });

    const text = $body.text();
    const regResult = text.match(blocklistReg);
    if (regResult) {
        regResult.forEach(word => {
            if (unneutralList.indexOf(word.toLowerCase()) < 0) {
                unneutralList.push(word.toLowerCase());
            }
        });
    }
    if (unneutralList.length) {
        sr.warning(self, 'neutral', { words: unneutralList.join('", "') });
    }
    done();
};
