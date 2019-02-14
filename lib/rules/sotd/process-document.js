const self = {
    name: 'sotd.process-document'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var BOILERPLATE_PREFIX = 'This document is governed by the '
    ,   BOILERPLATE_SUFFIX = ' W3C Process Document.'
    ;
    var $sotd = sr.getSotDSection()
    ,   proc = "1 March 2019"
    ,   boilerplate = BOILERPLATE_PREFIX + proc + BOILERPLATE_SUFFIX
    ,   procUri = "https://www.w3.org/2019/Process-20190301/"
    ,   deprecatedProc = "1 February 2018"
    ,   deprecatedBoilerplate = BOILERPLATE_PREFIX + deprecatedProc + BOILERPLATE_SUFFIX
    ,   deprecatedUri = 'https://www.w3.org/2018/Process-20180201/'
    ,   deprecatedAllowed
    ;

    sr.transition({
        from:         new Date('2019-03-01')
    ,   to:           new Date('2019-03-31')
    ,   doBefore:     function() { proc = deprecatedProc;
                                   procUri = deprecatedUri;
                                   deprecatedBoilerplate = BOILERPLATE_PREFIX + '1 March 2017' + BOILERPLATE_SUFFIX;
                                   deprecatedUri = 'https://www.w3.org/2017/Process-20170301/';
                                   deprecatedAllowed = false; }
    ,   doMeanwhile:  function() { deprecatedAllowed = true; }
    ,   doAfter:      function() { deprecatedAllowed = false; }
    });
    if ($sotd && $sotd.length) {
        var found = false
        ,   regex = new RegExp(BOILERPLATE_PREFIX + '.+' + BOILERPLATE_SUFFIX)
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
                if (deprecatedAllowed) {
                    sr.warning(self, 'deprecatedAllowed', { process: deprecatedUri });
                    found = true;
                }
                else sr.error(self, 'deprecated', { process: deprecatedUri });
            }
            else if (sr.norm($p.text()) !== boilerplate && regex.test($p.text())) {
                sr.error(self, "wrong-process", { process: proc });
            }
            else if (sr.norm($p.text()) === boilerplate && $p.find("a").attr("href") !== procUri) {
                sr.error(self, "wrong-link");
            }
        });
        if (!found) sr.error(self, "not-found", { process: proc });
    }
    done();
};
