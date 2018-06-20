/**
 * Pseudo-rule for metadata extraction: dl.
 */

const latestRule = {
    name: 'metadata.dl'
,   section: 'front-matter'
,   rule: 'docIDLatestVersion'
};

const previousRule = {
    name: 'metadata.dl'
,   section: 'front-matter'
,   rule: 'docIDFormat'
};

exports.name = "metadata.dl";

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
        var latestRegex = $linkLate.attr("href").trim().match(new RegExp(/.*\/([^/]+)\/$/));
        if (latestRegex && latestRegex.length > 0)
            latestShortname = latestRegex[1];
        else
            sr.error(latestRule, 'latest-not-found');
    }

    var $linkPrev = (dts.Previous) ? dts.Previous.dd.find("a").first() : null;
    if ($linkPrev && $linkPrev.length) {
        result.previousVersion = $linkPrev.attr('href').trim();
        var previousRegex = $linkPrev.attr("href").trim().match(new RegExp(/.*\/[^/-]+\-(.*)-\d{8}\/$/));
        if (previousRegex && previousRegex.length > 0)
            previousShortname = previousRegex[1];
        else
            sr.error(previousRule, 'previous-not-found');
    }

    var $linkEd = (dts.EditorDraft) ? dts.EditorDraft.dd.find("a").first() : null;
    if ($linkEd && $linkEd.length)
        result.editorsDraft = $linkEd.attr('href').trim();

    if (previousShortname && latestShortname && previousShortname !== latestShortname) {
        result.sameWorkAs = 'https://www.w3.org/TR/'+previousShortname+'/';  // TODO use api to get the previous shortlink
    }

    // check same day publications
    var ua            = "W3C-Pubrules/" + sr.version,
        apikey        = process.env.API_KEY,
        docDate       = sr.getDocumentDate(),
        year          = docDate.getFullYear(),
        month         = (docDate.getMonth() + 1).toString(),
        day           = (docDate.getDate()).toString(),
        formattedDate = year + (month[1]?month:"0"+month[0]) + (day[1]?day:"0"+day[0]),
        endpoint      = 'https://api.w3.org/specifications/' + latestShortname + '/versions/' + formattedDate,
        sua           = require("../../throttled-ua");

        var req = sua.get(endpoint)
                     .set("User-Agent", ua);
        req.query({apikey: apikey});
        req.end(function(err, res) {
          result.updated = !(err || !res.ok);
          return done(result);
        });
};
