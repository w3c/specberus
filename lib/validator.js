/*jshint es5:true */

// the most useful source:
//  http://services.w3.org/xslt?xmlfile=http://www.w3.org/2005/07/13-pubrules-src.html&xslfile=http://www.w3.org/2005/07/13-pubrules-compare.xsl

// Pseudo-constants:
var DELIVERER_IDS_KEY = 'delivererIDs';

var whacko = require("whacko")
,   fs = require("fs")
,   sua = require("./throttled-ua")
,   version = require("../package.json").version
;

var Specberus = function () {
    this.version = version;
    this.clearCache();
};

Specberus.prototype.clearCache = function () {
    this.docDate = null;
    this.sotdSection = null;
    this.url = null;
    this.source = null;
    this.delivererIDs = [];
};

Specberus.prototype.validate = function (options) {
    // accepted options:
    //  - url: URL for a document to load
    //  - source: source of a document to parse
    //  - file: file name of a document to load
    //  - document: the document, directly available
    //  - profile: the profile against which to validate
    //  - events: where to send the various events
    //  - validation: whether to skip CSS and HTML validation
    //  - noRecTrack: document uses a Rec-track status but isn't on Rec-track
    //  - informativeOnly: document is informative only
    //  - echidnaReady: document is intended for automatic publication
    //  - patentPolicy: Working Group Patent Policy
    //  - processDocument: process document to be used

    this.clearCache();
    var self = this;

    if (!options.events) return console.error('[EXCEPTION] The events option is required for reporting.');
    self.sink = options.events;
    if (self.sink.listeners('exception').length === 0) {
        console.error("[WARNING] No handler for event `exception` which to report system errors.");
    }

    if (!options.profile) return this.throw("Without a profile there is nothing to check.");
    var profile = options.profile;
    self.config = profile.config || {};
    self.config.validation = options.validation;
    self.config.htmlValidator = options.htmlValidator;
    self.config.cssValidator = options.cssValidator;
    self.config.noRecTrack = ('true' === options.noRecTrack);
    self.config.informativeOnly = ('true' === options.informativeOnly);
    self.config.echidnaReady = ('true' === options.echidnaReady);
    self.config.patentPolicy = options.patentPolicy;
    self.config.processDocument = options.processDocument;
    self.config.lang = 'en_GB';
    var seenErrors = {};
    self.sink.on("err", function (name) { seenErrors[name] = true; });
    var doValidation = function (err, query) {
        if (err) return self.throw(err);
        self.$ = query;
        self.sink.emit("start-all", profile.name);
        var total = (profile.rules || []).length
        ,   done = 0
        ;
        profile.rules.forEach(function (rule) {
            // XXX
            //  I would like to catch all exceptions here, but this derails the testing
            //  infrastructure which also uses exceptions that it expects aren't caught
            rule.check(self, function () {
                done++;
                if (!seenErrors[this.name]) self.sink.emit("ok", this.name);
                self.sink.emit('metadata', DELIVERER_IDS_KEY, self.delivererIDs);
                self.sink.emit("done", this.name);
                if (done === total) self.sink.emit("end-all", profile.name);
            }.bind(rule));
        });
    };
    if (options.url) this.loadURL(options.url, doValidation);
    else if (options.source) this.loadSource(options.source, doValidation);
    else if (options.file) this.loadFile(options.file, doValidation);
    else if (options.document) this.loadDocument(options.document, doValidation);
    else return this.throw("At least one of url, source, file, or document must be specified.");
};

Specberus.prototype.error = function (rule, key, extra) {
    this.sink.emit("err", rule, { key: key, extra: extra });
};

Specberus.prototype.warning = function (rule, key, extra) {
    this.sink.emit("warning", rule, { key: key, extra: extra });
};

Specberus.prototype.info = function (rule, key, extra) {
    this.sink.emit('info', rule, {key: key, extra: extra});
};

Specberus.prototype.metadata = function (key, value) {

    if (key === DELIVERER_IDS_KEY) {
        this.delivererIDs.push (value);
    } else {
        this.sink.emit('metadata', key, value);
    }

};

Specberus.prototype.throw = function (msg) {
    console.error('[EXCEPTION] ' + msg);
    this.sink.emit('exception', { message: msg });
};

