/**
 * Main file of the Specberus npm package.
 *
 * The most useful source:
 * https://services.w3.org/xslt?xmlfile=https://www.w3.org/2005/07/13-pubrules-src.html&xslfile=https://www.w3.org/2005/07/13-pubrules-compare.xsl
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const w3cApi = require('node-w3capi');
const sua = require('./throttled-ua');
const { version } = require('../package.json');
const { Exceptions } = require('./exceptions');
const profileMetadata = require('./profiles/metadata');
const util = require('./util');
const l10n = require('./l10n');

l10n.setLanguage('en_GB');
w3cApi.apiKey = process.env.W3C_API_KEY;

const Specberus = function (apiKey = process.env.W3C_API_KEY) {
    if (typeof apiKey !== 'string' || !apiKey.length) {
        throw new Error('apiKey is required.');
    }
    this.apiKey = apiKey;
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
    this.delivererGroups = undefined;
    this.exceptions = new Exceptions();
    this.patentPolicies = undefined;
    this.chartersData = undefined;
    this.charters = undefined;
    this.headers = undefined;
    this.isFirstPublic = undefined;
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
    self.sink.on('err', data => {
        errors.push(data);
    });
    self.sink.on('warning', data => {
        warnings.push(data);
    });
    self.sink.on('info', data => {
        infos.push(data);
    });
    const doMetadataExtraction = function (err, jsDocument) {
        if (err) return self.throw(err);
        self.jsDocument = jsDocument;
        self.sink.emit('start-all', profileMetadata);
        const total = (profileMetadata.rules || []).length;
        let done = 0;
        profileMetadata.rules.forEach(rule => {
            try {
                rule.check(
                    self,
                    function (result) {
                        if (result) {
                            for (const i in result) {
                                self.meta[i] = result[i];
                            }
                        }
                        done += 1;
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
        profile.rules.forEach(rule => {
            // XXX
            //  I would like to catch all exceptions here, but this derails the testing
            //  infrastructure which also uses exceptions that it expects aren't caught
            rule.check(
                self,
                function () {
                    done += 1;
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
            this.config.status === 'DRY' ||
            this.config.status === 'DNOTE' ||
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
        `${this.dateRegexStrCapturing}(?:, edited in place ${this.dateRegexStrNonCapturing})?$`
    );
    const self = this;
    const element = this.jsDocument.getElementById('w3c-state');

    const matches = element && self.norm(element.textContent).match(rex);
    if (matches) {
        self.docDate = self.stringToDate(
            `${matches[1]} ${matches[2]} ${matches[3]}`
        );
        self.docDateEl = element;
    }
    return this.docDate;
};

Specberus.prototype.getDocumentStateElement = function () {
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
    Array.prototype.some.call(this.jsDocument.querySelectorAll('h2'), h2 => {
        if (startH2) {
            endH2 = h2;
            return true;
        }
        if (
            // cspell:disable-next-line
            /^Status [Oo]f [Tt]his [Dd]ocument$/.test(self.norm(h2.textContent))
        ) {
            startH2 = h2;
        }
    });
    if (!startH2) this.sotdSection = null;
    else {
        let started = false;
        Array.prototype.some.call(startH2.parentElement.children, element => {
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

// The parameter`dl` is optional.
// If `dl` is not set, extractHeaders() would use the current document to extract headers link and cache them for future use.
// If sets a `dl`, the situation would be extract data from other document, the new element will be used and the result wouldn't be cached.
Specberus.prototype.extractHeaders = function (dl) {
    const self = this;
    const dts = {};
    const EDITORS = /^editor(s)?$/;
    const EDITORS_DRAFT = /(latest )?editor's draft/i;

    // If 'dl' doesn't exist, the function use 'current document' to extract. Return cached data if possible,
    // If 'dl' is set, it may comes from another document, e.g. previous document, extract every time.
    const extractThisDocument = !dl;
    if (extractThisDocument && this.headers !== undefined) {
        return this.headers;
    }

    dl = dl || this.jsDocument.querySelector('body div.head dl');

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
            else if (/^history$/.test(txt)) key = 'History';
            else if (/^rescinds this recommendation?$/.test(txt))
                key = 'Rescinds';
            else if (/^obsoletes this recommendation?$/.test(txt))
                key = 'Obsoletes';
            else if (/^supersedes this recommendation?$/.test(txt))
                key = 'Supersedes';
            else if (/^implementation report?$/.test(txt))
                key = 'Implementation';
            else if (/^feedback$/.test(txt)) {
                // feedback link can be multi-lines
                key = 'Feedback';
                dd = util.nextUntil(dt, 'dt', 'dd');
            } else if (/^errata?$/.test(txt)) key = 'Errata';
            if (EDITORS_DRAFT.test(txt) && dd.querySelector('a'))
                key = 'EditorDraft';
            if (EDITORS.test(txt)) {
                key = 'Editor';
                dd = util.nextUntil(dt, 'dt', 'dd');
            }
            if (key) dts[key] = { pos: idx, el: dt, dd };
        });
    }
    this.headers = dts;
    return dts;
};

Specberus.prototype.getEditorIDs = function () {
    const dts = this.extractHeaders();
    const result = [];
    if (dts.Editor) {
        dts.Editor.dd.forEach(element => {
            const editorID = element.getAttribute('data-editor-id');
            // Return ID as Number format, if the ID is not a digit-only string, it gets filtered out
            if (editorID) result.push(parseInt(editorID, 10));
        });
        // remove duplicates
        return result.filter((item, pos) => result.indexOf(item) === pos);
    }
    return result;
};

Specberus.prototype.getShortname = async function () {
    if (undefined !== this.shortname) {
        return this.shortname;
    }

    let shortname;
    const dts = this.extractHeaders();
    const linkThis = dts.This ? dts.This.dd.querySelector('a') : null;
    const linkThisHref = linkThis.getAttribute('href').trim();
    const thisVersionMatches =
        linkThisHref && linkThisHref.match(/.*\/[^/-]+-(.*)-\d{8}\/$/);
    if (thisVersionMatches && thisVersionMatches.length > 0)
        [, shortname] = thisVersionMatches;

    this.shortname = shortname;
    return shortname;
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
            for (let i = 0; i < candidates.length; i += 1) {
                const d = this.stringToDate(candidates[i]);
                if (d >= lowBound) dates.list.push(d);
                if (d >= lowBound && d < highBound) dates.valid.push(d);
            }
        }
    }
    return dates;
};

/**
 * getDelivererGroups get deliverers groupNames and types
 *
 * @returns {Array} [{groupShortname: '', groupType: ''}]
 */
