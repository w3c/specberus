
var sua = require("../../throttled-ua")
;

exports.check = function (sr, cb) {
    var name = "validation.css"
    ,   service = "http://jigsaw.w3.org/css-validator/validator"
    ,   loader = sr.loader
    ,   sink = sr.sink
    ;
    if (!loader.url && !loader.source) {
        sink.emit("warning", name + ".no-source");
        return cb(name);
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
    if (loader.url) {
        req = sua.get(service)
                 .set("User-Agent", ua)
                 .query({ doc: loader.url, profile: "css3", output: "json", type: "html" });
    }
    else {
        req = sua.post(service)
                 .set("User-Agent", ua)
                 ;
        addPart(req, "text", loader.source);
        addPart(req, "profile", "css3");
        addPart(req, "output", "json");
        addPart(req, "type", "html");
    }
    req
        .end(function (res) {
            var json = res.body;
            if (!res.ok) {
                sink.emit("err", name, { message: "Failure code from validator: " + res.status });
            }
            else if (!json) {
                sink.emit("err", name, { message: "No response." });
            }
            else {
                var cssRes = json.cssvalidation.result;
                // XXX the below needs to be changed to use the new JSON details
                if (cssRes.warningcount) sink.emit("warning", name, cssRes.warningcount);
                if (cssRes.errorcount) sink.emit("err", name, cssRes.errorcount);
                else sink.emit("ok", name);
            }
            cb(name);
        })
    ;
};
