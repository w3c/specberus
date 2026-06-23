/**
 * Main runnable file.
 */

// @ts-ignore (no typings)
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import { writeFile } from 'fs';
import http from 'http';
// @ts-ignore (no typings)
import insafe from 'insafe';
import morgan from 'morgan';
import { Server, type Socket } from 'socket.io';
import tmp from 'tmp';

import * as api from './lib/api.js';
import badterms from './lib/badterms.js';
import * as l10n from './lib/l10n.js';
import { allProfiles, specberusVersion } from './lib/util.js';
import { ExceptionsError, Specberus } from './lib/specberus.js';
import * as views from './lib/views.js';
import type { ProfileModule } from './lib/types.js';

// Settings:
const DEFAULT_PORT = 80;

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
app.use(
    fileUpload({
        createParentPath: true,
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);

app.use(express.static('public'));
app.get('/badterms.json', cors(), (_, res) => {
    res.json(badterms);
});
api.setUp(app);
views.setUp(app);

// @TODO Localize this properly when messages are translated; hard-coded British English for now.
l10n.setLanguage('en_GB');

server.listen(process.argv[2] || process.env.PORT || DEFAULT_PORT);

/** Emits misc. errors, for cases where 'exception' handler already emits individual exceptions. */
function reportNonExceptionsError(
    socket: Socket,
    e: any,
    subject: 'Metadata extraction' | 'Validation'
) {
    if (!(e instanceof ExceptionsError))
        socket.emit('exception', {
            message: `${subject} encountered an unexpected error: ${e}`,
        });
}

io.on('connection', socket => {
    socket.emit('handshake', { version: specberusVersion });
    socket.on('extractMetadata', async data => {
        if (!data.url && !data.file)
            return socket.emit('exception', {
                message: 'URL or file not provided.',
            });
        const specberus = new Specberus();
        specberus.on('err', (type, data) => {
            try {
                socket.emit(
                    'err',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        specberus.on('warning', (type, data) => {
            try {
                socket.emit(
                    'warning',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        specberus.on('info', (type, data) => {
            try {
                socket.emit(
                    'info',
                    l10n.message(null, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        specberus.on('exception', data => {
            socket.emit('exception', data);
        });
        try {
            const metadata = await specberus.extractMetadata(data);
            socket.emit('finishedExtraction', {
                ...metadata,
                url: data.url,
            });
        } catch (e) {
            reportNonExceptionsError(socket, e, 'Metadata extraction');
        }
    });
    socket.on('validate', async data => {
        if (!data.url && !data.file)
            return socket.emit('exception', {
                message: 'URL or file not provided.',
            });
        if (!data.profile)
            return socket.emit('exception', {
                message: 'Profile not provided.',
            });
        const profilePath = allProfiles.find(p =>
            p.endsWith(`/${data.profile}`)
        );
        let profile;
        try {
            profile = (await import(
                `./lib/profiles/${profilePath}.js`
            )) as ProfileModule;
        } catch (err) {
            return socket.emit('exception', {
                message: `Failed to get profile ${profilePath}.`,
            });
        }
        const specberus = new Specberus();
        const profileCode = profile.name;
        socket.emit('start', {
            rules: (profile.rules || []).map(rule => rule.name),
        });
        specberus.on('err', (type, data) => {
            try {
                socket.emit(
                    'err',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        specberus.on('warning', (type, data) => {
            try {
                socket.emit(
                    'warning',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        specberus.on('info', (type, data) => {
            try {
                socket.emit(
                    'info',
                    l10n.message(profileCode, type, data.key, data.extra)
                );
            } catch (err) {
                socket.emit('exception', err.message);
            }
        });
        specberus.on('done', name => {
            socket.emit('done', { name });
        });
        specberus.on('exception', data => {
            socket.emit('exception', data);
        });

        // Note: informativeOnly and patentPolicy no longer affect validation,
        // and echidnaReady only impacts client-side profile selection.

        if (data.url) {
            insafe
                .check({
                    url: data.url,
                    statusCodesAccepted: ['301', '406'],
                })
                .then(async (res: any) => {
                    if (res.status) {
                        try {
                            await specberus.validate({
                                url: data.url,
                                profile,
                                validation: data.validation,
                            });
                        } catch (e) {
                            reportNonExceptionsError(socket, e, 'Validation');
                        } finally {
                            socket.emit('finished');
                        }
                    } else {
                        const message = `Error while resolving <a href="${data.url}"><code>${data.url}</code></a>;
                        check the spelling of the host, the protocol (<code>HTTP</code>, <code>HTTPS</code>)
                        and ensure that the page is accessible from the public internet.`;
                        socket.emit('exception', { message });
                    }
                })
                .catch((error: any) => {
                    socket.emit('exception', {
                        message: `Insafe check blew up: ${error}`,
                    });
                    socket.emit('finished');
                });
        } else {
            try {
                await specberus.validate({
                    file: data.file,
                    profile,
                    validation: data.validation,
                });
            } catch (e) {
                reportNonExceptionsError(socket, e, 'Validation');
            } finally {
                // Exceptions already emitted from event handler
                socket.emit('finished');
            }
        }
    });

    socket.on('upload', (file, callback) => {
        const tmpfile = tmp.fileSync().name;
        writeFile(tmpfile, file, err => {
            callback({
                status: err ? 'failure' : 'success',
                filename: tmpfile,
            });
        });
    });
});
