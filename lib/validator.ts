/**
 * @file Main file of the Specberus npm package.
 */

import EventEmitter from 'events';
import { access, constants, readFile } from 'fs/promises';

import { type Cheerio, load } from 'cheerio';
import type { Element } from 'domhandler';
// @ts-ignore (no typings)
import w3cApi from 'node-w3capi';

import { hasExceptions } from './exceptions.js';
import { assembleData, setLanguage } from './l10n.js';
import * as profileMetadata from './profiles/metadata.js';
import * as profileAdditionalMetadata from './profiles/additionalMetadata.js';
import { get } from './throttled-ua.js';
import { AB, processParams, REC_TEXT, specberusVersion, TAG } from './util.js';
import type {
    ApiCharter,
    HandlerMessage,
    RuleBase,
    ApiSpecificationVersion,
    RecMetadata,
    RuleMeta,
    SpecberusConfig,
    ProfileModule,
} from './types.js';

setLanguage('en_GB');

interface BaseOptions {
    events?: EventEmitter;
    file?: string;
    source?: string;
    url?: string;
}

interface ExtractMetadataOptions extends BaseOptions {
    additionalMetadata?: boolean;
}

export interface ValidateOptions extends BaseOptions {
    profile: ProfileModule;
    validation?: 'no-validation' | 'recursive';
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

interface TransitionBaseOptions {
    doMeanwhile: () => void;
}

interface TransitionFromOptions {
    doBefore: () => void;
    from: Date;
}

interface TransitionToOptions {
    doAfter: () => void;
    to: Date;
}

type TransitionOptions =
    | (TransitionBaseOptions & TransitionFromOptions)
    | (TransitionBaseOptions & TransitionToOptions)
    | (TransitionBaseOptions & TransitionFromOptions & TransitionToOptions);

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

interface ExceptionsErrorOptions extends ErrorOptions {
    exceptions: string[];
}

export interface SpecberusResult {
    errors: HandlerMessage[];
    info: HandlerMessage[];
    metadata: Record<string, any>;
    success: boolean;
    warnings: HandlerMessage[];
}

/**
 * Error which includes list of exception messages,
 * thrown in case of unexpected errors during extractMetadata or validate
 */
export class ExceptionsError extends Error {
    exceptions: string[];

    constructor(message?: string, options?: ExceptionsErrorOptions) {
        super(message, options);
        this.exceptions = options?.exceptions || [];
    }
}

export class Specberus {
    $ = load('');
    config: SpecberusConfig | undefined;
    // TODO(kgf): This is publicly documented, but is unused within the codebase;
    // it would be better exposed as a Promise return value from extractMetadata
    meta: Record<string, any> | undefined;
    source: string | undefined;
    url: string | undefined;
    version = specberusVersion;

    // Private fields

    #$docDateEl: Cheerio<Element> | undefined;
    #$sotdSection: Cheerio<Element> | null | undefined;
    /** Group objects returned by W3C API charters endpoint */
    #chartersData: ApiCharter[] | undefined;
    /** Charter URIs */
    #charters: string[] | undefined;
    #delivererIDs: number[] | undefined;
    #delivererGroups: DelivererGroup[] | undefined;
    #docDate: Date | undefined;
    /** Stores messages from any unexpected errors encountered during process */
    #exceptions: string[] = [];
    #headers: HeaderMap | undefined;
    #isFirstPublic: any | undefined;
    #shortname: string | undefined = undefined;
    #sink: EventEmitter | undefined;

    /**
     * Handles common end-state logic for both extractMetadata and validate,
     * returning results (resolving) or throwing an error if exceptions occurred (rejecting).
     */
    #reportResult(result: Omit<SpecberusResult, 'success'>): SpecberusResult {
        if (this.#exceptions.length) {
            throw new ExceptionsError(
                'The following unexpected errors occurred:\n' +
                    this.#exceptions.join('\n'),
                { exceptions: this.#exceptions }
            );
        }
        return {
            ...result,
            success: !result.errors.length,
        };
    }

