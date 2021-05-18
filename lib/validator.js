/**
 * Main file of the Specberus npm package.
 *
 * The most useful source:
 * http://services.w3.org/xslt?xmlfile=http://www.w3.org/2005/07/13-pubrules-src.html&xslfile=http://www.w3.org/2005/07/13-pubrules-compare.xsl
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const sua = require('./throttled-ua');
const { version } = require('../package.json');
const { Exceptions } = require('./exceptions');
const profileMetadata = require('./profiles/metadata');
const util = require('./util');
const l10n = require('./l10n');

l10n.setLanguage('en_GB');

const Specberus = function () {
    this.version = version;
    this.clearCache();
};

Specberus.prototype.clearCache = function () {
    this.docDate = null;
    this.docDateEl = null;
    this.sotdSection = undefined;
    this.url = null;
    this.source = null;
    this.shortname = undefined;
    this.delivererIDs = undefined;
    this.exceptions = new Exceptions();
};

Specberus.prototype.extractMetadata = function (options) {
    this.clearCache();
    const self = this;

    if (!options.events)
        throw new Error(
            '[EXCEPTION] The events option is required for reporting.'
        );
    self.sink = options.events;
    if (self.sink.listeners('exception').length === 0)
        throw new Error(
            '[WARNING] No handler for event `exception` which to report system errors.'
        );

    self.config = {};
    self.meta = {};
    const errors = [];
    const warnings = [];
    const infos = [];
    self.sink.on('err', (data) => {
        errors.push(data);
    });
    self.sink.on('warning', (data) => {
        warnings.push(data);
    });
    self.sink.on('info', (data) => {
        infos.push(data);
    });
    const doMetadataExtraction = function (err, jsDocument) {
        if (err) return self.throw(err);
        self.jsDocument = jsDocument;
        self.sink.emit('start-all', profileMetadata);
        const total = (profileMetadata.rules || []).length;
        let done = 0;
        profileMetadata.rules.forEach((rule) => {
            try {
                rule.check(
                    self,
                    function (result) {
                        if (result) {
                            for (const i in result) {
                                self.meta[i] = result[i];
                            }
                        }
                        done++;
                        self.sink.emit('done', this.name);
                        if (done === total)
                            self.sink.emit(
                                'end-all',
                                util.buildJSONresult(
                                    errors,
                                    warnings,
                                    infos,
                                    self.meta
                                )
                            );
                    }.bind(rule)
                );
            } catch (e) {
                self.throw(e.message);
            }
        });
    };
    if (options.url) this.loadURL(options.url, doMetadataExtraction);
    else if (options.source)
        this.loadSource(options.source, doMetadataExtraction);
    else if (options.file) this.loadFile(options.file, doMetadataExtraction);
    else if (options.document)
        this.loadDocument(options.document, doMetadataExtraction);
    else
        return this.throw(
            'At least one of url, source, file, or document must be specified.'
        );
};

Specberus.prototype.validate = function (options) {
    this.clearCache();
    const self = this;

    if (!options.events)
        throw new Error(
            '[EXCEPTION] The events option is required for reporting.'
        );
    self.sink = options.events;
    if (self.sink.listeners('exception').length === 0)
        throw new Error(
            '[WARNING] No handler for event `exception` which to report system errors.'
        );

    if (!options.profile)
        return this.throw('Without a profile there is nothing to check.');
    const { profile } = options;
    try {
        self.config = util.processParams(options, profile.config);
    } catch (err) {
        return this.throw(err.toString());
    }
    self.config.lang = 'en_GB';
    const errors = [];
    const warnings = [];
    const infos = [];
    self.sink.on('err', (...data) => {
        errors.push(Object.assign({}, ...data));
    });
    self.sink.on('warning', (...data) => {
        warnings.push(Object.assign({}, ...data));
    });
    self.sink.on('info', (...data) => {
        infos.push(Object.assign({}, ...data));
    });
    const doValidation = function (err, jsDocument) {
        if (err) return self.throw(err);
        self.jsDocument = jsDocument;
        self.sink.emit('start-all', profile.name);
        const total = (profile.rules || []).length;
        let done = 0;
        profile.rules.forEach((rule) => {
            // XXX
            //  I would like to catch all exceptions here, but this derails the testing
            //  infrastructure which also uses exceptions that it expects aren't caught
            rule.check(
                self,
                function () {
                    done++;
                    self.sink.emit('done', this.name);
                    if (done === total)
                        self.sink.emit(
                            'end-all',
                            util.buildJSONresult(errors, warnings, infos, {})
                        );
                }.bind(rule)
            );
        });
    };
    if (options.url) this.loadURL(options.url, doValidation);
    else if (options.source) this.loadSource(options.source, doValidation);
    else if (options.file) this.loadFile(options.file, doValidation);
    else if (options.document)
        this.loadDocument(options.document, doValidation);
    else
        return this.throw(
            'At least one of url, source, file, or document must be specified.'
        );
};

Specberus.prototype.error = function (rule, key, extra) {
    let name;
    if (typeof rule === 'string') name = rule;
    else name = rule.name;
    if (
        this.shortname !== undefined &&
        (this.config.status === 'WD' ||
            this.config.status === 'CR' ||
            this.config.status === 'CRD' ||
            this.config.status === 'NOTE') &&
        this.exceptions.has(this.shortname, name, key, extra)
    )
        this.warning(rule, key, extra);
    else if (typeof rule === 'string')
        this.sink.emit('err', name, {
            key,
            extra,
            detailMessage: l10n.assembleData(null, name, key, extra).message,
        });
    else
        this.sink.emit('err', rule, {
            key,
            extra,
            detailMessage: l10n.assembleData(null, rule, key, extra).message,
        });
};

Specberus.prototype.warning = function (rule, key, extra) {
    this.sink.emit('warning', rule, {
        key,
        extra,
        detailMessage: l10n.assembleData(null, rule, key, extra).message,
    });
};

Specberus.prototype.info = function (rule, key, extra) {
    this.sink.emit('info', rule, {
        key,
        extra,
        detailMessage: l10n.assembleData(null, rule, key, extra).message,
    });
};

Specberus.prototype.metadata = function (key, value) {
    if (key === 'shortname') {
        this.shortname = value;
    }
    this.sink.emit('metadata', key, value);
};

Specberus.prototype.throw = function (msg) {
    console.error(`[EXCEPTION] ${msg}`);
    this.sink.emit('exception', { message: msg });
};

Specberus.prototype.checkSelector = function (sel, name, done) {
    try {
        const selElement = this.jsDocument.querySelectorAll(sel);
        if (!selElement || !selElement.length) this.error(name, 'not-found');
    } catch (e) {
        this.throw(`Selector '${sel}' caused the validator to blow up.`);
    }
    done();
};

Specberus.prototype.norm = function (str) {
    if (!str) return '';
    str = `${str}`;
    return str.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ');
};

const months =
    'January February March April May June July August September October November December'.split(
        ' '
    );
Specberus.prototype.dateRegexStrCapturing = `(\\d?\\d) (${months.join(
    '|'
)}) (\\d{4})`;
Specberus.prototype.dateRegexStrNonCapturing = `\\d?\\d (?:${months.join(
    '|'
)}) \\d{4}`;

Specberus.prototype.stringToDate = function (str) {
    const rex = new RegExp(this.dateRegexStrCapturing);
    const matches = str.match(rex);
    if (matches) {
        try {
            return new Date(
                matches[3] * 1,
                months.indexOf(matches[2]),
                matches[1] * 1
            );
        } catch (e) {
            this.self.throw(
                `Creating Date() '${matches[3] * 1}, ${months.indexOf(
                    matches[2]
                )}, ${matches[1] * 1}' caused the validator to blow up.`
            );
        }
    }
};

Specberus.prototype.getDocumentDate = function () {
    if (this.docDate) return this.docDate;
    const rex = new RegExp(
        `${this.dateRegexStrCapturing}(?:, edited in place ${this.dateRegexStrNonCapturing}| \\(Amended by W3C\\))?$`
    );
    const self = this;
    const element = this.jsDocument.querySelector(
        'body div.head h2:not(#subtitle)'
    );
    const matches = element && self.norm(element.textContent).match(rex);
    if (matches) {
        self.docDate = self.stringToDate(
            `${matches[1]} ${matches[2]} ${matches[3]}`
        );
        self.docDateEl = element;
    }
    return this.docDate;
};

Specberus.prototype.getDocumentDateElement = function () {
    if (this.docDateEl) return this.docDateEl;
    this.getDocumentDate();
    return this.docDateEl;
};

Specberus.prototype.getSotDSection = function () {
    if (undefined !== this.sotdSection) {
        return this.sotdSection;
    }
    let startH2;
    let endH2;
    const div = this.jsDocument.createElement('div');
    const self = this;
    const nav = this.jsDocument.querySelector('nav#toc');
    Array.prototype.some.call(this.jsDocument.querySelectorAll('h2'), (h2) => {
        if (startH2) {
            endH2 = h2;
            return true;
        }
        if (
            /^Status [Oo]f [Tt]his [Dd]ocument$/.test(self.norm(h2.textContent))
        ) {
            startH2 = h2;
        }
    });
    if (!startH2) this.sotdSection = null;
    else {
        let started = false;
        Array.prototype.some.call(startH2.parentElement.children, (element) => {
            if (startH2 === element) {
                started = true;
                return false;
            }
            if (!started) return false;
            if (endH2 === element || nav === element) return true;
            div.appendChild(element.cloneNode(true));
        });
        this.sotdSection = div.children.length ? div : null;
    }
    if (!this.sotdSection)
        this.error(
            { name: 'generic.sotd', section: 'document-status', rule: 'sotd' },
            'not-found'
        );
    return this.sotdSection;
};

Specberus.prototype.extractHeaders = function (dl) {
    const self = this;
    const dts = {};
    const EDITORS = /^editor(s)?$/;
    const EDITORS_DRAFT = /(latest )?editor's draft/i;

    if (dl) {
        dl.querySelectorAll('dt').forEach(function (dt, idx) {
            const txt = self
                .norm(dt.textContent)
                .replace(':', '')
                .toLowerCase()
                .replace('published ', '');
            let dd = dt.nextElementSibling;
            let key = null;
            if (!dd)
                return this.throw(`No &lt;dd&gt; element found for ${txt}.`);
            if (txt === 'this version') key = 'This';
            else if (!dts.Latest && txt.lastIndexOf('latest version', 0) === 0)
                key = 'Latest';
            else if (/^previous version(?:s)?.*$/.test(txt)) key = 'Previous';
            else if (/^rescinds this recommendation?$/.test(txt))
                key = 'Rescinds';
            else if (/^obsoletes this recommendation?$/.test(txt))
                key = 'Obsoletes';
            else if (/^supersedes this recommendation?$/.test(txt))
                key = 'Supersedes';
            else if (/^implementation report?$/.test(txt))
                key = 'Implementation';
            if (EDITORS_DRAFT.test(txt) && dd.querySelector('a'))
                key = 'EditorDraft';
            if (EDITORS.test(txt)) {
                key = 'Editor';
                dd = util.nextUntil(dt, 'dt', 'dd');
            }
            if (key) dts[key] = { pos: idx, el: dt, dd };
        });
    }
    return dts;
};

Specberus.prototype.getEditorIDs = function () {
    const dataEditor = this.jsDocument.querySelectorAll('dd[data-editor-id]');
    const editors = Array.prototype.map.call(dataEditor, (element) => {
        const strId = element.getAttribute('data-editor-id');

        // If the ID is not a digit-only string, it gets filtered out
        if (/^\d+$/.test(strId)) return parseInt(strId, 10);
    });
    // remove duplicates
    return editors.filter((item, pos) => editors.indexOf(item) === pos);
};

// That rule tries to extract all the dates from the SOTD;
// only the dates posterior to the date of the doc and inferior to one year
// later are extracted... If there is only one, there is a good chance that it's
// the deadline for feedback.
Specberus.prototype.getFeedbackDueDate = function () {
    const sotd = this.getSotDSection();
    const dates = { list: [], valid: [] };
    if (sotd) {
        const txt = this.norm(sotd.textContent);
        const rex = new RegExp(this.dateRegexStrCapturing, 'g');
        const docDate = this.getDocumentDate();
        const lowBound = new Date(docDate).setDate(
            new Date(docDate).getDate() + 27
        ); // minimum review period: 28 days (not counting the hours)
        const highBound = new Date(docDate).setFullYear(
            docDate.getFullYear() + 1
        );
        const candidates = txt.match(rex);
        if (candidates !== null) {
            for (let i = 0; i < candidates.length; i++) {
                const d = this.stringToDate(candidates[i]);
                if (d >= lowBound) dates.list.push(d);
                if (d >= lowBound && d < highBound) dates.valid.push(d);
            }
        }
    }
    return dates;
};

Specberus.prototype.getDelivererIDs = async function () {
    if (undefined !== this.delivererIDs) {
        return this.delivererIDs;
    }
    const REGEX_DELIVERER_URL =
        /^https?:\/\/www\.w3\.org\/2004\/01\/pp-impl\/\d+\/status(#.*)?$/i;
    const REGEX_DELIVERER_TEXT =
        /^(charter|public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?)$/i;
    const REGEX_DELIVERER_ID = /pp-impl\/(\d+)\/status/i;
    const REGEX_TAG_DISCLOSURE =
        /https?:\/\/www.w3.org\/2001\/tag\/disclosures/;
    const REGEX_DELIVERER_IPR_URL =
        /^https:\/\/www\.w3\.org\/groups\/([^/]+)\/([^/]+)\/ipr(#.*)?$/i;
    const { TAG_ID } = util;
    const ids = this.getDelivererIDsNote() || [];
    const sotd = this.getSotDSection();
    const sotdLinks = sotd && sotd.querySelectorAll('a[href]');
    const promiseArray = [];

    if (ids.length === 0 && sotdLinks && sotdLinks.length > 0) {
        for (const item of sotdLinks) {
            const href = item.getAttribute('href');
            const text = this.norm(item.textContent);
            const found = {};
            if (REGEX_DELIVERER_TEXT.test(text)) {
                if (REGEX_DELIVERER_URL.test(href)) {
                    const id = REGEX_DELIVERER_ID.exec(href);
                    if (id && id.length > 1 && !found[id[1]]) {
                        found[id] = true;
                        ids.push(parseInt(id[1], 10));
                    }
                } else if (REGEX_TAG_DISCLOSURE.test(href)) {
                    ids.push(TAG_ID);
                } else if (REGEX_DELIVERER_IPR_URL.test(href)) {
                    const [, type, shortname] =
                        REGEX_DELIVERER_IPR_URL.exec(href);
                    const groupAPIURL = `https://api.w3.org/groups/${type}/${shortname}`;
                    const apikey = process.env.W3C_API_KEY;
                    promiseArray.push(
                        sua
                            .get(groupAPIURL)
                            .set('User-Agent', `W3C-Pubrules/${version}`)
                            .query({ apikey })
                    );
                }
            }
        }
        await Promise.all(promiseArray).then((res) => {
            for (const data of res) {
                if (data.body && data.body.id) {
                    ids.push(data.body.id);
                }
            }
        });
    }
    this.delivererIDs = ids;
    return ids;
};

Specberus.prototype.getDelivererIDsNote = function () {
    const ids = [];
    const self = this;
    const sotd = self.getSotDSection();
    const deliver = sotd && sotd.querySelectorAll('[data-deliverer]');
    if (deliver && deliver.length > 0) {
        deliver.forEach((element) => {
            const deliverers = element
                .getAttribute('data-deliverer')
                .trim()
                .split(/[,\s]+/);
            deliverers.forEach((id) => {
                if (/\d+/.test(id)) ids.push(parseInt(id, 10));
            });
        });
    }
    return ids;
};

Specberus.prototype.loadURL = function (url, cb) {
    if (!cb) return this.throw('Missing callback to loadURL.');
    const self = this;
    sua.get(url)
        .set('User-Agent', `W3C-Pubrules/${version}`)
        .end((err, res) => {
            if (err) return self.throw(err.message);
            if (!res.text) return self.throw(`Body of ${url} is empty.`);
            self.url = url;
            self.loadSource(res.text, cb);
        });
};

Specberus.prototype.loadSource = function (src, cb) {
    if (!cb) return this.throw('Missing callback to loadSource.');
    this.source = src;
    let jsdom;
    try {
        jsdom = new JSDOM(src);
    } catch (e) {
        this.throw('Jsdom failed to parse source: ', JSON.stringify(e));
    }
    const jsDocument = jsdom.window.document;
    cb(null, jsDocument);
};

Specberus.prototype.loadFile = function (file, cb) {
    if (!cb) return this.throw('Missing callback to loadFile.');
    const self = this;
    fs.access(file, fs.constants.F_OK, (errors) => {
        if (errors) return cb(`File '${file}' not found.`);
        fs.readFile(file, { encoding: 'utf8' }, (err, src) => {
            if (err) return cb(err);
            self.loadSource(src, cb);
        });
    });
};

Specberus.prototype.loadDocument = function (doc, cb) {
    if (!cb) return this.throw('Missing callback to loadDocument.');
    if (!doc) return cb('No document.');
    cb(null, (selector, context) => {
        const jsdom = new JSDOM(doc);
        const jsDocument = jsdom.window.document;
        const query = context + (context ? ' ' : '') + selector;
        return jsDocument.querySelectorAll(query);
    });
};

Specberus.prototype.transition = function (options) {
    if (this.getDocumentDate() < options.from) options.doBefore();
    else if (this.getDocumentDate() > options.to) options.doAfter();
    else options.doMeanwhile();
};

Specberus.prototype.getRecMetadata = function (meta) {
    const SOTD_CORRECTION = 'It includes proposed correction(s)?.';
    const SOTD_ADDITION =
        'It includes proposed addition(s)?, introducing new feature(s)? since the previous Recommendation.';
    const SOTD_COR_ADD =
        'It includes proposed change(s)?, introducing substantive change(s)? and new feature(s)? since the previous Recommendation.';
    const sotdText = this.norm(this.getSotDSection().textContent);
    if (sotdText.match(new RegExp(`${SOTD_CORRECTION}|${SOTD_COR_ADD}`, 'i')))
        meta.substantiveChanges = true;
    if (sotdText.match(new RegExp(`${SOTD_ADDITION}|${SOTD_COR_ADD}`, 'i')))
        meta.newFeatures = true;
    return meta;
};

if (
    !process ||
    !process.env ||
    !process.env.W3C_API_KEY ||
    process.env.W3C_API_KEY.length < 1
)
    throw new Error(
        'Pubrules is missing a valid key for the W3C API; define environment variable “W3C_API_KEY”'
    );
else {
    if (
        !process ||
        !process.env ||
        !process.env.BASE_URI ||
        process.env.BASE_URI.length < 1
    )
        console.warn(
            `Environment variable “BASE_URI” not defined; assuming that Pubrules lives at “/”`
        );
    exports.Specberus = Specberus;
}
