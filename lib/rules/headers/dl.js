// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is https://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is https://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author

var PowerPromise = require('promise')
,   req = require('request')
,   whacko = require('whacko')
;

const self = {
        name: 'headers.dl'
    ,   section: 'front-matter'
    ,   rule: 'docIDFormat'
    }
,   thisError = {
        name: 'headers.dl'
    ,   section: 'front-matter'
    ,   rule: 'docIDThisVersion'
}
,   latestError = {
        name: 'headers.dl'
    ,   section: 'front-matter'
    ,   rule: 'docIDLatestVersion'
}
,   previousError = {
        name: 'headers.dl'
    ,   section: 'front-matter'
    ,   rule: 'docIDOrder'
}
;

exports.name = self.name;
const chalk = require('chalk');
exports.check = function (sr, done) {

    var prevRequired = sr.config.previousVersion
    ,   rescinds = sr.config.rescinds
    ,   obsoletes = sr.config.obsoletes
    ,   supersedes = sr.config.supersedes
    ,   subType = sr.config.submissionType
    ,   topLevel = "TR"
    ,   thisURI = ''
    ,   previousURI = ''
    ,   latestURI = ''
    ;

    var fetch = function(uri) {
        return new PowerPromise(function (resolve, reject) {
            req.get(uri, {}, function (error, response, body) {
                if (error) {
                    reject(new Error('Fetching ' + uri + ' triggered a network error: ' + error.message));
                }
                else if (response.statusCode !== 200) {
                    reject(new Error('Fetching ' + uri + ' triggered an HTTP error: code ' + response.statusCode));
                }
                else resolve(body);
            });
        });
    };

    if (subType === "member") topLevel = "Submission";
    else if (subType === "team") topLevel = "TeamSubmission";

    var dts = sr.extractHeaders(sr.$("body div.head dl").first());
    if (!dts.This) sr.error(self, "this-version");
    if (!dts.Latest) sr.error(self, "latest-version");
    if (prevRequired && !dts.Previous) sr.error(self, "previous-version");
    console.log(chalk.yellow('sr.config.previousVersion: ' + prevRequired));
    console.log(chalk.yellow('dts.Previous: ' + dts.Previous));
    console.log('\n');
    
    if (!prevRequired && dts.Previous) sr.warning(self, 'previous-not-needed');
    if (rescinds && !dts.Rescinds) sr.error(self, "rescinds");
    if (!rescinds && dts.Rescinds) sr.warning(self, 'rescinds-not-needed');
    if (obsoletes && !dts.Obsoletes) sr.error(self, "obsoletes");
    if (!obsoletes && dts.Obsoletes) sr.warning(self, 'obsoletes-not-needed');
    if (supersedes && !dts.Supersedes) sr.error(self, "supersedes");
    if (!supersedes && dts.Supersedes) sr.warning(self, 'supersedes-not-needed');

    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos) sr.error(self, "this-latest-order");
    if (dts.Latest && dts.Previous && dts.Latest.pos > dts.Previous.pos) sr.error(self, "latest-previous-order");
    if (dts.Latest && dts.Rescinds && dts.Latest.pos > dts.Rescinds.pos) sr.error(self, "latest-rescinds-order");
    if (dts.Latest && dts.Obsoletes && dts.Latest.pos > dts.Obsoletes.pos) sr.error(self, "latest-obsoletes-order");
    if (dts.Latest && dts.Supersedes && dts.Latest.pos > dts.Supersedes.pos) sr.error(self, "latest-supersedes-order");

    var shortname
    ,   matches
    ,   shortnameChange = false;

    if (dts.This) {
        var $linkThis = dts.This.dd.find("a").first();
        if (!$linkThis || !$linkThis.length || $linkThis.attr("href").trim() !== $linkThis.text().trim())
            sr.error(self, "this-link");

        var vThisRex = "^https:\\/\\/www\\.w3\\.org\\/" +
                       topLevel +
                       "\\/(\\d{4})\\/" +
                       (sr.config.status || "[A-Z]+") +
                       "-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$";
        matches = ($linkThis.attr("href") || "").trim().match(new RegExp(vThisRex));
        var docDate = sr.getDocumentDate();
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
                   ) sr.error(self, "this-date");
            }
            else sr.warning(self, 'no-date');
        }
        else sr.error(thisError, "this-syntax");
    }

    var sn;

    if (dts.Latest) {
        var $linkLate = dts.Latest.dd.find("a").first();
        if (!$linkLate || !$linkLate.length || $linkLate.attr("href").trim() !== $linkLate.text().trim())
            sr.error(self, "latest-link");

        var lateRex = "^https:\\/\\/www\\.w3\\.org\\/" + topLevel + "\\/(.+?)\\/?$";
        matches = ($linkLate.attr("href") || "").trim().match(new RegExp(lateRex));
        if (matches) {
            sn = matches[1];
            latestURI = $linkLate.text();
            if (sn !== shortname) sr.error(self, "this-latest-shortname");
        }
        else sr.error(latestError, "latest-syntax");
    }

    if (dts.Previous) {
        var $linkPrev = dts.Previous.dd.find("a").first();
        if (!$linkPrev || !$linkPrev.length || $linkPrev.attr("href").trim() !== $linkPrev.text().trim())
            sr.error(self, "previous-link");

        const prevRex = /^http(s?):\/\/www\.w3\.org\/TR\/\d{4}\/[A-Z]+-(.+)-(\d{8})\/$/;
        matches = ($linkPrev.attr("href") || "").trim().match(prevRex);
        if (matches) {
            if (matches[3] >= 20160801 && 's' !== matches[1])
                sr.error(previousError, "previous-syntax");
            previousURI = $linkPrev.text();
            shortnameChange = matches[2] !== shortname;
            if (shortnameChange) {
                sr.warning(self, "this-previous-shortname");
            }
        }
        else sr.error(previousError, "previous-syntax");
    }

    if (dts.Rescinds) {
        var $linkResc = dts.Rescinds.dd.find("a").first();
        if (!$linkResc || !$linkResc.length || $linkResc.attr("href") !== $linkResc.text()) sr.error(self, "rescinds-link");

        matches = ($linkResc.attr("href") || "").trim().match(/^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            sn = matches[1];
            if (sn !== shortname) sr.error(self, "this-rescinds-shortname");
        }
        else sr.error(self, "rescinds-syntax");
    }

    if (dts.Obsoletes) {
        var $linkObsl = dts.Obsoletes.dd.find("a").first();
        if (!$linkObsl || !$linkObsl.length || $linkObsl.attr("href") !== $linkObsl.text()) sr.error(self, "obsoletes-link");

        matches = ($linkObsl.attr("href") || "").trim().match(/^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            sn = matches[1];
            if (sn !== shortname) sr.error(self, "this-obsoletes-shortname");
        }
        else sr.error(self, "obsoletes-syntax");
    }

    if (dts.Supersedes) {
        var $linkSpsd = dts.Supersedes.dd.find("a").first();
        if (!$linkSpsd || !$linkSpsd.length || $linkSpsd.attr("href") !== $linkSpsd.text()) sr.error(self, "supersedes-link");

        matches = ($linkSpsd.attr("href") || "").trim().match(/^https:\/\/www\.w3\.org\/TR\/\d{4}\/REC-(.+)-\d{8}\/?$/);
        if (matches) {
            sn = matches[1];
            if (sn !== shortname) sr.error(self, "this-supersedes-shortname");
        }
        else sr.error(self, "supersedes-syntax");
    }

    if (thisURI && previousURI && thisURI.toLowerCase() === previousURI.toLowerCase()) {
        sr.error(self, 'same-this-and-previous');
    }

    if (!previousURI || !latestURI || previousURI.toLowerCase() === latestURI.toLowerCase() || shortnameChange) {
        done();
    }
    else {
        PowerPromise.all([fetch(previousURI), fetch(latestURI)]).then(function (bodies) {
            if (!bodies || 2 !== bodies.length) {
                sr.error(self, 'cant-retrieve');
            }
            else if (bodies[0] !== bodies[1]) {
                // check same day publication
                var $         = whacko.load(bodies[1])
                ,   $latestDl = $("body div.head dl").first()
                ,   latestDts = sr.extractHeaders($latestDl);
                if (latestDts.This &&
                    latestDts.This.dd.find("a").first().attr("href") === thisURI &&
                    latestDts.Previous &&
                    latestDts.Previous.dd.find("a").first().attr("href") === previousURI) {
                      sr.warning(self, 'same-day-publication');
                } else {
                    sr.error(self, 'latest-is-not-previous');
                }
            }
            done();
        }, function() {
            sr.error(self, 'cant-retrieve');
            done();
        });
    }

};
