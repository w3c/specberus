
var validator = require("../lib/node-validator").makeSpecberus()
,   expect = require("expect.js")
,   pth = require("path")
,   fs = require("fs")
,   events = require("events")
,   util = require("util")
,   profiles = "dummy".split(" ")
;

function Sink () {
    this.ok = 0;
    this.done = 0;
}
util.inherits(Sink, events.EventEmitter);

profiles.forEach(function (profileName) {
    var profile = require("../lib/profiles/" + profileName);
    describe("Gives a pass to all the files in profile: " + profileName, function () {
        var testDir = pth.join(__dirname, "pass", profileName)
        ,   total = profile.rules.length
        ;
        fs.readdirSync(testDir).forEach(function (file) {
            it("should pass for file: " + file, function (done) {
                var sink = new Sink;
                sink.on("ok", function () {
                    sink.ok++;
                });
                sink.on("done", function () {
                    sink.done++;
                });
                sink.on("end-all", function (name) {
                    expect(name).to.eql(profile.name);
                    expect(sink.ok).to.eql(total);
                    expect(sink.done).to.eql(total);
                    done();
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
