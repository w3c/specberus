import assert from 'assert';
import { EventEmitter } from 'events';
import type { Server } from 'http';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { removeRules } from '../lib/profiles/profileUtil.js';
import { allProfiles, buildJSONresult } from '../lib/util.js';
import { Specberus } from '../lib/validator.js';
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
    errors?: Record<string, any>[];
    [index: string]: any;
}

/**
 * Returns an EventEmitter and Promise, both reflecting progress/completion of a Specberus call.
 */
function createSpecberusPromiseHandler() {
    const handler = new EventEmitter();
    const promise = new Promise<ReturnType<typeof buildJSONresult>>(
        (resolve, reject) => {
            handler.on('end-all', resolve);
            handler.on('exception', reject);
        }
    );
    return { handler, promise };
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
        const { handler, promise } = createSpecberusPromiseHandler();
        specberus.extractMetadata({ events: handler, file: testFile });
        const result = await promise;

        assert.strictEqual(result.success, !('errors' in expectedObject));
        if ('errors' in expectedObject) {
            assert.strictEqual(
                result.errors.length,
                expectedObject.errors.length
            );
            assert(
                expectedObject.errors.every((expected, i) =>
                    Object.entries(expected).every(
                        ([key, value]) => result.errors[i][key] === value
                    )
                ),
                `Errors should contain expected properties:\n${JSON.stringify(
                    expectedObject.errors,
                    null,
                    '  '
                )}`
            );
        }

        assert(specberus.meta, 'Expected specberus.meta to be defined');
        for (const [key, value] of Object.entries(expectedObject)) {
            if (key === 'errors' || key === 'file') continue;
            assert(
                key in specberus.meta,
                `Expected specberus.meta.${key} to be defined`
            );
            assert.deepStrictEqual(specberus.meta[key], value);
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

function buildValidationTestHandler(test: ValidationTestConfig) {
    const { handler, promise } = createSpecberusPromiseHandler();

    if (DEBUG) {
        handler.on('err', (type, data) => {
            console.log('error:\n', type, data);
        });
        handler.on('warning', (type, data) => {
            console.log('warning:\n', type, data);
        });
        handler.on('done', name => {
            console.log(`----> ${name} check done`);
        });
    }
    handler.on('exception', data => {
        console.error(
            `[EXCEPTION] Validator had a massive failure: ${data.message}`
        );
    });

    return {
        handler,
        promise: promise.then(({ errors, warnings }) => {
            if (test.errors) {
                assert.strictEqual(errors.length, test.errors.length);
                errors.forEach(({ key, name }, i) => {
                    assert.strictEqual(`${name}.${key}`, test.errors![i]);
                });
            } else {
                assert.strictEqual(
                    errors.length,
                    0,
                    'Expected errors to be empty'
                );
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
        }),
    };
}

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

            const { handler, promise } = buildValidationTestHandler({
                ignoreWarnings: true,
            });
            const options = {
                profile: {
                    ...extendedProfile,
                    rules, // do not change profile.rules
                },
                events: handler,
                url,
            };

            new Specberus().validate(options);
            return promise;
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
        if (
            (testRule && rule !== testRule) ||
            (testType && test.data !== testType) ||
            (testProfile && profile !== testProfile)
        )
            return;

        it(`should ${passOrFail} for ${url}`, async () => {
            const { config } = await import(
                `../lib/profiles/${docType}/${suffix}.js`
            );
            const ruleModule = await import(
                `../lib/rules/${category}/${rule}.js`
            );
            const { handler, promise } = buildValidationTestHandler(test);

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
                events: handler,
            };
            new Specberus().validate(options);
            return promise;
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
                describe(`Rule: ${category}.${rule}`, () => {
                    checkRule(tests, {
                        docType,
                        track,
                        profile: profile.substring(0, profile.lastIndexOf('.')),
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
                        return runTestsForProfile({
                            docType,
                            profile: trackOrProfile,
                            rules: profilesOrRules as Record<
                                string,
                                Record<string, RuleTest[]>
                            >,
                        });
                    }

                    // Track: Note/Recommendation/Registry
                    describe(`Track: ${trackOrProfile}`, () => {
                        Object.entries(profilesOrRules).forEach(
                            ([profile, rules]) =>
                                runTestsForProfile({
                                    docType,
                                    track: trackOrProfile,
                                    profile,
                                    rules,
                                })
                        );
                    });
                }
            );
        });
    });
});
