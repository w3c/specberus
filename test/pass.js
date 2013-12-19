
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
        console.log("in describe");
        var testDir = pth.join(__dirname, "pass", profileName)
        ,   total = 0
        ;
        fs.readdirSync(testDir).forEach(function (file) {
            total++;
            it("should pass for file: " + file, function (done) {
                console.log("in it for " + file);
                var sink = new Sink;
                sink.on("ok", function (data) {
                    sink.ok = true;
                    console.log("ok", data);
                });
                sink.on("done", function (data) {
                    expect(sink.ok).to.be.ok();
                    sink.done++;
                    console.log("done", sink.done, data);
                    done();
                    if (sink.done === total) allDone();
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
