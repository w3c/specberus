/**
 * Test the REST API.
 */

import assert from 'assert';
import http, { type Server } from 'http';
import { join } from 'path';
import { after, before, describe, it } from 'node:test';

import express from 'express';
import fileUpload from 'express-fileupload';
import superagent, { type Response, type ResponseError } from 'superagent';

import { setUp } from '../lib/api.js';
import { specberusVersion } from '../lib/util.js';
import { cleanupMocks, setupMocks } from './lib/utils.js';

// Settings:
const DEFAULT_PORT = 8000;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}/api/`;
const timeouts = { response: 30000 };
const testDocsPath = join('test', 'docs', 'api');

let server: Server;

/**
 * Sets up mocks and the HTTP server for tests.
 */
function setup() {
    setupMocks();

    const app = express();
    // fileUpload is _not_ covered by app.js setUp, so need to repeat it here
    app.use(
        fileUpload({
            createParentPath: true,
            useTempFiles: true,
            tempFileDir: '/tmp/',
        })
    );
    server = http.createServer(app);
    setUp(app);
    server.listen(PORT).on('error', err => {
        throw err;
    });
}

const handleResponse = (response: Response) => response.text || response.body;
const handleJsonResponse = (response: Response) =>
    JSON.parse(handleResponse(response));
function getErrorResponseText(error: ResponseError) {
    const text = error.response?.text;
    assert(text, 'Response data not available on error');
    return text;
}

/** Performs a GET request. */
const get = (suffix: string) =>
    superagent
        .get(ENDPOINT + suffix)
        .timeout(timeouts)
        .then(handleResponse);

/** Creates a POST request, returning the superagent object for parameter chaining. */
const createPostRequest = (suffix: string) =>
    superagent.post(ENDPOINT + suffix).timeout(timeouts);

describe('API', () => {
    before(setup);

    after(() => {
        cleanupMocks();
        server.close();
    });

    describe('Endpoint', () => {
        it('Should exist and listen to GET requests', () =>
            assert.rejects(get(''), (error: any) => {
                const text = getErrorResponseText(error);
                assert.strictEqual(text, 'Wrong API endpoint.');
                return true;
            }));
        it('Should exist and listen to POST requests', () =>
            assert.rejects(createPostRequest(''), (error: any) => {
                const text = getErrorResponseText(error);
                assert.strictEqual(text, 'Wrong API endpoint.');
                return true;
            }));
    });

    describe('Method “version”', () => {
        it('Should return the right version string', async () => {
            assert.strictEqual(await get('version'), specberusVersion);
        });
    });

    describe('Method “metadata”', () => {
        it('Should accept "file" via POST, and return the right profile and date', () =>
            createPostRequest('metadata')
                .attach('file', join(testDocsPath, 'ttml-imsc1.html'))
                .then(handleJsonResponse)
                .then(({ metadata }) => {
                    assert.strictEqual(metadata.profile, 'REC');
                    assert.strictEqual(metadata.docDate, '2016-3-8');
                }));

        it('Should accept "file" via POST, and report exceptions', () =>
            assert.rejects(
                createPostRequest('metadata').attach(
                    'file',
                    join(testDocsPath, 'wd-fail-date.html')
                ),
                (error: any) => {
                    const { errors } = JSON.parse(getErrorResponseText(error));
                    assert.strictEqual(
                        errors.length,
                        2,
                        'Expected multiple errors to be reported'
                    );
                    return true;
                }
            ));
    });

    describe('Method “validate”', () => {
        it('Should 400 and return an array of errors when validation fails', () =>
            assert.rejects(
                createPostRequest('validate')
                    .field('profile', 'REC')
                    .attach('file', join(testDocsPath, 'ttml-imsc1.html')),
                (error: any) => {
                    const { success, errors } = JSON.parse(
                        getErrorResponseText(error)
                    );
                    assert.strictEqual(success, false);
                    assert(errors.length > 0, 'Response should report errors');
                    for (const obj of errors) {
                        assert(
                            obj.name &&
                                obj.rule &&
                                obj.section &&
                                obj.key &&
                                obj.detailMessage,
                            'Every error should consistently define fields'
                        );
                    }
                    return true;
                }
            ));

        it('Should 400 with error on POST if "file" is provided but "profile" is not', () =>
            assert.rejects(
                createPostRequest('validate').attach(
                    'file',
                    join(testDocsPath, 'wd-good.html')
                ),
                (error: any) => {
                    const { success, errors } = JSON.parse(
                        getErrorResponseText(error)
                    );
                    assert.strictEqual(success, false);
                    assert.deepStrictEqual(errors, [
                        {
                            error: 'Error: Parameter “profile” is required in this context',
                        },
                    ]);
                    return true;
                }
            ));

        it('Should accept "file" via POST, and succeed when the document is valid', () =>
            createPostRequest('validate')
                .field('profile', 'WD')
                .attach('file', join(testDocsPath, 'wd-good.html'))
                .then(handleJsonResponse)
                .then(({ success }) => {
                    assert.strictEqual(success, true);
                }));

        it('Special profile “auto”: should detect the right profile and validate the document', () =>
            createPostRequest('validate')
                .field('profile', 'auto')
                .attach('file', join(testDocsPath, 'wd-good.html'))
                .then(handleJsonResponse)
                .then(({ success, metadata }) => {
                    assert.strictEqual(success, true);
                    assert.strictEqual(metadata.profile, 'WD');
                }));

        it('Special profile “auto”: should report exception if profile cannot be determined', () =>
            assert.rejects(
                createPostRequest('validate')
                    .field('profile', 'auto')
                    .attach('file', join(testDocsPath, 'wd-fail-auto.html')),
                (error: any) => {
                    const { errors } = JSON.parse(getErrorResponseText(error));
                    assert.strictEqual(errors.length, 1);
                    assert.match(
                        errors[0].exception,
                        /Pubrules is having a hard time identifying the profile of the document/
                    );
                    return true;
                }
            ));
    });

    describe('Parameter restrictions', () => {
        it('Should reject the parameter "document" as unknown', () =>
            assert.rejects(get('metadata?document=foo'), (error: any) => {
                const { success, errors } = JSON.parse(
                    getErrorResponseText(error)
                );
                assert.strictEqual(success, false);
                assert.deepStrictEqual(errors[0], {
                    error: 'Error: Illegal parameter “document”',
                });
                return true;
            }));

        it('Should reject the parameter "source" as forbidden', () =>
            assert.rejects(get('metadata?source=foo'), (error: any) => {
                const { success, errors } = JSON.parse(
                    getErrorResponseText(error)
                );
                assert.strictEqual(success, false);
                assert.deepStrictEqual(errors[0], {
                    error: 'Error: Parameter “source” is not allowed in this context',
                });
                return true;
            }));
    });
});
