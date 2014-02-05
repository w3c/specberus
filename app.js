/*jshint es5: true*/

// The Express and Socket.io server interface
var express = require("express")
,   app = express()
,   server = require("http").createServer(app)
,   io = require("socket.io").listen(server)
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
//      start, {}
//      ok, { name: "test name" }
//      warning, { name: "test name", code: "FOO" }
//      error, { name: "test name", code: "FOO" }
//      done, {}
io.sockets.on("connection", function (socket) {
    socket.emit("handshake", { version: version });
    socket.on("validate", function (data) {
        if (!data.url) return socket.emit("exception", {}); // XXX
        // load up node-validator
        // configure it with the right profile, run
        // pipe the events back to the client
    });
});
