const self = {
    name: 'sotd.processDocument'
};

exports.check = function (sr, done) {
    var BOILERPLATE_PREFIX = 'This document is governed by the '
    ,   BOILERPLATE_SUFFIX = ' W3C Process Document.'
    ;
    var $sotd = sr.getSotDSection()
    ,   proc = "1 September 2015"
    ,   procUri = "http://www.w3.org/2015/Process-20150901/";
    if (!$sotd || !$sotd.length) {
        sr.error(self, "no-sotd");
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
            if (found) sr.error(self, "multiple-times", { process: proc });
            else {
                found = true;
            }
        }
        else if (deprecatedBoilerplate === sr.norm($p.text()) || deprecatedUri === $p.find('a').attr('href')) {
            sr.error(self, 'deprecated');
        }
        else if (sr.norm($p.text()) !== boilerplate && regex.test($p.text())) {
            sr.error(self, "wrong-process", { process: proc });
        }
        else if (sr.norm($p.text()) === boilerplate && $p.find("a").attr("href") !== procUri) {
            sr.error(self, "wrong-link");
        }
    });
    if (!found) sr.error(self, "not-found", { process: proc });
    done();
};