Specberus.prototype.checkSelector = function (sel, name, done) {
    try {
        if (!this.$(sel).length) this.error(name, "not-found");
    }
    catch (e) {
        this.throw("Selector '" + sel + "' caused the validator to blow up.");
    }
    done();
};

Specberus.prototype.norm = function (str) {
    if (!str) return "";
    str = "" + str;
    return str.replace(/^\s+/, "")
              .replace(/\s+$/, "")
              .replace(/\s+/g, " ");
};

var months = "January February March April May June July August September October November December".split(" ");
Specberus.prototype.dateRegexStrCapturing = "(\\d?\\d) (" + months.join("|") + ") (\\d{4})";
Specberus.prototype.dateRegexStrNonCapturing = "\\d?\\d (?:" + months.join("|") + ") \\d{4}";

Specberus.prototype.stringToDate = function (str) {
    var rex = new RegExp(this.dateRegexStrCapturing)
    ,   matches = str.match(rex);
    if (matches) {
        try {
            return new Date(matches[3] * 1, months.indexOf(matches[2]), matches[1] * 1);
        }
        catch (e) {
            self.throw("Creating Date() '" + matches[3] * 1 + ", " +
                                             months.indexOf(matches[2]) + ", " +
                                             matches[1] * 1 + "' caused the validator to blow up.");
        }
    }
};

Specberus.prototype.getDocumentDate = function () {
    if (this.docDate) return this.docDate;
    var rex = new RegExp(this.dateRegexStrCapturing + "(?:, edited in place " + this.dateRegexStrNonCapturing + ")?$")
    ,   self = this
    ;
    this.$("body div.head h2").each(function () {
        var matches = self.norm(self.$(this).text()).match(rex);
        if (matches) {
            self.docDate = self.stringToDate(matches[1] + " " + matches[2] + " " + matches[3]);
            self.metadata('docDate', self.docDate);
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
    $("h2").each(function () {
        var $h2 = $(this);
        if ($startH2) {
            $endH2 = $h2;
            return false;
        }
        if (/^Status [Oo]f [Tt]his [Dd]ocument$/.test(self.norm($h2.text()))) $startH2 = $h2;
    });
    if (!$startH2 || !$endH2) return null;
    var started = false;
    $startH2.parent().children().each(function () {
        if ($startH2[0] === this) {
            started = true;
            return;
        }
        if (!started) return;
        if ($endH2[0] === this) return false;
        $div.append($(this).clone());
    });
    this.sotdSection = $div.children();
    return this.sotdSection;
};

Specberus.prototype.loadURL = function (url, cb) {
    if (!cb) return this.throw("Missing callback to loadURL.");
    var self = this;
    sua.get(url)
        .set("User-Agent", "Specberus/" + version + " Node/" + process.version + " by sexy Robin")
        .end(function (err, res) {
            if (err) return self.throw(err.message);
            if (!res.text) return self.throw("Body of " + url + " is empty.");
            self.url = url;
            self.loadSource(res.text, cb);
        });
};

Specberus.prototype.loadSource = function (src, cb) {
    if (!cb) return this.throw("Missing callback to loadSource.");
    this.source = src;
    var $;
    try {
        $ = whacko.load(src);
    }
    catch (e) {
        this.throw("Whacko failed to parse source: " + e);
    }
    cb(null, $);
};

Specberus.prototype.loadFile = function (file, cb) {
    if (!cb) return this.throw("Missing callback to loadFile.");
    var self = this;
    fs.exists(file, function (exists) {
        if (!exists) return cb("File '" + file + "' not found.");
        fs.readFile(file, { encoding: "utf8" }, function (err, src) {
            if (err) return cb(err);
            self.loadSource(src, cb);
        });
    });
};

Specberus.prototype.loadDocument = function (doc, cb) {
    if (!cb) return this.throw("Missing callback to loadDocument.");
    if (!doc) return cb("No document.");
    cb(null, function (selector, context) { return whacko(selector, context, doc); });
};

Specberus.prototype.transition = function (options) {
    if (this.getDocumentDate() < options.from) options.doBefore();
    else if (this.getDocumentDate() > options.to) options.doAfter();
    else options.doMeanwhile();
}

exports.Specberus = Specberus;

