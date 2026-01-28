/* emits: 'not-found' */

/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'headers.div-head',
    section: 'front-matter',
    rule: 'divClassHead',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    sr.checkSelector('body div.head', self, done);
}
