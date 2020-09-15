var sua = require("../../throttled-ua");

const self = {
    name: 'validation.css'
,   section: 'document-body'
,   rule: 'cssValide'
}
,   TIMEOUT = 10000;

exports.name = self.name;

exports.check = function (sr, done) {
    var service = null;
    if (sr.config.cssValidator !== undefined) {
        service = sr.config.cssValidator;
    } else {
        service = "http://jigsaw.w3.org/css-validator/validator";
    }
    if (sr.config.validation === "no-validation") {
        sr.warning(self, "skipped");
        return done();
    }
    if (!sr.url && !sr.source) {
        sr.warning(self, "no-source");
        return done();
    }
    var req
    ,   ua = "W3C-Pubrules/" + sr.version
    ;
    if (sr.url) {
        req = sua.get(service)
                 .set("User-Agent", ua);
        req.query({ uri: sr.url, profile: "css3svg", output: "json", type: "html" });
    }
    else {
        req = sua.post(service);
        req.set("User-Agent", ua)
           .field('text', sr.source)
           .field('profile', "css3svg")
           .field('output', "json")
           .field('type', "html");
    }
    req.timeout(TIMEOUT);
    req.end(function (err, res) {
        if (err) {
            if (err.timeout === TIMEOUT) {
                sr.warning(self, "timeout");
            } else {
                sr.error(self, "no-response");
            }
        } else if (!res.ok) {
            sr.error(self, "failure", { status: res.status });
        } else {
            var json = res.body;
            if (!json) return sr.throw("No JSON input.");
            else {
                var i
                ,   n
                ;
                // {
                //     "source":    URL,
                //     "line":      line number,
                //     "message":   human message,
                //     "type":      internal type,
                //     "level":     how important
                // }
                if (json.cssvalidation && json.cssvalidation.warnings) {
                    for (i = 0, n = json.cssvalidation.warnings.length; i < n; i++) {
                        let warn = json.cssvalidation.warnings[i];
                        sr.warning(self, "warning", {
                            source:     warn.source
                        ,   line:       warn.line
                        ,   level:      warn.level
                        ,   type:       warn.type
                        ,   message:    warn.message
                        ,   link:       service + '?uri=' + sr.url
                        });
                    }
                }
                // {
                //     "source":    URL,
                //     "line":      line number,
                //     "context":   selector,
                //     "type":      internal type,
                //     "message":   human message
                // }
                if (json.cssvalidation && json.cssvalidation.errors) {
                    for (i = 0, n = json.cssvalidation.errors.length; i < n; i++) {
                        let err = json.cssvalidation.errors[i];
                        // ignore all errors in TR CSS as the validator doesn't support CSS variables yet
                        if (err.source !== "https://www.w3.org/StyleSheets/TR/2016/base.css") {
                            sr.error(self, "error", {
                                source:     err.source
                            ,   line:       err.line
                            ,   context:    err.context
                            ,   type:       err.type
                            ,   message:    err.message
                            ,   link:       service + '?uri=' + sr.url
                            });
                        }
                    }
                }
            }
        }
        done();
    });
};
