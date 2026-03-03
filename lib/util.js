/**
 * Miscellaneous utilities.
 */

import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { Octokit } from '@octokit/core';
import w3cApi from 'node-w3capi';
import { nextTick } from 'process';

/** @import { Specberus } from "./validator.js" */

const __dirname = dirname(fileURLToPath(import.meta.url));

const filesTR = fs.readdirSync(`${__dirname}/profiles/TR/`);
const filesSUBM = fs.readdirSync(`${__dirname}/profiles/SUBM/`);

export const importJSON = (relativeTo, importURL) => {
    const dir = dirname(fileURLToPath(importURL));
    const pathname = resolve(dir, relativeTo);

    return JSON.parse(fs.readFileSync(pathname).toString());
};

/**
 * Build a JSON result (of validation, metadata extraction, etc).
 *
 * @param {Array} err - errors.
 * @param {Array} warn - warnings.
 * @param {Array} inf - informative messages.
 * @param {Object} metadata - dictionary with some found metadata.
 */

export const buildJSONresult = function (err, warn, inf, metadata) {
    return {
        success: err.length === 0,
        errors: err,
        warnings: warn,
        info: inf,
        metadata,
    };
};

// Get rules of each profile
let TRProfiles = [];
filesTR.forEach(track => {
    if (!track.startsWith('.')) {
        const profileNames = fs
            .readdirSync(`${__dirname}/profiles/TR/${track}/`)
            .map(profileName => `${track}/${profileName}`);
        TRProfiles = [...TRProfiles, ...profileNames];
    }
});

export const allProfiles = [
    ...TRProfiles.map(x => `TR/${x}`),
    ...filesSUBM.map(x => `SUBM/${x}`),
];

export const profiles = Object.fromEntries(
    allProfiles
        .map(file => {
            const match =
                /((TR|SUBM)\/([A-Za-z]+\/)?([A-Z][A-Z-]*[A-Z](-Echidna)?))\.js$/.exec(
                    file
                );
            if (match && match[4]) {
                const key = match[4];
                return [key, import(`./profiles/${match[0]}`)];
            }
            return null;
        })
        .filter(Boolean)
);

/**
 * Build a function that builds an “options” object based on certain parameters.
 *
 * @returns {Function} a function that builds an “options” object based on an HTTP query string or a similar object containing options.
 */

const buildProcessParamsFunction = function () {
    /**
     * Build an “options” object based on an HTTP query string or a similar object containing options.
     *
     * An example of <code>constraints</code>:
     * <blockquote><pre>{
     *     "required": ["processDocument"],
     *     "forbidden": ["echidnaReady", "bogusParam"],
     *     "allowUnknownParams": true
     * }</pre>/blockquote>
     *
     * @param {Object} params - an HTTP request query, or a similar object.
     * @param {Object} base - (<strong>optional</strong>) a template or “base” object to build from.
     * @param {Object} constraints - (<strong>optional</strong>) an object listing “required” and/or “forbidden” parameters.
     * @returns {Promise<Object>} an “options” object that can be used by Specberus.
     * @throws {Error} if there is an error in the parameters.
     */

    return async function (params, base, constraints) {
        const result = base ? JSON.parse(JSON.stringify(base)) : {};
        let originFound = false;
        for (const p in params) {
            if (
                p === 'url' ||
                p === 'source' ||
                p === 'file' ||
                p === 'document'
            ) {
                // Origins: only one allowed.
                if (originFound)
                    throw new Error(
                        'Only one of parameters {“url”, “source”, “file”, “document”} is allowed'
                    );
                originFound = true;
                result[p] = params[p];
            } else if (p === 'profile') {
                // Profile: if it's a string, load the corresponding object.
                if (Object.prototype.hasOwnProperty.call(result, p))
                    throw new Error(`Parameter “${p}” is used more than once`);
                else if (typeof params[p] === 'string') {
                    const subPath = `/${params[p]}.js`;
                    const profilePath = allProfiles.find(p =>
                        p.endsWith(subPath)
                    );

                    if (profilePath)
                        result[p] = await import(
                            `../lib/profiles/${profilePath}`
                        );
                    else if (params[p] === 'auto') result[p] = 'auto';
                    else throw new Error(`Unknown profile “${params[p]}”`);
                } else result[p] = params[p];
            } else if (
                p === 'validation' ||
                p === 'htmlValidator' ||
                p === 'cssValidator' ||
                p === 'patentPolicy' ||
                p === 'processDocument' ||
                p === 'informativeOnly' ||
                p === 'echidnaReady' ||
                p === 'events' ||
                p === 'editorial' ||
                p === 'additionalMetadata'
            ) {
                // Other params:
                if (Object.prototype.hasOwnProperty.call(result, p))
                    throw new Error(`Parameter “${p}” is used more than once`);
                result[p] = params[p];
            } else if (!constraints || !constraints.allowUnknownParams)
                // Illegal params:
                throw new Error(`Illegal parameter “${p}”`);
        }
        if (!originFound)
            // Origin: one required.
            throw new Error(
                'One parameter of {“url”, “source”, “file”, “document”} is required'
            );
        else {
            let c;
            if (constraints && constraints.required) {
                // Extra required params:
                for (c in constraints.required)
                    if (
                        !Object.prototype.hasOwnProperty.call(
                            result,
                            constraints.required[c]
                        )
                    )
                        throw new Error(
                            `Parameter “${constraints.required[c]}” is required in this context`
                        );
            }
            if (constraints && constraints.forbidden) {
                // Forbidden params:
                for (c in constraints.forbidden)
                    if (
                        Object.prototype.hasOwnProperty.call(
                            result,
                            constraints.forbidden[c]
                        )
                    )
                        throw new Error(
                            `Parameter “${constraints.forbidden[c]}” is not allowed in this context`
                        );
            }
        }
        return result;
    };
};

