
// must have dl, with:
//  dts containing "This Version", "Latest Version", "Previous Version" in that order
//  this version is http://www.w3.org/TR/2013/WD-shortname-2013MMDD/
//  latest version is http://www.w3.org/TR/shortname/
//  h2 date and this version date must match
//  dt for editor or author
exports.name = "headers.dl";
exports.check = function (sr, done) {
    var $dl = sr.$("body > div.head:first-child dl").first()
    ,   prevRequired = sr.config.previousVersion
    ,   err = function (str) {
            sr.error(exports.name, str);
        }
    ;

    var dts = [];
    $dl.find("dt").each(function () {
        dts.push(sr.norm(
            sr.$(this).text()
                      .replace(":", "")
                      .replace("version", "Version")
                      .replace("published", "")
        ));
    });
    var vThis = dts.indexOf("This Version")
    ,   vLate = dts.indexOf("Latest Version")
    ,   vPrev = dts.indexOf("Previous Version")
    ;
    
    if (vThis === -1) err("this-version");
    if (vLate === -1) err("latest-version");
    if (prevRequired && vPrev === -1) err("previous-version");
    if (vThis > vLate) err("this-latest-order");
    if (vPrev > -1 && vLate > vPrev) err("latest-previous-order");

    var shortname;
    if (vThis > -1) {
        // XXX this won't scale
        //  use $dl.find("dt")[vThis].find("+ dd a")
        var linkThis = $dl.find("dt:contains('This Version') + dd a, dt:contains('This version') + dd a").first();
        if (linkThis.attr("href") !== linkThis.text()) err("this-link");

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
                   ) err("this-date");
            }
            else sr.warning(exports.name, "no-date");
        }
        else err("this-syntax");
    }

    if (vLate > -1) {
        var linkLate = $dl.find("dt:contains('Latest Version') + dd a, dt:contains('Latest version') + dd a").first();
        if (linkLate.attr("href") !== linkLate.text()) err("latest-link");

        var matches = linkLate.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/(.+?)\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("this-latest-shortname");
        }
        else err("latest-syntax");
    }
    
    if (vPrev > -1) {
        var linkPrev = $dl.find("dt:contains('Previous Version') + dd a, dt:contains('Previous version') + dd a").first();
        if (linkPrev.attr("href") !== linkPrev.text()) err("previous-link");

        var matches = linkPrev.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/\d{4}\/[A-Z]+-(.+)-\d{8}\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("this-previous-shortname");
        }
        else err("previous-syntax");
    }

    if (!dts.some(function (txt) { return (/^(Editors?|Authors?)$/.test(txt)); })) err("editor");

    done();
};