Specberus.prototype.getDelivererGroups = async function () {
    if (undefined !== this.delivererGroups) {
        return this.delivererGroups;
    }
    const REGEX_DELIVERER_URL =
        /^https?:\/\/www\.w3\.org\/2004\/01\/pp-impl\/(\d+)\/status(#.*)?$/i;
    const REGEX_DELIVERER_TEXT =
        /^(charter|public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?)$/i;
    const REGEX_TAG_DISCLOSURE =
        /https?:\/\/www.w3.org\/2001\/tag\/disclosures/;
    const REGEX_DELIVERER_IPR_URL =
        /^https:\/\/www\.w3\.org\/groups\/([^/]+)\/([^/]+)\/ipr(#.*)?$/i;
    const TagID = util.TAG.id;

    const sotd = this.getSotDSection();
    const sotdLinks = sotd && sotd.querySelectorAll('a[href]');
    const promiseArray = [];
    let ids = [];
    const delivererGroups = [];

    // getDataDelivererIDs first, apply if document is Note/Registry track.
    ids = this.getDataDelivererIDs() || [];
    // For rec-track
    if (ids.length === 0 && sotdLinks && sotdLinks.length > 0) {
        for (let i = 0; i < sotdLinks.length; i += 1) {
            const item = sotdLinks[i];
            const href = item.getAttribute('href');
            const text = this.norm(item.textContent);
            const found = {};

            if (REGEX_DELIVERER_TEXT.test(text)) {
                if (REGEX_DELIVERER_IPR_URL.test(href)) {
                    // get group shortnames directly
                    const [, type, shortname] =
                        REGEX_DELIVERER_IPR_URL.exec(href);
                    delivererGroups.push({
                        groupShortname: shortname,
                        groupType: type,
                    });
                } else {
                    // get group shortnames through groupId
                    const delivererUrlMatch = href.match(REGEX_DELIVERER_URL);
                    if (delivererUrlMatch) {
                        const id = delivererUrlMatch[1];
                        if (id && id.length > 1 && !found[id]) {
                            found[id] = true;
                            ids.push(parseInt(id, 10));
                        }
                    } else if (REGEX_TAG_DISCLOSURE.test(href)) {
                        ids.push(TagID);
                    }
                }
            }
        }
    }

    // send request to W3C API if there's id extracted from the doc.
    for (let i = 0; i < ids.length; i += 1) {
        const groupApiUrl = `https://api.w3.org/groups/${ids[i]}`;
        const apikey = this.apiKey;
        promiseArray.push(
            new Promise(resolve => {
                sua.get(groupApiUrl)
                    .set('User-Agent', `W3C-Pubrules/${version}`)
                    .query({ apikey })
                    .end((err, data) => {
                        resolve(data);
                    });
            })
        );
    }

    await Promise.all(promiseArray).then(res => {
        for (let i = 0; i < res.length; i += 1) {
            const data = res[i];
            if (data && data.body) {
                let { type } = data.body;
                switch (type) {
                    case 'working group':
                        type = 'wg';
                        break;
                    case 'interest group':
                        type = 'ig';
                        break;
                    default:
                        type = 'other';
                        break;
                }

                delivererGroups.push({
                    groupShortname: data.body.shortname,
                    groupType: type,
                });
            }
        }
    });
    this.delivererGroups = delivererGroups;
    return delivererGroups;
};

Specberus.prototype.getDelivererIDs = async function () {
    if (undefined !== this.delivererIDs) {
        return this.delivererIDs;
    }
    const REGEX_DELIVERER_URL =
        /^https?:\/\/www\.w3\.org\/2004\/01\/pp-impl\/(\d+)\/status(#.*)?$/i;
    const REGEX_DELIVERER_TEXT =
        /^(charter|public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?)$/i;
    const REGEX_TAG_DISCLOSURE =
        /https?:\/\/www.w3.org\/2001\/tag\/disclosures/;
    const REGEX_DELIVERER_IPR_URL =
        /^https:\/\/www\.w3\.org\/groups\/([^/]+)\/([^/]+)\/ipr(#.*)?$/i;
    const TagID = util.TAG.id;
    const ids = this.getDataDelivererIDs() || [];
    const sotd = this.getSotDSection();
    const sotdLinks = sotd && sotd.querySelectorAll('a[href]');
    const promiseArray = [];

    if (ids.length === 0 && sotdLinks && sotdLinks.length > 0) {
        for (let i = 0; i < sotdLinks.length; i += 1) {
            const item = sotdLinks[i];
            const href = item.getAttribute('href');
            const text = this.norm(item.textContent);
            const found = {};
            if (REGEX_DELIVERER_TEXT.test(text)) {
                const delivererUrlMatch = href.match(REGEX_DELIVERER_URL);
                if (delivererUrlMatch) {
                    const id = delivererUrlMatch[1];
                    if (id && id.length > 1 && !found[id]) {
                        found[id] = true;
                        ids.push(parseInt(id, 10));
                    }
                } else if (REGEX_TAG_DISCLOSURE.test(href)) {
                    ids.push(TagID);
                } else if (REGEX_DELIVERER_IPR_URL.test(href)) {
                    const [, type, shortname] =
                        REGEX_DELIVERER_IPR_URL.exec(href);
                    const groupApiUrl = `https://api.w3.org/groups/${type}/${shortname}`;
                    const apikey = this.apiKey;
                    promiseArray.push(
                        new Promise(resolve => {
                            sua.get(groupApiUrl)
                                .set('User-Agent', `W3C-Pubrules/${version}`)
                                .query({ apikey })
                                .end((err, data) => {
                                    resolve(data);
                                });
                        })
                    );
                }
            }
        }

        await Promise.all(promiseArray).then(res => {
            for (const data of res) {
                if (data && data.body && data.body.id) {
                    ids.push(data.body.id);
                }
            }
        });
    }
    this.delivererIDs = ids;
    return ids;
};

Specberus.prototype.getDataDelivererIDs = function () {
    const ids = [];
    const sotd = this.getSotDSection();
    const deliver = sotd && sotd.querySelectorAll('[data-deliverer]');
    if (deliver && deliver.length > 0) {
        deliver.forEach(element => {
            const deliverers = element
                .getAttribute('data-deliverer')
                .trim()
                .split(/[,\s]+/);
            deliverers.forEach(id => {
                if (/\d+/.test(id)) ids.push(parseInt(id, 10));
            });
        });
    }
    return ids;
};

// Find the current charter(s) of the document.
Specberus.prototype.getChartersData = async function () {
    if (undefined !== this.chartersData) return this.chartersData;

    const deliverers = await this.getDelivererIDs();
    const docDate = this.getDocumentDate();
    let groupsCharters = [];
    const chartersData = [];
    if (deliverers.length) {
        const delivererPromises = [];
        const TagID = util.TAG.id;
        const AbID = util.AB.id;
        // Get charter data from W3C API
        // deliverers.forEach is for joint publication.
        deliverers.forEach(deliverer => {
            // Skip finding charter for the TAG which doesn't have any charter
            if (deliverer === TagID || deliverer === AbID) return;

            delivererPromises.push(
                new Promise(resolve => {
                    w3cApi
                        .group(deliverer)
                        .charters()
                        .fetch({ embed: true }, (err, charters) => {
                            resolve(charters);
                        });
                })
            );
        });
        groupsCharters = await Promise.all(delivererPromises);

        // groups -> group is for joint publication.
        groupsCharters.forEach(groupCharters => {
            if (groupCharters) {
                groupCharters.forEach(groupCharter => {
                    if (
                        docDate >= new Date(groupCharter.start) &&
                        docDate <= new Date(groupCharter.end)
                    ) {
                        chartersData.push(groupCharter);
                    }
                });
            }
        });
    }

    this.chartersData = chartersData;
    return chartersData;
};

Specberus.prototype.getCharters = async function () {
    if (undefined !== this.charters) {
        return this.charters;
    }

    const chartersData = await this.getChartersData();
    const charters = [];
    chartersData.forEach(charterData => charters.push(charterData.uri));
    this.charters = charters;
    return charters;
};

Specberus.prototype.getPatentPolicies = async function () {
    if (undefined !== this.patentPolicies) {
        return this.patentPolicies;
    }
    const chartersData = await this.getChartersData();
    const patentPolicies = [];
    chartersData.forEach(charterData =>
        patentPolicies.push(charterData['patent-policy'])
    );
    this.patentPolicies = patentPolicies;
    return patentPolicies;
};

// check if this document is a FP document. For shortname change document, data-previous-shortname="xxx" is needed.
Specberus.prototype.isFP = async function () {
    if (undefined !== this.isFirstPublic) {
        return this.isFirstPublic;
    }
    const previousLink = await this.getPreviousVersion();
    if (!previousLink) {
        const dts = this.extractHeaders();
        const shortnameChange =
            dts.History &&
            dts.History.dd.querySelector('a').dataset.previousShortname;
        this.isFirstPublic = !shortnameChange;
    } else {
        this.isFirstPublic = false;
    }
    return this.isFirstPublic;
};

// get previous version link from API using shortname
Specberus.prototype.getPreviousVersion = async function () {
    const dts = this.extractHeaders();
    const shortname = this.shortname || (await this.getShortname());

    /**
     *
     */
    function shortnameHistoryP() {
        return new Promise(resolve => {
            w3cApi
                .specification(shortname)
                .versions()
                .fetch({ embed: true }, (err, data) => {
                    if (err && err.status === 404) {
                        // check if it's not a shortname change
                        const shortnameChange = dts.History
                            ? dts.History.dd.querySelector('a').dataset
                                  .previousShortname
                            : null;
                        if (shortnameChange) {
                            w3cApi
                                .specification(shortnameChange)
                                .versions()
                                .fetch({ embed: true }, (err, data) => {
                                    resolve(data);
                                });
                        } else {
                            resolve();
                        }
                    } else {
                        resolve(data);
                    }
                });
        });
    }
    const versions = (await shortnameHistoryP()) || [];

    const linkThis = dts.This
        ? dts.This.dd.querySelector('a').getAttribute('href')
        : '';
    // in case of same day publication. use older version as previousVersion link.
    const previousVersion =
        versions.length &&
        (versions[0].uri === linkThis ? versions[1].uri : versions[0].uri);
    return previousVersion;
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
    fs.access(file, fs.constants.F_OK, errors => {
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
    const sotdText = this.norm(this.getSotDSection().textContent);

    // proposed corrections, proposed additions, proposed amendments:
    const { SOTD_P_COR } = util.REC_TEXT;
    const { SOTD_P_ADD } = util.REC_TEXT;
    const { SOTD_P_COR_ADD } = util.REC_TEXT;
    if (sotdText.match(new RegExp(`${SOTD_P_COR}|${SOTD_P_COR_ADD}`, 'i')))
        meta.pSubChanges = true;
    if (sotdText.match(new RegExp(`${SOTD_P_ADD}|${SOTD_P_COR_ADD}`, 'i')))
        meta.pNewFeatures = true;

    // candidate corrections, candidate additions, candidate amendments:
    const { SOTD_C_COR } = util.REC_TEXT;
    const { SOTD_C_ADD } = util.REC_TEXT;
    const { SOTD_C_COR_ADD } = util.REC_TEXT;
    if (sotdText.match(new RegExp(`${SOTD_C_COR}|${SOTD_C_COR_ADD}`, 'i')))
        meta.cSubChanges = true;
    if (sotdText.match(new RegExp(`${SOTD_C_ADD}|${SOTD_C_COR_ADD}`, 'i')))
        meta.cNewFeatures = true;

    return meta;
};

exports.Specberus = Specberus;
