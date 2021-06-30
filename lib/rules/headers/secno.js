/**
 * Check (more or less) if items in the TOC and headings are wrapped inside <code>&lt;bdi class="secno"&gt;</code>.
 */

const self = {
    name: 'headers.secno',
};

exports.name = self.name;

exports.check = function (sr, done) {
    // TODO: once supported, use: ":is(h2, h3, h4, h5, h6) :is(bdi.secno,span.secno)"
    const secnos = sr.jsDocument.querySelectorAll(
        'h1 span.secno, h2 span.secno, h3 span.secno, h4 span.secno, h5 span.secno, h6 span.secno, #toc span.secno,' +
            'h1 bdi.secno, h2 bdi.secno, h3 bdi.secno, h4 bdi.secno, h5 bdi.secno, h6 bdi.secno, #toc bdi.secno'
    );

    if (!secnos || secnos.length < 1) {
        sr.warning(self, 'not-found');
    }

    done();
};
