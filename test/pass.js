
var validator = require("../lib/node-validator").makeSpecberus()
,   expect = require("expect.js")
,   pth = require("path")
,   fs = require("fs")
,   events = require("events")
,   util = require("util")
,   profiles = "dummy".split(" ")
;

function Sink () {
    this.ok = false;
    this.done = 0;
}
util.inherits(Sink, events.EventEmitter);

profiles.forEach(function (profileName) {
    var profile = require("../lib/profiles/" + profileName);
    describe("Gives a pass to all the files in profile: " + profileName, function (allDone) {
        var testDir = pth.join(__dirname, "pass", profileName)
        ,   total = 0
        ;
        fs.readdirSync(testDir).forEach(function (file) {
            total++;
            it("should pass for file: " + file, function (done) {
                var sink = new Sink;
                sink.on("ok", function () { this.ok = true; });
                sink.on("done", function () {
                    expect(this.ok).to.be.ok();
                    this.done++;
                    done();
                    if (this.done === total) allDone();
                });
                validator.validate({
                    file:       pth.join(testDir, file)
                ,   profile:    profile
                ,   events:     sink
                });
            });
        });
    });
});