    async extractMetadata(options: ExtractMetadataOptions) {
        const sink = (this.#sink = options.events || new EventEmitter());

        const metadata: Record<string, any> = (this.meta = {});
        const errors: HandlerMessage[] = [];
        const warnings: HandlerMessage[] = [];
        const info: HandlerMessage[] = [];
        sink.on('err', data => {
            errors.push(data);
        });
        sink.on('warning', data => {
            warnings.push(data);
        });
        sink.on('info', data => {
            info.push(data);
        });

        try {
            this.$ = await this.#load(options);
        } catch (error) {
            this.#throw(error.toString());
            throw error;
        }

        const profile = options.additionalMetadata
            ? profileAdditionalMetadata
            : profileMetadata;
        await Promise.all(
            profile.rules.map(async rule => {
                try {
                    const result = await rule.check(this);
                    if (result)
                        for (const [key, value] of Object.entries(result))
                            metadata[key] = value;
                    sink.emit('done', rule.name);
                } catch (error) {
                    this.#throw(error.message);
                }
            })
        );

        return this.#reportResult({ errors, warnings, info, metadata });
    }

    async validate(options: ValidateOptions) {
        if (!options.profile)
            throw new Error('Without a profile there is nothing to check.');

        const sink = (this.#sink = options.events || new EventEmitter());
        const { profile } = options;
        this.config = await processParams(options, profile.config);
        const errors: HandlerMessage[] = [];
        const warnings: HandlerMessage[] = [];
        const info: HandlerMessage[] = [];
        sink.on('err', (...data) => {
            errors.push(Object.assign({}, ...data));
        });
        sink.on('warning', (...data) => {
            warnings.push(Object.assign({}, ...data));
        });
        sink.on('info', (...data) => {
            info.push(Object.assign({}, ...data));
        });

        this.$ = await this.#load(options);

        await Promise.all(
            profile.rules.map(async rule => {
                try {
                    await rule.check(this);
                    sink.emit('done', rule.name);
                } catch (error) {
                    this.#throw(error.message);
                }
            })
        );

        return this.#reportResult({ errors, warnings, info, metadata: {} });
    }

    error(rule: RuleBase | RuleMeta, key: string, extra?: Record<string, any>) {
        const name = typeof rule === 'string' ? rule : rule.name;
        const shortname = this.getShortname();
        if (
            typeof shortname !== 'undefined' &&
            hasExceptions(shortname, name, extra)
        )
            this.warning(rule, key, extra);
        else
            this.#sink!.emit('err', rule, {
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
        this.#sink!.emit('warning', rule, {
            key,
            extra,
            detailMessage: assembleData(null, rule, key, extra).message,
        });
    }

