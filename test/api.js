/**
 * Test the REST API.
 */

// Settings:
const DEFAULT_PORT = 8000
,   PORT = process.env.PORT || DEFAULT_PORT
,   ENDPOINT = 'http://localhost:' + PORT + '/api/'
,   TIMEOUT = 30000
;

// Native packages:
const http = require('http');

// External packages:
const chai = require('chai')
,   chaiAsPromised = require('chai-as-promised')
,   express = require('express')
,   superagent = require('superagent')
;

// Internal packages:
const package = require('../package')
,   api = require('../lib/api')
;

var expect
,   server
;

/**
 * Launch an HTTP server for tests.
 */

const launchServer = function () {
    const app = express();
    server = http.createServer(app);
    api.setUp(app);
    server.listen(PORT).on('error', function(err) {
        throw new Error(err);
    });
};

/**
 * Set up the testing framework.
 */

const setUp = function() {
    chai.use(chaiAsPromised);
    expect = chai.expect;
};

/**
 * Query the API.
 */

const get = function (suffix, post) {
    const method = post ? superagent.post : superagent.get;
    return new Promise(function (resolve, reject) {
        method(ENDPOINT + suffix, {
            timeout: TIMEOUT,
            encoding: null
        }, function (error, response, body) {
            if (error) {
                if (error.response && error.response.error && error.response.error.text)
                    reject(new Error(error.response.error.text));
                else
                    reject(new Error('Fetching “' + ENDPOINT + suffix + '” triggered a network error: ' + error.message));
            }
            else if (response.statusCode !== 200)
                reject(new Error('Fetching “' + ENDPOINT + suffix + '” triggered an HTTP error: code ' + response.statusCode));
            else if (response.res && response.res.text)
                resolve(response.res.text);
            else
                resolve(body);
        });
    });
};

if (!process || !process.env || !process.env.SKIP_NETWORK) {

    describe('API', function() {

        var suffix;

        before(function() {
            launchServer();
            setUp();
            suffix = '?file=test/docs/metadata/ttml-imsc1.html'
        });

        describe('Endpoint', function() {
            it('Should exist and listen to GET requests', function() {
                const bogus = get('');
                return expect(bogus).to.eventually.be.rejectedWith(/wrong\ api\ method/i);
            });
            it('Should not accept POST requests', function() {
                const bogus = get('', true);
                return expect(bogus).to.eventually.be.rejectedWith(/cannot\ post/i);
            });
        });

        describe('Method “version”', function() {
            it('Should return the right version string', function() {
                const version = get('version');
                return expect(version).to.eventually.become(package.version);
            });
        });

        describe('Method “metadata”', function() {
            it('Should return the expected profile', function() {
                const meta = get('metadata' + suffix);
                return expect(meta).to.eventually.match(/"profile":\s*"pr"/i);
            });
        });

        describe('Method “validate”', function() {
            it('Should 404 and return an array of errors when validation fails', function() {
                const check = get('validate' + suffix + '&profile=REC&validation=simple-validation&processDocument=2047');
                return expect(check).to.eventually.be.rejectedWith(/"headers\.\w+/i);
            });
            it('Should succeed and return the profile when the document is valid', function() {
                const check = get('validate' + suffix + '&profile=PR&validation=simple-validation&processDocument=2015');
                return expect(check).to.eventually.become('PR');
            });
        });

        after(function() {
            server.close();
        });

    });

}
