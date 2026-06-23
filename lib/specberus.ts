/**
 * @file Main file of the Specberus npm package.
 */

import EventEmitter from 'events';
import { access, constants, readFile } from 'fs/promises';

import { load } from 'cheerio';
// @ts-ignore (no typings)
import w3cApi from 'node-w3capi';

import { setLanguage } from './l10n.js';
import * as profileMetadata from './profiles/metadata.js';
import * as profileAdditionalMetadata from './profiles/additionalMetadata.js';
import { get } from './throttled-ua.js';
import { processParams, specberusVersion } from './util.js';
import type {
    HandlerMessage,
    ProfileModule,
    RuleBase,
    RuleMeta,
} from './types.js';
import { RuleContext } from './rule-context.js';

setLanguage('en_GB');

interface BaseOptions {
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
    source: string | undefined;
    url: string | undefined;
    version = specberusVersion;

    /** Stores messages from any unexpected errors encountered during process */
    #exceptions: string[] = [];

    /**
     * Internal function for handling common end-state logic for extractMetadata and validate,
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

    /** Internal function containing setup logic common to both extractMetadata and validate. */
    async #prepare(options: ExtractMetadataOptions | ValidateOptions) {
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
            const $ = await this.#load(options);
            return { $, errors, info, warnings };
        } catch (error) {
            this.#throw(error.toString());
            throw error;
        }
    }

    async extractMetadata(options: ExtractMetadataOptions) {
        const { $, ...messages } = await this.#prepare(options);
        const metadata: Record<string, any> = {};
        const profile = options.additionalMetadata
            ? profileAdditionalMetadata
            : profileMetadata;
        const ruleContext = new RuleContext(this, $);

        await Promise.all(
            profile.rules.map(async rule => {
                try {
                    const result = await rule.check(ruleContext);
                    if (result)
                        for (const [key, value] of Object.entries(result))
                            metadata[key] = value;
                } catch (error) {
                    this.#throw(error.message);
                } finally {
                    this.emit('done', rule.name);
                }
            })
        );
        return this.#reportResult({ ...messages, metadata });
    }

    async validate(options: ValidateOptions) {
        if (!options.profile)
            throw new Error('Without a profile there is nothing to check.');

        const { profile } = options;
        const config = await processParams(options, profile.config);
        const { $, ...messages } = await this.#prepare(options);
        const ruleContext = new RuleContext(this, $, config);

        await Promise.all(
            profile.rules.map(async rule => {
                try {
                    await rule.check(ruleContext);
                } catch (error) {
                    this.#throw(error.message);
                } finally {
                    this.emit('done', rule.name);
                }
            })
        );
        return this.#reportResult({ ...messages, metadata: {} });
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
            await access(file, constants.F_OK);
        } catch (error) {
            throw new Error(`File '${file}' not found or inaccessible.`);
        }
        return this.#loadSource(await readFile(file, 'utf8'));
    }
}
