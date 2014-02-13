
// the most useful source:
//  http://services.w3.org/xslt?xmlfile=http://www.w3.org/2005/07/13-pubrules-src.html&xslfile=http://www.w3.org/2005/07/13-pubrules-compare.xsl

(function (global) {
    "use strict";
    
    var Specberus = function (docLoader) {
        this.loader = docLoader;
        this.version = require("../package.json").version;
        this.clearCache();
    };
    Specberus.prototype.clearCache = function () {
        this.docDate = null;
        this.sotdSection = null;
    };
    Specberus.prototype.validate = function (options) {
        // accepted options:
        //  - url: URL for a document to load
        //  - source: source of a document to parse
        //  - file: file name of a document to load
        //  - document: the document, directly available
        //  - profile: the profile against which to validate
        //  - events: where to send the various events
        //  - skipValidation: turn on to skip CSS and HTML validation
        //  - noRecTrack: document uses a Rec-track status but isn't on Rec-track
        //  - informativeOnly: document is informative only
        if (!options.events) throw new Error("The events option is required for reporting.");
        if (!options.profile) throw new Error("Without a profile there is nothing to check.");
        this.clearCache();
        var sink = options.events
        ,   profile = options.profile
        ,   self = this
        ;
        self.config = profile.config || {};
        self.config.skipValidation = !!options.skipValidation;
        self.config.noRecTrack = !!options.noRecTrack;
        self.config.informativeOnly = !!options.informativeOnly;
        self.sink = sink;
        var seenErrors = {};
        sink.on("err", function (name) { seenErrors[name] = true; });
        var doValidation = function (err, query) {
            if (err) throw new Error(err);
            self.$ = query;
            sink.emit("start-all", profile.name);
            var total = profile.rules.length
            ,   done = 0
            ;
            profile.rules.forEach(function (rule) {
                // XXX not sure this does anything useful
                process.nextTick(function () {
                    rule.check(self, function () {
                        done++;
                        if (!seenErrors[this.name]) sink.emit("ok", this.name);
                        sink.emit("done", this.name);
                        if (done === total) sink.emit("end-all", profile.name);
                    }.bind(rule));
                });
            });
        };
        if (options.url) this.loader.loadURL(options.url, doValidation);
        else if (options.source) this.loader.loadSource(options.source, doValidation);
        else if (options.file) this.loader.loadFile(options.file, doValidation);
        else if (options.document) this.loader.loadDocument(options.document, doValidation);
        else throw new Error("At least one of url, source, file, or document must be specified.");
    };
    
    Specberus.prototype.error = function (rule, key, extra) {
        this.sink.emit("err", rule, { key: key, extra: extra });
    };
    
    Specberus.prototype.warning = function (rule, key, extra) {
        this.sink.emit("warning", rule, { key: key, extra: extra });
    };
    
    Specberus.prototype.checkSelector = function (sel, name, done) {
        if (!this.$(sel).length) this.error(name, "not-found");
        done();
    };
    
    Specberus.prototype.norm = function (str) {
        return str.replace(/^\s+/, "")
                  .replace(/\s+$/, "")
                  .replace(/\s+/g, " ");
    };
    
    var months = "January February March April May June July August September October November December".split(" ");
    Specberus.prototype.dateRegexStrCapturing = "(\\d?\\d) (" + months.join("|") + ") (\\d{4})";
    Specberus.prototype.dateRegexStrNonCapturing = "\\d?\\d (?:" + months.join("|") + ") \\d{4}";
    
    Specberus.prototype.getDocumentDate = function () {
        if (this.docDate) return this.docDate;
        var rex = new RegExp(this.dateRegexStrCapturing + "(?:, edited in place " + this.dateRegexStrNonCapturing + ")?$")
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
    
    Specberus.prototype.getSotDSection = function () {
        if (this.sotdSection) return this.sotdSection;
        var $startH2, $endH2
        ,   $ = this.$
        ,   $div = $("<div></div>")
        ,   self = this
        ;
        this.$("h2").each(function () {
            var $h2 = $(this);
            if ($startH2) {
                $endH2 = $h2;
                return false;
            }
            if (/^Status [Oo]f [Tt]his Document$/.test(self.norm($h2.text()))) $startH2 = $h2;
        });
        if (!$startH2 || !$endH2) return null;
        var started = false;
        $startH2.parent().children().each(function () {
            if ($startH2[0] === this[0]) {
                started = true;
                return;
            }
            if (!started) return;
            if ($endH2[0] === this[0]) return false;
            $div.append(this.clone());
        });
        this.sotdSection = $div.children();
        return this.sotdSection;
    };
    
    global.Specberus = Specberus;
}(exports || window));
