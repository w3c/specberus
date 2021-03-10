/**
 * Check if there's a <em>back-top-top</em> hyperlink.
 */

const self = {
    name: 'style.back-to-top',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const candidates = sr.jsDocument.querySelectorAll(
        "body p#back-to-top[role='navigation'] a[href='#title']"
    );

    if (candidates.length !== 1) {
        sr.warning(self, 'not-found');
    }

    done();
};
