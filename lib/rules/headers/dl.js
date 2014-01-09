
// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is http://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is http://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author

exports.name = "headers.dl";
exports.check = function (sr, done) {
    var $dl = sr.$("body > div.head:first-child dl").first()
    ,   sink = sr.sink
    ,   prevRequired = sr.config.previousVersion
    ,   err = function (str) {
            sink.emit("err", exports.name, { message: str });
        }
    ;

    var dts = [];
    $dl.find("dt").each(function () { dts.push(sr.$(this).text().replace(":", "")); });
    var vThis = dts.indexOf("This Version")
    ,   vLate = dts.indexOf("Latest Version")
    ,   vPrev = dts.indexOf("Previous Version")
    ;
    
    // XXX use error names instead of messages, we don't need details for these errors
    if (vThis === -1) err("This Version is missing.");
    if (vLate === -1) err("Latest Version is missing.");
    if (prevRequired && vPrev === -1) err("Previous Version is missing.");
    if (vThis > vLate) err("This Version must be before Latest Version.");
    if (vPrev > -1 && vLate > vPrev) err("Latest Version must be before Previous Version.");

    var shortname;
    if (vThis > -1) {
        var linkThis = $dl.find("dt:contains('This Version') + dd a").first();
        if (linkThis.attr("href") !== linkThis.text())
            err("Link href and text differ for This Version.");

        var vThisRex = "^https?:\\/\\/www\\.w3\\.org\\/TR\\/(\\d{4})\\/" +
                       (sr.config.status || "[A-Z]+") +
                       "-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$";
        var matches = linkThis.attr("href").match(new RegExp(vThisRex))
        ,   docDate = sr.getDocumentDate()
        ;
        if (matches) {
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
                   ) err("Mismatch between document date and This Version link.");
            }
            else sink.emit("warning", exports.name, { message: "Cannot find document date." });
        }
        else err("Wrong syntax for This Version link.");
    }

    if (vLate > -1) {
        var linkLate = $dl.find("dt:contains('Latest Version') + dd a").first();
        if (linkLate.attr("href") !== linkLate.text())
            err("Link href and text differ for Latest Version.");

        var matches = linkLate.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/(.+?)\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("Short names differ between This and Latest Versions.");
        }
        else err("Wrong syntax for Latest Version link.");
    }
    
    if (vPrev > -1) {
        var linkPrev = $dl.find("dt:contains('Previous Version') + dd a").first();
        if (linkPrev.attr("href") !== linkPrev.text())
            err("Link href and text differ for Previous Version.");

        var matches = linkPrev.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/\d{4}\/[A-Z]+-(.+)-\d{8}\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("Short names differ between This and Previous Versions.");
        }
        else err("Wrong syntax for Previous Version link.");
    }

    if (!dts.some(function (txt) { return (/^(Editors?|Authors?)$/.test(txt)); }))
        err("There must be at least an editor or an author.");

    done();
};
