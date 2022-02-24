const self = {
    name: 'validation.wcag',
    section: 'document-body',
    rule: 'wcag',
};

export const name = self.name;

export function check(sr, done) {
    sr.info(self, 'tools');
    return done();
}
