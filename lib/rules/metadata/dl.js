/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

exports.name = 'metadata.rectrack';

exports.check = function(sr, done) {

    var dts = sr.extractHeaders()
    ,   result = {};

    var $linkThis = (dts.This) ? dts.This.dd.find("a").first() : null;
    if ($linkThis && $linkThis.length)
      result['thisVersion'] = $linkThis.attr('href').trim();

    var $linkLate = (dts.Latest) ? dts.Latest.dd.find("a").first() : null;
    if ($linkLate && $linkLate.length)
        result['latestVersion'] = $linkLate.attr('href').trim();

    var $linkPrev = (dts.Previous) ? dts.Previous.dd.find("a").first() : null;
    if ($linkPrev && $linkPrev.length)
        result['previousVersion'] = $linkPrev.attr('href').trim();

    var $linkEd = (dts.Editor) ? dts.Editor.dd.find("a").first() : null;
    if ($linkEd && $linkEd.length)
        result['editorsDraft'] = $linkEd.attr('href').trim();

    return done(result);
};
