/**
 * Check the presence of the actual TOC (<code>&lt;ol class="toc"&gt;</code>) inside the main navigation element.
 */

const self = {
    name: 'headers.ol-toc'
    // @TODO: fix the section... when it is fixed in the JSON.
,   section: 'undefined'
    // @TODO: update this selector... when the rule is added to the JSON.
,   rule: 'tocTest'
};

exports.check = function (sr, done) {

    var toc = sr.$('nav#toc ol.toc, div#toc ol.toc');

    if (!toc || toc.length < 1) {
        sr.warning(self, 'not-found');
    }

    done();

};
