
var validator = require("../lib/node-validator").makeSpecberus()
,   expect = require("expect.js")
,   pth = require("path")
,   events = require("events")
,   util = require("util")
,   networkCats = "validation".split(" ")
,   DEBUG = true
;

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
,   headers:   {
        "div.head":  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.div-head"] }
        ]
    ,   hr:  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/hr.html" }
        ,   { doc: "headers/fails.html", errors: ["headers.hr"] }
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
            { doc: "headers/simple.html", config: { previousVersion: true, status: "WD" } }
        ,   { doc: "headers/fails.html", errors: ["headers.dl", "headers.dl", "headers.dl"] }
        ,   { doc: "headers/fails.html"
            , config: { previousVersion: true }
            , errors: ["headers.dl", "headers.dl", "headers.dl", "headers.dl"] }
        ,   { doc: "headers/dl-order.html", errors: ["headers.dl", "headers.dl"], warnings: ["headers.dl"] }
        ,   { doc: "headers/dl-mismatch.html"
            , errors: ["headers.dl", "headers.dl", "headers.dl", "headers.dl", "headers.dl", "headers.dl"]
            , warnings: ["headers.dl"]
            }
        ]
    ,   "h2-status":  [
            { doc: "headers/simple.html", config: { longStatus: "Working Draft" } }
        ,   { doc: "headers/simple.html", config: { longStatus: "Recommendation" }, errors: ["headers.h2-status"] }
        ]
    ,   copyright:  [
            { doc: "headers/simple.html" }
        ,   { doc: "headers/copyright-freedom.html", warnings: ["headers.copyright"] }
        ,   { doc: "headers/fails.html", errors: ["headers.copyright"] }
        ]
    }
,   style:   {
        sheet:  [
            { doc: "headers/simple.html", config: { styleSheet: "W3C-WD"} }
        ,   { doc: "headers/fails.html", config: { styleSheet: "W3C-WD"}, errors: ["style.sheet"] }
        ,   { doc: "style/style-not-last.html", config: { styleSheet: "W3C-WD"}, errors: ["style.sheet"] }
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
                      ,"structure.section-ids"]  }
        ]
    }
,   sotd:   {
        supersedable:  [
            { doc: "headers/simple.html" }
        ,   { doc: "sotd/supersedable.html", errors: ["sotd.supersedable", "sotd.supersedable"] }
        ]
    ,   "mailing-list":  [
            { doc: "headers/simple.html" }
        ,   { doc: "sotd/ml-bad.html", errors: ["sotd.mailing-list", "sotd.mailing-list", "sotd.mailing-list"] }
        ]
    ,   pp:  [
            { doc: "headers/simple.html" }
        ,   { doc: "sotd/pp-bad.html", errors: ["sotd.pp", "sotd.pp", "sotd.pp", "sotd.pp"] }
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
        ]
    }
,   validation:   {
        css:  [
            { doc: "validation/simple.html", ignoreWarnings: true }
        ,   { doc: "validation/css.html", ignoreWarnings: true }
        ,   { doc: "validation/bad-css.html", errors: ["validation.css", "validation.css"], ignoreWarnings: true }
        ]
    ,   html:  [
            { doc: "validation/simple.html" }
        ,   { doc: "validation/invalid.html", errors: ["validation.html"] }
        ]
    
    }
};

function Sink () {
    this.ok = 0;
    this.errors = [];
    this.warnings = [];
    this.done = 0;
}
util.inherits(Sink, events.EventEmitter);

Object.keys(tests).forEach(function (category) {
    if (process.env.SKIP_NETWORK && networkCats.indexOf(category) > -1) return;
    describe("Category " + category, function () {
        Object.keys(tests[category]).forEach(function (rule) {
            describe("Rule " + rule, function () {
                tests[category][rule].forEach(function (test) {
                    var passTest = test.errors ? false : true;
                    it("should " + (passTest ? "pass" : "fail") + " for " + test.doc, function (done) {
                        var r = require("../lib/rules/" + category + "/" + rule)
                        ,   sink = new Sink
                        ;
                        sink.on("ok", function () {
                            if (DEBUG) console.log("OK");
                            sink.ok++;
                        });
                        sink.on("err", function (type, data) {
                            if (DEBUG) console.log(data);
                            sink.errors.push(type);
                        });
                        sink.on("warning", function (type, data) {
                            if (DEBUG) console.log("[W]", data);
                            sink.warnings.push(type);
                        });
                        sink.on("done", function () {
                            if (DEBUG) console.log("---done---");
                            sink.done++;
                        });
                        sink.on("end-all", function () {
                            if (passTest) {
                                expect(sink.errors).to.be.empty();
                                expect(sink.ok).to.eql(sink.done);
                            }
                            else {
                                expect(sink.errors.length).to.eql(test.errors.length);
                                for (var i = 0, n = test.errors.length; i < n; i++) {
                                    expect(sink.errors).to.contain(test.errors[i]);
                                }
                            }
                            if (!test.ignoreWarnings) {
                                if (test.warnings) {
                                    expect(sink.warnings.length).to.eql(test.warnings.length);
                                    for (var i = 0, n = test.warnings.length; i < n; i++) {
                                        expect(sink.warnings).to.contain(test.warnings[i]);
                                    }
                                }
                                else {
                                    expect(sink.warnings).to.be.empty();
                                }
                            }
                            done();
                        });
                        var profile = {
                            name:   "Synthetic " + category + "/" + rule
                        ,   rules:  [r]
                        };
                        profile.config = test.config;
                        validator.validate({
                            file:       pth.join(__dirname, "docs", test.doc)
                        ,   profile:    profile
                        ,   events:     sink
                        });
                    });
                });
            });
        });
    });
});
