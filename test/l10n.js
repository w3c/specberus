/**
 * Test L10n features.
 */

/* globals describe: false, it: false, expect: true, before: false */

// Native packages:
const fs = require('fs');

// External packages:
const chai = require('chai')
,   chaiAsPromised = require('chai-as-promised')
;

// Internal packages:
const rules = require('../lib/rules')
,   l10n = require('../lib/l10n-en_GB')
;

// Constants:
const messages = l10n.messages
,   baseDir = './lib/rules/'
,   extensionRemover = /\.[^\.]+$/
,   messageFinder = /\.(info|warning|error)\s*\(.+,\s*[\"\']([^\(\)\"\'{}]+)[\"\']/g
,   exceptionFinder = /emits\s*:\s*[\"\']([^\(\)\"\'{}]+)[\"\']/g
;

/**
 * Set up the testing framework.
 */

const setUp = function() {
    chai.use(chaiAsPromised);
    expect = chai.expect;
};

/**
 * Process “messages” and build a tree with up to 3 levels (section, rule, message ID).
 *
 * Leaf values “true” indicate that the message exists; “false” is used rarely to mean
 * that one rule (or the whole section) is missing on purpose, to avoid false positives from the tests.
 */

const scanStrings = function() {
    const result = {};
    for (var i in messages) {
        var c = i.split('.');
        if (!c || c.length < 1 || c.length > 3)
            throw new Error(`message key “${i}” doesn't follow the pattern “x[.y[.z]]”`);
        if ('generic' !== c[0]) {

            // 1. Process the section:
            if (!result.hasOwnProperty(c[0])) {
                if (1 === c.length) {
                    if (false === messages[i])
                        result[c[0]] = false;
                    else
                        throw new Error(`key “${i}” can be used only to indicate an empty category using “false”`);
                }
                else
                    result[c[0]] = {};
            }
            else if (1 === c.length &&
                ((false === result[c[0]] && false !== messages[i]) ||
                (false !== result[c[0]] && false === messages[i])))
                throw new Error(`key “${i}” can't be used to indicate an empty category because it's used for messages too`);

            // 2. Process the rule:
            if (c.length > 1) {
                if (!result[c[0]].hasOwnProperty(c[1])) {
                    if (2 === c.length) {
                        if (false === messages[i])
                            result[c[0]][c[1]] = false;
                        else
                            throw new Error(`key “${i}” can be used only to indicate an empty category using “false”`);
                    }
                    else
                        result[c[0]][c[1]] = {};
                }
                else if (2 === c.length &&
                    ((false === result[c[0]][c[1]] && false !== messages[i]) ||
                    (false !== result[c[0]][c[1]] && false === messages[i])))
                    throw new Error(`key “${i}” can't be used to indicate an empty category because it's used for messages too`);
            }

            // 3. Process the message ID:
            if (c.length > 2) {
                if (!result[c[0]][c[1]].hasOwnProperty(c[2]))
                    result[c[0]][c[1]][c[2]] = !!(messages[i]);
                else
                    throw new Error(`key “${i}” is defined more than once`);
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

const scanFileSystem = function() {
    return new Promise(function(fulfill, reject) {
        const result = {};
        fs.readdir(baseDir, function(err, dirs) {
            if (err)
                reject(`Error: could not read directory “${baseDir}”: “${err}”`);
            else {
                var total = 0
                ,   n = 0
                ;
                const readDir = function(dir) {
                    result[dir] = {};
                    return function(bar, filenames) {
                        total += filenames.length;
                        const readFile = function(file) {
                            return function(err, data) {
                                if (err)
                                    reject(`Error: could not read file ${dir}/${file}: ${err}`);
                                else {
                                    const name = file.replace(extensionRemover, '');
                                    var match;
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
                                    n ++;
                                    if (total === n)
                                        fulfill(result);
                                }
                            };
                        };
                        for (var i of filenames)
                            fs.readFile(`${baseDir}${dir}/${i}`, readFile(i));
                    };
                };
                for (var i of dirs)
                    fs.readdir(`${baseDir}${i}`, readDir(i));
            }
        });
    });
};

/**
 * Compare two trees of {sections, rules, message IDs} to find leaves that are missing.
 */

const findHoles = function(source, expected, labelSource, labelExpected) {
    var errors = '';
    for (var i in expected)
        if (!source.hasOwnProperty(i))
            errors += `Section “${i}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
        else if (false !== source[i])
            for (var j in expected[i])
                if (!source[i].hasOwnProperty(j))
                    errors += `Rule “${i}/${j}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
                else if (false !== source[i][j])
                    for (var k in expected[i][j])
                        if (!source[i][j].hasOwnProperty(k))
                            errors += `Message ID “${i}/${j}/${k}” exists in ${labelExpected} but is missing in ${labelSource}.\n`;
    if (errors)
        throw new Error(errors.slice(0, -2) + '.');
};

describe('L10n', function() {

    var strings
    ,   files
    ;

    before(function() {
        setUp();
        strings = scanStrings();
        var p = scanFileSystem();
        p.then(function(value) {
            files = value;
        });
        return expect(p).to.be.fulfilled;
    });

    describe('UI messages module', function() {
        it('“lib/rules-wrapper” should be a valid object', function() {
            return expect(rules).to.be.an('object');
        });
        it('“lib/l10n-en_GB” should be a valid object', function() {
            return expect(l10n).to.be.an('object');
        });
    });

    describe('Consistency between rules and L10n messages', function() {
        it('All L10n messages should be used by some rule', function() {
            return findHoles(files, strings, 'files', 'strings');
        });
        it('All message IDs used by rules should exist as L10n messages', function() {
            return findHoles(strings, files, 'strings', 'files');
        });
    });

});
