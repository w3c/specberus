// must have h1, with same content as title

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.h1-title',
    section: 'front-matter',
    rule: 'title',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $title = sr.$('head > title').first();
    const $h1 = sr.$('body div.head h1').first();
    if (!$title.length || !$h1.length) {
        sr.error(self, 'not-found');
    } else {
        const titleText = sr.norm($title.text());
        $h1.html($h1.html().replace(/:<br>/g, ': ').replace(/<br>/g, ' - '));
        const h1Text = sr.norm($h1.text());
        if (titleText !== h1Text)
            sr.error(self, 'not-match', { titleText, h1Text });
    }
    done();
}
