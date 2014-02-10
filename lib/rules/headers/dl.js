
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
        // XXX one of the horrible hacks that can be removed when whacko supports .next properly
    ,   getDD = function ($dl, idx) {
            var pastDT = false
            ,   dtIdx = -1
            ,   $dd = null
            ;
            $dl.children().each(function () {
                var $el = sr.$(this);
                if (pastDT && $el.is("dd")) {
                    $dd = $el;
                    return false;
                }
                if (!pastDT && $el.is("dt")) {
                    dtIdx++;
                    if (dtIdx === idx) pastDT = true;
                }
            });
            return $dd;
        }
    ,   dts = {}
    ,   seenEditors = false
    ;

    $dl.find("dt").each(function (idx) {
        var $dt = sr.$(this)
        ,   txt = sr.norm($dt.text())
                      .replace(":", "")
                      .toLowerCase()
                      .replace("published ", "")
        ,   $dd = getDD($dl, idx)
        ,   key = null
        ;
        if (/^(editor|author)s?/.test(txt)) seenEditors = true;
        if (txt === "this version") key = "This";
        else if (txt === "latest version") key = "Latest";
        else if (/^previous version(?:s)?$/.test(txt)) key = "Previous";
        if (key) dts[key] = { pos: idx, el: $dt, dd: $dd };
    });


    if (!dts.This) err("this-version");
    if (!dts.Latest) err("latest-version");
    if (prevRequired && !dts.Previous) err("previous-version");
    if (dts.This && dts.Latest && dts.This.pos > dts.Latest.pos) err("this-latest-order");
    if (dts.Latest && dts.Previous && dts.Latest.pos > dts.Previous.pos) err("latest-previous-order");

    var shortname;
    if (dts.This) {
        var $linkThis = dts.This.dd.find("a").first();
        if ($linkThis.attr("href") !== $linkThis.text()) err("this-link");

        var vThisRex = "^https?:\\/\\/www\\.w3\\.org\\/TR\\/(\\d{4})\\/" +
                       (sr.config.status || "[A-Z]+") +
                       "-(.+)-(\\d{4})(\\d\\d)(\\d\\d)\\/?$";
        var matches = $linkThis.attr("href").match(new RegExp(vThisRex))
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

    if (dts.Latest) {
        var $linkLate = dts.Latest.dd.find("a").first();
        if ($linkLate.attr("href") !== $linkLate.text()) err("latest-link");

        var matches = $linkLate.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/(.+?)\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("this-latest-shortname");
        }
        else err("latest-syntax");
    }
    
    if (dts.Previous) {
        var $linkPrev = dts.Previous.dd.find("a").first();
        if ($linkPrev.attr("href") !== $linkPrev.text()) err("previous-link");

        var matches = $linkPrev.attr("href").match(/^https?:\/\/www\.w3\.org\/TR\/\d{4}\/[A-Z]+-(.+)-\d{8}\/?$/);
        if (matches) {
            var sn = matches[1];
            if (sn !== shortname) err("this-previous-shortname");
        }
        else err("previous-syntax");
    }

    if (!seenEditors) err("editor");
    done();
};
