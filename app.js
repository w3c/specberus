/**
 * Main runnable file.
 */

// Settings:
const DEFAULT_PORT = 80;

// Native packages:
const http = require('http');

// External packages:
const bodyParser = require('body-parser')
,   compression = require('compression')
,   express = require('express')
,   insafe = require('insafe')
,   morgan = require('morgan')
,   socket = require('socket.io')
;

// Internal packages:
const self = require('./package.json')
,   l10n = require('./lib/l10n')
,   sink = require('./lib/sink')
,   validator = require('./lib/validator')
,   views = require('./lib/views')
,   util = require('./lib/util')
,   api = require('./lib/api')
;

const app = express()
,   server = http.createServer(app)
,   io = socket.listen(server)
,   profiles = util.profiles
,   Sink = sink.Sink
,   version = self.version
;

// middleware
app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.json());
app.use(express.static("public"));
api.setUp(app);
views.setUp(app);

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

io.sockets.on("connection", function (socket) {
    socket.emit("handshake", { version: version });
    socket.on("extractMetadata", function (data) {
        if (!data.url) return socket.emit("exception", { message: "URL not provided." });
        var v = new validator.Specberus
        ,   handler = new Sink
        ;
        handler.on("end-all", function (metadata) {
            metadata.url = data.url;
            socket.emit("finishedExtraction", metadata);
        });
        handler.on("exception", function (data) {
            socket.emit("exception", data);
        });
        v.extractMetadata({
            url    : data.url
          , events : handler
        });
    });
    socket.on("validate", function (data) {
        if (!data.url) return socket.emit("exception", { message: "URL not provided." });
        if (!data.profile) return socket.emit("exception", { message: "Profile not provided." });
        if (!profiles[data.profile]) return socket.emit("exception", { message: "Profile does not exist." });
        var v = new validator.Specberus
        ,   handler = new Sink
        ,   profile = profiles[data.profile]
        ,   profileCode = profile.name
        ;
        // @TODO Localise this properly when messages are translated; hard-coded British English for now.
        l10n.setLanguage('en_GB');
        socket.emit("start", {
            rules:  (profile.rules || []).map(function (rule) { return rule.name; })
        });
        handler.on('err', function (type, data) {
            socket.emit('err', l10n.message(profileCode, type, data.key, data.extra));
        });
        handler.on('warning', function (type, data) {
            socket.emit('warning', l10n.message(profileCode, type, data.key, data.extra));
        });
        handler.on('info', function (type, data) {
            socket.emit('info', l10n.message(profileCode, type, data.key, data.extra));
        });
        handler.on("done", function (name) {
            socket.emit("done", { name: name });
        });
        handler.on("end-all", function () {
            socket.emit("finished");
        });
        handler.on("exception", function (data) {
            socket.emit("exception", data);
        });
        insafe.check({
            url: data.url,
            statusCodesAccepted: ["301", "406"]
        }).then(function(res){
            if(res.status) {
                try {
                    v.validate({
                        url:                res.url
                    ,   profile:            profile
                    ,   events:             handler
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
