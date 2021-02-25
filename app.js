/**
 * Main runnable file.
 */

'use strict';

// Settings:
const DEFAULT_PORT = 80;

// Native packages:
const http = require('http');

// External packages:
const compression = require('compression');
const express = require('express');
const insafe = require('insafe');
const morgan = require('morgan');
const socket = require('socket.io');
// Internal packages:
const self = require('./package');
const l10n = require('./lib/l10n');
const sink = require('./lib/sink');
const validator = require('./lib/validator');
const views = require('./lib/views');
const util = require('./lib/util');
const api = require('./lib/api');
const app = express();
const server = http.createServer(app);
const io = socket(server);
const Sink = sink.Sink;
const version = self.version;
// Middleware:
app.use(morgan('combined'));
app.use(compression());
app.use('/badterms.json', require('cors')());
app.use(express.static('public'));
api.setUp(app);
views.setUp(app);

// @TODO Localise this properly when messages are translated; hard-coded British English for now.
l10n.setLanguage('en_GB');

server.listen(process.argv[2] || process.env.PORT || DEFAULT_PORT);

io.on('connection', function (socket) {
    socket.emit('handshake', { version: version });
    socket.on('extractMetadata', function (data) {
        if (!data.url)
            return socket.emit('exception', { message: 'URL not provided.' });
        var vali = new validator.Specberus();
        var handler = new Sink();
        handler.on('err', function (type, data) {
            try {
                socket.emit(
                    'err',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('warning', function (type, data) {
            try {
                socket.emit(
                    'warning',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('info', function (type, data) {
            try {
                socket.emit(
                    'info',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('end-all', function (metadata) {
            metadata.url = data.url;
            socket.emit('finishedExtraction', metadata);
        });
        handler.on('exception', function (data) {
            socket.emit('exception', data);
        });
        vali.extractMetadata({
            url: data.url,
            events: handler,
        });
    });
    socket.on('validate', function (data) {
        if (!data.url)
            return socket.emit('exception', { message: 'URL not provided.' });
        if (!data.profile)
            return socket.emit('exception', {
                message: 'Profile not provided.',
            });
        if (!util.profiles[data.profile])
            return socket.emit('exception', {
                message: 'Profile does not exist.',
            });
        var vali = new validator.Specberus();
        var handler = new Sink();
        var profile = util.profiles[data.profile];
        var profileCode = profile.name;
        socket.emit('start', {
            rules: (profile.rules || []).map(function (rule) {
                return rule.name;
            }),
        });
        handler.on('err', function (type, data) {
            try {
                socket.emit(
                    'err',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('warning', function (type, data) {
            try {
                socket.emit(
                    'warning',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('info', function (type, data) {
            try {
                socket.emit(
                    'info',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('done', function (name) {
            socket.emit('done', { name: name });
        });
        handler.on('end-all', function () {
            socket.emit('finished');
        });
        handler.on('exception', function (data) {
            socket.emit('exception', data);
        });
        insafe
            .check({
                url: data.url,
                statusCodesAccepted: ['301', '406'],
            })
            .then(function (res) {
                if (res.status) {
                    try {
                        vali.validate({
                            url: data.url,
                            profile: profile,
                            events: handler,
                            validation: data.validation,
                            noRecTrack: data.noRecTrack,
                            informativeOnly: data.informativeOnly,
                            echidnaReady: data.echidnaReady,
                            patentPolicy: data.patentPolicy,
                        });
                    } catch (e) {
                        socket.emit('exception', {
                            message: 'Validation blew up: ' + e,
                        });
                        socket.emit('finished');
                    }
                } else {
                    const message = `Error while resolving <a href="${data.url}"><code>${data.url}</code></a>;
                    check the spelling of the host, the protocol (<code>HTTP</code>, <code>HTTPS</code>)
                    and ensure that the page is accessible from the public internet.`;
                    socket.emit('exception', { message: message });
                }
            })
            .catch(function (e) {
                socket.emit('exception', {
                    message: 'Insafe check blew up: ' + e,
                });
                socket.emit('finished');
            });
    });
});
