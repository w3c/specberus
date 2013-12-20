
var sua = require("superagent")
;

exports.check = function ($, sink, sr, cb) {
    var name = "validation.css"
    ,   service = "http://jigsaw.w3.org/css-validator/validator"
    ,   loader = sr.loader
    ;
    if (!loader.url && !loader.source) {
        sink.emit("warning", name + ".no-source");
        return cb(name);
    }
    var req;
    if (loader.url) {
        req = sua.get(service)
                 .query({ doc: loader.url });
    }
    else {
        // maybe this has to stay get
        // req = sua.post(service)
        //          .type("form")
        //          .send({ text: loader.source });
        req = sua.get(service)
                 .query({ text: loader.source });
    }
    req
        .query({ profile: "css3", output: "json", type: "html" })
        .set("User-Agent", "Specberus/" + sr.version + " Node/" + process.version + " by sexy Robin")
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
                if (cssRes.warningcount) sink.emit("warning", name, cssRes.warningcount);
                if (cssRes.errorcount) sink.emit("err", name, cssRes.errorcount);
                else sink.emit("ok", name);
            }
            cb(name);
        })
    ;
};
