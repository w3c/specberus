/**
 * @file Main file of the Specberus npm package.
 *
 * The most useful source:
 * https://services.w3.org/xslt?xmlfile=https://www.w3.org/2005/07/13-pubrules-src.html&xslfile=https://www.w3.org/2005/07/13-pubrules-compare.xsl
 */

import fs from 'fs';
import type EventEmitter from 'events';

import { type Cheerio, type CheerioAPI, load } from 'cheerio';
import type { Element } from 'domhandler';
// @ts-ignore (no typings)
import w3cApi from 'node-w3capi';

import { hasExceptions } from './exceptions.js';
import { assembleData, setLanguage } from './l10n.js';
import * as profileMetadata from './profiles/metadata.js';
import * as profileAdditionalMetadata from './profiles/additionalMetadata.js';
import { get } from './throttled-ua.js';
import { AB, buildJSONresult, processParams, REC_TEXT, TAG } from './util.js';
import pkg from '../package.json' with { type: 'json' };
import type {
    ApiCharter,
    HandlerMessage,
    Rule,
    RuleBase,
    ApiSpecificationVersion,
    RecMetadata,
    RuleMeta,
    SpecberusConfig,
} from './types.js';

setLanguage('en_GB');

interface BaseOptions {
    events: EventEmitter;
    file?: string;
    source?: string;
    url?: string;
}

interface ExtractMetadataOptions extends BaseOptions {
    additionalMetadata?: boolean;
}

export interface ValidateOptions extends BaseOptions {
    profile: any; // TODO
}

type HeaderMap = Record<
    string,
    {
        pos: number;
        $el: Cheerio<Element>;
        $dd: Cheerio<Element>;
    }
>;

interface DelivererGroup {
    groupShortname: string;
    groupType: string;
}

interface TransitionOptions {
    doAfter: () => void;
    doBefore: () => void;
    doMeanwhile: () => void;
    from: Date;
    to: Date;
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const abbrMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

export const possibleMonths = [...months, ...abbrMonths].join('|');

const separator = '[ -]{1}';

export class Specberus {
    $ = load('');
    config: SpecberusConfig | undefined;
    url!: string | null;
    version = pkg.version;
    private $docDateEl: Cheerio<Element> | undefined;
    private $sotdSection: Cheerio<Element> | null | undefined;
    private meta: Record<string, any> | undefined;
    /** Group objects returned by W3C API charters endpoint */
    private chartersData: ApiCharter[] | undefined;
    /** Charter URIs */
    private charters: string[] | undefined;
    private delivererIDs: number[] | undefined;
    private delivererGroups: DelivererGroup[] | undefined;
    private docDate: Date | null | undefined;
    private headers: HeaderMap | undefined;
    private isFirstPublic: any | undefined;
    private shortname: string | undefined;
    private source!: any | null;
    private sink: EventEmitter | undefined;

    constructor() {
        this.clearCache();
    }

    clearCache() {
        this.$ = load('');
        this.config = undefined;
        this.docDate = null;
        this.$docDateEl = undefined;
        this.$sotdSection = undefined;
        this.url = null;
        this.source = null;
        this.shortname = undefined;
        this.delivererIDs = undefined;
        this.delivererGroups = undefined;
        this.chartersData = undefined;
        this.charters = undefined;
        this.headers = undefined;
        this.isFirstPublic = undefined;
    }

