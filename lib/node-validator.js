

var Specberus = require("./validator").Specberus
// ,   jq = require("../bower_components/jquery/jquery")
,   jq = require("./node-jquery").loadJQuery()
,   fs = require("fs")
,   gumbo = require("gumbo-parser")
,   sua = require("superagent")
;

exports.makeSpecberus = function () {
    return new Specberus({
        css:    jq
    ,   loader: {
            loadURL:    function (url, cb) {
                if (!cb) throw new Error("Missing callback to loadURL.");
                var self = this;
                sua.get(url)
                    .end(function (err, res) {
                        if (err) return cb(err);
                        self.loadSource(res.text, cb);
                    });
            }
        ,   loadSource: function (src, cb) {
                if (!cb) throw new Error("Missing callback to loadSource.");
                var tree = gumbo(src);
                if (!tree || !tree.root) return cb("Failed to parse source.");
                cb(null, tree.document);
            }
        ,   loadFile:   function (file, cb) {
                if (!cb) throw new Error("Missing callback to loadFile.");
                var self = this;
                fs.exists(file, function (err, exists) {
                    if (err) return cb(err);
                    if (!exists) return cb("File '" + file + "' not found.");
                    fs.readFile(file, { encoding: "utf8"}, function (err, src) {
                        if (err) return cb(err);
                        self.loadSource(src, cb);
                    });
                });
            }
        ,   loadDocument:   function (doc, cb) {
                if (!cb) throw new Error("Missing callback to loadDocument.");
                if (doc) return cb("No document.");
                cb(null, doc);
            }
        }
    });
};
