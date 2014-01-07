
var validator = require("../lib/node-validator").makeSpecberus()
,   expect = require("expect.js")
,   pth = require("path")
,   events = require("events")
,   util = require("util")
,   networkCats = "validation".split(" ")
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
        ]
    ,   hr:  [
        ]
    ,   title:  [
        ]
    }
,   validation:   {
        css:  [
            { doc: "validation/simple.html" }
        ,   { doc: "validation/css.html" }
        ,   { doc: "validation/bad-css.html", errors: ["validation.css"] }
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
                    var passTest = test.errors ? true : false;
                    it("should " + (passTest ? "pass" : "fail") + " for " + test.doc, function (done) {
                        var r = require("../lib/rules/" + category + "/" + rule)
                        ,   sink = new Sink
                        ;
                        sink.on("ok", function () {
                            sink.ok++;
                        });
                        sink.on("err", function (type) {
                            sink.errors.push(type);
                        });
                        sink.on("warning", function (type) {
                            sink.warnings.push(type);
                        });
                        sink.on("done", function () {
                            sink.done++;
                        });
                        sink.on("end-all", function () {
                            if (passTest) {
                                expect(sink.errors).to.be.empty();
                                expect(sink.ok).to.eql(sink.done); // this may not hold
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
                        validator.validate({
                            file:       pth.join(__dirname, "docs", test.doc)
                        ,   profile:    {
                                name:   "Synthetic " + category + "/" + rule
                            ,   rules:  [r]
                            }
                        ,   events:     sink
                        });
                    });
                });
            });
        });
    });
});


// for each category, describe()
// for each rule, describe()
// for each test, it()
//  run with doc and accrue ok, error, warnings
//  must be ok for a pass test, not for a fail test
//  warnings must match in either case
//  option to ignore some|all warnings
//  options to skip network tests (through ENV)

// replace the current profile tests completely
// they will be reintroduced in a more comprehensive way