    extractMetadata(options: ExtractMetadataOptions) {
        this.clearCache();

        if (!options.events)
            throw new Error(
                '[EXCEPTION] The events option is required for reporting.'
            );
        const sink = (this.sink = options.events);
        if (!this.sink.listeners('exception').length)
            throw new Error(
                '[WARNING] No handler for event `exception` which to report system errors.'
            );

        const meta: Record<string, any> = (this.meta = {});
        const errors: HandlerMessage[] = [];
        const warnings: HandlerMessage[] = [];
        const infos: HandlerMessage[] = [];
        sink.on('err', data => {
            errors.push(data);
        });
        sink.on('warning', data => {
            warnings.push(data);
        });
        sink.on('info', data => {
            infos.push(data);
        });
        /**
         * @param err
         * @param {CheerioAPI} $
         */
        const doMetadataExtraction = (err: any, $?: CheerioAPI) => {
            if (err) return this.throw(err);
            if ($) this.$ = $;
            const profile = options.additionalMetadata
                ? profileAdditionalMetadata
                : profileMetadata;
            sink.emit('start-all', profile);
            const total = (profile.rules || []).length;
            let done = 0;
            profile.rules.forEach(rule => {
                try {
                    rule.check(this, result => {
                        if (result) {
                            for (const i in result) {
                                meta[i] = result[i];
                            }
                        }
                        done += 1;
                        sink.emit('done', rule.name);
                        if (done === total)
                            sink.emit(
                                'end-all',
                                buildJSONresult(errors, warnings, infos, meta)
                            );
                    });
                } catch (e) {
                    this.throw(e.message);
                }
            });
        };
        if (options.url) this.loadURL(options.url, doMetadataExtraction);
        else if (options.source)
            this.loadSource(options.source, doMetadataExtraction);
        else if (options.file)
            this.loadFile(options.file, doMetadataExtraction);
        else
            return this.throw(
                'At least one of url, source, file, or document must be specified.'
            );
    }

    validate(options: ValidateOptions) {
        this.clearCache();

        if (!options.events)
            throw new Error(
                '[EXCEPTION] The events option is required for reporting.'
            );
        const sink = (this.sink = options.events);
        if (sink.listeners('exception').length === 0)
            throw new Error(
                '[WARNING] No handler for event `exception` which to report system errors.'
            );

        if (!options.profile)
            return this.throw('Without a profile there is nothing to check.');
        const { profile } = options;
        processParams(options, profile.config)
            .then(config => {
                this.config = config;
                config.lang = 'en_GB';
                const errors: HandlerMessage[] = [];
                const warnings: HandlerMessage[] = [];
                const infos: HandlerMessage[] = [];
                sink.on('err', (...data) => {
                    errors.push(Object.assign({}, ...data));
                });
                sink.on('warning', (...data) => {
                    warnings.push(Object.assign({}, ...data));
                });
                sink.on('info', (...data) => {
                    infos.push(Object.assign({}, ...data));
                });
                /**
                 * @param err
                 * @param {CheerioAPI} $
                 */
                const doValidation = (err: any, $?: CheerioAPI) => {
                    if (err) return this.throw(err);
                    if ($) this.$ = $;
                    sink.emit('start-all', profile.name);
                    const total = (profile.rules || []).length;
                    let done = 0;
                    profile.rules.forEach((rule: Rule) => {
                        // XXX(darobin)
                        //  I would like to catch all exceptions here, but this derails the testing
                        //  infrastructure which also uses exceptions that it expects aren't caught
                        rule.check(
                            this,
                            function () {
                                done += 1;
                                sink.emit('done', rule.name);
                                if (done === total)
                                    sink.emit(
                                        'end-all',
                                        buildJSONresult(
                                            errors,
                                            warnings,
                                            infos,
                                            {}
                                        )
                                    );
                            }.bind(rule)
                        );
                    });
                };
                if (options.url) this.loadURL(options.url, doValidation);
                else if (options.source)
                    this.loadSource(options.source, doValidation);
                else if (options.file)
                    this.loadFile(options.file, doValidation);
                else
                    return this.throw(
                        'At least one of url, source, file, or document must be specified.'
                    );
            })
            .catch(err => this.throw(err.toString()));
    }

