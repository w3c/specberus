/** @import { Specberus } from "../../validator.js" */

const self = {
    name: 'style.body-toc-sidebar',
};

export const { name } = self;

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    try {
        if (sr.$('body').hasClass('toc-sidebar')) sr.error(self, 'class-found');
    } catch (e) {
        sr.error(self, 'selector-fail');
    }
    done();
}
