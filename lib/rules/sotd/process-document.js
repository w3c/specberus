const self = {
    name: 'sotd.process-document'
};

exports.name = self.name;

exports.check = function (sr, done) {
    var BOILERPLATE_PREFIX = 'This document is governed by the '
    ,   BOILERPLATE_SUFFIX = ' W3C Process Document.'
    ;
    var sotd = sr.getSotDSection()
    ,   proc = "15 September 2020"
    ,   boilerplate = BOILERPLATE_PREFIX + proc + BOILERPLATE_SUFFIX
    ,   procUri = "https://www.w3.org/2020/Process-20200915/"
    ,   deprecatedProc = "1 March 2019"
    ,   deprecatedBoilerplate = BOILERPLATE_PREFIX + deprecatedProc + BOILERPLATE_SUFFIX
    ,   deprecatedUri = 'https://www.w3.org/2019/Process-20190301/'
    ,   deprecatedAllowed
    ;

    sr.transition({
        from:         new Date('2020-09-14')
    ,   to:           new Date('2020-09-14')
    ,   doBefore:     function() { proc = deprecatedProc;
                                   procUri = deprecatedUri;
                                   boilerplate = BOILERPLATE_PREFIX + proc + BOILERPLATE_SUFFIX;
                                   deprecatedBoilerplate = BOILERPLATE_PREFIX + '1 February 2018' + BOILERPLATE_SUFFIX;
                                   deprecatedUri = 'https://www.w3.org/2018/Process-20180201/';
                                   deprecatedAllowed = false; }
    ,   doMeanwhile:  function() { deprecatedAllowed = true; }
    ,   doAfter:      function() { deprecatedAllowed = false; }
    });
    if (sotd) {
        var found = false
        ,   regex = new RegExp(BOILERPLATE_PREFIX + '.+' + BOILERPLATE_SUFFIX)
        ;
        sotd.querySelectorAll("p").forEach(function (p) {
            if (sr.norm(p.textContent) === boilerplate && p.querySelector("a") && p.querySelector("a").getAttribute("href") === procUri) {
                if (found) sr.error(self, "multiple-times", { process: proc });
                else {
                    found = true;
                }
            }
            else if (deprecatedBoilerplate === sr.norm(p.textContent) || deprecatedUri === p.querySelector('a') && p.querySelector('a').getAttribute('href')) {
                if (deprecatedAllowed) {
                    sr.warning(self, 'deprecatedAllowed', { process: deprecatedUri });
                    found = true;
                }
                else sr.error(self, 'deprecated', { process: deprecatedUri });
            }
            else if (sr.norm(p.textContent) !== boilerplate && regex.test(p.textContent)) {
                sr.error(self, "wrong-process", { process: proc });
            }
            else if (sr.norm(p.textContent) === boilerplate && p.querySelector("a") && p.querySelector("a").getAttribute("href") !== procUri) {
                sr.error(self, "wrong-link");
            }
        });
        if (!found) sr.error(self, "not-found", { process: proc });
    }
    done();
};
