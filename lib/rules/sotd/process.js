
exports.name = "sotd.processDocument";
exports.check = function (sr, done) {
    var processDocument = sr.config.processDocument
    ,   $sotd = sr.getSotDSection()
    ,   proc
    ,   procUri;
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }

    if (processDocument === "20051014") {
        proc = "14 October 2005";
        procUri = "http://www.w3.org/2005/10/Process-20051014/";
    }
    else if (processDocument === "20140801") {
        proc = "1 August 2014";
        procUri = "http://www.w3.org/2014/Process-20140801/";
    }
    else {
        sr.error(exports.name, "not-specified");
        return done();
    }
    var found = false
    ,   boilerplate = "This document is governed by the " + proc + " W3C Process Document.";
    $sotd.parent().find("p").each(function () {
        var $p = sr.$(this);
        if (sr.norm($p.text()) === boilerplate && $p.find("a").attr("href") === procUri) {
            found = true;
            return;
        }
    });
    if (!found) sr.error(exports.name, "not-found", { process: proc });
    done();
};
