/**
 * Check the presence of the actual TOC (<code>&lt;ol class="toc"&gt;</code>) inside the main navigation element.
 */

const self = {
    name: 'headers.ol-toc',
    section: 'navigation',
    // @TODO: update this selector... when the rule is added to the JSON.
    rule: 'toc',
};

exports.name = self.name;

exports.check = function (sr, done) {
    const toc = sr.jsDocument.querySelectorAll(
        'nav#toc ol.toc, div#toc ol.toc'
    );

    if (!toc || toc.length < 1) {
        sr.warning(self, 'not-found');
    }

    done();
};
