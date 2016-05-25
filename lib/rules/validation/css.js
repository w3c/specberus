var sua = require("../../throttled-ua");

const self = {
    name: 'validation.css'
,   section: 'document-body'
,   rule: 'cssValideTest'
};

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
    ,   ua = "Specberus/" + sr.version + " Node/" + process.version + " by sexy Robin"
    ;
    if (sr.url) {
        req = sua.get(service)
                 .set("User-Agent", ua);
        req.query({ uri: sr.url, profile: "css3", output: "json", type: "html" });
    }
    else {
        req = sua.post(service);
        req.set("User-Agent", ua)
           .field('text', sr.source)
           .field('profile', "css3")
           .field('output', "json")
           .field('type', "html");
    }
    req.end(function (err, res) {
        if (err) {
            sr.error(self, "no-response");
        } else if (!res.ok) {
            sr.error(self, "failure", { status: res.status });
        } else {
            var json = res.body;
            if (!json) return sr.throw("No JSON input.");
            else {
                // {
                //     "source":    URL,
                //     "line":      line number,
                //     "message":   human message,
                //     "type":      internal type,
                //     "level":     how important
                // }
                if (json.cssvalidation && json.cssvalidation.warnings) {
                    for (var i = 0, n = json.cssvalidation.warnings.length; i < n; i++) {
                        sr.warning(self, "warning", json.cssvalidation.warnings[i]);
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
                    for (var i = 0, n = json.cssvalidation.errors.length; i < n; i++) {
                        sr.error(self, "error", json.cssvalidation.errors[i]);
                    }
                }
            }
        }
        done();
    });
};
