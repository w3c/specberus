/**
 * @file Tests L10n features.
 */

import assert from 'assert';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { describe, it } from 'node:test';

import { messages } from '../lib/l10n-en_GB.js';

import rules from '../lib/rules-track.js';

// Constants:
const baseDir = join('lib', 'rules');
const extensionRemover = /\.[^.]+$/;
const messageFinder =
    /\.(info|warning|error)\s*\([\s\S]+?,\s*["']([^"']+)["']/g;
const exceptionFinder = /emits\s*:\s*["']([^()"'{}]+)["']/g;

/**
 * Processes “messages” and builds a tree with up to 3 levels (section, rule, message ID).
 *
 * Leaf values “true” indicate that the message exists; “false” is used rarely to mean
 * that one rule (or the whole section) is missing on purpose, to avoid false positives from the tests.
 */
const scanStrings = function () {
    const result: Record<
        string,
        false | Record<string, false | Record<string, true | string>>
    > = {};
    for (const [key, message] of Object.entries(messages)) {
        const keyParts = key.split('.');
        if (keyParts.length < 1 || keyParts.length > 3)
            throw new Error(
                `message key “${key}” doesn't follow the pattern “x[.y[.z]]”`
            );
        if (keyParts[0] !== 'generic') {
            // 1. Process the section:
            if (!Object.hasOwn(result, keyParts[0])) {
                if (keyParts.length === 1) {
                    if (message === false) result[keyParts[0]] = false;
                    else
                        throw new Error(
                            `key “${key}” can be used only to indicate an empty category using “false”`
                        );
                } else result[keyParts[0]] = {};
            } else if (
                keyParts.length === 1 &&
                ((result[keyParts[0]] === false && message !== false) ||
                    (result[keyParts[0]] !== false && message === false))
            )
                throw new Error(
                    `key “${key}” can't be used to indicate an empty category because it's used for messages too`
                );

            // 2. Process the rule:
            if (keyParts.length > 1) {
                const section = result[keyParts[0]];
                if (!section)
                    throw new Error(
                        'key contains 2 or more parts, but first part resolved to false'
                    );

                if (!Object.hasOwn(section, keyParts[1])) {
                    if (keyParts.length === 2) {
                        if (message === false) section[keyParts[1]] = false;
                        else
                            throw new Error(
                                `key “${key}” can be used only to indicate an empty category using “false”`
                            );
                    } else section[keyParts[1]] = {};
                } else if (
                    keyParts.length === 2 &&
                    ((section[keyParts[1]] === false && message !== false) ||
                        (section[keyParts[1]] !== false && message === false))
                )
                    throw new Error(
                        `key “${key}” can't be used to indicate an empty category because it's used for messages too`
                    );

                // 3. Process the message ID:
                if (keyParts.length > 2) {
                    const rule = section[keyParts[1]];
                    if (!rule)
                        throw new Error(
                            'key contains 3 parts, but first 2 parts resolved to false'
                        );

                    if (!Object.hasOwn(rule, keyParts[2]))
                        rule[keyParts[2]] = !!rule;
                    else
                        throw new Error(
                            `key “${key}” is defined more than once`
                        );
                }
            }
        }
    }
    return result;
};

/**
 * Scans “baseDir” and finds heuristically all sections, rules, and message IDs.
 *
 * The search relies on a regex that tries to find instances of “sr.error()” etc, so it's not exact.
 * Return a promise that will be fulfilled if/when all directories and files are read successfully.
 */
async function scanFileSystem() {
    const result: Record<string, Record<string, Record<string, true>>> = {};

    const dirnames = await readdir(baseDir);
    for (const dirname of dirnames) {
        result[dirname] = {};

        const filenames = await readdir(join(baseDir, dirname));
        for (const filename of filenames) {
            if (!filename.endsWith('.ts')) continue;
            if (filename.endsWith('.d.ts')) continue;

            const content = await readFile(
                join(baseDir, dirname, filename),
                'utf8'
            );
            const name = filename.replace(extensionRemover, '');
            result[dirname][name] = {};

            let match;
            while ((match = messageFinder.exec(content)))
                result[dirname][name][match[2]] = true;
            while ((match = exceptionFinder.exec(content)))
                result[dirname][name][match[1]] = true;
        }
    }

    return result;
}

const strings = scanStrings();
const files = await scanFileSystem();

/**
 * Compares two trees of {sections, rules, message IDs} to find leaves that are missing.
 */
const findHoles = function (
    source: typeof files | typeof strings,
    expected: typeof files | typeof strings,
    labelSource: string,
    labelExpected: string
) {
    let errors = '';
    for (const [i, expectedSection] of Object.entries(expected))
        if (!Object.hasOwn(source, i))
            errors += `Section “${i}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
        else if (source[i] !== false && expectedSection !== false) {
            for (const [j, expectedRule] of Object.entries(expectedSection))
                if (!Object.hasOwn(source[i], j))
                    errors += `Rule “${i}/${j}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
                else if (source[i][j] !== false && expectedRule !== false)
                    for (const k of Object.keys(expectedRule))
                        if (!source[i][j] || !Object.hasOwn(source[i][j], k))
                            errors += `Message ID “${i}/${j}/${k}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
        }
    if (errors) assert.fail(`${errors.slice(0, -2)}.`);
};

describe('L10n', () => {
    describe('UI messages module', () => {
        it('“lib/rules-track” should be a valid object', () => {
            assert.strictEqual(typeof rules, 'object');
        });
        it('“lib/l10n-en_GB” should be a valid object', () => {
            assert.strictEqual(typeof messages, 'object');
            for (const [key, message] of Object.entries(messages)) {
                assert.match(
                    key,
                    /^[\w-]+\.[\w-]+(\.[\w-]+)?$/,
                    'All l10n keys should be the format of 2 or 3 period-delimited slugs'
                );
                const numParts = key.split('.').length;
                if (numParts < 3)
                    assert.strictEqual(
                        message,
                        false,
                        'Any key with fewer than 3 path segments should have a value of false'
                    );
                else
                    assert(
                        message === false || typeof message === 'string',
                        'Any key with a fully-qualified path should be either false or a string'
                    );
            }
        });
    });

    describe('Consistency between rules and L10n messages', () => {
        it('All L10n messages should be used by some rule', () =>
            findHoles(files, strings, 'files', 'l10n strings'));
        it('All message IDs used by rules should exist as L10n messages', () =>
            findHoles(strings, files, 'l10n strings', 'files'));
    });
});
