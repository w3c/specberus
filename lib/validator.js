/**
 * Main file of the Specberus npm package.
 *
 * The most useful source:
 * http://services.w3.org/xslt?xmlfile=http://www.w3.org/2005/07/13-pubrules-src.html&xslfile=http://www.w3.org/2005/07/13-pubrules-compare.xsl
 */

var whacko = require("whacko")
,   fs = require("fs")
,   sua = require("./throttled-ua")
,   version = require("../package.json").version
,   Exceptions = require("./exceptions").Exceptions
,   profileMetadata = require('./profiles/metadata')
,   util = require('./util')
;

var Specberus = function () {
    this.version = version;
    this.clearCache();
};

Specberus.prototype.clearCache = function () {
    this.docDate = null;
    this.docDateEl = null;
    this.sotdSection = null;
    this.url = null;
    this.source = null;
    this.shortname = undefined;
    this.exceptions = new Exceptions();
};

Specberus.prototype.extractMetadata = function (options) {

    this.clearCache();
    var self = this;

    if (!options.events) return console.error('[EXCEPTION] The events option is required for reporting.');
    self.sink = options.events;
    if (self.sink.listeners('exception').length === 0) {
        console.error("[WARNING] No handler for event `exception` which to report system errors.");
    }

    self.config = {};
    self.meta = {};
    var errors = [];
    var warnings = [];
    var infos = [];
    self.sink.on('err', function (data) { errors.push(data); });
    self.sink.on('warning', function (data) { warnings.push(data); });
    self.sink.on('info', function (data) { infos.push(data); });
    var doMetadataExtraction = function (err, query) {
        if (err) return self.throw(err);
        self.$ = query;
        self.sink.emit("start-all", profileMetadata);
        var total = (profileMetadata.rules || []).length
        ,   done = 0
        ;
        profileMetadata.rules.forEach(function (rule) {
            rule.check(self, function (result) {
                if (result) {
                    for (var i in result) {
                        self.meta[i] = result[i];
                    }
                }
                done++;
                self.sink.emit("done", this.name);
                if (done === total)
                    self.sink.emit("end-all", util.buildJSONresult(errors, warnings, infos, self.meta));
            }.bind(rule));
        });
    };
    if (options.url) this.loadURL(options.url, doMetadataExtraction);
    else if (options.source) this.loadSource(options.source, doMetadataExtraction);
    else if (options.file) this.loadFile(options.file, doMetadataExtraction);
    else if (options.document) this.loadDocument(options.document, doMetadataExtraction);
    else return this.throw("At least one of url, source, file, or document must be specified.");
};

Specberus.prototype.validate = function (options) {

    this.clearCache();
    var self = this;

    if (!options.events) return console.error('[EXCEPTION] The events option is required for reporting.');
    self.sink = options.events;
    if (self.sink.listeners('exception').length === 0) {
        console.error("[WARNING] No handler for event `exception` which to report system errors.");
    }

    if (!options.profile) return this.throw("Without a profile there is nothing to check.");
    var profile = options.profile;
    try {
        self.config = util.processParams(options, profile.config);
    }
    catch (err) {
        return this.throw(err.toString());
    }
    self.config.lang = 'en_GB';
    var errors = [];
    var warnings = [];
    var infos = [];
    self.sink.on('err', function (data) { errors.push(data); });
    self.sink.on('warning', function (data) { warnings.push(data); });
    self.sink.on('info', function (data) { infos.push(data); });
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
                self.sink.emit("done", this.name);
                if (done === total)
                    self.sink.emit("end-all", util.buildJSONresult(errors, warnings, infos, {}));
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
    var name;
    if('string' === typeof rule)
        name = rule;
    else
        name = rule.name;
    if ((this.shortname !== undefined)
        && (this.config.status === "WD" || this.config.status === "CR")
        && this.exceptions.has(this.shortname, name, key, extra))
        this.warning(rule, key, extra);
    else {
        if('string' === typeof rule)
            this.sink.emit('err', name, {key: key, extra: extra});
        else
            this.sink.emit('err', rule, {key: key, extra: extra});
    }
};

Specberus.prototype.warning = function (rule, key, extra) {
    this.sink.emit('warning', rule, { key: key, extra: extra });
};

