// External modules:
import { expect as chai } from 'chai';
import expect from 'expect.js';

// Internal modules:
import { Sink } from '../lib/sink.js';
import { allProfiles } from '../lib/util.js';
import { Specberus } from '../lib/validator.js';
// A list of good documents to be tested, using all rules configured in the profiles.
// Shouldn't cause any error.
import { goodDocuments } from './data/goodDocuments.js';
import { samples } from './samples.js';
import { app } from './lib/testserver.js';
import { buildBadTestCases, cleanupMocks, setupMocks } from './lib/utils.js';

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

/**
 * Assert that metadata detected in a spec is equal to the expected values.
 *
 * @param {String} file - name of local file containing a spec (without path and without ".html" suffix).
 * @param {Object} expectedObject - values that are expected to be found.
 */

function compareMetadata(file, expectedObject) {
    const specberus = new Specberus();
    const successExpected = !('errors' in expectedObject);

    const handler = new Sink();
    handler.on('exception', data => {
        throw new Error(data);
    });
    if (successExpected) {
        handler.on('err', (...data) => {
            throw new Error(...data);
        });
    }

    const testFile = `test/docs/${file}.html`;
    // test only local fixtures
    const opts = { events: handler, file: testFile };

    it(`Should detect metadata for ${testFile}`, done => {
        handler.on('end-all', result => {
            try {
                chai(result).to.have.property('success').equal(successExpected);
                if (!successExpected) {
                    chai(result)
                        .to.have.property('errors')
                        .satisfy(
                            errors => {
                                if (
                                    errors.length !==
                                    expectedObject.errors.length
                                )
                                    return false;
                                return expectedObject.errors.every(
                                    (expected, i) => {
                                        return Object.entries(expected).every(
                                            ([key, value]) => {
                                                return errors[i][key] === value;
                                            }
                                        );
                                    }
                                );
                            },
                            `Errors should contain expected properties:\n${JSON.stringify(
                                expectedObject.errors,
                                null,
                                '  '
                            )}`
                        );
                }

                for (const [key, value] of Object.entries(expectedObject)) {
                    if (key === 'errors' || key === 'file') continue;
                    let assertion = chai(specberus)
                        .to.have.property('meta')
                        .to.have.property(key);

                    if (Array.isArray(value)) assertion = assertion.deep;
                    assertion.equal(value, `Expected meta.${key} to match`);
                }

                done();
            } catch (error) {
                done(error);
            }
        });
        specberus.extractMetadata(opts);
    });
}

describe('Basics', () => {
    const specberus = new Specberus();

    beforeEach(() => setupMocks());
    afterEach(cleanupMocks);

    describe('Method "extractMetadata"', () => {
        it('Should exist and be a function', done => {
            chai(specberus)
                .to.have.property('extractMetadata')
                .that.is.a('function');
            done();
        });

        samples.forEach(sample => {
            compareMetadata(sample.file, sample);
        });
    });

    describe('Method "validate"', () => {
        it('Should exist and be a function', done => {
            chai(specberus).to.have.property('validate').that.is.a('function');
            done();
        });
    });
});

let testserver;

before(done => {
    testserver = app.listen(PORT, done);
});

after(done => {
    if (testserver) {
        testserver.close(done);
    }
});

function buildHandler(test, done) {
    const handler = new Sink();

    handler.on('err', (type, data) => {
        if (DEBUG) console.log('error: \n', type, data);
        handler.errors.push(`${type.name}.${data.key}`);
    });
    handler.on('warning', (type, data) => {
        if (DEBUG) console.log('warning: \n', type, data);
        handler.warnings.push(`${type.name}.${data.key}`);
    });
    handler.on('done', name => {
        if (DEBUG) console.log(`----> ${name} check done`);
    });
    handler.on('exception', data => {
        console.error(
            `[EXCEPTION] Validator had a massive failure: ${data.message}`
        );
    });
    handler.on('end-all', () => {
        try {
            if (!test.errors) {
                expect(handler.errors).to.be.empty();
            } else {
                expect(handler.errors.length).to.eql(test.errors.length);
                handler.errors.forEach((_, i) => {
                    expect(handler.errors).to.contain(test.errors[i]);
                });
            }

            if (!test.ignoreWarnings) {
                if (test.warnings) {
                    expect(handler.warnings.length).to.eql(
                        test.warnings.length
                    );
                    handler.warnings.forEach((_, i) => {
                        expect(handler.warnings).to.contain(test.warnings[i]);
                    });
                } else {
                    expect(handler.warnings).to.be.empty();
                }
            }
            done();
        } catch (e) {
            done(e);
        }
    });

    return handler;
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

    Object.keys(testsGoodDoc).forEach(docProfile => {
        // testsGoodDoc[docProfile].profile is used to distinguish multiple cases for same profile.
        docProfile = testsGoodDoc[docProfile].profile || docProfile;
        if (testProfile && testProfile !== docProfile) return;

        const url = `${ENDPOINT}/${testsGoodDoc[docProfile].url}`;

        it(`should pass for ${docProfile} doc with ${url}`, done => {
            const profilePath = allProfiles.find(p =>
                p.endsWith(`/${docProfile}.js`)
            );
            import(`../lib/profiles/${profilePath}`).then(profile => {
                // add custom config to test
                const extendedProfile = {
                    ...profile,
                    config: {
                        patentPolicy: 'pp2020', // default config for all docs.
                        ...profile.config,
                        ...testsGoodDoc[docProfile].config,
                    },
                };

                // remove unnecessary rules from test
                import('../lib/profiles/profileUtil.js').then(
                    ({ removeRules }) => {
                        const rules = removeRules(extendedProfile.rules, [
                            'validation.html',
                            'validation.wcag',
                            'links.linkchecker', // too slow. will check separately.
                        ]);

                        const options = {
                            profile: {
                                ...extendedProfile,
                                rules, // do not change profile.rules
                            },
                            events: buildHandler(
                                { ignoreWarnings: true },
                                done
                            ),
                            url,
                        };

                        // for (const o in test.options) options[o] = test.options[o];
                        new Specberus().validate(options);
                    }
                );
            });
        });
    });
});

function checkRule(tests, options) {
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

        it(`should ${passOrFail} for ${url}`, done => {
            import(`../lib/profiles/${docType}/${suffix}.js`).then(
                ({ config }) => {
                    import(`../lib/rules/${category}/${rule}.js`).then(
                        ruleModule => {
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
                                events: buildHandler(test, done),
                                ...test.options,
                            };
                            new Specberus().validate(options);
                        }
                    );
                }
            );
        });
    });
}

function runTestsForProfile({ docType, track, profile, rules }) {
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
        // DocType: TR/SUMB
        describe(`DocType: ${docType}`, () => {
            Object.entries(tracksOrProfiles).forEach(
                ([trackOrProfile, profilesOrRules]) => {
                    // Profile: SUBM
                    if (trackOrProfile === 'MEM-SUBM.js') {
                        runTestsForProfile({
                            docType,
                            profile: trackOrProfile,
                            rules: profilesOrRules,
                        });
                        return;
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
