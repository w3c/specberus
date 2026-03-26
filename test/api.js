/**
 * Test the REST API.
 */

import http from 'http';
import { join } from 'path';

import chaiAsPromised from '@rvagg/chai-as-promised';
import * as chai from 'chai';
import express from 'express';
import fileUpload from 'express-fileupload';
import superagent from 'superagent';

import { setUp } from '../lib/api.js';
import { cleanupMocks, setupMocks } from './lib/utils.js';
import meta from '../package.json' with { type: 'json' };

const { expect } = chai;

// Settings:
const DEFAULT_PORT = 8000;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}/api/`;
const timeouts = { response: 30000 };
const testDocsPath = join('test', 'docs', 'api');

let server;

/**
 * Sets up Chai, mocks, and the HTTP server for tests.
 */
function setup() {
    setupMocks();
    chai.use(chaiAsPromised);

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
        throw new Error(err);
    });
}

const handleResponse = response => response.res?.text || response.body;
const handleError = error => {
    throw new Error(
        error.response?.error?.text ||
            `Fetching “${ENDPOINT}${suffix}” triggered a network error: ${error.message}`
    );
};

/** Performs a GET request. */
const get = suffix =>
    superagent
        .get(ENDPOINT + suffix)
        .timeout(timeouts)
        .then(handleResponse, handleError);

/** Creates a POST request, returning the superagent object for parameter chaining. */
const createPostRequest = suffix =>
    superagent.post(ENDPOINT + suffix).timeout(timeouts);

describe('API', () => {
    before(setup);

    after(() => {
        cleanupMocks();
        server.close();
    });

    describe('Endpoint', () => {
        it('Should exist and listen to GET requests', () => {
            const query = get('');
            return expect(query).to.eventually.be.rejectedWith(
                /wrong api endpoint/i
            );
        });
        it('Should exist and listen to POST requests', () => {
            const query = createPostRequest('').then(
                handleResponse,
                handleError
            );
            return expect(query).to.eventually.be.rejectedWith(
                /wrong api endpoint/i
            );
        });
    });

    describe('Method “version”', () => {
        it('Should return the right version string', () => {
            const query = get('version');
            return expect(query).to.eventually.become(meta.version);
        });
    });

    describe('Method “metadata”', () => {
        it('Should accept "file" via POST, and return the right profile and date', () => {
            const query = createPostRequest('metadata')
                .attach('file', join(testDocsPath, 'ttml-imsc1.html'))
                .then(handleResponse, handleError);
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query)
                .to.eventually.match(/"profile":\s*"rec"/i)
                .and.to.eventually.match(/"docDate":\s*"2016-3-8"/i);
        });
    });

    describe('Method “validate”', () => {
        it('Should 400 and return an array of errors when validation fails', () => {
            const query = createPostRequest('validate')
                .field('profile', 'REC')
                .attach('file', join(testDocsPath, 'ttml-imsc1.html'))
                .then(handleResponse, handleError);
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query).to.eventually.be.rejectedWith(
                /"errors":\[\{"name":"headers\.\w+/
            );
        });
        it('Should accept "file" via POST, and succeed when the document is valid', function () {
            const query = createPostRequest('validate')
                .field('profile', 'WD')
                .attach('file', join(testDocsPath, 'wd-good.html'))
                .then(handleResponse, handleError);
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query).to.eventually.match(/"success":\s*true/);
        });
        it('Special profile “auto”: should detect the right profile and validate the document', function () {
            const query = createPostRequest('validate')
                .field('profile', 'auto')
                .attach('file', join(testDocsPath, 'wd-good.html'))
                .then(handleResponse, handleError);
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query)
                .to.eventually.match(/"success":\s*true/)
                .and.to.eventually.match(/"profile":\s*"WD"/);
        });
    });

    describe('Parameter restrictions', () => {
        it('Should reject the parameter “document”', () => {
            const query = get('metadata?document=foo');
            return expect(query).to.eventually.be.rejectedWith(
                'Parameter “document” is not allowed in this context'
            );
        });
        it('Should reject the parameter “source”', () => {
            const query = get('metadata?source=foo');
            return expect(query).to.eventually.be.rejectedWith(
                'Parameter “source” is not allowed in this context'
            );
        });
    });
});
