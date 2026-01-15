/**
 * Check the presence of the actual TOC (<code>&lt;ol class="toc"&gt;</code>) inside the main navigation element.
 */

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.ol-toc',
    section: 'navigation',
    // @TODO: update this selector... when the rule is added to the JSON.
    rule: 'toc',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $toc = sr.$('nav#toc ol.toc, div#toc ol.toc');

    if (!$toc.length) sr.warning(self, 'not-found');

    done();
}
