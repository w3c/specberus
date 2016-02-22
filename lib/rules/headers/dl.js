// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is http://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is http://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author

var Request = require('request')
,   Promise = require('promise');

exports.name = "headers.dl";

exports.check = function (sr, done) {

    var prevRequired = sr.config.previousVersion
    ,   rescinds = sr.config.rescinds
    ,   subType = sr.config.submissionType
    ,   topLevel = "TR"
    ,   thisURI = ''
    ,   previousURI = ''
    ,   latestURI = ''
    ,   err = function (str, extra) {
            sr.error(exports.name, str, extra);
        }
    ;

    var fetch = function(uri) {
      return new Promise(function (resolve, reject) {
        Request.get(uri, {}, function (error, response, body) {
          if (error) {
            reject(new Error('Fetching ' + uri + ' triggered a network error: ' + error.message));
          }
          else if (response.statusCode !== 200) {
            reject(new Error('Fetching ' + uri + ' triggered and HTTP error: code ' + response.statusCode));
          }
          else resolve(body);
        });
      });
    };

    if (subType === "member") topLevel = "Submission";
    else if (subType === "team") topLevel = "TeamSubmission";

    var dts = sr.extractHeaders(sr.$("body div.head dl").first());
    if (!dts.This) err("this-version");
    if (!dts.Latest) err("latest-version");
    if (prevRequired && !dts.Previous) err("previous-version");
    if (!prevRequired && dts.Previous) sr.warning(exports.name, "previous-not-needed");
    if (rescinds && !dts.Rescinds) err("rescinds");
    if (!rescinds && dts.Rescinds) sr.warning(exports.name, "rescinds-not-needed");

    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos) err("this-latest-order");
    if (dts.Latest && dts.Previous && dts.Latest.pos > dts.Previous.pos) err("latest-previous-order");
    if (dts.Latest && dts.Rescinds && dts.Latest.pos > dts.Rescinds.pos) err("latest-rescinds-order");

    var shortname;
    if (dts.This) {
        var $linkThis = dts.This.dd.find("a").first();
        if (!$linkThis
            || !$linkThis.length
            || $linkThis.attr("href").trim() !== $linkThis.text().trim()
           ) err("this-link");

        var vThisRex = "^http:\\/\\/www\\.w3\\.org\\/" +
                       topLevel +
                       "\\/(\\d{4})\\/" +
                       (sr.config.status || "[A-Z]+") +
                       "-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$";
        var matches = ($linkThis.attr("href") || "").trim().match(new RegExp(vThisRex))
        ,   docDate = sr.getDocumentDate()
        ;
        if (matches) {
            thisURI = matches[0];
            var year = matches[1] * 1
            ,   year2 = matches[3] * 1
            ,   month = matches[4] * 1
            ,   day = matches[5] * 1
            ;
            shortname = matches[2];
            if (docDate) {
                if (year !== docDate.getFullYear() ||
                    year2 !== docDate.getFullYear() ||
                    month - 1 !== docDate.getMonth() ||
                    day !== docDate.getDate()
                   ) err("this-date");
            }
            else sr.warning(exports.name, "no-date");
        }
        else err("this-syntax");
    }

    if (dts.Latest) {
        var $linkLate = dts.Latest.dd.find("a").first();
        if (!$linkLate
            || !$linkLate.length
            || $linkLate.attr("href").trim() !== $linkLate.text().trim()
           ) err("latest-link");

        var lateRex = "^https?:\\/\\/www\\.w3\\.org\\/" + topLevel + "\\/(.+?)\\/?$"
        ,   matches = ($linkLate.attr("href") || "").trim().match(new RegExp(lateRex));
        if (matches) {
            var sn = matches[1];
            latestURI = $linkLate.text();
            if (sn !== shortname) err("this-latest-shortname");
        }
        else err("latest-syntax");
    }

    if (dts.Previous) {
        var $linkPrev = dts.Previous.dd.find("a").first();
        if (!$linkPrev
            || !$linkPrev.length
            || $linkPrev.attr("href").trim() !== $linkPrev.text().trim()
           ) err("previous-link");

        var prevRex = "^https?:\\/\\/www\\.w3\\.org\\/" + topLevel + "\\/\\d{4}\\/[A-Z]+-(.+)-\\d{8}\\/?$"
        ,   matches = ($linkPrev.attr("href") || "").trim().match(new RegExp(prevRex))
        ;
        if (matches) {
            var sn = matches[1];
            previousURI = $linkPrev.text();
            if (sn !== shortname) err("this-previous-shortname");
        }
        else err("previous-syntax");
    }

    if (dts.Rescinds) {
        var $linkResc = dts.Rescinds.dd.find("a").first();
        if (!$linkResc || !$linkResc.length || $linkResc.attr("href") !== $linkResc.text()) err("rescinds-link");

        var matches = ($linkResc.attr("href") || "").trim().match(/^https?:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("this-rescinds-shortname");
        }
        else err("rescinds-syntax");
    }

    if (thisURI && previousURI && thisURI.toLowerCase() === previousURI.toLowerCase()) {
      err('same-this-and-previous');
    }

    if (!previousURI || !latestURI || previousURI.toLowerCase() === latestURI.toLowerCase()) {
      done();
    }
    else {
      Promise.all([fetch(previousURI), fetch(latestURI)]).then(function (bodies) {
        if (!bodies || 2 !== bodies.length) {
          err('cant-retrieve');
        }
        else if (bodies[0] !== bodies[1]) {
          // check same day publication
          var $         = require("whacko").load(bodies[1])
          ,   $latestDl = $("body div.head dl").first()
          ,   latestDts = sr.extractHeaders($latestDl);
          if (latestDts.This &&
              latestDts.This.dd.find("a").first().attr("href") === thisURI &&
              latestDts.Previous &&
              latestDts.Previous.dd.find("a").first().attr("href") === previousURI) {
            sr.warning(exports.name, 'same-day-publication');
          } else {
            err('latest-is-not-previous');
          }
        }
        done();
      }, function() {
        err('cant-retrieve');
        done();
      }
    );
  }

};
