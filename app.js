/*jshint es5: true*/

// Pseudo-constants:
var DEFAULT_PORT = 80;

// The Express and Socket.io server interface
var express = require("express")
,   bodyParser = require('body-parser')
,   compression = require('compression')
,   morgan = require('morgan')
,   app = express()
,   server = require("http").createServer(app)
,   io = require("socket.io").listen(server)
,   Specberus = new require("./lib/validator").Specberus
,   Exceptions = require("./lib/exceptions").Exceptions
,   l10n = require("./lib/l10n")
,   util = require("util")
,   events = require("events")
,   insafe = require("insafe")
,   version = require("./package.json").version
,   profiles = {}
,   shortnameRegex = /http:\/\/www.w3.org\/TR\/([-A-Za-z0-9_]+)\//g;
;
("FPWD FPLC WD LC CR PR PER REC RSCND " +
"CG-NOTE FPIG-NOTE IG-NOTE FPWG-NOTE WG-NOTE " +
"WD-Echidna " +
"MEM-SUBM TEAM-SUBM").split(" ")
         .forEach(function (p) {
             profiles[p] = require("./lib/profiles/" + p);
         })
;

// middleware
app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.json());
app.use(express.static("public"));

// listen up
server.listen(process.argv[2] || process.env.PORT || DEFAULT_PORT);

// VALIDATION PROTOCOL
//  Client:
//      validate, { url: "document", profile: "WD", validation: "simple-validation" }
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
        if (!profiles[data.profile]) return socket.emit("exception", { message: "Profile does not exist." });
        var validator = new Specberus()
        ,   sink = new Sink
        ,   profile = profiles[data.profile]
        ,   shortname = undefined
        ,   exceptions = new Exceptions()
        ;
        socket.emit("start", {
            rules:  (profile.rules || []).map(function (rule) { return rule.name; })
        });
        sink.on("ok", function (type) {
            socket.emit("ok", { name: type });
        });
        sink.on("err", function (type, data) {
            data.name = type;
            data.message = l10n.message(validator.config.lang, type, data.key, data.extra);
            if ((shortname !== undefined)
                && exceptions.has(shortname, data)) {
                socket.emit("warning", data);
            } else {
              socket.emit("err", data);
            }
        });
        sink.on("warning", function (type, data) {
            data.name = type;
            data.message = l10n.message(validator.config.lang, type, data.key, data.extra);
            socket.emit("warning", data);
        });
        sink.on('metadata', function (key, value) {
            if (key === "latestVersion") {
              shortname = value.replace(shortnameRegex, "$1");
            }
        });
        sink.on('info', function (type, data) {
            data.name = type;
            data.message = l10n.message(validator.config.lang, type, data.key, data.extra);
            socket.emit('info', data);
        });
        sink.on("done", function (name) {
            socket.emit("done", { name: name });
        });
        sink.on("end-all", function () {
            socket.emit("finished");
        });
        sink.on("exception", function (data) {
            socket.emit("exception", data);
        });
        insafe.check({
            url: data.url,
            statusCodesAccepted: ["301"]
        }).then(function(res){
            if(res.status) {
                try {
                    validator.validate({
                        url:                res.url
                    ,   profile:            profile
                    ,   events:             sink
                    ,   validation:         data.validation
                    ,   noRecTrack:         data.noRecTrack
                    ,   informativeOnly:    data.informativeOnly
                    ,   echidnaReady:       data.echidnaReady
                    ,   patentPolicy:       data.patentPolicy
                    ,   processDocument:    data.processDocument
                    });
                }
                catch (e) {
                    socket.emit("exception", { message: "Validation blew up: " + e });
                    socket.emit("finished");
                }
            } else {
                socket.emit("exception", {message: "error while resolving " + data.url + " Check the spelling of the host, the protocol (http, https) and ensure that the page is accessible from the public Internet."});
            }
        }).catch(function(e){
            socket.emit("exception", { message: "Insafe check blew up: " + e });
            socket.emit("finished");
        });
    });
});
