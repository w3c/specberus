
// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is http://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is http://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author

exports.check = function (sr, cb) {
    var name = "headers.dl"
    ,   $dl = sr.$("body > div.head:first-child dl").first()
    ,   sink = sr.sink
    ,   seenErrors = false
    ,   err = function (name, str) {
            sink.emit("err", name, { message: str });
            seenErrors = true;
        }
    ;
    

    var dts = [];
    $dl.find("dt").each(function () { dts.push($(this).text()); });
    var vThis = dts.indexOf("This Version")
    ,   vLate = dts.indexOf("Latest Version")
    ,   vPrev = dts.indexOf("Previous Version")
    ;
    
    // XXX use error names instead of messages, we don't need details for these errors
    // XXX Previous version is optional, e.g. for FPWD. It should only be checked when meaningful
    if (vThis === -1) err(name, "This Version is missing.");
    if (vLate === -1) err(name, "Latest Version is missing.");
    if (vPrev === -1) err(name, "Previous Version is missing.");
    if (vThis > vLate) err(name, "This Version must be before Latest Version.");
    if (vLate > vPrev) err(name, "Latest Version must be before Previous Version.");

    var linkThis = $dl.find("dt:contains('This Version') + dd a").first();
    if (linkThis.attr("href") !== linkThis.text())
        err(name, "Link href and text differ for This Version.");
    
    var matches = linkThis.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/(2013)\/[A-Z]+-(.+)-(\d{4})(\d\d)(\d\d)\/?$/)
    ,   shortname
    ,   docDate = sr.getDocumentDate()
    ;
    if (matches) {
        var year = matches[1]
        ,   year2 = matches[3]
        ,   month = matches[3]
        ,   day = matches[3]
        ;
        shortname = matches[2];
        if (docDate) {
            if (year !== docDate.getFullYear() ||
                year2 !== docDate.getFullYear() ||
                month - 1 !== docDate.getMonth() ||
                day * 1 !== docDate.getDate()
               ) err(name, "Mismatch between document date and This Version link.");
        }
        else sink.emit("warning", name, { message: "Cannot find document date." });
    }
    else err(name, "Wrong syntax for This Version link.");

    var linkLate = $dl.find("dt:contains('Latest Version') + dd a").first();
    if (linkLate.attr("href") !== linkLate.text())
        err(name, "Link href and text differ for Latest Version.");
    
    var matches = linkLate.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/(.+?)\/?$/);
    if (matches) {
        var sn = matches[1];
        if (sn !== shortname) err(name, "Short names differ between This and Latest Versions.");
    }
    else err(name, "Wrong syntax for Latest Version link.");
    
    // XXX we can do the same checks for Previous Version, but not here


    if (!dts.some(function (txt) { return (/^(Editors?|Authors?)$/.test(txt)); })) {
        err(name, "There must be at least an editor or an author.");
    }

    if (!seenErrors) sink.emit("ok", name);
    cb();
};
