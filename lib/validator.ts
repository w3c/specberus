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
    ApiSpecificationVersion,
    HandlerMessage,
    ProfileModule,
    RecMetadata,
    RuleBase,
    RuleMeta,
    SpecberusConfig,
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

// Regular expressions used by getDelivererIDs and getDelivererGroups

const REGEX_DELIVERER_URL =
    /^https?:\/\/www\.w3\.org\/2004\/01\/pp-impl\/(\d+)\/status(#.*)?$/i;
const REGEX_DELIVERER_TEXT =
    /^(charter|public\s+list\s+of\s+any\s+patent\s+disclosures(\s+\(.+\))?)$/i;
const REGEX_TAG_DISCLOSURE = /https?:\/\/www.w3.org\/2001\/tag\/disclosures/;
const REGEX_DELIVERER_IPR_URL =
    /^https:\/\/www\.w3\.org\/groups\/([^/]+)\/([^/]+)\/ipr\/?(#.*)?$/i;

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

type SpecberusMessageEventArgs = [
    RuleMeta | RuleBase,
    {
        detailMessage: string;
        extra?: Record<string, any>;
        key: string;
    },
];

interface SpecberusEvents {
    done: [string];
    err: SpecberusMessageEventArgs;
    exception: [{ message: string }];
    info: SpecberusMessageEventArgs;
    warning: SpecberusMessageEventArgs;
}

export class Specberus extends EventEmitter<SpecberusEvents> {
    $ = load('');
    config: SpecberusConfig | undefined;
    source: string | undefined;
    url: string | undefined;
    version = specberusVersion;

    // Private fields

    #$docDateEl: Cheerio<Element> | undefined;
    #$sotdSection: Cheerio<Element> | null | undefined;
    /** Group objects returned by W3C API charters endpoint */
    #chartersData: [] | Promise<ApiCharter[]> | undefined;
    /** Charter URIs */
    #charters: string[] | undefined;
    #delivererIDs: number[] | Promise<number[]> | undefined;
    #delivererGroups: Promise<DelivererGroup[]> | undefined;
    #docDate: Date | undefined;
    /** Stores messages from any unexpected errors encountered during process */
    #exceptions: string[] = [];
    #headers: HeaderMap | undefined;
    #isFirstPublic: any | undefined;
    #previousVersion: Promise<string | null> | undefined;
    #shortname: string | undefined = undefined;

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
        const metadata: Record<string, any> = {};
        const errors: HandlerMessage[] = [];
        const warnings: HandlerMessage[] = [];
        const info: HandlerMessage[] = [];
        this.on('err', (rule, data) => {
            errors.push({ ...rule, ...data });
        });
        this.on('warning', (rule, data) => {
            warnings.push({ ...rule, ...data });
        });
        this.on('info', (rule, data) => {
            info.push({ ...rule, ...data });
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
                    this.emit('done', rule.name);
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

        const { profile } = options;
        this.config = await processParams(options, profile.config);
        const errors: HandlerMessage[] = [];
        const warnings: HandlerMessage[] = [];
        const info: HandlerMessage[] = [];
        this.on('err', (rule, data) => {
            errors.push({ ...rule, ...data });
        });
        this.on('warning', (rule, data) => {
            warnings.push({ ...rule, ...data });
        });
        this.on('info', (rule, data) => {
            info.push({ ...rule, ...data });
        });

        this.$ = await this.#load(options);

        await Promise.all(
            profile.rules.map(async rule => {
                try {
                    await rule.check(this);
                    this.emit('done', rule.name);
                } catch (error) {
                    this.#throw(error.message);
                }
            })
        );

        return this.#reportResult({ errors, warnings, info, metadata: {} });
    }

    error(rule: RuleBase | RuleMeta, key: string, extra?: Record<string, any>) {
        const shortname = this.getShortname();
        if (
            typeof shortname !== 'undefined' &&
            hasExceptions(shortname, rule.name, extra)
        )
            this.warning(rule, key, extra);
        else
            this.emit('err', rule, {
                key,
                ...(extra && { extra }),
                detailMessage: assembleData(null, rule, key, extra).message,
            });
    }

    warning(
        rule: RuleBase | RuleMeta,
        key: string,
        extra?: Record<string, any>
    ) {
        this.emit('warning', rule, {
            key,
            ...(extra && { extra }),
            detailMessage: assembleData(null, rule, key, extra).message,
        });
    }

    info(rule: RuleBase | RuleMeta, key: string, extra?: Record<string, any>) {
        this.emit('info', rule, {
            key,
            ...(extra && { extra }),
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
        this.emit('exception', { message });
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
        if (this.#$sotdSection) return this.#$sotdSection;

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

    extractHeaders() {
        if (this.#headers) return this.#headers;

        const dts: HeaderMap = {};
        const EDITORS = /^editor(s)?$/;
        const EDITORS_DRAFT = /^(latest )?editor's draft$/i;
        const $dl = this.$('body div.head dl');

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
        if (this.#delivererGroups) return this.#delivererGroups;

        const $sotd = this.getSotDSection();
        const $sotdLinks = $sotd && $sotd.find('a[href]');
        const delivererGroups: DelivererGroup[] = [];

        // getDataDelivererIDs first, apply if document is Note/Registry track.
        const ids = this.getDataDelivererIDs();
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

        // Send request to W3C API if there's ids extracted from the doc.
        // Cache the promise (to avoid duplicate requests)
        this.#delivererGroups = Promise.all([
            ...delivererGroups, // Any immediately-resolvable groups from links
            ...ids.map(id => {
                const groupApiUrl = `https://api.w3.org/groups/${id}`;
                return get(groupApiUrl)
                    .set('User-Agent', `W3C-Pubrules/${specberusVersion}`)
                    .then(
                        res => {
                            if (!res.body) return;
                            const { shortname, type } = res.body;
                            let groupType = 'other';
                            if (type === 'working group') groupType = 'wg';
                            else if (type === 'interest group')
                                groupType = 'ig';

                            return {
                                groupShortname: shortname,
                                groupType,
                            };
                        },
                        () => {}
                    );
            }),
        ]).then(groups => groups.filter(group => !!group));
        return this.#delivererGroups;
    }

    async getDelivererIDs() {
        if (this.#delivererIDs) return this.#delivererIDs;

        const ids: number[] = this.getDataDelivererIDs() || [];
        const $sotd = this.getSotDSection();
        const $sotdLinks = $sotd && $sotd.find('a[href]');

        if (ids.length > 0 || !$sotdLinks?.length) {
            this.#delivererIDs = ids;
            return ids;
        }

        const promiseArray: (number | Promise<number>)[] = [];
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
                        promiseArray.push(parseInt(id, 10));
                    }
                } else if (REGEX_TAG_DISCLOSURE.test(href)) {
                    promiseArray.push(TAG.id);
                } else if (REGEX_DELIVERER_IPR_URL.test(href)) {
                    const [, type, shortname] =
                        REGEX_DELIVERER_IPR_URL.exec(href)!;
                    const groupApiUrl = `https://api.w3.org/groups/${type}/${shortname}`;
                    promiseArray.push(
                        get(groupApiUrl)
                            .set(
                                'User-Agent',
                                `W3C-Pubrules/${specberusVersion}`
                            )
                            .then(
                                res => res.body?.id,
                                () => {}
                            )
                    );
                }
            }
        });

        // Cache the promise (to avoid duplicate requests)
        this.#delivererIDs = Promise.all(promiseArray).then(ids =>
            ids.filter(id => typeof id !== 'undefined')
        );
        return this.#delivererIDs;
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
        if (this.#chartersData) return this.#chartersData;

        const deliverers = await this.getDelivererIDs();
        if (!deliverers.length) {
            this.#chartersData = [];
            return this.#chartersData;
        }

        const docDate = this.getDocumentDate()!;
        const delivererPromises: Promise<ApiCharter[]>[] = [];
        // Get charter data from W3C API
        // deliverers.forEach is for joint publication.
        deliverers.forEach(deliverer => {
            // Skip finding charter for the TAG which doesn't have any charter
            if (deliverer === TAG.id || deliverer === AB.id) return;

            delivererPromises.push(
                w3cApi
                    .group(deliverer)
                    .charters()
                    .fetch({ embed: true })
                    .then(
                        (groupCharters: ApiCharter[]) => {
                            if (!groupCharters) return;
                            return groupCharters.filter(
                                groupCharter =>
                                    docDate >= new Date(groupCharter.start) &&
                                    docDate <= new Date(groupCharter.end)
                            );
                        },
                        () => {}
                    )
            );
        });

        this.#chartersData = Promise.all(delivererPromises).then(lists =>
            lists.flat().filter(charter => !!charter)
        );
        return this.#chartersData;
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
        if (typeof this.#previousVersion !== 'undefined')
            return this.#previousVersion;

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

        const shortnameHistory: Promise<ApiSpecificationVersion[] | undefined> =
            w3cApi
                .specification(shortname)
                .versions()
                .fetch({ embed: true, items: 1000 })
                .catch((err: any) => {
                    if (err.status === 404) {
                        // check if it's not a shortname change
                        const shortnameChange = dts.History
                            ? dts.History.$dd
                                  .find('a')
                                  .attr('data-previous-shortname')
                            : null;
                        if (shortnameChange) {
                            return w3cApi
                                .specification(shortnameChange)
                                .versions()
                                .fetch({ embed: true, items: 1000 })
                                .catch(() => {});
                        }
                    }
                });

        // Cache the promise (to avoid duplicate requests)
        this.#previousVersion = shortnameHistory.then(history => {
            const versions = history || [];
            const linkThis = dts.This
                ? dts.This.$dd.find('a').attr('href')
                : '';

            if (versions.length && linkThis) {
                const versionUris = versions.map(({ uri }) => uri);
                const index = versionUris.indexOf(linkThis);
                return index === -1 ? versionUris[0] : versionUris[index + 1];
            }
            return null;
        });
        return this.#previousVersion;
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
