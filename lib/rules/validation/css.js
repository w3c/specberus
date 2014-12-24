/*jshint es5:true */

var sua = require("../../throttled-ua");

exports.name = "validation.css";
exports.check = function (sr, done) {
    var service = null;
    if (sr.config.cssValidator !== undefined) {
        service = sr.config.cssValidator;
    } else {
        service = "http://jigsaw.w3.org/css-validator/validator";
    }
    if (sr.config.validation === "no-validation") {
        sr.warning(this.name, "skipped");
        return done();
    }
    if (!sr.url && !sr.source) {
        sr.warning(exports.name, "no-source");
        return done();
    }
    var req
    ,   ua = "Specberus/" + sr.version + " Node/" + process.version + " by sexy Robin"
    ;
    function addPart (req, name, value) {
        req.part()
            .set("Content-Disposition", 'form-data; name="' + name + '"')
            .set("Content-Type", "text/plain")
            .write(value);
    }
    if (sr.url) {
        req = sua.get(service)
                 .set("User-Agent", ua)
                 .query({ uri: sr.url, profile: "css3", output: "json", type: "html" });
    }
    else {
        req = sua.post(service)
                 .set("User-Agent", ua)
                 ;
        addPart(req, "text", sr.source);
        addPart(req, "profile", "css3");
        addPart(req, "output", "json");
        addPart(req, "type", "html");
    }
    req
        .end(function (res) {
            var json = res.body;
            if (!json) return sr.throw("No JSON input.");
            if (!res.ok) {
                sr.error(exports.name, "failure", { status: res.status });
            }
            else if (!json) {
                sr.error(exports.name, "no-response");
            }
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
                        sr.warning(exports.name, "warning", json.cssvalidation.warnings[i]);
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
                        sr.error(exports.name, "error", json.cssvalidation.errors[i]);
                    }
                }
            }
            done();
        })
    ;
};
