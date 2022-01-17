/* eslint-disable import/no-dynamic-require */
/**
 * Test the rules.
 */

// Settings:
const DEBUG = process.env.DEBUG || false;
const DEFAULT_PORT = 8001;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}`;
// Native packages:
const pth = require('path');
const { readdirSync, lstatSync } = require('fs');

// External packages:
const express = require('express');
const expect = require('expect.js');
const chai = require('chai').expect;
const exphbs = require('express-handlebars');

// Internal packages:
const { Specberus } = require('../lib/validator');
const { Sink } = require('../lib/sink');
const util = require('../lib/util');
const { samples } = require('./samples');

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
 * @param {String} file - name of local file containing a spec (without pth and without ".html" suffix).
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
                .to.have.property('previousVersion')
                .equal(expectedObject.previousVersion);
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
        defaultLayout: pth.join(__dirname, './doc-views/layout/TR'),
        layoutsDir: pth.join(__dirname, './doc-views'),
        partialsDir: pth.join(__dirname, './doc-views/partials/'),
    })
);
app.set('view engine', 'handlebars');
app.set('views', pth.join(__dirname, './doc-views'));

app.get('/doc-views/:docType/:profile/:track', (req, res) => {
    const { rule, type } = req.query;
    // get data for template from json (.js)
    const data = require(pth.join(
        __dirname,
        `./doc-views/${req.params.docType}/${req.params.profile}/${req.params.track}.js`
    ));

    let finalData;
    if (type.startsWith('good')) {
        finalData = data[type];
    } else {
        if (!rule)
            res.send(
                '<h1>Error: please add the parameter "rule" in the URL </h1>'
            );
        if (!type)
            res.send(
                '<h1>Error: please add the parameter "type" in the URL </h1>'
            );
        // for data causes error, make rule and the type of error specific.
        finalData = data[rule][type];
    }

    res.render(pth.join(__dirname, './doc-views/layout/TR'), finalData);
});

app.get('/doc-views/SUBM/MEM-SUBM', (req, res) => {
    // get data for template from json (.js)
    const { goodData } = require(pth.join(
        __dirname,
        `./doc-views/SUBM/MEM-SUBM.js`
    ));

    res.render(pth.join(__dirname, './doc-views/layout/TR'), goodData);
});

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

// A list of good documents to be tested, using all rules configured in the profiles.
// Shouldn't cause any error.
const { goodDocuments } = require('./data/goodDocuments');

const testsGoodDoc = goodDocuments;

function buildHandler(test, done) {
    const handler = new Sink();
    handler.on('err', (type, data) => {
        if (DEBUG) console.log(type, data);
        handler.errors.push(`${type.name}.${data.key}`);
    });
    handler.on('warning', (type, data) => {
        if (DEBUG) console.log('[W]', data);
        handler.warnings.push(`${type.name}.${data.key}`);
    });
    handler.on('done', () => {
        if (DEBUG) console.log('---done---');
        handler.done += 1;
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

// The next check is running each profile using the rules configured.
describe('Making sure good documents pass Specberus...', () => {
    Object.keys(testsGoodDoc).forEach(docProfile => {
        // testsGoodDoc[docProfile].profile is used to distinguish multiple cases for same profile.
        docProfile = testsGoodDoc[docProfile].profile || docProfile;

        const url = `${ENDPOINT}/${testsGoodDoc[docProfile].url}`;
        it(`should pass for ${docProfile} doc with ${url}`, done => {
            const profile = util.profiles[docProfile];

            // add custom config to test
            profile.config = {
                patentPolicy: 'pp2020', // default config for all docs.
                ...profile.config,
                ...testsGoodDoc[docProfile].config,
            };

            // remove unnecessary rules from test
            const { removeRules } = require('../lib/profiles/profileUtil');
            const rules = removeRules(profile.rules, [
                'validation.html',
                'validation.wcag',
                'links.linkchecker', // too slow. will check separately.
            ]);

            const options = {
                profile: {
                    ...profile,
                    rules, // do not change profile.rules
                },
                events: buildHandler({ ignoreWarnings: true }, done),
                url,
            };

            // for (const o in test.options) options[o] = test.options[o];
            new Specberus(process.env.W3C_API_KEY).validate(options);
        });
    });
});

function checkRule(tests, options) {
    const [docType, track, profile, category, rule] = options;
    tests.forEach(test => {
        const passOrFail = !test.errors ? 'pass' : 'fail';
        const url = `${ENDPOINT}/doc-views/${docType}/${track}/${profile}?rule=${rule}&type=${test.data}`;

        it(`should ${passOrFail} for ${url}`, done => {
            const options = {
                url,
                profile: {
                    name: `Synthetic ${profile}/${rule}`,
                    rules: [require(`../lib/rules/${category}/${rule}`)],
                    config: test.config,
                },
                events: buildHandler(test, done),
                ...test.options,
            };

            new Specberus(process.env.W3C_API_KEY).validate(options);
        });
    });
}

// The next check runs every rule for each profile, one rule at a time, and should trigger every existing errors and warnings in lib/l10n-en_GB.js
describe('Making sure Specberus is not broken...', () => {
    const base = `${process.cwd()}/test/data`;
    readdirSync(base)
        .filter(v => lstatSync(`${base}/${v}`).isDirectory())
        .forEach(docType => {
            // DocType: TR/SUMB
            describe(`DocType: ${docType}:`, () => {
                readdirSync(`${base}/${docType}`).forEach(track => {
                    // Track: Note/Recommendation/Registry
                    describe(`Track: ${track}`, () => {
                        readdirSync(`${base}/${docType}/${track}`).forEach(
                            file => {
                                const lastDot = file.lastIndexOf('.');
                                const profile = file.substring(0, lastDot);
                                // Profile: CR/NOTE/RY ...
                                describe(`Profile: ${profile}`, () => {
                                    const config = require(`${base}/${docType}/${track}/${file}`);
                                    Object.entries(config.rules).forEach(
                                        ([category, rules]) => {
                                            Object.entries(rules).forEach(
                                                ([rule, tests]) => {
                                                    // Rule: hr/logo ...
                                                    describe(`Rule: ${category}.${rule}`, () => {
                                                        checkRule(tests, [
                                                            docType,
                                                            track,
                                                            profile,
                                                            category,
                                                            rule,
                                                        ]);
                                                    });
                                                }
                                            );
                                        }
                                    );
                                });
                            }
                        );
                    });
                });
            });
        });
});