    error(rule: RuleBase | RuleMeta, key: string, extra?: Record<string, any>) {
        let name;
        if (typeof rule === 'string') name = rule;
        else name = rule.name;
        const shortname = this.getShortname();
        if (
            typeof shortname !== 'undefined' &&
            hasExceptions(shortname, name, extra)
        )
            this.warning(rule, key, extra);
        else if (typeof rule === 'string')
            this.sink!.emit('err', name, {
                key,
                extra,
                detailMessage: assembleData(null, name, key, extra).message,
            });
        else
            this.sink!.emit('err', rule, {
                key,
                extra,
                detailMessage: assembleData(null, rule, key, extra).message,
            });
    }

    warning(
        rule: RuleBase | RuleMeta,
        key: string,
        extra?: Record<string, any>
    ) {
        this.sink!.emit('warning', rule, {
            key,
            extra,
            detailMessage: assembleData(null, rule, key, extra).message,
        });
    }

    info(rule: RuleBase | RuleMeta, key: string, extra?: Record<string, any>) {
        this.sink!.emit('info', rule, {
            key,
            extra,
            detailMessage: assembleData(null, rule, key, extra).message,
        });
    }

    throw(message: any) {
        console.error(`[EXCEPTION] ${message}`);
        this.sink!.emit('exception', { message });
    }

    checkSelector(sel: string, rule: RuleMeta, done: () => void) {
        try {
            if (!this.$(sel).length) this.error(rule, 'not-found');
        } catch (e) {
            this.throw(`Selector '${sel}' caused the validator to blow up.`);
        }
        done();
    }

    norm(str: string) {
        if (!str) return '';
        return `${str}`
            .replace(/^\s+/, '')
            .replace(/\s+$/, '')
            .replace(/\s+/g, ' ');
    }

    static dateRegexStrCapturing = `(\\d?\\d)${separator}(${possibleMonths})${separator}(\\d{4})`;
    static dateRegexStrNonCapturing = `\\d?\\d${separator}(?:${possibleMonths})${separator}\\d{4}`;

    stringToDate(str: string) {
        const rex = new RegExp(Specberus.dateRegexStrCapturing);
        const matches = str.match(rex);
        if (matches) {
            return new Date(
                +matches[3],
                months.indexOf(matches[2]),
                +matches[1]
            );
        }
    }

    getDocumentDate() {
        if (this.docDate) return this.docDate;
        const rex = new RegExp(
            `${Specberus.dateRegexStrCapturing}(?:, edited in place ${Specberus.dateRegexStrNonCapturing})?$`
        );
        const $el = this.$('#w3c-state');

        const matches = $el.length && this.norm($el.text()).match(rex);
        if (matches) {
            this.docDate = this.stringToDate(
                `${matches[1]} ${matches[2]} ${matches[3]}`
            );
            this.$docDateEl = $el;
        }
        return this.docDate;
    }

    getDocumentStateElement() {
        if (this.$docDateEl) return this.$docDateEl;
        this.getDocumentDate();
        return this.$docDateEl;
    }

    getSotDSection() {
        if (typeof this.$sotdSection !== 'undefined') return this.$sotdSection;

        let startH2: Element | undefined;
        let endH2: Element | undefined;
        const $div = load('<div></div>', null, false)('div');
        const self = this;
        const $nav = this.$('nav#toc');
        this.$('h2').each((_, h2) => {
            if (startH2) {
                endH2 = h2;
                return false;
            }
            if (
                // cspell:disable-next-line
                /^Status [Oo]f [Tt]his [Dd]ocument$/.test(
                    self.norm(this.$(h2).text())
                )
            ) {
                startH2 = h2;
            }
        });
        if (!startH2) this.$sotdSection = null;
        else {
            let started = false;
            this.$(startH2)
                .parent()
                .children()
                .each((_, el) => {
                    if (startH2 === el) {
                        started = true;
                        return;
                    }
                    if (!started) return;
                    if (endH2 === el || $nav[0] === el) return false;
                    $div.append(el.cloneNode(true));
                });
            this.$sotdSection = $div.children().length ? $div : null;
        }
        if (!this.$sotdSection)
            this.error(
                {
                    name: 'generic.sotd',
                    section: 'document-status',
                    rule: 'sotd',
                },
                'not-found'
            );
        return this.$sotdSection;
    }

