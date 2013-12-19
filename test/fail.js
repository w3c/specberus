
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
    this.errors = [];
    this.done = 0;
}
util.inherits(Sink, events.EventEmitter);

profiles.forEach(function (profileName) {
    var profile = require("../lib/profiles/" + profileName)
    ,   errors = require("./fail/" + profileName + ".json")
    ;
    describe("Gives a fail to all the files in profile: " + profileName, function () {
        var testDir = pth.join(__dirname, "fail", profileName)
        ,   total = profile.rules.length
        ;
        fs.readdirSync(testDir).forEach(function (file) {
            it("should fail for file: " + file, function (done) {
                var sink = new Sink
                ,   fileErrors = errors[file]
                ;
                sink.on("ok", function () {
                    sink.ok++;
                });
                sink.on("error", function (type) {
                    sink.errors.push(type);
                });
                sink.on("done", function () {
                    sink.done++;
                });
                sink.on("end-all", function (name) {
                    expect(name).to.eql(profile.name);
                    expect(sink.ok).to.eql(total - fileErrors.length);
                    expect(sink.errors.length).to.eql(fileErrors.length);
                    for (var i = 0, n = fileErrors.length; i < n; i++) {
                        var error = fileErrors[i];
                        expect(sink.errors).to.contain(error);
                    }
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
