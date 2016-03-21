/**
 * Test the rules.
 */

// Settings:
const DEBUG = false
,   META_PROFILE = 'profile'
,   META_DELIVERER_IDS = 'delivererIDs'
;

// Native packages:
const pth = require('path');

// External packages:
const expect = require('expect.js')
,   chai = require('chai').expect
;

// Internal packages:
const validation = require('./validation')
,   samples = require('./samples')
,   validator = require('../lib/validator')
,   sink = require('../lib/sink')
;

/**
 * Compare two arrays of "deliverer IDs" and check that they're equivalent.
 *
 * @param {Array} a1 - One array.
 * @param {Array} a2 - The other array.
 * @returns {Boolean} whether the two arrays contain exactly the same integers.
 */

const equivalentDelivererIDs = function(a1, a2) {
    if (a1 && a2 && a1.length === a2.length) {
        var found = 0;
        for(var i = 0; i < a1.length; i ++) {
            for(var j = 0; j < a2.length && found === i; j ++) {
                if (a1[i] === a2[j]) {
                    found++;
                }
            }
        }
        return (found === a1.length);
    }
    else {
        return false;
    }
};

/**
 * Assert that some metadata detected in a spec is equal to the expected value.
 *
 * @param {String} url - public URL of a spec.
 * @param {String} file - name of local file containing a spec (without path and withouth ".html" suffix).
 * @param {String} type - metadata to check: {"META_PROFILE", "META_DELIVERER_IDS"}.
 * @param {Object} expectedValue - value that is expected to be found.
 */

const compareMetadata = function(url, file, type, expectedValue) {

    const specberus = new validator.Specberus()
    ,   handler = new sink.Sink(function(data) { throw new Error(data); })
    ,   thisFile = file ? 'test/docs/metadata/' + file + '.html' : null
    ;
    const opts = {events: handler, url: url, file: thisFile};

    if (META_PROFILE === type) {
        it('Should detect a ' + expectedValue, function (done) {
            handler.on('end-all', function () {
                chai(specberus).to.have.property('meta').to.have.property('detectedProfile').equal(expectedValue);
                done();
            });
            specberus.extractMetadata(opts);
        });
    }
    else if (META_DELIVERER_IDS === type) {
        it('Should find deliverer IDs of ' + (url ? url : file), function (done) {
            handler.on('end-all', function () {
                chai(specberus).to.have.property('meta').to.have.property('detectedDelivererIDs');
                chai(specberus.meta.detectedDelivererIDs).to.satisfy(function(found) {
                    return equivalentDelivererIDs(found, expectedValue);
                });
                done();
            });
            specberus.extractMetadata(opts);
        });
    }


};

describe('Basics', function() {

    const specberus = new validator.Specberus;

    describe('Method "extractMetadata"', function() {

        it('Should exist and be a function', function(done) {
            chai(specberus).to.have.property('extractMetadata').that.is.a('function');
            done();
        });

        if (!process || !process.env || (process.env.TRAVIS !== 'true' && !process.env.SKIP_NETWORK)) {
            for(var i in samples) {
                compareMetadata(samples[i].url, null, META_PROFILE, samples[i].profile);
            }
            for(var i in samples) {
                compareMetadata(samples[i].url, null, META_DELIVERER_IDS, samples[i].delivererIDs);
            }
        }
        else {
            for(var i in samples) {
                compareMetadata(null, samples[i].file, META_PROFILE, samples[i].profile);
            }
            for(var i in samples) {
                compareMetadata(null, samples[i].file, META_DELIVERER_IDS, samples[i].delivererIDs);
            }
        }

    });

    describe('Method "validate"', function() {

        it('Should exist and be a function', function(done) {
            chai(specberus).to.have.property('validate').that.is.a('function');
            done();
        });

    });

});

