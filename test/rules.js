// Native packages:
// eslint-disable-next-line node/no-unpublished-import
import { expect as chai } from 'chai';
// eslint-disable-next-line node/no-unpublished-import
import expect from 'expect.js';

// eslint-disable-next-line node/no-unpublished-import
import nock from 'nock';
import { Sink } from '../lib/sink.js';
import { allProfiles } from '../lib/util.js';
// Internal packages:
import { Specberus } from '../lib/validator.js';
// A list of good documents to be tested, using all rules configured in the profiles.
// Shouldn't cause any error.
import { goodDocuments } from './data/goodDocuments.js';
import { samples } from './samples.js';
import { app } from './lib/testserver.js';
import { buildBadTestCases, equivalentArray } from './lib/utils.js';
import { nockData } from './lib/nockData.js';

/**
 * Test the rules.
 */

// Settings:
const DEBUG = process.env.DEBUG || false;
const DEFAULT_PORT = 8001;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}`;

/**
 * Assert that metadata detected in a spec is equal to the expected values.
 *
 * @param {String} url - public URL of a spec.
 * @param {String} file - name of local file containing a spec (without path and without ".html" suffix).
 * @param {Object} expectedObject - values that are expected to be found.
 */

const compareMetadata = function (url, file, expectedObject) {
    const specberus = new Specberus(process.env.W3C_API_KEY);
    const handler = new Sink(data => {
        throw new Error(data);
    });
    const thisFile = file ? `test/docs/${file}.html` : null;
    // test only local fixtures
    const opts = { events: handler, file: thisFile };

    it(`Should detect metadata for ${thisFile}`, done => {
        handler.on('end-all', () => {
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('profile')
                .equal(expectedObject.profile);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('title')
                .equal(expectedObject.title);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('docDate')
                .equal(expectedObject.docDate);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('thisVersion')
                .equal(expectedObject.thisVersion);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('latestVersion')
                .equal(expectedObject.latestVersion);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('editorNames');
            chai(specberus.meta.editorNames).to.satisfy(found =>
                equivalentArray(found, expectedObject.editorNames)
            );
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('delivererIDs');
            chai(specberus.meta.delivererIDs).to.satisfy(found =>
                equivalentArray(found, expectedObject.delivererIDs)
            );
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('editorIDs');
            chai(specberus.meta.editorIDs).to.satisfy(found =>
                equivalentArray(found, expectedObject.editorIDs)
            );
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('informative')
                .equal(expectedObject.informative);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('rectrack')
                .equal(expectedObject.rectrack);
            chai(specberus)
                .to.have.property('meta')
                .to.have.property('history')
                .equal(expectedObject.history);
            const optionalProperties = [
                'process',
                'previousVersion',
                'editorsDraft',
                'implementationFeedbackDue',
                'prReviewsDue',
                'implementationReport',
                'errata',
            ];
            optionalProperties.forEach(p => {
                if (Object.prototype.hasOwnProperty.call(expectedObject, p)) {
                    chai(specberus)
                        .to.have.property('meta')
                        .to.have.property(p)
                        .equal(expectedObject[p]);
                }
            });
            done();
        });
        specberus.extractMetadata(opts);
    });
};

describe('Basics', () => {
    const specberus = new Specberus(process.env.W3C_API_KEY);

    describe('Method "extractMetadata"', () => {
        it('Should exist and be a function', done => {
            chai(specberus)
                .to.have.property('extractMetadata')
                .that.is.a('function');
            done();
        });

        // if (!process || !process.env || (process.env.TRAVIS !== 'true' && !process.env.SKIP_NETWORK)) {
        //     for(i in samples) {
        //         compareMetadata(samples[i].url, null, samples[i]);
        //     }
        // }
        // else {
        //     for(i in samples) {
        //         compareMetadata(null, samples[i].file, samples[i]);
        //     }
        // }
        samples.forEach(sample => {
            compareMetadata(null, sample.file, sample);
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

function buildHandler(test, mock, done) {
    const handler = new Sink();

    if (mock) {
        // Mock some external calls to speed up the test suite
        nock('https://www.w3.org', { allowUnmocked: true })
            .head('/standards/history/hr-time')
            .reply(200, 'HR Time history page');
        const { versions } = nockData;
        nock('https://api.w3.org', { allowUnmocked: true })
            .get('/specifications/hr-time/versions')
            .query({ embed: true })
            .reply(200, versions);

        const { groupNames } = nockData;
        Object.keys(groupNames).forEach(groupName => {
            const groupId = groupNames[groupName];
            nock('https://api.w3.org', { allowUnmocked: true })
                .get(
                    `/groups/wg/${groupName}?apikey=${process.env.W3C_API_KEY}`
                )
                .reply(200, {
                    id: groupId,
                    type: 'working group',
                });
        });

        const { chartersData } = nockData;
        Object.keys(chartersData).forEach(groupId => {
            const charterData = Array.isArray(chartersData[groupId])
                ? chartersData[groupId]
                : [chartersData[groupId]];
            // nock('https://api.w3.org', { allowUnmocked: true })
            nock('https://api.w3.org')
                .get(`/groups/${groupId}/charters?embed=true`)
                .reply(200, {
                    _embedded: {
                        charters: charterData,
                    },
                });
        });
    }
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
            if (mock) nock.cleanAll();
        } catch (e) {
            done(e);
        }
    });

    return handler;
}

const testsGoodDoc = goodDocuments;

// The next check is running each profile using the rules configured.
describe('Making sure good documents pass Specberus...', () => {
    Object.keys(testsGoodDoc).forEach(docProfile => {
        // testsGoodDoc[docProfile].profile is used to distinguish multiple cases for same profile.
        docProfile = testsGoodDoc[docProfile].profile || docProfile;

        const url = `${ENDPOINT}/${testsGoodDoc[docProfile].url}`;
        it(`should pass for ${docProfile} doc with ${url}`, done => {
            const profilePath = allProfiles.find(p =>
                p.endsWith(`/${docProfile}.js`)
            );
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
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
                // eslint-disable-next-line node/no-unsupported-features/es-syntax
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
                                false,
                                done
                            ),
                            url,
                        };

                        // for (const o in test.options) options[o] = test.options[o];
                        new Specberus(process.env.W3C_API_KEY).validate(
                            options
                        );
                    }
                );
            });
        });
    });
});

// These 3 environment variables are to reduce test documents.
// e.g. `RULE=copyright TYPE=noCopyright PROFILE=WD npm run test`
const testRule = process.env.RULE;
const testType = process.env.TYPE;
const testProfile = process.env.PROFILE;

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
            (testProfile && profile !== 'CR')
        )
            return;

        it(`should ${passOrFail} for ${url}`, done => {
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            import(`../lib/profiles/${docType}/${suffix}.js`).then(
                ({ config }) => {
                    // eslint-disable-next-line node/no-unsupported-features/es-syntax
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
                                events: buildHandler(test, true, done),
                                ...test.options,
                            };
                            new Specberus(process.env.W3C_API_KEY).validate(
                                options
                            );
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
