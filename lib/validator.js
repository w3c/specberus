
(function (global) {
    "use strict";
    
    var Specberus = function (docLoader) {
        this.loader = docLoader;
        this.version = require("../package.json").version;
        this.docDate = null;
    };
    Specberus.prototype.validate = function (options) {
        // accepted options:
        //  - url: URL for a document to load
        //  - source: source of a document to parse
        //  - file: file name of a document to load
        //  - document: the document, directly available
        //  - profile: the profile against which to validate
        //  - events: where to send the various events
        if (!options.events) throw new Error("The events option is required for reporting.");
        if (!options.profile) throw new Error("Without a profile there is nothing to check.");
        var sink = options.events
        ,   profile = options.profile
        ,   self = this
        ;
        self.config = profile.config || {};
        self.sink = sink;
        var doValidation = function (err, query) {
            if (err) throw new Error(err);
            self.$ = query;
            sink.emit("start-all", profile.name);
            var total = profile.rules.length
            ,   done = 0
            ;
            for (var i = 0, n = profile.rules.length; i < n; i++) {
                var rule = profile.rules[i];
                rule.check(self, function (name) {
                    done++;
                    sink.emit("done", name);
                    if (done === total) sink.emit("end-all", profile.name);
                });
            }
        };
        if (options.url) this.loader.loadURL(options.url, doValidation);
        else if (options.source) this.loader.loadSource(options.source, doValidation);
        else if (options.file) this.loader.loadFile(options.file, doValidation);
        else if (options.document) this.loader.loadDocument(options.document, doValidation);
        else throw new Error("At least one of url, source, file, or document must be specified.");
    };
    
    Specberus.prototype.checkSelector = function (sel, name, cb) {
        var $res = this.$(sel);
        if ($res.length) this.sink.emit("ok", name);
        else this.sink.emit("err", name);
        cb(name);
    };
    
    Specberus.prototype.norm = function (str) {
        return str.replace(/^\s+/, "")
                  .replace(/\s+$/, "")
                  .replace(/\s+/g, " ");
    };
    
    Specberus.prototype.getDocumentDate = function () {
        if (this.docDate) return this.docDate;
        var months = "January February March April May June July August September October November December".split(" ")
        ,   rex = new RegExp("(\\d?\\d) (" + months.join("|") + ") (\\d{4})$")
        ,   self = this
        ;
        this.$("body > div.head h2").each(function () {
            var matches = self.norm(self.$(this).text()).match(rex);
            if (matches) {
                self.docDate = new Date(matches[3] * 1, months.indexOf(matches[2]), matches[1] * 1);
                self.docDateEl = self.$(this);
                return false; // no need to look further
            }
        });
        return this.docDate;
    };
    
    Specberus.prototype.getDocumentDateElement = function () {
        if (this.docDateEl) return this.docDateEl;
        this.getDocumentDate();
        return this.docDateEl;
    };
    
    global.Specberus = Specberus;
}(exports || window));
