
exports.name = "sotd.processDocument";
exports.check = function (sr, done) {
    var BOILERPLATE_PREFIX = 'This document is governed by the '
    ,   BOILERPLATE_SUFFIX = ' W3C Process Document.'
    ;
    var processDocument = sr.config.processDocument
    ,   $sotd = sr.getSotDSection()
    ,   proc
    ,   procUri;
    if (!$sotd || !$sotd.length) {
        sr.error(exports.name, "no-sotd");
        return done();
    }

    if ('2015' === processDocument) {
        proc = '1 September 2015';
        procUri = 'http://www.w3.org/2015/Process-20150901/';
    }
    else if (processDocument === "2005") {
        proc = "14 October 2005";
        procUri = "http://www.w3.org/2005/10/Process-20051014/";
    }
    else {
        sr.error(exports.name, "not-specified");
        return done();
    }
    var found = false
    ,   boilerplate = BOILERPLATE_PREFIX + proc + BOILERPLATE_SUFFIX
    ,   regex = new RegExp(BOILERPLATE_PREFIX + '.+' + BOILERPLATE_SUFFIX)
    ,   deprecatedBoilerplate = BOILERPLATE_PREFIX + '1 August 2014' + BOILERPLATE_SUFFIX
    ,   deprecatedUri = 'http://www.w3.org/2014/Process-20140801/'
    ;
    $sotd.parent().find("p").each(function () {
        var $p = sr.$(this);
        if (sr.norm($p.text()) === boilerplate && $p.find("a").attr("href") === procUri) {
            if (found) sr.error(exports.name, "multiple-times", { process: proc });
            else {
                sr.metadata('process', procUri);
                found = true;
            }
        }
        else if (deprecatedBoilerplate === sr.norm($p.text()) || deprecatedUri === $p.find('a').attr('href')) {
            sr.error(exports.name, 'deprecated');
        }
        else if (sr.norm($p.text()) !== boilerplate && regex.test($p.text())) {
            sr.error(exports.name, "wrong-process", { process: proc });
        }
        else if (sr.norm($p.text()) === boilerplate && $p.find("a").attr("href") !== procUri) {
            sr.error(exports.name, "wrong-link");
        }
    });
    if (!found) sr.error(exports.name, "not-found", { process: proc });
    done();
};
