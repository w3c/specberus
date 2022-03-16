const self = {
    name: 'sotd.diff',
    section: 'document-status',
    rule: 'changesList',
};

export const { name } = self;

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    sr.info(self, 'note');
    return done();
}