var tests = {
    // Categories
    dummy:  {
        // Rules
        dahut:  [
            // Tests
            { doc: "dummy/simple.html" } // pass test
        ,   { doc: "dummy/dahut.html", errors: ["dummy.dahut"] } // fail test
        ,   { doc: "dummy/all.html", errors: ["dummy.dahut"] }
        ]
    ,   h1:  [
            { doc: "dummy/simple.html" }
        ,   { doc: "dummy/h1.html", errors: ["dummy.h1"] }
        ,   { doc: "dummy/all.html", errors: ["dummy.h1"] }
        ]
    ,   "h2-foo":  [
            { doc: "dummy/simple.html" }
        ,   { doc: "dummy/h2-foo.html", errors: ["dummy.h2-foo"] }
        ,   { doc: "dummy/all.html", errors: ["dummy.h2-foo"] }
        ]
    }
,   echidna:  {
        "editor-ids":  [
            { doc: "echidna/automated-wg.html" }
        ,   { doc: "echidna/fails-missing-editorsid.html", errors: ["echidna.editor-ids"] }
        ]
    ,   "todays-date":  [
            { doc: "echidna/fails-future-date.html", errors: ["echidna.todays-date"] }
        ]
    }
,   headers:   {
        "div.head":  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.div-head"] }
        ]
    ,   hr:  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/hr.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.hr"] }
        ,   { doc: "headers/fails-too.html", errors: ["headers.hr"] }
        ]
    ,   title:  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.title"] }
        ]
    ,   logo:  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/logo.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.logo"] }
        ]
    ,   "h1-title":  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.h1-title"] }
        ,   { doc: "headers/h1-title.html", errors: ["headers.h1-title"] }
        ]
    ,   dl:  [
            { doc: "headers/simple.html", config: { previousVersion: true, status: "WD" }, errors: ["headers.dl"] }
        ,   { doc: "headers/fails.html", errors: ["headers.dl", "headers.dl"] }
        ,   { doc: "headers/fails.html", config: { previousVersion: true }, errors: ["headers.dl", "headers.dl", "headers.dl"] }
        ,   { doc: "headers/dl-order.html", errors: ["headers.dl", "headers.dl", "headers.dl"], warnings: ["headers.dl"] }
        ,   { doc: "headers/dl-mismatch.html"
            , errors: ["headers.dl", "headers.dl", "headers.dl", "headers.dl", "headers.dl", "headers.dl"]
            , warnings: ["headers.dl"] }
        ,   { doc: "headers/wrong-urls.html", errors: ["headers.dl", "headers.dl"], config: { previousVersion: true, status: "WD" } }
        ,   { doc: "headers/dl-trailing-whitespace.html", config: { previousVersion: true, status: "WD" }, errors: ["headers.dl"] }
        ]
    ,   "h2-status":  [
            { doc: "headers/simple.html", config: { longStatus: "Working Draft" } }
        ,   { doc: "headers/h2-comma.html", config: { longStatus: "Working Draft" } }
        ,   { doc: "headers/simple.html", config: { longStatus: "Recommendation" }, errors: ["headers.h2-status"] }
        ]
    ,   "h2-toc":  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.h2-toc"] }
        ]
    ,   "ol-toc":  [
	    { doc: "headers/proper-toc.html" }
	,   { doc: "headers/fails.html", warnings: ["headers.ol-toc"] }
	]
    ,   "secno":  [
            { doc: "headers/proper-secno.html" }
        ,   { doc: "headers/fails.html", warnings: [ "headers.secno" ] }
        ]
    ,   copyright:  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/simple-oxford.html" }
        ,   { doc: "headers/copyright-freedom.html", warnings: ["headers.copyright"] }
        ,   { doc: "headers/fails.html", errors: ["headers.copyright"] }
        ,   { doc: "headers/permissive-doc-license.html", warnings: ["headers.copyright"] }
        ]
    ,   translations:  [
            { doc: "headers/translations.html" }
        ,   { doc: "headers/simple.html", errors: ["headers.translations"] }
        ,   { doc: "headers/translations-warning.html", warnings: ["headers.translations"] }
        ,   { doc: "headers/translations-alternative.html" }
        ]
    }
,   style:   {
        sheet:  [
            { doc: "headers/simple.html", config: { styleSheet: "W3C-WD"} }
        ,   { doc: "headers/fails.html", config: { styleSheet: "W3C-WD"}, errors: ["style.sheet"] }
        ,   { doc: "style/style-not-last.html", config: { styleSheet: "W3C-WD"}, errors: ["style.sheet"] }
        ]
    ,   meta:  [
            { doc: "dummy/simple.html", errors: ["style.meta"] }
        ,   { doc: "style/simple.html" }
        ,   { doc: "style/wrong-meta.html", errors: ["style.meta"] }
        ]
    ,   script:  [
            { doc: "headers/simple.html", errors: ["style.script"] }
        ,   { doc: "headers/fixup.html" }
        ]
    ,   'back-to-top':  [
            { doc: "headers/simple.html", warnings: ["style.back-to-top"] }
        ,   { doc: "headers/back-to-top.html" }
        ]
    }
,   links:   {
        internal:  [
            { doc: "links/internal-good.html" }
        ,   { doc: "links/internal-fails.html", errors: ["links.internal", "links.internal"] }
        ]
    }
,   structure:   {
        h2:  [
            { doc: "headers/simple.html" }
        ,   { doc: "structure/h2-abstract.html", errors: ["structure.h2"] }
        ,   { doc: "structure/h2-sotd.html", errors: ["structure.h2", "structure.h2"] }
        ,   { doc: "structure/h2-toc.html", errors: ["structure.h2", "structure.h2", "structure.h2"] }
        ]
    ,   "section-ids":  [
            { doc: "structure/sid-ok.html" }
        ,   { doc: "structure/sid-all-wrong.html"
            , errors: ["structure.section-ids", "structure.section-ids", "structure.section-ids"
                      ,"structure.section-ids", "structure.section-ids", "structure.section-ids"
                      ]  }
        ]
    }