Specberus.prototype.info = function (rule, key, extra) {
    this.sink.emit('info', rule, {key: key, extra: extra});
};

Specberus.prototype.metadata = function (key, value) {

    if (key === "shortname") {
        this.shortname = value;
    }
    this.sink.emit('metadata', key, value);

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
    ,   $nav = $("nav#toc")
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
        if ($endH2[0] === this || $nav[0] === this) return false;
        $div.append($(this).clone());
    });
    this.sotdSection = $div.children();
    return this.sotdSection;
};

Specberus.prototype.extractHeaders = function ($dl) {
  var $ = this.$
  ,   self = this
  ,   dts = {}
  ,   EDITORS_DRAFT = /Latest\ editor's\ draft/i;
  $dl.find("dt").each(function (idx) {
    var $dt = $(this)
    ,   txt = self.norm($dt.text())
                  .replace(":", "")
                  .toLowerCase()
                  .replace("published ", "")
    ,   $dd = $dt.next('dd')
    ,   key = null
    ;
    if (!$dd) return err("no-dd", { dt: txt });
    if (txt === "this version") key = "This";
    else if (txt.lastIndexOf("latest version", 0) === 0) key = "Latest";
    else if (/^previous version(?:s)?$/.test(txt)) key = "Previous";
    else if (/^rescinds this recommendation?$/.test(txt)) key = "Rescinds";
    if (EDITORS_DRAFT.test(txt) && $dd.find('a')) key = "Editor";
    if (key) dts[key] = { pos: idx, el: $dt, dd: $dd };
  });
  return dts;
};

Specberus.prototype.getEditorIDs = function () {
    var $ = this.$
    ,   editors = $('dd[data-editor-id]').map(function(index, element) {
        var strId = $(element).attr('data-editor-id');

        // If the ID is not a digit-only string, it gets filtered out
        if (/^\d+$/.test(strId)) return parseInt(strId, 10);
    }).get();
    // remove duplicates
    return editors.filter(function(item, pos) {
        return editors.indexOf(item) === pos;
    })
};

// That rule tries to extract all the dates from the SOTD;
// only the dates posterior to the date of the doc and inferior to one year
// later are extracted... If there is only one, there is a good chance that it's
// the deadline for feedback.
Specberus.prototype.getFeedbackDueDate = function() {
  var $sotd = this.getSotDSection()
  ,   dates = [];
  if ($sotd) {
      var txt        = this.norm($sotd.text())
      ,   rex        = new RegExp(this.dateRegexStrCapturing, 'g')
      ,   lowBound   = this.getDocumentDate()
      ,   highBound  = new Date(lowBound).setFullYear(lowBound.getFullYear() + 1)
      ,   candidates = txt.match(rex)
      ,   dates      = []
      ;

      for (var i = 0; i < candidates.length; i++) {
          var d = this.stringToDate(candidates[i]);
          if (d > lowBound && d < highBound)
              dates.push(d);
      }
  }
  return dates;
}

Specberus.prototype.getDelivererIDs = function () {
    const REGEX_DELIVERER_URL = /^((https?:)?\/\/)?(www\.)?w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/i
    ,   REGEX_DELIVERER_TEXT = /^public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?$/i
    ,   REGEX_DELIVERER_ID = /pp-impl\/(\d+)\/status/i
    ;

    var ids = []
    ,   $    = this.$
    ,   self = this
    ,   $sotd = self.getSotDSection();

    if ($sotd && $sotd.find('a[href]')) {

        $sotd.find('a[href]').each(function() {

            var item = $(this)
            ,   href = item.attr('href')
            ,   text = self.norm(item.text())
            ,   found = {}
            ;

            if (REGEX_DELIVERER_URL.test(href) && REGEX_DELIVERER_TEXT.test(text)) {
                var id = REGEX_DELIVERER_ID.exec(href);
                if (id && id.length > 1 && !found[id[1]]) {
                    found[id] = true;
                    ids.push(parseInt(id[1], 10));
                }
            }
        });
    }

    return ids;
}

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

if (!process || !process.env || !process.env.API_KEY || process.env.API_KEY.length < 1) {
    throw new Error('Specberus is missing a valid key for the W3C API; define environment variable “API_KEY”');
    exports = undefined;
}
else
    exports.Specberus = Specberus;
