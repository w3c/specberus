/* emits: 'not-found' */

const self = {
    name: 'headers.div-head',
    section: 'front-matter',
    rule: 'divClassHead',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    sr.checkSelector('body div.head', self, done);
}
