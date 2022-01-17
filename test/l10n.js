/**
 * Test L10n features.
 */

/* globals expect: true */

// Native packages:
const fs = require('fs');

// External packages:
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// Internal packages:
const rules = require('../lib/rules.json');
const l10n = require('../lib/l10n-en_GB');

// Constants:
const { messages } = l10n;
const baseDir = './lib/rules/';
const extensionRemover = /\.[^.]+$/;
const messageFinder = /\.(info|warning|error)\s*\(.+,\s*["']([^()"'{}]+)["']/g;
const exceptionFinder = /emits\s*:\s*["']([^()"'{}]+)["']/g;
/**
 * Set up the testing framework.
 */

const setUp = function () {
    chai.use(chaiAsPromised);
    expect = chai.expect;
};

/**
 * Process “messages” and build a tree with up to 3 levels (section, rule, message ID).
 *
 * Leaf values “true” indicate that the message exists; “false” is used rarely to mean
 * that one rule (or the whole section) is missing on purpose, to avoid false positives from the tests.
 */

const scanStrings = function () {
    const result = {};
    for (const i in messages) {
        const c = i.split('.');
        if (!c || c.length < 1 || c.length > 3)
            throw new Error(
                `message key “${i}” doesn't follow the pattern “x[.y[.z]]”`
            );
        if (c[0] !== 'generic') {
            // 1. Process the section:
            if (!Object.prototype.hasOwnProperty.call(result, c[0])) {
                if (c.length === 1) {
                    if (messages[i] === false) result[c[0]] = false;
                    else
                        throw new Error(
                            `key “${i}” can be used only to indicate an empty category using “false”`
                        );
                } else result[c[0]] = {};
            } else if (
                c.length === 1 &&
                ((result[c[0]] === false && messages[i] !== false) ||
                    (result[c[0]] !== false && messages[i] === false))
            )
                throw new Error(
                    `key “${i}” can't be used to indicate an empty category because it's used for messages too`
                );

            // 2. Process the rule:
            if (c.length > 1) {
                if (!Object.prototype.hasOwnProperty.call(result[c[0]], c[1])) {
                    if (c.length === 2) {
                        if (messages[i] === false) result[c[0]][c[1]] = false;
                        else
                            throw new Error(
                                `key “${i}” can be used only to indicate an empty category using “false”`
                            );
                    } else result[c[0]][c[1]] = {};
                } else if (
                    c.length === 2 &&
                    ((result[c[0]][c[1]] === false && messages[i] !== false) ||
                        (result[c[0]][c[1]] !== false && messages[i] === false))
                )
                    throw new Error(
                        `key “${i}” can't be used to indicate an empty category because it's used for messages too`
                    );
            }

            // 3. Process the message ID:
            if (c.length > 2) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        result[c[0]][c[1]],
                        c[2]
                    )
                )
                    result[c[0]][c[1]][c[2]] = !!messages[i];
                else throw new Error(`key “${i}” is defined more than once`);
            }
        }
    }
    return result;
};

/**
 * Scan “baseDir” and find heuristically all sections, rules, and message IDs.
 *
 * The search relies on a regex that tries to find instances of “sr.error()” etc, so it's not exact.
 * Return a promise that will be fulfilled if/when all directories and files are read successfully.
 */

const scanFileSystem = function () {
    return new Promise((fulfill, reject) => {
        const result = {};
        fs.readdir(baseDir, (err, dirs) => {
            if (err)
                // eslint-disable-next-line
                reject(
                    `Error: could not read directory “${baseDir}”: “${err}”`
                );
            else {
                let total = 0;
                let n = 0;
                const readDir = function (dir) {
                    result[dir] = {};
                    return function (bar, filenames) {
                        total += filenames.length;
                        const readFile = function (file) {
                            return function (err, data) {
                                if (err)
                                    // eslint-disable-next-line
                                    reject(
                                        `Error: could not read file ${dir}/${file}: ${err}`
                                    );
                                else {
                                    const name = file.replace(
                                        extensionRemover,
                                        ''
                                    );
                                    let match;
                                    result[dir][name] = {};
                                    match = messageFinder.exec(data);
                                    while (match) {
                                        result[dir][name][match[2]] = true;
                                        match = messageFinder.exec(data);
                                    }
                                    match = exceptionFinder.exec(data);
                                    while (match) {
                                        result[dir][name][match[1]] = true;
                                        match = exceptionFinder.exec(data);
                                    }
                                    n += 1;
                                    if (total === n) fulfill(result);
                                }
                            };
                        };
                        for (const i of filenames)
                            fs.readFile(`${baseDir}${dir}/${i}`, readFile(i));
                    };
                };
                for (const i of dirs) fs.readdir(`${baseDir}${i}`, readDir(i));
            }
        });
    });
};

/**
 * Compare two trees of {sections, rules, message IDs} to find leaves that are missing.
 */

const findHoles = function (source, expected, labelSource, labelExpected) {
    let errors = '';
    for (const i in expected)
        if (!Object.prototype.hasOwnProperty.call(source, i))
            errors += `Section “${i}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
        else if (source[i] !== false)
            for (const j in expected[i])
                if (!Object.prototype.hasOwnProperty.call(source[i], j))
                    errors += `Rule “${i}/${j}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
                else if (source[i][j] !== false)
                    for (const k in expected[i][j])
                        if (
                            !Object.prototype.hasOwnProperty.call(
                                source[i][j],
                                k
                            )
                        )
                            errors += `Message ID “${i}/${j}/${k}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
    if (errors) throw new Error(`${errors.slice(0, -2)}.`);
};

describe('L10n', () => {
    let strings;
    let files;

    before(() => {
        setUp();
        strings = scanStrings();
        const p = scanFileSystem();
        p.then(value => {
            files = value;
        });
        return expect(p).to.be.fulfilled;
    });

    describe('UI messages module', () => {
        it('“lib/rules-wrapper” should be a valid object', () =>
            expect(rules).to.be.an('object'));
        it('“lib/l10n-en_GB” should be a valid object', () =>
            expect(l10n).to.be.an('object'));
    });

    describe('Consistency between rules and L10n messages', () => {
        it('All L10n messages should be used by some rule', () =>
            findHoles(files, strings, 'files', 'l10n strings'));
        it('All message IDs used by rules should exist as L10n messages', () =>
            findHoles(strings, files, 'l10n strings', 'files'));
    });
});
