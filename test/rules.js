// Native packages:
// eslint-disable-next-line node/no-unpublished-import
import { expect as chai } from 'chai';
// eslint-disable-next-line node/no-unpublished-import
import expect from 'expect.js';
// External packages:
import express from 'express';
import exphbs from 'express-handlebars';
import { lstatSync, readdirSync } from 'fs';
// eslint-disable-next-line node/no-unpublished-import
import nock from 'nock';
import pth, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Sink } from '../lib/sink.js';
import { allProfiles } from '../lib/util.js';
// Internal packages:
import { Specberus } from '../lib/validator.js';
// A list of good documents to be tested, using all rules configured in the profiles.
// Shouldn't cause any error.
import { goodDocuments } from './data/goodDocuments.js';
import { samples } from './samples.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Test the rules.
 */

// Settings:
const DEBUG = process.env.DEBUG || false;
const DEFAULT_PORT = 8001;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}`;

/**
 * Compare two arrays of "deliverer IDs" and check that they're equivalent.
 *
 * @param {Array} a1 - One array.
 * @param {Array} a2 - The other array.
 * @returns {Boolean} whether the two arrays contain exactly the same integers.
 */

const equivalentArray = function (a1, a2) {
    if (a1 && a2 && a1.length === a2.length) {
        let found = 0;
        for (let i = 0; i < a1.length; i += 1) {
            for (let j = 0; j < a2.length && found === i; j += 1) {
                if (a1[i] === a2[j]) {
                    found += 1;
                }
            }
        }
        return found === a1.length;
    }

    return false;
};

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

// start an server to host doc, response to sr.url requests
const app = express();
app.use('/docs', express.static(pth.join(__dirname, 'docs')));

// use express-handlebars
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: pth.join(__dirname, './doc-views/layout/spec'),
        layoutsDir: pth.join(__dirname, './doc-views'),
        partialsDir: pth.join(__dirname, './doc-views/partials/'),
    })
);
app.set('view engine', 'handlebars');
app.set('views', pth.join(__dirname, './doc-views'));

function renderByConfig(req, res) {
    const { rule, type } = req.query;
    const suffix = req.params.track
        ? `${req.params.track}/${req.params.profile}`
        : req.params.profile;

    // get data for template from json (.js)
    const path = pth.join(
        __dirname,
        `./doc-views/${req.params.docType}/${suffix}.js`
    );

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    import(path).then(module => {
        const data = module.default;

        let finalData;
        if (!type)
            res.send(
                '<h1>Error: please add the parameter "type" in the URL </h1>'
            );
        else if (type.startsWith('good')) {
            finalData = data[type];
        } else {
            if (!rule)
                res.send(
                    '<h1>Error: please add the parameter "rule" in the URL </h1>'
                );

            // for data causes error, make rule and the type of error specific.
            finalData = data[rule][type];
        }
        res.render(pth.join(__dirname, './doc-views/layout/spec'), finalData);
    });
}

app.get('/doc-views/:docType/:track/:profile', renderByConfig);
app.get('/doc-views/:docType/:profile', renderByConfig);

// config single redirection
app.get('/docs/links/image/logo', (req, res) => {
    res.redirect('/docs/links/image/logo.png');
});
// config single redirection to no where (404)
app.get('/docs/links/image/logo-fail', (req, res) => {
    res.redirect('/docs/links/image/logo-fail.png');
});
// config multiple redirection
app.get('/docs/links/image/logo-redirection-1', (req, res) => {
    res.redirect(301, '/docs/links/image/logo-redirection-2');
});
app.get('/docs/links/image/logo-redirection-2', (req, res) => {
    res.redirect(307, '/docs/links/image/logo-redirection-3');
});
app.get('/docs/links/image/logo-redirection-3', (req, res) => {
    res.redirect('/docs/links/image/logo.png');
});

let server;

before(done => {
    server = app.listen(PORT, done);
});

after(done => {
    if (server) {
        server.close(done);
    }
});

function buildHandler(test, mock, done) {
    const handler = new Sink();

    if (mock) {
        // Mock some external calls to speed up the test suite
        nock('https://www.w3.org', { allowUnmocked: true })
            .head('/standards/history/hr-time')
            .reply(200, 'HR Time history page');
        const versions = {
            page: 1,
            pages: 1,
            _embedded: {
                'version-history': [
                    {
                        uri: 'https://www.w3.org/TR/2022/WD-hr-time-3-20220117/',
                    },
                    {
                        uri: 'https://www.w3.org/TR/2021/WD-hr-time-3-20211201/',
                    },
                    {
                        uri: 'https://www.w3.org/TR/2021/WD-hr-time-3-20211012/',
                    },
                ],
            },
        };
        nock('https://api.w3.org', { allowUnmocked: true })
            .get('/specifications/hr-time/versions')
            .query({ embed: true })
            .reply(200, versions);

        const groupNames = {
            'i18n-core': 32113,
            forms: 32219,
            apa: 83907,
            ag: 35422,
        };
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

        const chartersData = {
            32113: [
                {
                    end: '2021-09-30',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2019-06-28',
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20170801/',
                },
                {
                    end: '2090-09-30',
                    'doc-licenses': [
                        {
                            uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                            name: 'W3C Software and Document License',
                        },
                    ],
                    start: '2021-09-30',
                    'patent-policy':
                        'https://www.w3.org/Consortium/Patent-Policy-20200915/',
                },
            ],
            32219: {
                end: '2012-03-31',
                'doc-licenses': [],
                start: '2010-05-17',
            },
            83907: {
                end: '2090-07-31',
                'doc-licenses': [
                    {
                        uri: 'https://www.w3.org/Consortium/Legal/copyright-documents',
                        name: 'W3C Document License',
                    },
                    {
                        uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                        name: 'W3C Software and Document License',
                    },
                ],
                start: '2021-08-11',
                'patent-policy':
                    'https://www.w3.org/Consortium/Patent-Policy-20200915/',
            },
            35422: {
                end: '2090-10-31',
                'doc-licenses': [
                    {
                        uri: 'https://www.w3.org/Consortium/Legal/copyright-documents',
                        name: 'W3C Document License',
                    },
                    {
                        uri: 'https://www.w3.org/Consortium/Legal/copyright-software',
                        name: 'W3C Software and Document License',
                    },
                ],
                start: '2019-12-20',
                'patent-policy':
                    'https://www.w3.org/Consortium/Patent-Policy-20170801/',
            },
        };

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

function checkRule(tests, options) {
    const { docType, track, profile, category, rule } = options;

    tests.forEach(test => {
        const passOrFail = !test.errors ? 'pass' : 'fail';
        const suffix = track ? `${track}/${profile}` : profile;
        const url = `${ENDPOINT}/doc-views/${docType}/${suffix}?rule=${rule}&type=${test.data}`;

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

// ignore .DS_Store from Mac
function listFilesOf(dir) {
    const files = readdirSync(dir);
    const blocklist = ['.DS_Store', 'Base.js'];

    return files.filter(v => !blocklist.find(b => v.includes(b)));
}

const flat = objs => objs.reduce((acc, cur) => ({ ...acc, ...cur }), {});

const buildProfileTestCases = async path => {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { rules } = await import(path);
    return rules;
};

const buildTrackTestCases = async path => {
    if (lstatSync(path).isFile()) {
        const profile = await buildProfileTestCases(path);
        return profile;
    }

    const profiles = await Promise.all(
        listFilesOf(path).map(async profile => ({
            [profile]: await buildProfileTestCases(`${path}/${profile}`),
        }))
    );

    return flat(profiles);
};

const buildDocTypeTestCases = async path => {
    const tracks = await Promise.all(
        listFilesOf(path).map(async track => ({
            [track]: await buildTrackTestCases(`${path}/${track}`),
        }))
    );

    return flat(tracks);
};

const buildBadTestCases = async () => {
    const base = `${process.cwd()}/test/data`;
    const docTypes = await Promise.all(
        listFilesOf(base)
            .filter(v => lstatSync(`${base}/${v}`).isDirectory())
            .map(async docType => ({
                [docType]: await buildDocTypeTestCases(`${base}/${docType}`),
            }))
    );

    return flat(docTypes);
};

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
