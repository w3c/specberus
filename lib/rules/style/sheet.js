const name = 'style.sheet'
,   section = 'metadata'
,   missing = {
        name: name
    ,   section: section
    ,   rule: 'goodStylesheet'
    }
,   notLast = {
        name: name
    ,   section: section
    ,   rule: 'lastStylesheet'
    }
;

exports.check = function (sr, done) {
    if (!sr.config.styleSheet) return done();
    var url = "//www.w3.org/StyleSheets/TR/2016/" + sr.config.styleSheet
    ,   sels = [
                "head > link[rel=stylesheet][href='" + url + "']"
            ,   "head > link[rel=stylesheet][href='http:" + url + "']"
            ,   "head > link[rel=stylesheet][href='https:" + url + "']"
            ,   "head > link[rel=stylesheet][href='" + url + ".css']"
            ,   "head > link[rel=stylesheet][href='http:" + url + ".css']"
            ,   "head > link[rel=stylesheet][href='https:" + url + ".css']"
        ]
    ,   $lnk = sr.$(sels.join(", "))
    ;
    if (!$lnk.length) sr.error(missing, "not-found");
    else if ($lnk.nextAll("link[rel=stylesheet], style").length) {
        sr.error(notLast, "last");
    }
    done();
};
