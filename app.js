/**
 * Main runnable file.
 */

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import http from 'http';
import insafe from 'insafe';
import morgan from 'morgan';
import { Server } from 'socket.io';
import * as api from './lib/api.js';
import * as l10n from './lib/l10n.js';
import { Sink } from './lib/sink.js';
import { allProfiles, importJSON } from './lib/util.js';
import { Specberus } from './lib/validator.js';
import * as views from './lib/views.js';

const { version } = importJSON('./package.json', import.meta.url);

// Settings:
const DEFAULT_PORT = 80;

if (!process.env.W3C_API_KEY || process.env.W3C_API_KEY.length < 1) {
    throw new Error(
        'Pubrules is missing a valid key for the W3C API; define environment variable “W3C_API_KEY”'
    );
}

if (!process.env.BASE_URI || process.env.BASE_URI.length < 1) {
    console.warn(
        `Environment variable “BASE_URI” not defined; assuming that Pubrules lives at “/”`
    );
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// Middleware:
app.use(morgan('combined'));
app.use(compression());
app.use('/badterms.json', cors());

app.use(express.static('public'));
api.setUp(app, process.env.W3C_API_KEY);
views.setUp(app);

// @TODO Localize this properly when messages are translated; hard-coded British English for now.
l10n.setLanguage('en_GB');

server.listen(process.argv[2] || process.env.PORT || DEFAULT_PORT);

io.on('connection', socket => {
    socket.emit('handshake', { version });
    socket.on('extractMetadata', data => {
        if (!data.url)
            return socket.emit('exception', { message: 'URL not provided.' });
        const specberus = new Specberus(process.env.W3C_API_KEY);
        const handler = new Sink();
        handler.on('err', (type, data) => {
            try {
                socket.emit(
                    'err',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('warning', (type, data) => {
            try {
                socket.emit(
                    'warning',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('info', (type, data) => {
            try {
                socket.emit(
                    'info',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('end-all', metadata => {
            metadata.url = data.url;
            socket.emit('finishedExtraction', metadata);
        });
        handler.on('exception', data => {
            socket.emit('exception', data);
        });
        specberus.extractMetadata({
            url: data.url,
            events: handler,
        });
    });
    socket.on('validate', async data => {
        if (!data.url)
            return socket.emit('exception', { message: 'URL not provided.' });
        if (!data.profile)
            return socket.emit('exception', {
                message: 'Profile not provided.',
            });
        const profilePath = allProfiles.find(p =>
            p.endsWith(`/${data.profile}.js`)
        );
        let profile;
        try {
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            profile = await import(`./lib/profiles/${profilePath}`);
        } catch (err) {
            return socket.emit('exception', {
                message: 'Profile does not exist.',
            });
        }
        const specberus = new Specberus(process.env.W3C_API_KEY);
        const handler = new Sink();
        const profileCode = profile.name;
        socket.emit('start', {
            rules: (profile.rules || []).map(rule => rule.name),
        });
        handler.on('err', (type, data) => {
            try {
                socket.emit(
                    'err',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('warning', (type, data) => {
            try {
                socket.emit(
                    'warning',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('info', (type, data) => {
            try {
                socket.emit(
                    'info',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        handler.on('done', name => {
            socket.emit('done', { name });
        });
        handler.on('end-all', () => {
            socket.emit('finished');
        });
        handler.on('exception', data => {
            socket.emit('exception', data);
        });
        insafe
            .check({
                url: data.url,
                statusCodesAccepted: ['301', '406'],
            })
            .then(res => {
                if (res.status) {
                    try {
                        specberus.validate({
                            url: data.url,
                            profile,
                            events: handler,
                            validation: data.validation,
                            informativeOnly: data.informativeOnly,
                            echidnaReady: data.echidnaReady,
                            patentPolicy: data.patentPolicy,
                        });
                    } catch (e) {
                        socket.emit('exception', {
                            message: `Validation blew up: ${e}`,
                        });
                        socket.emit('finished');
                    }
                } else {
                    const message = `Error while resolving <a href="${data.url}"><code>${data.url}</code></a>;
                    check the spelling of the host, the protocol (<code>HTTP</code>, <code>HTTPS</code>)
                    and ensure that the page is accessible from the public internet.`;
                    socket.emit('exception', { message });
                }
            })
            .catch(e => {
                socket.emit('exception', {
                    message: `Insafe check blew up: ${e}`,
                });
                socket.emit('finished');
            });
    });
});