export const processParams = buildProcessParamsFunction();

/** @type {Record<string, { id: number; time: number; }>} */
const githubUsernameCache = {};
const githubUsernameCacheTimeout = 3600000;

/** @type {Octokit} */
let octokit;

function cleanGithubUsernameCache() {
    const now = Date.now();
    for (const [key, { time }] of Object.entries(githubUsernameCache)) {
        if (now - time >= githubUsernameCacheTimeout)
            delete githubUsernameCache[key];
    }
}

function cacheGithubUsername(username, id) {
    githubUsernameCache[username] = { id, time: Date.now() };
    process.nextTick(cleanGithubUsernameCache);
    return id;
}

/**
 * Attempts to resolve a GitHub username to a W3C user ID.
 * Returns null on 404; throws on any other 4xx/5xx response.
 * @param {string} username
 */
export async function resolveGithubUsernameToId(username) {
    if (
        typeof githubUsernameCache[username] !== 'undefined' &&
        Date.now() - githubUsernameCache[username].time <
            githubUsernameCacheTimeout
    )
        return githubUsernameCache[username].id;

    if (!octokit) octokit = new Octokit({ auth: process.env.GH_TOKEN });

    try {
        const response = await octokit.request('GET /users/{username}', {
            username,
        });
        const githubId = response.data.id;
        const { id } = await w3cApi
            .user({ type: 'github', id: githubId })
            .fetch();
        return cacheGithubUsername(username, id);
    } catch (error) {
        // Both octokit and w3capi errors contain status and request.url
        const status = 'status' in error ? error.status : null;
        if (status === 404) {
            return cacheGithubUsername(username, null);
        } else {
            const message = `Failed to resolve GitHub user ${username}${
                status ? `: ${error.request.url} responded with ${status}` : ''
            }`;
            console.error(message);
            throw new Error(message, { cause: username });
        }
    }
}

export const TAG = { id: 34270, type: 'other' };
export const AB = { id: 7756, type: 'other' };

export const REC_TEXT = {
    SOTD_P_COR: 'It includes proposed correction(s)?.',
    SOTD_P_ADD:
        'It includes proposed addition(s)?, introducing new feature(s)? since the previous Recommendation.',
    SOTD_P_COR_ADD:
        'It includes proposed amendment(s)?, introducing substantive change(s)? and new feature(s)? since the previous Recommendation.',
    SOTD_C_COR: 'It includes candidate correction(s)?.',
    SOTD_C_ADD:
        'It includes candidate addition(s)?, introducing new feature(s)? since the previous Recommendation.',
    SOTD_C_COR_ADD:
        'It includes candidate amendment(s)?, introducing substantive change(s)? and new feature(s)? since the previous Recommendation.',
};
