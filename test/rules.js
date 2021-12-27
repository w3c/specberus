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

// External packages:
const express = require('express');
const expect = require('expect.js');
const chai = require('chai').expect;

// Internal packages:
const validation = require('./validation');
const { samples } = require('./samples');
const validator = require('../lib/validator');
const sink = require('../lib/sink');
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
    const specberus = new validator.Specberus(process.env.W3C_API_KEY);
    const handler = new sink.Sink(data => {
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
    const specberus = new validator.Specberus(process.env.W3C_API_KEY);

    describe('Method "extractMetadata"', () => {
        let i;

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
        for (i in samples) {
            compareMetadata(null, samples[i].file, samples[i]);
        }
    });

    describe('Method "validate"', () => {
        it('Should exist and be a function', done => {
            chai(specberus).to.have.property('validate').that.is.a('function');
            done();
        });
    });
});

const tests = {
    // Categories
    echidna: {
        'todays-date': [
            {
                doc: 'echidna/fails-future-date.html',
                errors: ['echidna.todays-date.wrong-date'],
            },
        ],
    },
    headers: {
        'div-head': [
            { doc: 'headers/simple.html' },
            {
                doc: 'headers/fails.html',
                errors: ['headers.div-head.not-found'],
            },
        ],
        hr: [
            { doc: 'headers/simple.html' },
            { doc: 'headers/hr.html' },
            { doc: 'headers/fails.html', errors: ['headers.hr.not-found'] },
            { doc: 'headers/fails-too.html', errors: ['headers.hr.not-found'] },
        ],
        logo: [
            { doc: 'headers/simple.html' },
            { doc: 'headers/logo.html' },
            { doc: 'headers/fails.html', errors: ['headers.logo.not-found'] },
        ],
        'h1-title': [
            { doc: 'headers/simple.html' },
            {
                doc: 'headers/fails.html',
                errors: ['headers.h1-title.not-found'],
            },
            {
                doc: 'headers/h1-title.html',
                errors: ['headers.h1-title.not-match'],
            },
            { doc: 'headers/h1-title-complex.html' },
        ],
        dl: [
            {
                doc: 'headers/dl-fpwd-good.html',
                config: { status: 'WD' },
            },
            {
                doc: 'headers/dl-history-error1.html',
                config: { status: 'WD' },
                errors: ['headers.dl.history-syntax'],
            },
            {
                doc: 'headers/dl-fpwd-new-level-bad.html',
                config: { status: 'WD' },
            },
            {
                doc: 'headers/dl-wd-good.html',
                config: { status: 'WD' },
            },
            {
                doc: 'headers/dl-wd-shortname-change-good.html',
                config: { status: 'WD' },
                warnings: ['headers.dl.this-previous-shortname'],
            },
            {
                doc: 'headers/simple.html',
                config: { status: 'WD' },
                errors: [
                    'headers.dl.no-history',
                    'headers.dl.editor-missing-id',
                ],
            },
            {
                doc: 'headers/fails.html',
                config: { status: 'REC' },
                errors: [
                    'headers.dl.no-history',
                    'headers.dl.this-version',
                    'headers.dl.latest-version',
                    'headers.dl.not-found',
                    'headers.dl.editor-not-found',
                ],
            },
            {
                doc: 'headers/fails.html',
                config: { status: 'REC' },
                errors: [
                    'headers.dl.no-history',
                    'headers.dl.this-version',
                    'headers.dl.latest-version',
                    'headers.dl.not-found',
                    'headers.dl.editor-not-found',
                ],
            },
            {
                doc: 'headers/dl-order.html',
                errors: [
                    'headers.dl.this-latest-order',
                    'headers.dl.implelink-should-be-https',
                    'headers.dl.editors-draft-should-be-https',
                ],
            },
            {
                doc: 'headers/dl-mismatch.html',
                config: { status: 'REC' },
                errors: [
                    'headers.dl.link-diff',
                    'headers.dl.this-syntax',
                    'headers.dl.link-diff',
                    'headers.dl.latest-syntax',
                    'headers.dl.link-diff',
                    'headers.dl.not-found',
                    'headers.dl.editor-not-found',
                ],
            },
            {
                doc: 'headers/wrong-urls.html',
                config: { status: 'WD' },
            },
            {
                doc: 'headers/dl-trailing-whitespace.html',
                config: { status: 'WD' },
            },
            {
                doc: 'headers/dl-untrimmed-text.html',
                config: { status: 'WD' },
            },
            {
                doc: 'headers/shortnameChange.html',
                config: { status: 'WD' },
                warnings: ['headers.dl.this-previous-shortname'],
                errors: ['headers.dl.history-bad-previous'],
            },
            {
                doc: 'headers/wg-note.html',
                config: { status: 'NOTE' },
            },
            { doc: 'headers/wg-note.html', config: { status: 'NOTE' } },
            {
                doc: 'headers/seriesShortlink.html',
                config: { status: 'WD' },
                errors: ['headers.dl.no-history'],
            },
            {
                doc: 'headers/dl-no-implelink.html',
                config: { status: 'CR' },
                warnings: ['headers.dl.implelink-confirm-no'],
            },
        ],
        'github-repo': [
            {
                doc: 'headers/simple.html',
                errors: ['headers.github-repo.no-feedback'],
            },
            {
                doc: 'sotd/github-bad.html',
                errors: ['headers.github-repo.no-repo'],
            },
            { doc: 'sotd/github-good.html' },
            { doc: 'sotd/github-good2.html' },
        ],
        errata: [
            {
                doc: 'headers/simple.html',
            },
            {
                doc: 'headers/simple-oxford.html',
                errors: ['headers.errata.no-errata'],
            },
        ],
        'w3c-state': [
            {
                doc: 'headers/simple.html',
                config: { longStatus: 'Working Draft', status: 'WD' },
            },
            {
                doc: 'headers/h2-comma.html',
                config: { longStatus: 'Working Draft', status: 'WD' },
            },
            {
                doc: 'headers/simple.html',
                config: { longStatus: 'Recommendation', status: 'REC' },
                errors: [
                    'headers.w3c-state.bad-w3c-state',
                    'headers.w3c-state.wrong-w3c-state-link',
                ],
            },
            {
                doc: 'headers/h2-not-found.html',
                errors: ['headers.w3c-state.no-w3c-state'],
                config: { longStatus: 'Working Draft', status: 'WD' },
            },
            {
                doc: 'sotd/cr-end.html',
                config: {
                    longStatus: 'Candidate Recommendation',
                    status: 'CR',
                    crType: 'Snapshot',
                },
                errors: ['headers.w3c-state.no-w3c-state-link'],
            },
            {
                doc: 'sotd/cr-end-27days.html',
                config: {
                    longStatus: 'Candidate Recommendation',
                    status: 'CRD',
                    crType: 'Draft',
                },
            },
            {
                doc: 'sotd/cr-end-27days.html',
                config: {
                    longStatus: 'Candidate Recommendation',
                    status: 'CR',
                    crType: 'Snapshot',
                },
                errors: [
                    'headers.w3c-state.bad-w3c-state',
                    'headers.w3c-state.wrong-w3c-state-link',
                ],
            },
            {
                doc: 'sotd/cr-end-multiple.html',
                config: {
                    longStatus: 'Candidate Recommendation',
                    status: 'CR',
                    crType: 'Snapshot',
                },
                errors: [
                    'headers.w3c-state.bad-w3c-state',
                    'headers.w3c-state.bad-w3c-state',
                ],
            },
        ],
        'h2-toc': [
            { doc: 'headers/simple.html' },
            { doc: 'headers/fails.html', errors: ['headers.h2-toc.not-found'] },
        ],
        'ol-toc': [
            { doc: 'headers/proper-toc.html' },
            {
                doc: 'headers/fails.html',
                warnings: ['headers.ol-toc.not-found'],
            },
        ],
        secno: [
            { doc: 'headers/proper-secno.html' },
            {
                doc: 'headers/fails.html',
                warnings: ['headers.secno.not-found'],
            },
        ],
        copyright: [
            {
                doc: 'headers/simple.html',
                errors: ['headers.copyright.no-license-found'],
            },
            {
                doc: 'headers/copyright-no-charter.html',
                errors: ['headers.copyright.no-data-from-API'],
            },
            {
                doc: 'headers/copyright-joint-no-union.html',
                errors: ['headers.copyright.no-license-found-joint'],
            },
            {
                doc: 'headers/copyright-good.html',
            },
            {
                doc: 'headers/copyright-good-datedlink.html',
            },
            {
                doc: 'headers/copyright-good-allow-both.html',
            },
            {
                doc: 'headers/copyright-bad-text.html',
                errors: ['headers.copyright.no-match'],
            },
            {
                doc: 'headers/copyright-bad-href.html',
                errors: [
                    'headers.copyright.href-not-match',
                    'headers.copyright.href-not-match',
                ],
            },
            {
                doc: 'headers/fails.html',
                errors: ['headers.copyright.not-found'],
            },
        ],
    },
    style: {
        sheet: [
            { doc: 'headers/simple.html', config: { styleSheet: 'W3C-WD' } },
            {
                doc: 'headers/simple-dark-mode.html',
                config: { styleSheet: 'W3C-WD' },
            },
            {
                doc: 'headers/fails.html',
                config: { styleSheet: 'W3C-WD' },
                errors: ['style.sheet.not-found'],
            },
            {
                doc: 'style/style-not-last.html',
                config: { styleSheet: 'W3C-WD' },
                errors: ['style.sheet.not-found'],
            },
        ],
        meta: [
            { doc: 'style/simple.html' },
            { doc: 'style/wrong-meta.html', errors: ['style.meta.not-found'] },
        ],
        script: [
            { doc: 'headers/simple.html', errors: ['style.script.not-found'] },
            { doc: 'headers/fixup.html' },
        ],
        'back-to-top': [
            {
                doc: 'headers/simple.html',
                warnings: ['style.back-to-top.not-found'],
            },
            { doc: 'headers/back-to-top.html' },
        ],
        'body-toc-sidebar': [
            { doc: 'style/simple.html' },
            {
                doc: 'style/wrong-meta.html',
                errors: ['style.body-toc-sidebar.class-found'],
            },
        ],
    },
    links: {
        internal: [
            { doc: 'links/internal-good.html' },
            {
                doc: 'links/internal-fails.html',
                errors: ['links.internal.anchor', 'links.internal.anchor'],
            },
        ],
        reliability: [
            {
                doc: 'links/internal-fails.html',
                warnings: [
                    // w3c-test.org is not reliable
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    // w3.org/Bugs is not reliable
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    // dev.w3.org, dvcs.w3.org are not reliable
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                    // tools.ietf.org is not reliable
                    'links.reliability.unreliable-link',
                    'links.reliability.unreliable-link',
                ],
            },
        ],
        linkchecker: [
            {
                url: 'links/external-resources.html',
                errors: [
                    'links.linkchecker.not-same-folder',
                    'links.linkchecker.not-same-folder',
                ],
                warnings: ['links.linkchecker.display'],
            },
            {
                url: 'links/broken-resources.html',
                errors: ['links.linkchecker.response-error'],
                warnings: ['links.linkchecker.display'],
            },
            {
                url: 'links/redirect-resources.html',
                errors: ['links.linkchecker.response-error-with-redirect'],
                warnings: ['links.linkchecker.display'],
            },
        ],
    },
    structure: {
        h2: [
            { doc: 'headers/simple.html' },
            {
                doc: 'structure/h2-abstract.html',
                errors: ['structure.h2.abstract'],
            },
            {
                doc: 'structure/h2-sotd.html',
                errors: ['structure.h2.abstract', 'structure.h2.sotd'],
            },
            {
                doc: 'structure/h2-toc.html',
                errors: [
                    'structure.h2.abstract',
                    'structure.h2.sotd',
                    'structure.h2.toc',
                ],
            },
        ],
        'section-ids': [
            { doc: 'structure/sid-ok.html' },
            {
                doc: 'structure/sid-all-wrong.html',
                errors: [
                    'structure.section-ids.no-id',
                    'structure.section-ids.no-id',
                    'structure.section-ids.no-id',
                    'structure.section-ids.no-id',
                    'structure.section-ids.no-id',
                    'structure.section-ids.no-id',
                ],
            },
        ],
        canonical: [
            { doc: 'headers/simple.html' },
            { doc: 'structure/canonical.html' },
            {
                doc: 'structure/canonical-missing.html',
                errors: ['structure.canonical.not-found'],
            },
            {
                doc: 'structure/canonical-href-missing.html',
                errors: ['structure.canonical.not-found'],
            },
        ],
        neutral: [
            {
                doc: 'structure/unneutral.html',
                warnings: ['structure.neutral.neutral'],
            },
            {
                doc: 'structure/unneutral2.html',
                warnings: ['structure.neutral.neutral'],
            },
            {
                doc: 'structure/unneutral3.html',
                warnings: ['structure.neutral.neutral'],
            },
            { doc: 'structure/neutral.html' },
            {
                doc: 'structure/canonical.html',
                warnings: ['structure.neutral.neutral'],
            },
        ],
    },
    sotd: {
        'rec-addition': [
            { doc: 'sotd/rec-addition-2021.html' },
            {
                doc: 'sotd/rec-obsl.html',
                errors: [
                    'sotd.rec-addition.no-section',
                    'sotd.rec-addition.no-section',
                ],
            },
            {
                doc: 'sotd/rec-rescind.html',
                errors: [
                    'sotd.rec-addition.wrong-text',
                    'sotd.rec-addition.wrong-text',
                ],
            },
            {
                doc: 'sotd/cr-end.html',
                errors: [
                    'sotd.rec-addition.unnecessary-section',
                    'sotd.rec-addition.unnecessary-section',
                ],
            },
            {
                doc: 'sotd/rec-publish-c-corrections-pass.html',
            },
            {
                doc: 'sotd/rec-publish-c-additions-pass.html',
            },
            {
                doc: 'sotd/rec-publish-c-changes-pass.html',
            },
        ],
        'rec-comment-end': [
            { doc: 'sotd/rec-addition-2021.html' },
            {
                doc: 'sotd/rec-obsl.html',
                errors: ['sotd.rec-comment-end.not-found'],
            },
            {
                doc: 'sotd/rec-rescind.html',
                warnings: ['sotd.rec-comment-end.multi-found'],
            },
        ],
        publish: [
            {
                doc: 'sotd/cr-end.html',
                config: {
                    status: 'CR',
                    track: 'Recommendation',
                    crType: 'Snapshot',
                },
            },
            {
                doc: 'sotd/cr-end-27days.html',
                config: {
                    status: 'CRD',
                    crType: 'Draft',
                    track: 'Recommendation',
                },
            },
            {
                doc: 'sotd/cr-end.html',
                config: {
                    status: 'CRD',
                    track: 'Recommendation',
                    crType: 'Draft',
                },
                errors: ['sotd.publish.not-found'],
            },
            {
                doc: 'sotd/rec-obsl.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/rec-rescind.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
                errors: ['sotd.publish.url-not-match'],
            },
            {
                doc: 'sotd/rec-superseded.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
                errors: ['sotd.publish.url-text-not-found'],
            },
            {
                doc: 'sotd/rec-publish-p-corrections-pass.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/rec-publish-p-corrections-fail.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
                errors: ['sotd.publish.url-not-match'],
            },
            {
                doc: 'sotd/rec-publish-p-corrections-fail2.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
                errors: ['sotd.publish.url-text-not-found'],
            },
            {
                doc: 'sotd/rec-publish-c-corrections-pass.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/rec-publish-c-additions-pass.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/rec-publish-c-changes-pass.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/rec-addition-2021.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/group-homepage.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/group-homepage-wrong.html',
                config: {
                    status: 'REC',
                    track: 'Recommendation',
                    longStatus: 'Recommendation',
                },
                errors: ['sotd.publish.no-homepage-link'],
            },
        ],
        'new-features': [
            { doc: 'sotd/rec-addition-2021.html', config: { status: 'REC' } },
            {
                doc: 'sotd/rec-addition-2021.html',
                config: { status: 'PR' },
                warnings: ['sotd.new-features.no-warning'],
            },
            {
                doc: 'sotd/cr-end-nodate.html',
                config: { status: 'REC' },
                errors: ['sotd.new-features.no-link'],
            },
        ],
        usage: [
            {
                doc: 'p2021/2021-ry.html',
                config: {
                    longStatus: 'Registry',
                },
            },
            {
                doc: 'p2021/2021-rec.html',
                config: {
                    longStatus: 'Registry',
                },
                errors: ['sotd.usage.not-found'],
            },
        ],
        'draft-stability': [
            {
                doc: 'headers/simple.html',
                config: { longStatus: 'Working Draft' },
            },
            {
                doc: 'headers/wd.html',
                config: { status: 'WD', longStatus: 'Working Draft' },
            },
            {
                doc: 'online/WD-screen-orientation.html',
                config: { longStatus: 'Working Draft' },
            },
            {
                doc: 'p2021/2021-dnote.html',
                config: { status: 'DNOTE', longStatus: 'Draft Note' },
            },
            {
                doc: 'p2021/2021-crd.html',
                config: {
                    status: 'CRD',
                    longStatus: 'Candidate Recommendation',
                    crType: 'Draft',
                },
            },
        ],
        supersedable: [
            { doc: 'headers/simple.html' },
            {
                doc: 'sotd/supersedable.html',
                errors: [
                    'sotd.supersedable.no-sotd-intro',
                    'sotd.supersedable.no-sotd-tr',
                ],
            },
        ],
        pp: [
            {
                doc: 'headers/simple.html',
                config: { track: 'Recommendation' },
                errors: ['sotd.pp.undefined'],
            },
            {
                doc: 'sotd/pp-bad.html',
                config: { track: 'Recommendation', patentPolicy: 'pp2004' },
                errors: ['sotd.pp.no-pp-from-charter'],
            },
            {
                doc: 'sotd/joint-publication-bad-pp-version.html',
                config: {
                    track: 'Recommendation',
                    patentPolicy: 'pp2004',
                },
                errors: ['sotd.pp.no-pp'],
                warnings: ['sotd.pp.joint-publication'],
            },
            {
                doc: 'sotd/wrong-pp-from-charter.html',
                config: {
                    track: 'Recommendation',
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.wrong-pp-from-charter'],
            },
            {
                doc: 'sotd/joint-publication-diff-pp-version.html',
                config: {
                    track: 'Recommendation',
                    patentPolicy: 'pp2020',
                },
                errors: ['sotd.pp.no-pp'],
                warnings: ['sotd.pp.joint-publication'],
            },
            {
                doc: 'sotd/joint-publication-good.html',
                config: {
                    track: 'Recommendation',
                    patentPolicy: 'pp2004',
                },
                warnings: ['sotd.pp.joint-publication'],
            },
            {
                doc: 'sotd/joint-publication-tag.html',
                config: { track: 'Note' },
                warnings: ['sotd.pp.joint-publication'],
            },
            {
                doc: 'sotd/joint-publication-fail.html',
                config: { track: 'Recommendation', patentPolicy: 'pp2004' },
                errors: ['sotd.pp.no-pp'],
            },
            {
                doc: 'headers/wg-note.html',
                config: {
                    longStatus: 'Working Group Note',
                    patentPolicy: 'pp2004',
                    track: 'Note',
                },
            },
            {
                doc: 'headers/wg-note1.html',
                config: {
                    longStatus: 'Working Group Note',
                    patentPolicy: 'pp2004',
                    track: 'Note',
                },
                errors: ['sotd.pp.no-pp-from-charter'],
            },
            {
                doc: 'sotd/pp-20170801.html',
                config: {
                    track: 'Recommendation',
                    patentPolicy: 'pp2004',
                },
            },
            {
                doc: 'sotd/pp-20200915.html',
                config: { track: 'Recommendation', patentPolicy: 'pp2020' },
                errors: ['sotd.pp.wrong-pp-from-charter'],
            },
            {
                doc: 'sotd/pp-20200915-iprlink.html',
                config: { track: 'Recommendation', patentPolicy: 'pp2020' },
                errors: ['sotd.pp.no-pp-from-charter'],
            },
            { doc: 'headers/wd.html' },
            {
                doc: 'sotd/wg-note-IG-good.html',
                config: {
                    longStatus: 'Working Group Note',
                    patentPolicy: 'pp2004',
                },
            },
            {
                doc: 'sotd/wg-note-IG-bad.html',
                config: {
                    longStatus: 'Working Group Note',
                    patentPolicy: 'pp2004',
                },
                errors: ['sotd.pp.no-pp'],
            },
        ],
        charter: [
            {
                doc: 'headers/ig-note.html',
                config: {
                    longStatus: 'Interest Group Note',
                },
            },
            {
                doc: 'online/IG-NOTE-media-timed-events.html',
                config: {
                    longStatus: 'Interest Group Note',
                },
                errors: ['sotd.charter.wrong-link'],
            },
            {
                doc: 'headers/ig-note2.html',
                config: {
                    longStatus: 'Interest Group Note',
                },
                errors: ['sotd.charter.no-group'],
            },
            {
                doc: 'headers/ig-note3.html',
                config: {
                    longStatus: 'Interest Group Note',
                },
                errors: ['sotd.charter.text-not-found'],
            },
            {
                doc: 'headers/wg-note.html',
                config: {
                    longStatus: 'Working Group Note',
                },
            },
            {
                doc: 'headers/wg-note1.html',
                config: {
                    longStatus: 'Working Group Note',
                },
                errors: ['sotd.charter.no-charter'],
            },
        ],
        stability: [
            {
                doc: 'headers/simple.html',
                config: { longStatus: 'Working Draft' },
            },
            {
                doc: 'headers/simple.html',
                config: { longStatus: 'Rock And Roll' },
                errors: ['sotd.stability.no-stability'],
            },
            {
                doc: 'sotd/supersedable.html',
                config: {
                    longStatus: 'Rock And Roll',
                },
                errors: ['sotd.stability.no-stability'],
            },
            {
                doc: 'headers/ig-note.html',
                config: {
                    longStatus: 'Interest Group Note',
                },
            },
            {
                doc: 'headers/wg-note.html',
                config: {
                    longStatus: 'Working Group Note',
                },
                errors: ['sotd.stability.no-stability'],
            },
            {
                doc: 'headers/wg-note1.html',
                config: {
                    longStatus: 'Working Group Note',
                },
            },
            {
                doc: 'headers/wg-note2.html',
                config: {
                    longStatus: 'Working Group Note',
                },
            },
            {
                doc: 'headers/wd.html',
                config: {
                    status: 'WD',
                    longStatus: 'Working Draft',
                },
            },
            {
                doc: 'headers/wd.html',
                config: {
                    status: 'CR',
                    longStatus: 'Candidate Recommendation',
                },
                errors: [
                    'sotd.stability.no-stability',
                    'sotd.stability.no-licensing-link',
                ],
            },
            {
                doc: 'sotd/rec-addition-2021.html',
                config: {
                    status: 'REC',
                    longStatus: 'Recommendation',
                },
            },
            {
                doc: 'sotd/rec-obsl.html',
                config: { status: 'REC' },
                errors: ['sotd.stability.no-licensing-link'],
            },
            {
                doc: 'sotd/cr-end-27days.html',
                config: {
                    crType: 'Snapshot',
                    longStatus: 'Candidate Recommendation',
                },
                errors: ['sotd.stability.no-cr-review'],
            },
            {
                doc: 'sotd/cr-end-multiple.html',
                config: {
                    crType: 'Snapshot',
                    longStatus: 'Candidate Recommendation',
                },
                errors: ['sotd.stability.wrong-cr-review-link'],
            },
            {
                doc: 'online/WG-NOTE-lpf.html',
                config: {
                    longStatus: 'Working Group Note',
                },
            },
            {
                doc: 'online/WD-screen-orientation.html',
                config: { longStatus: 'Working Draft' },
            },
            {
                doc: 'online/IG-NOTE-media-timed-events.html',
                config: {
                    longStatus: 'Interest Group Note',
                },
            },
            {
                doc: 'p2021/2021-ry.html',
                config: {
                    longStatus: 'Registry',
                },
            },
            {
                doc: 'p2021/2021-stmt.html',
                config: {
                    longStatus: 'Statement',
                },
            },
        ],
        'ac-review': [
            { doc: 'sotd/supersedable.html' },
            { doc: 'sotd/pp-bad.html', errors: ['sotd.ac-review.not-found'] },
        ],
        'process-document': [
            {
                doc: 'sotd/process2019.html',
                errors: [
                    'sotd.process-document.wrong-process',
                    'sotd.process-document.not-found',
                ],
            },
            { doc: 'sotd/rec-addition-2021.html' },
            {
                doc: 'sotd/process2019-not-allowed.html',
                errors: [
                    'sotd.process-document.wrong-process',
                    'sotd.process-document.not-found',
                ],
            },
            {
                doc: 'sotd/wrongprocess.html',
                errors: [
                    'sotd.process-document.wrong-process',
                    'sotd.process-document.not-found',
                ],
            },
        ],
        'obsl-rescind': [
            { doc: 'sotd/rec-obsl.html', config: { obsoletes: true } },
            { doc: 'sotd/rec-rescind.html', config: { rescinds: true } },
            { doc: 'sotd/rec-superseded.html', config: { supersedes: true } },
            {
                doc: 'sotd/rec-rescind.html',
                config: { obsoletes: true },
                errors: ['sotd.obsl-rescind.no-rationale'],
            },
            {
                doc: 'sotd/rec-obsl.html',
                config: { rescinds: true },
                errors: ['sotd.obsl-rescind.no-rationale'],
            },
            {
                doc: 'sotd/rec-superseded.html',
                config: { supersedes: false },
                errors: ['sotd.obsl-rescind.no-rationale'],
            },
        ],
        'deliverer-note': [
            { doc: 'sotd/note-deliverer.html', config: { status: 'WG-NOTE' } },
            {
                doc: 'sotd/note-deliverer-bad.html',
                config: { status: 'WG-NOTE' },
                errors: ['sotd.deliverer-note.not-found'],
            },
        ],
        'candidate-review-end': [
            {
                doc: 'metadata/cr-mediacapture-streams.html',
                config: { status: 'CR' },
            },
            {
                doc: 'metadata/cr-mediacapture-streams.html',
                config: { status: 'CR', editorial: true },
                warnings: ['sotd.candidate-review-end.editorial'],
            },
            { doc: 'sotd/cr-end.html', config: { status: 'CR' } },
            {
                doc: 'sotd/cr-end-27days.html',
                config: { status: 'CR' },
                errors: ['sotd.candidate-review-end.not-found'],
            },
            {
                doc: 'sotd/cr-end-multiple.html',
                config: { status: 'CR' },
                warnings: ['sotd.candidate-review-end.multiple-found'],
            },
            {
                doc: 'sotd/cr-end-nodate.html',
                config: { status: 'CR' },
                errors: ['sotd.candidate-review-end.found-not-valid'],
            },
        ],
    },
    heuristic: {
        'date-format': [
            { doc: 'heuristic/dates.html' },
            {
                doc: 'heuristic/bad-dates.html',
                errors: [
                    'heuristic.date-format.wrong',
                    'heuristic.date-format.wrong',
                ],
            },
            { doc: 'heuristic/dated-url.html' },
        ],
    },
    validation,
};

// start an server to host doc, response to sr.url requests
const app = express();
app.use('/docs', express.static(pth.join(__dirname, 'docs')));
const expressServer = app.listen(PORT, () => {});

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

describe('Making sure Specberus is not broken...', () => {
    after(() => {
        expressServer.close();
    });
    Object.keys(tests).forEach(category => {
        describe(`Category ${category}`, () => {
            Object.keys(tests[category]).forEach(rule => {
                describe(`Rule ${rule}`, () => {
                    tests[category][rule].forEach(test => {
                        const passTest = !test.errors;
                        it(`should ${passTest ? 'pass' : 'fail'} for ${
                            test.doc || test.url
                        }`, done => {
                            // eslint-disable-next-line import/no-dynamic-require
                            const r = require(`../lib/rules/${category}/${rule}`);
                            const handler = new sink.Sink();
                            handler.on('err', (type, data) => {
                                if (DEBUG) console.log(type, data);
                                handler.errors.push(`${type.name}.${data.key}`);
                            });
                            handler.on('warning', (type, data) => {
                                if (DEBUG) console.log('[W]', data);
                                handler.warnings.push(
                                    `${type.name}.${data.key}`
                                );
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
                                    let i;
                                    let n;
                                    if (passTest) {
                                        expect(handler.errors).to.be.empty();
                                    } else {
                                        expect(handler.errors.length).to.eql(
                                            test.errors.length
                                        );
                                        for (
                                            i = 0, n = test.errors.length;
                                            i < n;
                                            i += 1
                                        ) {
                                            expect(handler.errors).to.contain(
                                                test.errors[i]
                                            );
                                        }
                                    }
                                    if (!test.ignoreWarnings) {
                                        if (test.warnings) {
                                            expect(
                                                handler.warnings.length
                                            ).to.eql(test.warnings.length);
                                            for (
                                                i = 0, n = test.warnings.length;
                                                i < n;
                                                i += 1
                                            ) {
                                                expect(
                                                    handler.warnings
                                                ).to.contain(test.warnings[i]);
                                            }
                                        } else {
                                            expect(
                                                handler.warnings
                                            ).to.be.empty();
                                        }
                                    }
                                    done();
                                } catch (e) {
                                    return done(e);
                                }
                            });
                            const profile = {
                                name: `Synthetic ${category}/${rule}`,
                                rules: [r],
                            };
                            profile.config = test.config;
                            const options = {
                                profile,
                                events: handler,
                            };

                            // support both external urls and local files
                            if (test.url)
                                options.url = `${ENDPOINT}/docs/${test.url}`;
                            else
                                options.file = pth.join(
                                    __dirname,
                                    'docs',
                                    test.doc
                                );

                            for (const o in test.options)
                                options[o] = test.options[o];
                            new validator.Specberus(
                                process.env.W3C_API_KEY
                            ).validate(options);
                        });
                    });
                });
            });
        });
    });
});
