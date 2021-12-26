/**
 * Test the REST API.
 */

/* globals expect: true */

// Settings:
const DEFAULT_PORT = 8000;
const PORT = process.env.PORT || DEFAULT_PORT;
const ENDPOINT = `http://localhost:${PORT}/api/`;
const TIMEOUT = 30000;
// Native packages:
const http = require('http');

// External packages:
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const express = require('express');
const superagent = require('superagent');
// Internal packages:
const meta = require('../package.json');
const api = require('../lib/api');

let server;

/**
 * Launch an HTTP server for tests.
 */

const launchServer = function () {
    const app = express();
    server = http.createServer(app);
    api.setUp(app, process.env.W3C_API_KEY);
    server.listen(PORT).on('error', err => {
        throw new Error(err);
    });
};

/**
 * Set up the testing framework.
 */

const setUp = function () {
    chai.use(chaiAsPromised);
    expect = chai.expect;
};

/**
 * Query the API.
 */

const get = function (suffix, post) {
    const method = post ? superagent.post : superagent.get;
    return new Promise((resolve, reject) => {
        method(ENDPOINT + suffix, (error, response, body) => {
            if (error) {
                if (
                    error.response &&
                    error.response.error &&
                    error.response.error.text
                )
                    reject(new Error(error.response.error.text));
                else
                    reject(
                        new Error(
                            `Fetching “${ENDPOINT}${suffix}” triggered a network error: ${error.message}`
                        )
                    );
            } else if (response.statusCode !== 200)
                reject(
                    new Error(
                        `Fetching “${ENDPOINT}${suffix}” triggered an HTTP error: code ${response.statusCode}`
                    )
                );
            else if (response.res && response.res.text) {
                resolve(response.res.text);
            } else {
                resolve(body);
            }
        })
            .timeout({ response: TIMEOUT })
            .set({ encoding: null });
    });
};

describe('API', () => {
    let query;

    before(() => {
        launchServer();
        setUp();
    });

    describe('Endpoint', () => {
        it('Should exist and listen to GET requests', () => {
            query = get('');
            return expect(query).to.eventually.be.rejectedWith(
                /wrong api method/i
            );
        });
        it('Should not accept POST requests', () => {
            query = get('', true);
            return expect(query).to.eventually.be.rejectedWith(/cannot post/i);
        });
    });

    describe('Method “version”', () => {
        it('Should return the right version string', () => {
            query = get('version');
            return expect(query).to.eventually.become(meta.version);
        });
    });

    describe('Method “metadata”', () => {
        it('Should accept the parameter “file”, and return the right profile and date', () => {
            query = get('metadata?file=test/docs/metadata/ttml-imsc1.html');
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query)
                .to.eventually.match(/"profile":\s*"pr"/i)
                .and.to.eventually.match(/"docDate":\s*"2016-3-8"/i);
        });
    });

    describe('Method “validate”', () => {
        it('Should 404 and return an array of errors when validation fails', () => {
            query = get(
                'validate?file=test/docs/metadata/ttml-imsc1.html&profile=REC&validation=simple-validation&processDocument=2047'
            );
            return expect(query).to.eventually.be.rejectedWith(
                /"headers\.\w+/i
            );
        });
        // @TODO: The following two tests are failing because the rule dl.js follows the latest version
        //        and that version is pre-https switch
        // it('Should accept the parameter “file”, and succeed when the document is valid', function() {
        //     query = get('validate?file=test/docs/metadata/charmod-norm.html&' +
        //         'profile=WD&validation=simple-validation&processDocument=2015');
        //     // @TODO: parse result as an Object (it's JSON) instead of a String.
        //     return expect(query).to.eventually.match(/"success":\s*true/i);
        // });
        // it('Special profile “auto”: should detect the right profile and validate the document', function() {
        //     query = get('validate?file=test/docs/metadata/charmod-norm.html&profile=auto');
        //     // @TODO: parse result as an Object (it's JSON) instead of a String.
        //     return expect(query).to.eventually.match(/"success":\s*true/i)
        //         .and.to.eventually.match(/"profile":\s*"wd"/i);
        // });
    });

    describe('Parameter restrictions', () => {
        it('Should reject the parameter “document”', () => {
            query = get('metadata?document=foo');
            return expect(query).to.eventually.be.rejectedWith(
                'Parameter “document” is not allowed in this context'
            );
        });
        it('Should reject the parameter “source”', () => {
            query = get('metadata?source=foo');
            return expect(query).to.eventually.be.rejectedWith(
                'Parameter “source” is not allowed in this context'
            );
        });
    });

    after(() => {
        server.close();
    });
});
