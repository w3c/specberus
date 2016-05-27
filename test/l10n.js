/**
 * Test L10n features.
 */

/* globals describe: false, it: false */

// External packages:
const expect = require('expect.js');

// Internal packages:
const rulesWrapper = require('../lib/rules-wrapper');

describe('L10n', function() {

    describe('UI messages module', function() {
        it('Should be a valid object', function() {
            expect(rulesWrapper).to.be.an('object');
        });
    });

    // @TODO: check all new selectors: missing, typos, redundant, etc.

});
