/**
 * Check the presence of the actual TOC (<code>&lt;ol class="toc"&gt;</code>) inside the main navigation element.
 */

exports.name  = 'headers.ol-toc';

exports.check = function (sr, done) {

    var toc = sr.$('nav#toc ol.toc, div#toc ol.toc');

    if (!toc || toc.length < 1) {
        sr.warning(exports.name, 'not-found');
    }

    done();

};