    /**
     * @param $dl Optional Cheerio-wrapped dl element.
     *   If not set, extractHeaders() uses the current document to extract headers link and cache them for future use.
     *   If set, assume data is being extracted from another document; the new element will be used and the result will not be cached.
     */
    extractHeaders($dl?: Cheerio<Element>) {
        const dts: HeaderMap = {};
        const EDITORS = /^editor(s)?$/;
        const EDITORS_DRAFT = /^(latest )?editor's draft$/i;

        if (!$dl && typeof this.headers !== 'undefined') return this.headers;

        $dl = $dl || this.$('body div.head dl');

        if ($dl && $dl.length) {
            $dl.find('dt').each((idx, dt) => {
                const $dt = this.$(dt);
                const txt = this.norm($dt.text())
                    .replace(':', '')
                    .toLowerCase()
                    .replace('published ', '');
                let $dd = $dt.next('dd');
                let key = null;
                if (!$dd.length)
                    return this.throw(
                        `No &lt;dd&gt; element found for ${txt}.`
                    );
                if (txt === 'this version') key = 'This';
                else if (
                    !dts.Latest &&
                    txt.lastIndexOf('latest version', 0) === 0
                )
                    key = 'Latest';
                else if (/^history$/.test(txt)) key = 'History';
                else if (/^rescinds this recommendation?$/.test(txt))
                    key = 'Rescinds';
                else if (/^implementation report?$/.test(txt))
                    key = 'Implementation';
                else if (/^feedback$/.test(txt)) {
                    // feedback link can be multi-lines
                    key = 'Feedback';
                    $dd = $dt.nextUntil('dt', 'dd');
                } else if (/^errata?$/.test(txt)) key = 'Errata';
                if (EDITORS_DRAFT.test(txt) && $dd.find('a').length)
                    key = 'EditorDraft';
                if (EDITORS.test(txt)) {
                    key = 'Editor';
                    $dd = $dt.nextUntil('dt', 'dd');
                }
                if (key) dts[key] = { pos: idx, $el: $dt, $dd };
            });
        }
        this.headers = dts;
        return dts;
    }

    getShortname() {
        if (typeof this.shortname !== 'undefined') return this.shortname;

        let shortname;
        const dts = this.extractHeaders();
        const $linkThis = dts.This ? dts.This.$dd.find('a') : null;
        const linkThisHref = $linkThis?.attr('href')?.trim() || '';
        const thisVersionMatches =
            linkThisHref && linkThisHref.match(/.*\/[^/-]+-(.*)-\d{8}\/$/);
        if (thisVersionMatches && thisVersionMatches.length > 0)
            [, shortname] = thisVersionMatches;

        this.shortname = shortname;
        return shortname;
    }

