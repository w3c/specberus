import assert from 'assert';
import { readFile } from 'fs/promises';
import type { Server } from 'http';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { rules as metadataRules } from '../lib/profiles/metadata.js';
import { removeRules } from '../lib/profiles/profileUtil.js';
import type { HandlerMessage } from '../lib/types.js';
import { allProfiles } from '../lib/util.js';
import {
    ExceptionsError,
    Specberus,
    type SpecberusResult,
} from '../lib/validator.js';
// A list of good documents to be tested, using all rules configured in the profiles.
// Shouldn't cause any error.
import { goodDocuments } from './data/goodDocuments.js';
import { app } from './lib/testserver.js';
import {
    buildBadTestCases,
    cleanupMocks,
    setupMocks,
    type RuleTest,
} from './lib/utils.js';
import { samples } from './samples.js';

/**
 * Test the rules.
 */

// Settings:
const DEBUG = process.env.DEBUG || false;
const DEFAULT_PORT = 8001;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}`;

// These 3 environment variables are to reduce test documents.
// e.g. `RULE=copyright TYPE=noCopyright PROFILE=WD npm run test`
const testRule = process.env.RULE;
const testType = process.env.TYPE;
const testProfile = process.env.PROFILE;

interface CompareMetadataObject {
    errors?: Partial<HandlerMessage>[];
    [index: string]: any;
}

/**
 * Assert that metadata detected in a spec is equal to the expected values.
 *
 * @param file - name of local file containing a spec (without path and without ".html" suffix).
 * @param expectedObject - values that are expected to be found.
 */
function compareMetadata(file: string, expectedObject: CompareMetadataObject) {
    const testFile = `test/docs/${file}.html`;

    it(`Should detect metadata for ${testFile}`, async () => {
        const specberus = new Specberus();
        const result = await specberus.extractMetadata({ file: testFile });

        assert.strictEqual(result.success, !('errors' in expectedObject));
        if ('errors' in expectedObject) {
            assert.strictEqual(
                result.errors.length,
                expectedObject.errors.length
            );
            assert(
                expectedObject.errors.every((expected, i) =>
                    Object.entries(expected).every(
                        ([key, value]) =>
                            result.errors[i][key as keyof HandlerMessage] ===
                            value
                    )
                ),
                `Errors should contain expected properties:\n${JSON.stringify(
                    expectedObject.errors,
                    null,
                    '  '
                )}`
            );
        }

        for (const [key, value] of Object.entries(expectedObject)) {
            if (key === 'errors' || key === 'file') continue;
            assert(
                key in result.metadata,
                `Expected ${key} to be defined in metadata`
            );
            assert.deepStrictEqual(result.metadata[key], value);
        }
    });
}

describe('Basics', () => {
    const specberus = new Specberus();

    beforeEach(() => setupMocks());
    afterEach(cleanupMocks);

    describe('Method "extractMetadata"', () => {
        it('Should exist and be a function', () => {
            assert.strictEqual(typeof specberus.extractMetadata, 'function');
        });

        samples.forEach(sample => {
            compareMetadata(sample.file, sample);
        });

        it('Should report multiple exceptions when failing to parse date', async () => {
            const badHtml = (
                await readFile('test/docs/2021-wd.html', 'utf8')
            ).replace(/04 November/, '04 11');

            let observedDone = 0;
            const observedExceptions: string[] = [];
            const sr = new Specberus();
            sr.on('done', () => {
                observedDone++;
            });
            sr.on('exception', ({ message }) => {
                observedExceptions.push(message);
            });

            return assert.rejects(
                sr.extractMetadata({ source: badHtml }),
                (error: ExceptionsError) => {
                    assert.strictEqual(error.exceptions.length, 2);
                    assert.match(
                        error.exceptions[0],
                        /^Cannot find the .* element for profile and date/
                    );
                    assert.strictEqual(
                        error.exceptions[1],
                        'The document date could not be parsed.'
                    );
                    assert.deepStrictEqual(
                        observedExceptions,
                        error.exceptions,
                        'Exceptions in rejection error should match emitted exception events'
                    );
                    assert.strictEqual(
                        observedDone,
                        metadataRules.length,
                        'done event should fire for all rules regardless of exceptions'
                    );
                    return true;
                }
            );
        });
    });

    describe('Method "validate"', () => {
        it('Should exist and be a function', () => {
            assert.strictEqual(typeof specberus.validate, 'function');
        });
    });
});

let testserver: Server;

before(
    () =>
        new Promise<void>(
            (resolve, reject) =>
                (testserver = app.listen(PORT, err =>
                    err ? reject(err) : resolve()
                ))
        )
);

after(
    () =>
        new Promise<void>((resolve, reject) =>
            testserver.close(err => (err ? reject(err) : resolve()))
        )
);

interface ValidationTestConfig {
    errors?: any[];
    ignoreWarnings?: boolean;
    warnings?: any[];
}

function addValidationEventListeners(sr: Specberus) {
    if (DEBUG) {
        sr.on('err', (type, data) => {
            console.log('error:\n', type, data);
        });
        sr.on('warning', (type, data) => {
            console.log('warning:\n', type, data);
        });
        sr.on('done', name => {
            console.log(`----> ${name} check done`);
        });
    }
    sr.on('exception', data => {
        console.error(
            `[EXCEPTION] Validator had a massive failure: ${data.message}`
        );
    });
}

const verifySpecberusResult = (
    promise: Promise<SpecberusResult>,
    test: ValidationTestConfig
) =>
    promise.then(result => {
        const { errors, warnings } = result;
        if (test.errors) {
            assert.strictEqual(errors.length, test.errors.length);
            errors.forEach(({ key, name }, i) => {
                assert.strictEqual(`${name}.${key}`, test.errors![i]);
            });
        } else {
            assert.strictEqual(errors.length, 0, 'Expected errors to be empty');
        }

        if (!test.ignoreWarnings) {
            if (test.warnings) {
                assert.strictEqual(warnings.length, test.warnings.length);
                warnings.forEach(({ key, name }, i) => {
                    assert.strictEqual(`${name}.${key}`, test.warnings![i]);
                });
            } else {
                assert.strictEqual(
                    warnings.length,
                    0,
                    'Expected warnings to be empty'
                );
            }
        }

        // Pass through result to allow further verifications
        return result;
    });

const testsGoodDoc = goodDocuments;

// The next check is running each profile using the rules configured.
describe('Making sure good documents pass Specberus...', () => {
    beforeEach(() =>
        setupMocks({
            // hard-code group ID to match state of test documents
            delivererMap: { 'hr-time': 32113 },
        })
    );
    afterEach(cleanupMocks);

    for (const [key, doc] of Object.entries(testsGoodDoc)) {
        // testsGoodDoc[docProfile].profile is used to distinguish multiple cases for same profile.
        const docProfile = 'profile' in doc ? doc.profile : key;
        if (testProfile && testProfile !== docProfile) continue;

        const url = `${ENDPOINT}/${doc.url}`;

        it(`should pass for ${docProfile} doc with ${url}`, async () => {
            const profilePath = allProfiles.find(p =>
                p.endsWith(`/${docProfile}`)
            );
            const profile = await import(`../lib/profiles/${profilePath}.js`);
            // add custom config to test
            const extendedProfile = {
                ...profile,
                config: {
                    patentPolicy: 'pp2020', // default config for all docs.
                    ...profile.config,
                    ...('config' in doc && doc.config),
                },
            };

            // remove unnecessary rules from test
            const rules = removeRules(extendedProfile.rules, [
                'validation.html',
                'validation.wcag',
                'links.linkchecker', // too slow. will check separately.
            ]);

            const sr = new Specberus();
            addValidationEventListeners(sr);
            const options = {
                profile: {
                    ...extendedProfile,
                    rules, // do not change profile.rules
                },
                url,
            };

            await verifySpecberusResult(sr.validate(options), {
                ignoreWarnings: true,
            });
        });
    }
});

interface CheckRuleOptions {
    category: string;
    docType: string;
    profile: string;
    rule: string;
    track?: string | undefined;
}

function checkRule(tests: RuleTest[], options: CheckRuleOptions) {
    const { docType, track, profile, category, rule } = options;

    tests.forEach(test => {
        const passOrFail = !test.errors ? 'pass' : 'fail';
        const suffix = track ? `${track}/${profile}` : profile;
        const url = `${ENDPOINT}/doc-views/${docType}/${suffix}?rule=${rule}&type=${test.data}`;

        // If the test is not mentioned in the environment variables, skip it.
        if (testType && test.data !== testType) return;

        it(`should ${passOrFail} for ${url}`, async () => {
            const { config } = await import(
                `../lib/profiles/${docType}/${suffix}.js`
            );
            const ruleModule = await import(
                `../lib/rules/${category}/${rule}.js`
            );

            const sr = new Specberus();
            addValidationEventListeners(sr);
            const options = {
                url,
                profile: {
                    name: `Synthetic ${profile}/${rule}`,
                    rules: [ruleModule],
                    config: {
                        ...config,
                        ...test.config,
                    },
                },
            };

            const counts = { errors: 0, info: 0, warnings: 0 };
            sr.on('err', () => counts.errors++);
            sr.on('info', () => counts.info++);
            sr.on('warning', () => counts.warnings++);

            const result = await verifySpecberusResult(
                sr.validate(options),
                test
            );
            assert.strictEqual(
                result.errors.length,
                counts.errors,
                'Number of err events emitted should match number in resolved promise'
            );
            assert.strictEqual(
                result.info.length,
                counts.info,
                'Number of info events emitted should match number in resolved promise'
            );
            assert.strictEqual(
                result.warnings.length,
                counts.warnings,
                'Number of warning events emitted should match number in resolved promise'
            );
        });
    });
}

interface ProfileTestOptions {
    docType: string;
    profile: string;
    rules: Record<string, Record<string, RuleTest[]>>;
    track?: string;
}

function runTestsForProfile({
    docType,
    track,
    profile,
    rules,
}: ProfileTestOptions) {
    // Profile: CR/NOTE/RY ...
    describe(`Profile: ${profile}`, () => {
        Object.entries(rules).forEach(([category, rules]) => {
            Object.entries(rules).forEach(([rule, tests]) => {
                // Rule: hr/logo ...
                if (testRule && rule !== testRule) return;
                if (testType && !tests.some(({ data }) => data === testType))
                    return;

                describe(`Rule: ${category}.${rule}`, () => {
                    checkRule(tests, {
                        docType,
                        track,
                        profile,
                        category,
                        rule,
                    });
                });
            });
        });
    });
}

const badTestCases = await buildBadTestCases();

// The next check runs every rule for each profile, one rule at a time, and should trigger every existing errors and warnings in lib/l10n-en_GB.js
describe('Making sure Specberus is not broken...', () => {
    beforeEach(() => setupMocks());
    afterEach(cleanupMocks);

    Object.entries(badTestCases).forEach(([docType, tracksOrProfiles]) => {
        // DocType: TR/SUBM
        describe(`DocType: ${docType}`, () => {
            Object.entries(tracksOrProfiles).forEach(
                ([trackOrProfile, profilesOrRules]) => {
                    // Profile: SUBM
                    if (trackOrProfile === 'MEM-SUBM.js') {
                        if (testProfile && testProfile !== 'MEM-SUBM') return;
                        return runTestsForProfile({
                            docType,
                            profile: 'MEM-SUBM',
                            rules: profilesOrRules as Record<
                                string,
                                Record<string, RuleTest[]>
                            >,
                        });
                    }

                    // Track: Note/Recommendation/Registry
                    describe(`Track: ${trackOrProfile}`, () => {
                        Object.entries(profilesOrRules).forEach(
                            ([filename, rules]) => {
                                const profile = filename.slice(
                                    0,
                                    filename.lastIndexOf('.')
                                );
                                if (testProfile && testProfile !== profile)
                                    return;

                                runTestsForProfile({
                                    docType,
                                    track: trackOrProfile,
                                    profile,
                                    rules,
                                });
                            }
                        );
                    });
                }
            );
        });
    });
});
