/*jshint es5: true*/

// The Express and Socket.io server interface
var express = require("express")
,   app = express()
,   server = require("http").createServer(app)
,   io = require("socket.io").listen(server)
,   nv = require("./lib/node-validator")
,   l10n = require("./lib/l10n")
,   util = require("util")
,   events = require("events")
,   version = require("./package.json").version
,   profiles = {}
;
"base WD".split(" ")
         .forEach(function (p) {
             profiles[p] = require("./lib/profiles/" + p);
         })
;

// middleware
app.use(express.logger());
app.use(express.compress());
app.use(express.json());
app.use(express.static("public"));

// listen up
server.listen(process.env.PORT || 80);

// VALIDATION PROTOCOL
//  Client:
//      validate, { url: "document", profile: "WD" }
//  Server:
//      handshake, { version: "x.y.z"}
//      exception, { message: "blah", code: "FOO"} (for system errors)
//      start { rules: [rule names]}
//      ok, { name: "test name" }
//      warning, { name: "test name", code: "FOO" }
//      error, { name: "test name", code: "FOO" }
//      done, { name: "test name" }
//      finished
function Sink () {}
util.inherits(Sink, events.EventEmitter);

io.sockets.on("connection", function (socket) {
    socket.emit("handshake", { version: version });
    socket.on("validate", function (data) {
        if (!data.url) return socket.emit("exception", { message: "URL not provided." });
        if (!data.profile) return socket.emit("exception", { message: "Profile not provided." });
        var validator = nv.makeSpecberus()
        ,   sink = new Sink
        ,   profile = profiles[data.profile]
        ;
        socket.emit("start", {
            rules:  profile.rules.map(function (rule) { return rule.name; })
        });
        sink.on("ok", function (type) {
            socket.emit("ok", { name: type });
        });
        sink.on("err", function (type, data) {
            data.name = type;
            data.message = l10n.message("en", type, data.key, data.extra);
            socket.emit("error", data);
        });
        sink.on("warning", function (type, data) {
            data.name = type;
            data.message = l10n.message("en", type, data.key, data.extra);
            socket.emit("warning", data);
        });
        sink.on("done", function (name) {
            socket.emit("done", { name: name });
        });
        sink.on("end-all", function () {
            socket.emit("finished");
        });
        try {
            validator.validate({
                url:        data.url
            ,   profile:    profile
            ,   events:     sink
            });
        }
        catch (e) {
            socket.emit("exception", { message: "Validation blew up: " + e });
            socket.emit("finished");
        }
    });
});
