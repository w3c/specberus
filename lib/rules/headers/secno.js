/**
 * Check (more or less) if items in the TOC and headings are wrapped inside <code>&lt;span class="secno"&gt;</code>.
 */

const self = {
    name: 'headers.secno',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const secnos = sr.jsDocument.querySelectorAll(
        'h1 span.secno, h2 span.secno, h3 span.secno, h4 span.secno, h5 span.secno, h6 span.secno, #toc span.secno'
    );

    if (!secnos || secnos.length < 1) {
        sr.warning(self, 'not-found');
    }

    done();
};
