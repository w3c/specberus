const self = {
    name: 'headers.hr',
    section: 'front-matter',
    rule: 'hrAfterCopyright',
};

export const name = self.name;

export function check(sr, done) {
    const hasHrLastChild =
        sr.jsDocument.querySelectorAll('body div.head > hr:last-child')
            .length === 1;
    const hasHrNextSibling =
        sr.jsDocument.querySelectorAll('body div.head + hr').length === 1;
    if (hasHrLastChild && hasHrNextSibling) {
        sr.error(self, 'duplicate');
    } else if (!hasHrLastChild && !hasHrNextSibling) {
        sr.error(self, 'not-found');
    }
    done();
}
