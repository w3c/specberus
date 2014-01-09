
var sua = require("../../throttled-ua");

exports.name = "validation.html";
exports.check = function (sr, done) {
    var service = "http://validator.w3.org/nu/"
    ,   loader = sr.loader
    ,   sink = sr.sink
    ,   self = this
    ;
    if (!loader.url && !loader.source) {
        sink.emit("warning", this.name + ".no-source");
        return done();
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
                sink.emit("err", self.name, {
                                        type:       "non-document-error"
                                    ,   subtype:    "error-response"
                                    ,   message:    "Failure code from validator: " + res.status });
            }
            else if (!json) {
                sink.emit("err", self.name, {
                                        type:       "non-document-error"
                                    ,   subtype:    "no-response"
                                    ,   message:    "No response." });
            }
            else {
                if (json.messages && json.messages.length) {
                    for (var i = 0, n = json.messages.length; i < n; i++) {
                        var msg = json.messages[i];
                        if (msg.type === "error") {
                            sink.emit("err", self.name, msg);
                        }
                        else if (msg.type === "info") {
                            if (msg.subtype === "warning") {
                                sink.emit("warning", self.name, msg);
                            }
                        }
                        else if (msg.type === "non-document-error") {
                            sink.emit("err", self.name, msg);
                        }
                    }
                }
            }
            done();
        })
    ;
};
