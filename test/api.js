/**
 * Test the REST API.
 */

// External packages:
const expect = require('expect.js')
,   superagent = require('superagent')
;

// Internal packages:
const samples = require('./samples')
,   package = require('../package')
;

/**
 * Assert that the profile detected in a spec is equal to the known profile.
 *
 * @param {String} url - public URL of a spec.
 * @param {String} profile - profile that should be detected.
 */

const detect = function(url, profile) {
    it('Should detect a ' + profile, function () {
        // @TODO; submit URL to endpoint and check profiles.
    });
};

if (!process || !process.env || !process.env.SKIP_NETWORK) {

    // @TODO: launch Specberus locally as a server, listening to HTTP requests.

    describe('API', function() {

/*        it('The endpoint should exist', function() {
            // @TODO
        });

        describe('Method "version"', function() {
            it('Should exist'), function() {
                // @TODO
            };
            it('Should return the right version string'), function() {
                // @TODO; query method and compare with "package.version".
            };
        });

        describe('Method "metadata"', function() {
            it('Should exist'), function(done) {
                // @TODO
            };
            for(var i in samples) {
                detect(samples[i].url, samples[i].profile);
            }
        });

        describe('Method "validate"', function() {
            it('Should exist'), function(done) {
                // @TODO
            };
            // @TODO; submit a few sample specs for validation; check results.
        }); */

    });

}
