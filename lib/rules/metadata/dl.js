/**
 * Pseudo-rule for metadata extraction: dl.
 */

// 'self.name' would be 'metadata.dl'

exports.check = function(sr, done) {
    var $dl = sr.$("body div.head dl").first()
    ,   dts = sr.extractHeaders($dl)
    ,   result = {}
    ,   previousShortname
    ,   latestShortname;

    var $linkThis = (dts.This) ? dts.This.dd.find("a").first() : null;
    if ($linkThis && $linkThis.length)
      result.thisVersion = $linkThis.attr('href').trim();

    var $linkLate = (dts.Latest) ? dts.Latest.dd.find("a").first() : null;
    if ($linkLate && $linkLate.length) {
        result.latestVersion = $linkLate.attr('href').trim();
        latestShortname = $linkLate.attr("href").trim().match(new RegExp(/.*\/([^/]+)\/$/))[1];
    }

    var $linkPrev = (dts.Previous) ? dts.Previous.dd.find("a").first() : null;
    if ($linkPrev && $linkPrev.length) {
        result.previousVersion = $linkPrev.attr('href').trim();
        previousShortname = $linkPrev.attr("href").trim().match(new RegExp(/.*\/[^/-]+\-(.*)-\d{8}\/$/))[1];
    }

    var $linkEd = (dts.EditorDraft) ? dts.EditorDraft.dd.find("a").first() : null;
    if ($linkEd && $linkEd.length)
        result.editorsDraft = $linkEd.attr('href').trim();

    if (previousShortname && latestShortname && previousShortname !== latestShortname) {
        result.sameWorkAs = 'http://www.w3.org/TR/'+previousShortname+'/';  // TODO use api to get the previous shortlink
    }

    return done(result);
};
