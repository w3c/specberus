
var Specberus = require("./validator").Specberus
,   whacko = require("whacko")
,   fs = require("fs")
,   sua = require("./throttled-ua")
;

exports.makeSpecberus = function () {
    return new Specberus({
        loadURL:    function (url, cb) {
            if (!cb) throw new Error("Missing callback to loadURL.");
            var self = this;
            sua.get(url)
                .set("User-Agent", "Specberus/" + require("../package.json").version + " Node/" + process.version + " by sexy Robin")
                .end(function (err, res) {
                    if (err) return cb(err);
                    self.url = url;
                    self.loadSource(res.text, cb);
                });
        }
    ,   loadSource: function (src, cb) {
            if (!cb) throw new Error("Missing callback to loadSource.");
            this.source = src;
            cb(null, whacko.load(src));
        }
    ,   loadFile:   function (file, cb) {
            if (!cb) throw new Error("Missing callback to loadFile.");
            var self = this;
            fs.exists(file, function (exists) {
                if (!exists) return cb("File '" + file + "' not found.");
                fs.readFile(file, { encoding: "utf8"}, function (err, src) {
                    if (err) return cb(err);
                    self.loadSource(src, cb);
                });
            });
        }
    ,   loadDocument:   function (doc, cb) {
            if (!cb) throw new Error("Missing callback to loadDocument.");
            if (!doc) return cb("No document.");
            cb(null, function (selector, context) { return whacko(selector, context, doc); });
        }
    });
};
