/**
 * Test the REST API.
 */

/* globals describe: false, it: false, before: false, after: false, expect: true */

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

var server;

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

describe('API', function() {

    var query;

    before(function() {
        launchServer();
        setUp();
    });

    describe('Endpoint', function() {
        it('Should exist and listen to GET requests', function() {
            query = get('');
            return expect(query).to.eventually.be.rejectedWith(/wrong\ api\ method/i);
        });
        it('Should not accept POST requests', function() {
            query = get('', true);
            return expect(query).to.eventually.be.rejectedWith(/cannot\ post/i);
        });
    });

    describe('Method “version”', function() {
        it('Should return the right version string', function() {
            query = get('version');
            return expect(query).to.eventually.become(package.version);
        });
    });

    describe('Method “metadata”', function() {
        it('Should accept the parameter “file”, and return the right profile and date', function() {
            query = get('metadata?file=test/docs/metadata/ttml-imsc1.html');
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query).to.eventually.match(/"profile":\s*"pr"/i)
                .and.to.eventually.match(/"docdate":\s*"2016\-3\-8"/i);
        });
    });

    describe('Method “validate”', function() {
        it('Should 404 and return an array of errors when validation fails', function() {
            query = get('validate?file=test/docs/metadata/ttml-imsc1.html&profile=REC&validation=simple-validation&processDocument=2047');
            return expect(query).to.eventually.be.rejectedWith(/"headers\.\w+/i);
        });
        it('Should accept the parameter “url”, and succeed when the document is valid', function() {
            query = get('validate?url=https%3A%2F%2Fwww.w3.org%2FTR%2F2016%2FWD-charmod-norm-20160407%2F&' +
                'profile=WD&validation=simple-validation&processDocument=2015&noRecTrack=true');
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query).to.eventually.match(/"success":\s*true/i);
        });
        it('Special profile “auto”: should detect the right profile and validate the document', function() {
            query = get('validate?url=https%3A%2F%2Fwww.w3.org%2FTR%2F2016%2FWD-charmod-norm-20160407%2F&profile=auto');
            // @TODO: parse result as an Object (it's JSON) instead of a String.
            return expect(query).to.eventually.match(/"success":\s*true/i)
                .and.to.eventually.match(/"profile":\s*"wd"/i);
        });
    });

    describe('Parameter restrictions', function() {
        it('Should reject the parameter “document”', function() {
            query = get('metadata?document=foo');
            return expect(query).to.eventually.be.rejectedWith('Parameter “document” is not allowed in this context');
        });
        it('Should reject the parameter “source”', function() {
            query = get('metadata?source=foo');
            return expect(query).to.eventually.be.rejectedWith('Parameter “source” is not allowed in this context');
        });
    });

    after(function() {
        server.close();
    });

});
