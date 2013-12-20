
var sua = require("superagent")
;

exports.check = function ($, sink, sr, cb) {
    var name = "validation.html"
    ,   service = "http://validator.w3.org/nu/"
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
        req = sua.post(service)
                 .set("Content-Type", "text/html")
                 .send(loader.source);
    }
    req
        .query({ out: "json" })
        .set("User-Agent", "Specberus/" + sr.version + " Node/" + process.version + " by sexy Robin")
        .end(function (res) {
            var json = res.body;
            if (!res.ok) {
                sink.emit("err", name, {
                                        type:       "non-document-error"
                                    ,   subtype:    "error-response"
                                    ,   message:    "Failure code from validator: " + res.status });
            }
            else if (!json) {
                sink.emit("err", name, {
                                        type:       "non-document-error"
                                    ,   subtype:    "no-response"
                                    ,   message:    "No response." });
            }
            else {
                if (!json.messages || !json.messages.length) {
                    sink.emit("ok", name);
                }
                else {
                    var seenError = false;
                    for (var i = 0, n = json.messages.length; i < n; i++) {
                        var msg = json.messages[i];
                        if (msg.type === "err") {
                            seenError = true;
                            sink.emit("err", name, msg);
                        }
                        else if (msg.type === "info") {
                            if (msg.subtype === "warning") {
                                sink.emit("warning", name, msg);
                            }
                        }
                        else if (msg.type === "non-document-error") {
                            seenError = true;
                            sink.emit("err", name, msg);
                        }
                    }
                    if (!seenError) sink.emit("ok", name);
                }
            }
            cb(name);
        })
    ;
};