    info(rule: RuleBase | RuleMeta, key: string, extra?: Record<string, any>) {
        this.#sink!.emit('info', rule, {
            key,
            extra,
            detailMessage: assembleData(null, rule, key, extra).message,
        });
    }

    /**
     * Emits an exception event, intended to signify that the process stopped on a critical error.
     *
     * NOTE: This should not be called from rules; they should throw an Error,
     * which will result in extractMetadata or validate invoking this method.
     */
    #throw(message: string) {
        console.error(`[EXCEPTION] ${message}`);
        this.#sink!.emit('exception', { message });
        // Track in exceptions array, used to determine whether to resolve or reject process
        this.#exceptions.push(message);
    }

    /**
     * Checks for presence of a selector.
     * Reports a not-found error for the specified rule if no match is found.
     */
    checkSelector(sel: string, rule: RuleMeta) {
        try {
            if (!this.$(sel).length) this.error(rule, 'not-found');
        } catch (e) {
            throw new Error(`Invalid selector '${sel}': ${e}`);
        }
    }

    /**
     * Normalizes a string by removing leading/trailing whitespace
     * and condensing multiple consecutive whitespace characters to one.
     */
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
        if (this.#docDate) return this.#docDate;
        const rex = new RegExp(
            `${Specberus.dateRegexStrCapturing}(?:, edited in place ${Specberus.dateRegexStrNonCapturing})?$`
        );
        const $el = this.$('#w3c-state');

        const matches = $el.length && this.norm($el.text()).match(rex);
        if (matches) {
            this.#docDate = this.stringToDate(
                `${matches[1]} ${matches[2]} ${matches[3]}`
            );
            this.#$docDateEl = $el;
        }
        return this.#docDate;
    }

    getDocumentStateElement() {
        if (this.#$docDateEl) return this.#$docDateEl;
        this.getDocumentDate();
        return this.#$docDateEl;
    }

    getSotDSection() {
        if (typeof this.#$sotdSection !== 'undefined')
            return this.#$sotdSection;

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
        if (!startH2) this.#$sotdSection = null;
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
            this.#$sotdSection = $div.children().length ? $div : null;
        }
        if (!this.#$sotdSection)
            this.error(
                {
                    name: 'generic.sotd',
                    section: 'document-status',
                    rule: 'sotd',
                },
                'not-found'
            );
        return this.#$sotdSection;
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

        if (!$dl && typeof this.#headers !== 'undefined') return this.#headers;

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
                    throw new Error(`No &lt;dd&gt; element found for ${txt}.`);
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
        this.#headers = dts;
        return dts;
    }

    getShortname() {
        if (typeof this.#shortname !== 'undefined') return this.#shortname;

        let shortname;
        const dts = this.extractHeaders();
        const $linkThis = dts.This ? dts.This.$dd.find('a') : null;
        const linkThisHref = $linkThis?.attr('href')?.trim() || '';
        const thisVersionMatches =
            linkThisHref && linkThisHref.match(/.*\/[^/-]+-(.*)-\d{8}\/$/);
        if (thisVersionMatches && thisVersionMatches.length > 0)
            [, shortname] = thisVersionMatches;

        this.#shortname = shortname;
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
        if (typeof this.#delivererGroups !== 'undefined')
            return this.#delivererGroups;
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
        for (const id of ids) {
            const groupApiUrl = `https://api.w3.org/groups/${id}`;
            promiseArray.push(
                get(groupApiUrl).set(
                    'User-Agent',
                    `W3C-Pubrules/${specberusVersion}`
                )
            );
        }

        await Promise.all(promiseArray).then(responses => {
            for (const data of responses) {
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
        this.#delivererGroups = delivererGroups;
        return delivererGroups;
    }

    async getDelivererIDs() {
        if (undefined !== this.#delivererIDs) {
            return this.#delivererIDs;
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
                                        `W3C-Pubrules/${specberusVersion}`
                                    )
                                    .end((_: any, data) => {
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
        this.#delivererIDs = ids;
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
        if (undefined !== this.#chartersData) return this.#chartersData;

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
                                (_: any, charters: ApiCharter[]) => {
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

        this.#chartersData = chartersData;
        return chartersData;
    }

    async getCharters() {
        if (typeof this.#charters !== 'undefined') return this.#charters;

        this.#charters = (await this.getChartersData()).map(({ uri }) => uri);
        return this.#charters;
    }

    /**
     * Checks if this document is a FP document.
     * For shortname change document, data-previous-shortname attribute is needed.
     */
    async isFP() {
        if (typeof this.#isFirstPublic !== 'undefined')
            return this.#isFirstPublic;

        this.#isFirstPublic = !(await this.getPreviousVersion());
        return this.#isFirstPublic;
    }

    /**
     * Gets previous version link from API via shortname.
     */
    async getPreviousVersion() {
        const dts = this.extractHeaders();
        const shortname = this.#shortname || (await this.getShortname());

        if (!shortname) {
            this.error(
                {
                    name: 'generic.shortname',
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
                                            _: any,
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

    #load(options: ExtractMetadataOptions | ValidateOptions) {
        if (options.url) return this.#loadURL(options.url);
        if (options.source) return this.#loadSource(options.source);
        if (options.file) return this.#loadFile(options.file);
        throw new Error('url, source, or file must be specified.');
    }

    #loadURL(url: string) {
        return get(url)
            .set('User-Agent', `W3C-Pubrules/${specberusVersion}`)
            .then(res => {
                if (!res.text) throw new Error(`Body of ${url} is empty.`);
                this.url = url;
                return this.#loadSource(res.text);
            });
    }

    #loadSource(src: string) {
        this.source = src;
        try {
            return load(src);
        } catch (e) {
            throw new Error(
                `Cheerio failed to parse source: ${JSON.stringify(e)}`
            );
        }
    }

    async #loadFile(file: string) {
        try {
            access(file, constants.F_OK);
        } catch (error) {
            throw new Error(`File '${file}' not found or inaccessible.`);
        }
        return this.#loadSource(await readFile(file, 'utf8'));
    }

    transition(options: TransitionOptions) {
        const documentDate = this.getDocumentDate();
        if (documentDate && 'from' in options && documentDate < options.from)
            options.doBefore();
        else if (documentDate && 'to' in options && documentDate > options.to)
            options.doAfter();
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