    /**
     * Attempts to extract all the dates from the SOTD.
     * Only the dates after date of the doc and prior to one year later
     * are extracted. If there is only one, there is a good chance that it's
     * the deadline for feedback.
     */
    getFeedbackDueDate() {
        const $sotd = this.getSotDSection();
        const dates = { list: [] as Date[], valid: [] as Date[] };
        if ($sotd) {
            const txt = this.norm($sotd.text());
            const rex = new RegExp(Specberus.dateRegexStrCapturing, 'g');
            const docDate = this.getDocumentDate()!;
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
                    if (typeof d !== 'undefined' && +d >= lowBound) {
                        dates.list.push(d);
                        if (+d < highBound) dates.valid.push(d);
                    }
                }
            }
        }
        return dates;
    }

    // Return array of group names, e.g. ['Internationalization Working Group', 'Technical Architecture Group']
    getDelivererNames() {
        const $sotd = this.getSotDSection();
        const delivererNamesRegex =
            /This document was (?:produced|published) by the (.+? Working Group|.+? Interest Group|Technical Architecture Group|Advisory Board)( and the (.+? Working Group|.+? Interest Group|Technical Architecture Group|Advisory Board))? as/;

        const text = this.norm($sotd!.text());
        const matches = text.match(delivererNamesRegex);
        const groups = [];
        if (matches) {
            groups.push(matches[1]);
            if (matches[3]) groups.push(matches[3]);
        }
        return groups;
    }

    /**
     * Retrieves deliverers groupNames and types.
     */
    async getDelivererGroups() {
        if (typeof this.delivererGroups !== 'undefined')
            return this.delivererGroups;
        const REGEX_DELIVERER_URL =
            /^https?:\/\/www\.w3\.org\/2004\/01\/pp-impl\/(\d+)\/status(#.*)?$/i;
        const REGEX_DELIVERER_TEXT =
            /^(charter|public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?)$/i;
        const REGEX_TAG_DISCLOSURE =
            /https?:\/\/www.w3.org\/2001\/tag\/disclosures/;
        const REGEX_DELIVERER_IPR_URL =
            /^https:\/\/www\.w3\.org\/groups\/([^/]+)\/([^/]+)\/ipr\/?(#.*)?$/i;

        const $sotd = this.getSotDSection();
        const $sotdLinks = $sotd && $sotd.find('a[href]');
        const promiseArray: Promise<any>[] = [];
        let ids = [];
        const delivererGroups: DelivererGroup[] = [];

        // getDataDelivererIDs first, apply if document is Note/Registry track.
        ids = this.getDataDelivererIDs() || [];
        // For rec-track
        if (ids.length === 0 && $sotdLinks && $sotdLinks.length > 0) {
            $sotdLinks.each((_, el) => {
                const $el = this.$(el);
                const href = $el.attr('href')!;
                const text = this.norm($el.text());
                const found: Record<string, boolean> = {};

                if (REGEX_DELIVERER_TEXT.test(text)) {
                    if (REGEX_DELIVERER_IPR_URL.test(href)) {
                        // get group shortnames directly
                        const [, type, shortname] =
                            REGEX_DELIVERER_IPR_URL.exec(href)!;
                        delivererGroups.push({
                            groupShortname: shortname,
                            groupType: type,
                        });
                    } else {
                        // get group shortnames through groupId
                        const delivererUrlMatch =
                            href.match(REGEX_DELIVERER_URL);
                        if (delivererUrlMatch) {
                            const id = delivererUrlMatch[1];
                            if (id && id.length > 1 && !found[id]) {
                                found[id] = true;
                                ids.push(parseInt(id, 10));
                            }
                        } else if (REGEX_TAG_DISCLOSURE.test(href)) {
                            ids.push(TAG.id);
                        }
                    }
                }
            });
        }

        // send request to W3C API if there's id extracted from the doc.
        for (let i = 0; i < ids.length; i += 1) {
            const groupApiUrl = `https://api.w3.org/groups/${ids[i]}`;
            promiseArray.push(
                new Promise(resolve => {
                    get(groupApiUrl)
                        .set('User-Agent', `W3C-Pubrules/${pkg.version}`)
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
    }

    async getDelivererIDs() {
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
            /^https:\/\/www\.w3\.org\/groups\/([^/]+)\/([^/]+)\/ipr\/?(#.*)?$/i;
        const ids: number[] = this.getDataDelivererIDs() || [];
        const $sotd = this.getSotDSection();
        const $sotdLinks = $sotd && $sotd.find('a[href]');
        const promiseArray: Promise<any>[] = [];

        if (ids.length === 0 && $sotdLinks && $sotdLinks.length > 0) {
            $sotdLinks.each((_, el) => {
                const $el = this.$(el);
                const href = $el.attr('href')!;
                const text = this.norm($el.text());
                const found: Record<string, boolean> = {};
                if (REGEX_DELIVERER_TEXT.test(text)) {
                    const delivererUrlMatch = href.match(REGEX_DELIVERER_URL);
                    if (delivererUrlMatch) {
                        const id = delivererUrlMatch[1];
                        if (id && id.length > 1 && !found[id]) {
                            found[id] = true;
                            ids.push(parseInt(id, 10));
                        }
                    } else if (REGEX_TAG_DISCLOSURE.test(href)) {
                        ids.push(TAG.id);
                    } else if (REGEX_DELIVERER_IPR_URL.test(href)) {
                        const [, type, shortname] =
                            REGEX_DELIVERER_IPR_URL.exec(href)!;
                        const groupApiUrl = `https://api.w3.org/groups/${type}/${shortname}`;
                        promiseArray.push(
                            new Promise(resolve => {
                                get(groupApiUrl)
                                    .set(
                                        'User-Agent',
                                        `W3C-Pubrules/${pkg.version}`
                                    )
                                    .end((err: any, data) => {
                                        resolve(data);
                                    });
                            })
                        );
                    }
                }
            });

            await Promise.all(promiseArray).then(res => {
                for (const data of res) {
                    if (data?.body?.id) ids.push(data.body.id);
                }
            });
        }
        this.delivererIDs = ids;
        return ids;
    }

    getDataDelivererIDs() {
        const ids: number[] = [];
        const $sotd = this.getSotDSection();
        const $deliver = $sotd && $sotd.find('[data-deliverer]');
        if ($deliver && $deliver.length > 0) {
            $deliver.each((_, el) => {
                const deliverers = el.attribs['data-deliverer']
                    .trim()
                    .split(/[,\s]+/);
                deliverers.forEach(id => {
                    if (/\d+/.test(id)) ids.push(parseInt(id, 10));
                });
            });
        }
        return ids;
    }

    /** Finds the current charter(s) of the document. */
    async getChartersData() {
        if (undefined !== this.chartersData) return this.chartersData;

        const deliverers = await this.getDelivererIDs();
        const docDate = this.getDocumentDate()!;
        const chartersData: ApiCharter[] = [];
        if (deliverers.length) {
            const delivererPromises: Promise<ApiCharter[]>[] = [];
            const AbID = AB.id;
            // Get charter data from W3C API
            // deliverers.forEach is for joint publication.
            deliverers.forEach(deliverer => {
                // Skip finding charter for the TAG which doesn't have any charter
                if (deliverer === TAG.id || deliverer === AbID) return;

                delivererPromises.push(
                    new Promise(resolve => {
                        w3cApi
                            .group(deliverer)
                            .charters()
                            .fetch(
                                { embed: true },
                                (err: any, charters: ApiCharter[]) => {
                                    resolve(charters);
                                }
                            );
                    })
                );
            });

            // groups -> group is for joint publication.
            for (const groupCharters of await Promise.all(delivererPromises)) {
                if (groupCharters) {
                    for (const groupCharter of groupCharters) {
                        if (
                            docDate >= new Date(groupCharter.start) &&
                            docDate <= new Date(groupCharter.end)
                        ) {
                            chartersData.push(groupCharter);
                        }
                    }
                }
            }
        }

        this.chartersData = chartersData;
        return chartersData;
    }

    async getCharters() {
        if (typeof this.charters !== 'undefined') return this.charters;

        this.charters = (await this.getChartersData()).map(({ uri }) => uri);
        return this.charters;
    }

    /**
     * Checks if this document is a FP document.
     * For shortname change document, data-previous-shortname attribute is needed.
     */
    async isFP() {
        if (typeof this.isFirstPublic === 'undefined')
            return this.isFirstPublic;

        this.isFirstPublic = !(await this.getPreviousVersion());
        return this.isFirstPublic;
    }

    /**
     * Gets previous version link from API via shortname.
     */
    async getPreviousVersion() {
        const dts = this.extractHeaders();
        const shortname = this.shortname || (await this.getShortname());

        if (!shortname) {
            this.error(
                {
                    name: 'generic-shortname',
                    section: 'front-matter',
                    rule: 'docIDThisVersion',
                },
                'not-found'
            );
            return;
        }

        const shortnameHistory = await new Promise<
            ApiSpecificationVersion[] | null
        >(resolve => {
            w3cApi
                .specification(shortname)
                .versions()
                .fetch(
                    { embed: true, items: 1000 },
                    (err: any, data: ApiSpecificationVersion[]) => {
                        if (err && err.status === 404) {
                            // check if it's not a shortname change
                            const shortnameChange = dts.History
                                ? dts.History.$dd
                                      .find('a')
                                      .attr('data-previous-shortname')
                                : null;
                            if (shortnameChange) {
                                w3cApi
                                    .specification(shortnameChange)
                                    .versions()
                                    .fetch(
                                        { embed: true, items: 1000 },
                                        (
                                            err: any,
                                            data: ApiSpecificationVersion[]
                                        ) => {
                                            resolve(data);
                                        }
                                    );
                            } else {
                                resolve(null);
                            }
                        } else {
                            resolve(data);
                        }
                    }
                );
        });
        const versions = shortnameHistory || [];
        const linkThis = dts.This ? dts.This.$dd.find('a').attr('href') : '';

        if (versions.length && linkThis) {
            const versionUris = versions.map(({ uri }) => uri);
            const index = versionUris.indexOf(linkThis);
            return index === -1 ? versionUris[0] : versionUris[index + 1];
        }
    }

    loadURL(url: string, cb: (err: any, $?: CheerioAPI) => void) {
        if (!cb) return this.throw('Missing callback to loadURL.');
        get(url)
            .set('User-Agent', `W3C-Pubrules/${pkg.version}`)
            .end((err, res) => {
                if (err) return this.throw(err.message);
                if (!res.text) return this.throw(`Body of ${url} is empty.`);
                this.url = url;
                this.loadSource(res.text, cb);
            });
    }

    loadSource(src: string, cb: (err: Error | null, $?: CheerioAPI) => void) {
        if (!cb) return this.throw('Missing callback to loadSource.');
        this.source = src;
        let $: CheerioAPI;
        try {
            $ = load(src);
        } catch (e) {
            return this.throw(
                `Cheerio failed to parse source: ${JSON.stringify(e)}`
            );
        }
        cb(null, $);
    }

    loadFile(file: string, cb: (err: any, $?: CheerioAPI) => void) {
        if (!cb) return this.throw('Missing callback to loadFile.');
        fs.access(file, fs.constants.F_OK, errors => {
            if (errors) return cb(`File '${file}' not found.`);
            fs.readFile(file, { encoding: 'utf8' }, (err, src) => {
                if (err) return cb(err);
                this.loadSource(src, cb);
            });
        });
    }

    transition(options: TransitionOptions) {
        if (this.getDocumentDate()! < options.from) options.doBefore();
        else if (this.getDocumentDate()! > options.to) options.doAfter();
        else options.doMeanwhile();
    }

    getRecMetadata(meta: RecMetadata = {}) {
        const sotdText = this.norm(this.getSotDSection()!.text());

        // proposed corrections, proposed additions, proposed amendments:
        const { SOTD_P_COR, SOTD_P_ADD, SOTD_P_COR_ADD } = REC_TEXT;
        if (sotdText.match(new RegExp(`${SOTD_P_COR}|${SOTD_P_COR_ADD}`, 'i')))
            meta.pSubChanges = true;
        if (sotdText.match(new RegExp(`${SOTD_P_ADD}|${SOTD_P_COR_ADD}`, 'i')))
            meta.pNewFeatures = true;

        // candidate corrections, candidate additions, candidate amendments:
        const { SOTD_C_COR, SOTD_C_ADD, SOTD_C_COR_ADD } = REC_TEXT;
        if (sotdText.match(new RegExp(`${SOTD_C_COR}|${SOTD_C_COR_ADD}`, 'i')))
            meta.cSubChanges = true;
        if (sotdText.match(new RegExp(`${SOTD_C_ADD}|${SOTD_C_COR_ADD}`, 'i')))
            meta.cNewFeatures = true;

        return meta;
    }
}
