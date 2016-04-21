/*jshint es5:true */

var sua = require("../../throttled-ua");

exports.name = "validation.html";
exports.check = function (sr, done) {
    var service = null;
    if (sr.config.htmlValidator !== undefined) {
        service = sr.config.htmlValidator;
    } else {
        service = "https://validator.w3.org/nu/";
    }
    if (sr.config.skipValidation) {
        sr.warning(this.name, "skipped");
        return done();
    }
    if (!sr.url && !sr.source) {
        sr.warning(this.name, "no-source");
        return done();
    }
    var req
    ,   ua = "Specberus/" + sr.version + " Node/" + process.version + " by sexy Robin"
    ;
    if (sr.url) {
        req = sua.get(service)
             .set("User-Agent", ua);
        req.query({ doc: sr.url, out: "json" });
    }
    else {
        req = sua.post(service)
                 .set("User-Agent", ua)
                 .set('Content-Type', 'text/html')
                 .send(sr.source)
                 .query({ out: 'json'});
    }
    req.end(function (err, res) {
        if (err) {
            sr.error(exports.name, "no-response");
        } else if (!res.ok) {
            sr.error(exports.name, "failure", { status: res.status });
        } else {
            var json = res.body;
            if (!json) return sr.throw("No JSON input.");
            else {
                if (json.messages && json.messages.length) {
                    for (var i = 0, n = json.messages.length; i < n; i++) {
                        var msg = json.messages[i];
                        // {
                        //     "type": "error",
                        //     "lastLine": 26,
                        //     "lastColumn": 14,
                        //     "firstColumn": 7,
                        //     "message": "blah",
                        //     "extract": "er>\n <hgroup>\n ",
                        //     "hiliteStart": 10,
                        //     "hiliteLength": 8
                        // }
                        if (msg.type === "error") {
                            sr.error(exports.name, "error", {
                                line:       msg.lastLine
                            ,   column:     msg.lastColumn
                            ,   message:    msg.message
                            });
                        }
                        // {
                        //     "type": "info",
                        //     "url": "http://www.google.com/",
                        //     "subType": "warning",
                        //     "message": "blah"
                        // }
                        else if (msg.type === "info") {
                            if (msg.subtype === "warning") {
                                sr.warning(exports.name, "warning", { message: msg.message });
                            }
                        }
                        // {
                        //     "type":"non-document-error",
                        //     "subType":"io",
                        //     "message":"HTTP resource not retrievable. The HTTP status from the remote server was: 404."
                        // }
                        else if (msg.type === "non-document-error") {
                            sr.error(exports.name, "non-document-error", {
                                subType: msg.subType
                            ,   message: msg.message
                            });
                        }
                    }
                }
            }
        }
        done();
    });
};