,   sotd:   {
        supersedable:  [
            { doc: "headers/simple.html" }
        ,   { doc: "sotd/supersedable.html", errors: ["sotd.supersedable", "sotd.supersedable"] }
        ]
    ,   "mailing-list":  [
            { doc: "headers/simple.html" }
        ,   { doc: "sotd/ml-bad.html"
            , errors: ["sotd.mailing-list", "sotd.mailing-list"]
            , warnings: ["sotd.mailing-list"]
            }
        ]
    ,   pp:  [
            { doc: "headers/simple.html", config: { recTrackStatus: true } }
        ,   { doc: "sotd/pp-bad.html"
            , errors: ["sotd.pp", "sotd.pp", "sotd.pp", "sotd.pp"]
            , config: { recTrackStatus: true }
            }
        ,   { doc: "sotd/pp-cpp2002.html", options: { patentPolicy: "pp2002" } }
        ,   { doc: "headers/joint-publication.html", config: { recTrackStatus: true }, warnings: ["sotd.pp"] }
        ,   { doc: "headers/joint-publication-fail.html", config: { recTrackStatus: true }
              , errors: ["sotd.pp"]
            }
        ]
    ,   "charter-disclosure":  [
            { doc: "headers/ig-note.html" }
        ]
    ,   stability:  [
            { doc: "headers/simple.html", config: { longStatus: "Working Draft", stabilityWarning: true } }
        ,   { doc: "headers/simple.html"
              , config: { longStatus: "Rock And Roll", stabilityWarning: true }
              , errors: ["sotd.stability"]
            }
        ,   { doc: "sotd/supersedable.html"
              , config: { longStatus: "Rock And Roll", stabilityWarning: false }
            }
        ,   { doc: "headers/ig-note.html"
              , config: { longStatus: "Interest Group Note" , stabilityWarning: true }
            }
        ,   { doc: "headers/ig-note.html"
              , config: { longStatus: "Working Draft" , stabilityWarning: true }
              , errors: ["sotd.stability"]
            }
        ]
    ,   implementation:  [
            { doc: "sotd/supersedable.html"}
        ,   { doc: "sotd/pp-bad.html"}
        ,   { doc: "sotd/ml-bad.html", errors: ['sotd.implementation'] }
        ]
    ,   'ac-review':  [
            { doc: "sotd/supersedable.html"}
        ,   { doc: "sotd/pp-bad.html", errors: ['sotd.ac-review'] }
        ]
    ,   'process':  [
            { doc: "sotd/process2015.html", options: {processDocument: '2015'}}
    ,       { doc: "sotd/deprecated.html", errors: ['sotd.processDocument']}
    ,       { doc: "sotd/wrongprocess.html", errors: ['sotd.processDocument']}
        ]
    }
,   heuristic:   {
        'date-format':  [
            { doc: "heuristic/dates.html" }
        ,   { doc: "heuristic/bad-dates.html", errors: ['heuristic.date-format', 'heuristic.date-format', 'heuristic.date-format'] }
        ,   { doc: "heuristic/dated-url.html" }
        ]
    }
,   validation: validation
};

Object.keys(tests).forEach(function (category) {
    describe("Category " + category, function () {
        Object.keys(tests[category]).forEach(function (rule) {
            describe("Rule " + rule, function () {
                tests[category][rule].forEach(function (test) {
                    var passTest = test.errors ? false : true;
                    it("should " + (passTest ? "pass" : "fail") + " for " + test.doc, function (done) {
                        var r = require("../lib/rules/" + category + "/" + rule)
                        ,   handler = new sink.Sink
                        ;
                        handler.on("ok", function () {
                            if (DEBUG) console.log("OK");
                            handler.ok++;
                        });
                        handler.on("err", function (type, data) {
                            if (DEBUG) console.log(data);
                            handler.errors.push(type);
                        });
                        handler.on("warning", function (type, data) {
                            if (DEBUG) console.log("[W]", data);
                            handler.warnings.push(type);
                        });
                        handler.on("done", function () {
                            if (DEBUG) console.log("---done---");
                            handler.done++;
                        });
                        handler.on("exception", function (data) {
                            console.error("[EXCEPTION] Validator had a massive failure: " + data.message);
                        });
                        handler.on("end-all", function () {
                            if (passTest) {
                                expect(handler.errors).to.be.empty();
                                expect(handler.ok).to.eql(handler.done);
                            }
                            else {
                                expect(handler.errors.length).to.eql(test.errors.length);
                                for (var i = 0, n = test.errors.length; i < n; i++) {
                                    expect(handler.errors).to.contain(test.errors[i]);
                                }
                            }
                            if (!test.ignoreWarnings) {
                                if (test.warnings) {
                                    expect(handler.warnings.length).to.eql(test.warnings.length);
                                    for (var i = 0, n = test.warnings.length; i < n; i++) {
                                        expect(handler.warnings).to.contain(test.warnings[i]);
                                    }
                                }
                                else {
                                    expect(handler.warnings).to.be.empty();
                                }
                            }
                            done();
                        });
                        var profile = {
                            name:   "Synthetic " + category + "/" + rule
                        ,   rules:  [r]
                        };
                        profile.config = test.config;
                        var options = {
                            file:       pth.join(__dirname, "docs", test.doc)
                        ,   profile:    profile
                        ,   events:     handler
                        };
                        for (var o in test.options)
                            options[o] = test.options[o];
                        new validator.Specberus().validate(options);
                    });
                });
            });
        });
    });
});
